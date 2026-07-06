'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
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
import { cn } from '@workspace/ui/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import {
	ChevronsDownIcon,
	ChevronsUpIcon,
	Pencil,
	SearchIcon,
	Wallet,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import AddBudgetItemDialog from '@/components/budgets/add-budget-item-dialog';
import {
	formatBudgetPrice,
	isValidMoneyString,
	parseMoneyString,
} from '@/components/budgets/budget-form-shared';
import { usePriceEditing } from '@/components/budgets/use-price-editing';
import EditTrade from '@/components/trades/edit-trade';
import {
	type StageGroup,
	StageGroupedList,
	type StageGroupedListHandle,
} from '@/components/trades/stage-grouped-list';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import DeleteProjectBudget from './delete-project-budget';

interface TradeBudgetRow {
	budgetPrice: number | null;
	orderCount: number;
	projectBudgetId: Id<'projectBudgets'> | null;
	quotationCount: number;
	stageId: Id<'tradeStages'> | null;
	totalOrderPrice: number;
	totalQuotationPrice: number;
	tradeDescription: string | null;
	tradeId: Id<'trades'>;
	tradeName: string;
	tradeOrder: number | null;
}

// Shared grid so the header row and the data rows line up column-for-column.
const ROW_GRID =
	'grid grid-cols-[minmax(0,2.5fr)_minmax(0,1.3fr)_minmax(0,1.3fr)_minmax(0,1.3fr)_minmax(0,1.3fr)_auto] items-center gap-3';

const FILTER_PARAMS = [
	'orderId',
	'orderTaskId',
	'orderTradeId',
	'quotationTradeId',
	'quotationStatus',
] as const;

function actualColorClass(actual: number, budgetPrice: number | null): string {
	if (budgetPrice === null) {
		return '';
	}
	return actual <= budgetPrice
		? 'text-success-foreground'
		: 'text-destructive-foreground';
}

function BudgetValue({ price }: { price: number | null }) {
	if (price === null) {
		return <span className="text-muted-foreground text-sm">—</span>;
	}
	return <span className="tabular-nums">{formatBudgetPrice(price)}</span>;
}

function ActualCell({ row }: { row: TradeBudgetRow }) {
	if (row.quotationCount === 0 && row.orderCount === 0) {
		return <span className="text-muted-foreground text-sm">—</span>;
	}
	const actual = row.totalQuotationPrice + row.totalOrderPrice;
	return (
		<span
			className={cn(
				'font-medium tabular-nums',
				actualColorClass(actual, row.budgetPrice)
			)}
		>
			{formatBudgetPrice(actual)}
		</span>
	);
}

function QuotationsCountCell({ row }: { row: TradeBudgetRow }) {
	const router = useRouter();
	const searchParams = useSearchParams();

	if (row.quotationCount === 0) {
		return <span className="text-muted-foreground text-sm">—</span>;
	}

	const handleClick = () => {
		const params = new URLSearchParams(searchParams.toString());
		for (const key of FILTER_PARAMS) {
			params.delete(key);
		}
		params.set('tab', 'quotations');
		params.set('quotationTradeId', row.tradeId);
		params.set('quotationStatus', 'Approved');
		router.push(`?${params.toString()}`);
	};

	return (
		<button className="w-fit" onClick={handleClick} type="button">
			<Badge size="lg" variant="secondary">
				{row.quotationCount}{' '}
				{row.quotationCount === 1 ? 'Quotation' : 'Quotations'}
			</Badge>
		</button>
	);
}

function OrdersCountCell({ row }: { row: TradeBudgetRow }) {
	const router = useRouter();
	const searchParams = useSearchParams();

	if (row.orderCount === 0) {
		return <span className="text-muted-foreground text-sm">—</span>;
	}

	const handleClick = () => {
		const params = new URLSearchParams(searchParams.toString());
		for (const key of FILTER_PARAMS) {
			params.delete(key);
		}
		params.set('tab', 'orders');
		params.set('orderTradeId', row.tradeId);
		router.push(`?${params.toString()}`);
	};

	return (
		<button className="w-fit" onClick={handleClick} type="button">
			<Badge size="lg" variant="secondary">
				{row.orderCount} {row.orderCount === 1 ? 'Order' : 'Orders'}
			</Badge>
		</button>
	);
}

