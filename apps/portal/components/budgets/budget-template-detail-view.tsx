'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import { Input } from '@workspace/ui/components/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import {
	ChevronsDownIcon,
	ChevronsUpIcon,
	Pencil,
	SearchIcon,
	Wallet,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import PageHeading from '@/components/page-heading';
import EditTrade from '@/components/trades/edit-trade';
import {
	type StageGroup,
	StageGroupedList,
	type StageGroupedListHandle,
} from '@/components/trades/stage-grouped-list';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import AddBudgetItemDialog from './add-budget-item-dialog';
import AddBudgetTemplateToProject from './add-budget-template-to-project';
import {
	formatBudgetPrice,
	isValidMoneyString,
	parseMoneyString,
} from './budget-form-shared';
import DeleteBudgetTemplateItem from './delete-budget-template-item';
import { usePriceEditing } from './use-price-editing';

type TemplateItem = Doc<'budgetTemplateItems'> & {
	tradeName: string | null;
	tradeDescription: string | null;
	stageId: Id<'tradeStages'> | null;
	tradeOrder: number | null;
};

const MAX_ORDER = Number.MAX_SAFE_INTEGER;

/**
 * A template holds only a subset of trades, so the new order of the shown items
 * must be merged with the trades that live in the same stage but aren't in this
 * template. Hidden trades stay anchored in their current position; the shown
 * items fill the template-item slots in their new drag order, then a whole-stage
 * renumber (order 0..n-1, stageId = S) is produced for `reorderTrades`.
 */
function mergeStageOrder(
	allTrades: Doc<'trades'>[],
	templateTradeIds: Set<Id<'trades'>>,
	stageId: Id<'tradeStages'> | null,
	shownIds: Id<'trades'>[]
): Array<{
	tradeId: Id<'trades'>;
	stageId: Id<'tradeStages'> | null;
	order: number;
}> {
	const currentList = allTrades
		.filter((t) => (t.stageId ?? null) === stageId)
		.sort(
			(a, b) =>
				(a.order ?? MAX_ORDER) - (b.order ?? MAX_ORDER) ||
				a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
		);
	const shownSet = new Set(shownIds);
	const shownQueue = [...shownIds];
	const ordered: Id<'trades'>[] = [];
	for (const trade of currentList) {
		if (templateTradeIds.has(trade._id)) {
			// A template item that stays in this stage takes the next drag-order slot;
			// one that moved away is dropped (it is renumbered under its new stage).
			if (shownSet.has(trade._id)) {
				const nextId = shownQueue.shift();
				if (nextId) {
					ordered.push(nextId);
				}
			}
		} else {
			ordered.push(trade._id);
		}
	}
	// Any shown item without a slot (a trade dragged into this stage) trails.
	while (shownQueue.length > 0) {
		const nextId = shownQueue.shift();
		if (nextId) {
			ordered.push(nextId);
		}
	}
	return ordered.map((tradeId, order) => ({ tradeId, stageId, order }));
}

export default function BudgetTemplateDetailView({
	budgetTemplateId,
}: {
	budgetTemplateId: Id<'budgetTemplates'>;
}) {
	const template = useQuery(api.budgetTemplates.get.get, { budgetTemplateId });
	const items = useQuery(
		api.budgetTemplateItems.listByTemplate.listByTemplate,
		{ budgetTemplateId }
	) as TemplateItem[] | undefined;
	const stages = useQuery(api.tradeStages.list.list, {});
	const allTrades = useQuery(api.trades.list.list, {});

	const setPrices = useMutation(api.budgetTemplateItems.setPrices.setPrices);
	const addItem = useMutation(api.budgetTemplateItems.addItem.addItem);
	const updateTrade = useMutation(api.trades.update.update);
	const reorderStages = useMutation(
		api.tradeStages.reorder.reorder
	).withOptimisticUpdate((store, args) => {
		const current = store.getQuery(api.tradeStages.list.list, {});
		if (!current) {
			return;
		}
		const orderById = new Map(args.stageIds.map((id, index) => [id, index]));
		store.setQuery(
			api.tradeStages.list.list,
			{},
			current
				.map((stage) =>
					orderById.has(stage._id)
						? { ...stage, order: orderById.get(stage._id) as number }
						: stage
				)
				.sort((a, b) => a.order - b.order)
		);
	});
	// Patch both caches so grouping reflects the drop before the round-trip.
	const reorderTrades = useMutation(
		api.trades.reorderTrades.reorderTrades
	).withOptimisticUpdate((store, args) => {
		const byId = new Map(args.updates.map((u) => [u.tradeId, u]));
		const currentItems = store.getQuery(
			api.budgetTemplateItems.listByTemplate.listByTemplate,
			{ budgetTemplateId }
		);
		if (currentItems) {
			store.setQuery(
				api.budgetTemplateItems.listByTemplate.listByTemplate,
				{ budgetTemplateId },
				currentItems.map((item) => {
					const update = byId.get(item.tradeId);
					return update
						? {
								...item,
								stageId: update.stageId ?? null,
								tradeOrder: update.order,
							}
						: item;
				})
			);
		}
		const currentTrades = store.getQuery(api.trades.list.list, {});
		if (currentTrades) {
			store.setQuery(
				api.trades.list.list,
				{},
				currentTrades.map((trade) => {
					const update = byId.get(trade._id);
					return update
						? {
								...trade,
								stageId: update.stageId ?? undefined,
								order: update.order,
							}
						: trade;
				})
			);
		}
	});

	const {
		isEditing,
		drafts,
		nameDrafts,
		begin,
		setDraft,
		setNameDraft,
		cancel,
		getChanges,
		getNameChanges,
	} = usePriceEditing();
	const [isSaving, setIsSaving] = useState(false);
	const [search, setSearch] = useState('');
	const listRef = useRef<StageGroupedListHandle>(null);

	const usedTradeIds = useMemo(
		() => items?.map((item) => item.tradeId) ?? [],
		[items]
	);

	const persistItems = (
		groups: StageGroup<TemplateItem>[],
		affectedKeys: string[]
	) => {
		if (!allTrades) {
			return;
		}
		const templateTradeIds = new Set(items?.map((item) => item.tradeId));
		const updates: Array<{
			tradeId: Id<'trades'>;
			stageId: Id<'tradeStages'> | null;
			order: number;
		}> = [];
		for (const key of new Set(affectedKeys)) {
			const group = groups.find((g) => g.key === key);
			if (!group) {
				continue;
			}
			const shownIds = group.items.map((item) => item.tradeId);
			updates.push(
				...mergeStageOrder(allTrades, templateTradeIds, group.stageId, shownIds)
			);
		}
		if (updates.length > 0) {
			reorderTrades({ updates }).catch(() => {
				/* Convex reactive queries revert the UI automatically */
			});
		}
	};

	const handleEdit = () => {
		begin(
			(items ?? []).map((item) => ({
				tradeId: item.tradeId,
				price: item.price,
				name: item.tradeName ?? '',
			}))
		);
	};

	const handleDone = async () => {
		const changes = getChanges();
		const nameChanges = getNameChanges();
		if (changes.length === 0 && nameChanges.length === 0) {
			cancel();
			return;
		}
		setIsSaving(true);
		try {
			await Promise.all([
				changes.length > 0
					? setPrices({
							budgetTemplateId,
							items: changes.map((change) => ({
								tradeId: change.tradeId as Id<'trades'>,
								price: change.price,
							})),
						})
					: Promise.resolve(),
				...nameChanges.map((change) =>
					updateTrade({
						tradeId: change.tradeId as Id<'trades'>,
						name: change.name,
					})
				),
			]);
			toastManager.add({ title: 'Changes saved', type: 'success' });
			cancel();
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not save changes. Please try again in a moment.'
				),
				title: 'Could not save changes',
				type: 'error',
			});
		} finally {
			setIsSaving(false);
		}
	};

	if (template === undefined) {
		return <div className="text-muted-foreground text-sm">Loading…</div>;
	}

	if (template === null) {
		return (
			<div className="text-muted-foreground text-sm">
				Budget template not found.
			</div>
		);
	}

	const displayTotal =
		isEditing && items
			? items.reduce((sum, item) => {
					const raw = (drafts[item.tradeId] ?? '').trim();
					return (
						sum +
						(raw.length > 0 && isValidMoneyString(raw)
							? parseMoneyString(raw)
							: (item.price ?? 0))
					);
				}, 0)
			: template.totalPrice;

	const renderRowContent = (item: TemplateItem) => {
		const tradeName = item.tradeName ?? 'Unknown trade';
		return (
			<>
				<div className="min-w-0 flex-1">
					{isEditing ? (
						<Input
							aria-label={`Trade name for ${tradeName}`}
							className="max-w-64"
							nativeInput
							onChange={(e) => setNameDraft(item.tradeId, e.target.value)}
							placeholder="Trade name"
							type="text"
							value={nameDrafts[item.tradeId] ?? ''}
						/>
					) : (
						<span className="font-medium text-sm">
							{item.tradeName ?? (
								<span className="text-muted-foreground">Unknown trade</span>
							)}
						</span>
					)}
				</div>
				<div className="shrink-0">
					{isEditing ? (
						<InputGroup className="w-44">
							<InputGroupAddon align="inline-start">
								<InputGroupText>$</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								aria-label={`Price for ${tradeName}`}
								inputMode="decimal"
								nativeInput
								onChange={(e) => setDraft(item.tradeId, e.target.value)}
								placeholder="0.00"
								type="text"
								value={drafts[item.tradeId] ?? ''}
							/>
							<InputGroupAddon align="inline-end">
								<InputGroupText>AUD</InputGroupText>
							</InputGroupAddon>
						</InputGroup>
					) : (
						<span className="tabular-nums">
							{formatBudgetPrice(item.price)}
						</span>
					)}
				</div>
				<Group className="shrink-0">
					<EditTrade
						initialDescription={item.tradeDescription ?? undefined}
						initialName={item.tradeName ?? ''}
						initialStageId={item.stageId ?? undefined}
						tradeId={item.tradeId}
						trigger={
							<Button aria-label="Edit trade" size="icon" variant="outline">
								<Pencil />
							</Button>
						}
					/>
					<GroupSeparator />
					<DeleteBudgetTemplateItem
						budgetTemplateItemId={item._id}
						itemName={tradeName}
					/>
				</Group>
			</>
		);
	};

	const renderStageBadges = (group: StageGroup<TemplateItem>) => {
		const subtotal = group.items.reduce((sum, item) => {
			if (isEditing) {
				const raw = (drafts[item.tradeId] ?? '').trim();
				if (raw.length > 0 && isValidMoneyString(raw)) {
					return sum + parseMoneyString(raw);
				}
			}
			return sum + (item.price ?? 0);
		}, 0);
		return (
			<>
				<Badge size="lg" variant="secondary">
					{group.items.length}
				</Badge>
				{group.items.length > 0 ? (
					<Badge size="lg" variant="purple">
						{formatBudgetPrice(subtotal)}
					</Badge>
				) : null}
			</>
		);
	};

	return (
		<div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
			<PageHeading
				backLink="/budgets"
				description={template.description}
				heading={template.title}
				rightSlot={
					<>
						<InputGroup className="w-full sm:min-w-64 sm:max-w-md">
							<InputGroupAddon align="inline-start">
								<InputGroupText>
									<SearchIcon aria-hidden />
								</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								aria-label="Search items"
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search by stage or trade…"
								type="search"
								value={search}
							/>
						</InputGroup>
						<Group>
							<Button
								aria-label="Expand all"
								onClick={() => listRef.current?.expandAll()}
								size="icon"
								type="button"
								variant="outline"
							>
								<ChevronsDownIcon />
							</Button>
							<GroupSeparator />
							<Button
								aria-label="Collapse all"
								onClick={() => listRef.current?.collapseAll()}
								size="icon"
								type="button"
								variant="outline"
							>
								<ChevronsUpIcon />
							</Button>
						</Group>
						{isEditing ? (
							<Button
								loading={isSaving}
								onClick={() => {
									handleDone().catch(() => {
										/* Error handled in handleDone */
									});
								}}
								type="button"
							>
								Done
							</Button>
						) : (
							<Button onClick={handleEdit} type="button" variant="outline">
								<Pencil />
								Edit
							</Button>
						)}
						<AddBudgetItemDialog
							excludedTradeIds={usedTradeIds}
							onSubmit={async (args) => {
								await addItem({ budgetTemplateId, ...args });
							}}
						/>
						<AddBudgetTemplateToProject
							budgetTemplateId={budgetTemplateId}
							templateTitle={template.title}
						/>
					</>
				}
				titleTrailing={
					<Badge size="lg" variant="purple">
						Total {formatBudgetPrice(displayTotal)}
					</Badge>
				}
			/>

			{items !== undefined && items.length === 0 ? (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Wallet aria-hidden />
						</EmptyMedia>
						<EmptyTitle>No items yet</EmptyTitle>
						<EmptyDescription>
							Use “Add Item” to add trades and set budget prices for this
							template.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			) : (
				<div className="flex min-h-0 flex-1 flex-col">
					<StageGroupedList<TemplateItem>
						emptyGroupLabel="No items in this stage."
						getItemId={(item) => item.tradeId}
						getItemName={(item) => item.tradeName ?? 'Unknown trade'}
						getItemOrder={(item) => item.tradeOrder ?? undefined}
						getStageId={(item) => item.stageId}
						items={items}
						loadingLabel="Loading items…"
						noResults={
							<Empty>
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<Wallet aria-hidden />
									</EmptyMedia>
									<EmptyTitle>No matching items</EmptyTitle>
									<EmptyDescription>
										Try a different stage or trade name.
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						}
						onPersistItems={persistItems}
						onReorderStages={(stageIds) => {
							reorderStages({ stageIds }).catch(() => {
								/* Convex reactive queries revert the UI automatically */
							});
						}}
						ref={listRef}
						renderRowContent={renderRowContent}
						renderStageBadges={renderStageBadges}
						search={search}
						stages={stages}
					/>
				</div>
			)}
		</div>
	);
}