export default function ProjectBudgetsTabContent({
	projectId,
}: {
	projectId: Id<'projects'>;
}) {
	const rows = useQuery(api.projectBudgets.tradeSummary.tradeSummary, {
		projectId,
	}) as TradeBudgetRow[] | undefined;
	const stages = useQuery(api.tradeStages.list.list, {});

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

	const setPrices = useMutation(api.projectBudgets.setPrices.setPrices);
	const addItem = useMutation(api.projectBudgets.addItem.addItem);
	const updateTrade = useMutation(api.trades.update.update);
	const reorderTrades = useMutation(
		api.trades.reorderTrades.reorderTrades
	).withOptimisticUpdate((store, args) => {
		const byId = new Map(args.updates.map((u) => [u.tradeId, u]));
		const current = store.getQuery(
			api.projectBudgets.tradeSummary.tradeSummary,
			{
				projectId,
			}
		);
		if (current) {
			store.setQuery(
				api.projectBudgets.tradeSummary.tradeSummary,
				{ projectId },
				current.map((row) => {
					const update = byId.get(row.tradeId);
					return update
						? {
								...row,
								stageId: update.stageId ?? null,
								tradeOrder: update.order,
							}
						: row;
				})
			);
		}
		const trades = store.getQuery(api.trades.list.list, {});
		if (trades) {
			store.setQuery(
				api.trades.list.list,
				{},
				trades.map((trade) => {
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

	const budgetedTradeIds = (rows ?? [])
		.filter((row) => row.budgetPrice !== null)
		.map((row) => row.tradeId);

	// Live totals: reflect draft prices while editing so the header updates before
	// "Done"; blank/invalid drafts fall back to the saved price.
	const totalBudget = (rows ?? []).reduce((sum, row) => {
		if (isEditing) {
			const raw = (drafts[row.tradeId] ?? '').trim();
			if (raw.length > 0 && isValidMoneyString(raw)) {
				return sum + parseMoneyString(raw);
			}
		}
		return sum + (row.budgetPrice ?? 0);
	}, 0);
	const totalActual = (rows ?? []).reduce(
		(sum, row) => sum + row.totalQuotationPrice + row.totalOrderPrice,
		0
	);

	const persistItems = (
		groups: StageGroup<TradeBudgetRow>[],
		affectedKeys: string[]
	) => {
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
			group.items.forEach((row, order) => {
				updates.push({ tradeId: row.tradeId, stageId: group.stageId, order });
			});
		}
		if (updates.length > 0) {
			reorderTrades({ updates }).catch(() => {
				/* Convex reactive queries revert the UI automatically */
			});
		}
	};

	const handleEdit = () => {
		begin(
			(rows ?? []).map((row) => ({
				tradeId: row.tradeId,
				price: row.budgetPrice,
				name: row.tradeName,
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
							projectId,
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
			toastManager.add({ title: 'Budgets saved', type: 'success' });
			cancel();
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not save budgets. Please try again in a moment.'
				),
				title: 'Could not save budgets',
				type: 'error',
			});
		} finally {
			setIsSaving(false);
		}
	};

	const renderRowContent = (row: TradeBudgetRow) => (
		<div className={cn(ROW_GRID, 'flex-1')}>
			{isEditing ? (
				<Input
					aria-label={`Trade name for ${row.tradeName}`}
					nativeInput
					onChange={(e) => setNameDraft(row.tradeId, e.target.value)}
					placeholder="Trade name"
					type="text"
					value={nameDrafts[row.tradeId] ?? ''}
				/>
			) : (
				<span className="font-medium text-sm">{row.tradeName}</span>
			)}
			{isEditing ? (
				<InputGroup>
					<InputGroupAddon align="inline-start">
						<InputGroupText>$</InputGroupText>
					</InputGroupAddon>
					<InputGroupInput
						aria-label={`Budget for ${row.tradeName}`}
						inputMode="decimal"
						nativeInput
						onChange={(e) => setDraft(row.tradeId, e.target.value)}
						placeholder="0.00"
						type="text"
						value={drafts[row.tradeId] ?? ''}
					/>
					<InputGroupAddon align="inline-end">
						<InputGroupText>AUD</InputGroupText>
					</InputGroupAddon>
				</InputGroup>
			) : (
				<BudgetValue price={row.budgetPrice} />
			)}
			<ActualCell row={row} />
			<QuotationsCountCell row={row} />
			<OrdersCountCell row={row} />
			<Group className="justify-end">
				<EditTrade
					initialDescription={row.tradeDescription ?? undefined}
					initialName={row.tradeName}
					initialStageId={row.stageId ?? undefined}
					tradeId={row.tradeId}
					trigger={
						<Button aria-label="Edit trade" size="icon" variant="outline">
							<Pencil />
						</Button>
					}
				/>
				{row.projectBudgetId ? (
					<>
						<GroupSeparator />
						<DeleteProjectBudget
							projectBudgetId={row.projectBudgetId}
							tradeName={row.tradeName}
						/>
					</>
				) : null}
			</Group>
		</div>
	);

	const renderStageBadges = (group: StageGroup<TradeBudgetRow>) => {
		const subtotal = group.items.reduce((sum, row) => {
			if (isEditing) {
				const raw = (drafts[row.tradeId] ?? '').trim();
				if (raw.length > 0 && isValidMoneyString(raw)) {
					return sum + parseMoneyString(raw);
				}
			}
			return sum + (row.budgetPrice ?? 0);
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

	if (rows === undefined) {
		return (
			<div className="text-muted-foreground text-sm">Loading budgets…</div>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<InputGroup className="w-full sm:max-w-md">
					<InputGroupAddon align="inline-start">
						<InputGroupText>
							<SearchIcon aria-hidden />
						</InputGroupText>
					</InputGroupAddon>
					<InputGroupInput
						aria-label="Search budgets"
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search by stage or trade…"
						type="search"
						value={search}
					/>
				</InputGroup>
				<div className="flex items-center gap-2">
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
					{rows.length > 0 &&
						(isEditing ? (
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
						))}
					<AddBudgetItemDialog
						excludedTradeIds={budgetedTradeIds}
						onSubmit={async (args) => {
							await addItem({ projectId, ...args });
						}}
					/>
				</div>
			</div>

			{rows.length === 0 ? (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Wallet aria-hidden />
						</EmptyMedia>
						<EmptyTitle>No trades yet</EmptyTitle>
						<EmptyDescription>
							Use “Add Item” to add a budget for a trade.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			) : (
				<div className="flex min-h-0 flex-1 flex-col gap-2">
					{/* Column header — a leading spacer matches each row's drag grip. */}
					<div className="flex items-center gap-2 px-3 text-muted-foreground text-xs">
						<span aria-hidden className="w-4 shrink-0" />
						<div className={cn(ROW_GRID, 'flex-1')}>
							<span>Trade</span>
							<span className="flex items-center gap-2">
								Budget
								<Badge size="lg" variant="purple">
									{formatBudgetPrice(totalBudget)}
								</Badge>
							</span>
							<span className="flex items-center gap-2">
								Actual
								<Badge
									size="lg"
									variant={
										totalActual <= totalBudget
											? 'success-outline'
											: 'destructive-outline'
									}
								>
									{formatBudgetPrice(totalActual)}
								</Badge>
							</span>
							<span>Quotations</span>
							<span>Orders</span>
							<span />
						</div>
					</div>
					<StageGroupedList<TradeBudgetRow>
						emptyGroupLabel="No trades in this stage."
						getItemId={(row) => row.tradeId}
						getItemName={(row) => row.tradeName}
						getItemOrder={(row) => row.tradeOrder ?? undefined}
						getStageId={(row) => row.stageId}
						items={rows}
						loadingLabel="Loading budgets…"
						noResults={
							<Empty>
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<Wallet aria-hidden />
									</EmptyMedia>
									<EmptyTitle>No matching trades</EmptyTitle>
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
