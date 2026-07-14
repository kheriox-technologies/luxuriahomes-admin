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
import { SearchInput } from '@workspace/ui/components/search-input';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import {
	Check,
	ChevronsDownIcon,
	ChevronsUpIcon,
	Pencil,
	Trash2,
	Wrench,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import PageHeading from '@/components/page-heading';
import { UnmappedXeroCodesAlert } from '@/components/xero/unmapped-xero-codes-alert';
import type { XeroAccountLabel } from '@/components/xero/use-xero-account-codes';
import { useXeroAccounts } from '@/components/xero/use-xero-accounts';
import { XeroAccountCombobox } from '@/components/xero/xero-accounts-combobox';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import AddTrade from './add-trade';
import AddTradeStage from './add-trade-stage';
import DeleteTrade from './delete-trade';
import DeleteTradeStage from './delete-trade-stage';
import EditTrade from './edit-trade';
import EditTradeStage from './edit-trade-stage';
import {
	type StageGroup,
	StageGroupedList,
	type StageGroupedListHandle,
} from './stage-grouped-list';
import { useXeroMappingEditing } from './use-xero-mapping-editing';

// Read-only "Xero code" column: the trade's single mapped account as
// `code — name`, or an em dash when the trade maps to nothing.
function XeroCodesCell({
	accountId,
	labelsById,
}: {
	accountId: string | null | undefined;
	labelsById: Map<string, XeroAccountLabel>;
}) {
	if (!accountId) {
		return <span className="text-muted-foreground text-sm">—</span>;
	}
	const account = labelsById.get(accountId);
	const label = account ? `${account.code} — ${account.name}` : '…';
	return <span className="text-muted-foreground text-sm">{label}</span>;
}

export default function TradesPageContent() {
	const stages = useQuery(api.tradeStages.list.list, {});
	const trades = useQuery(api.trades.list.list, {});
	// Optimistically patch the query caches on drop so the reactive re-sync doesn't
	// briefly snap rows back to their pre-drag order while the mutation round-trips.
	const reorderStages = useMutation(
		api.tradeStages.reorder.reorder
	).withOptimisticUpdate((store, args) => {
		const current = store.getQuery(api.tradeStages.list.list, {});
		if (!current) {
			return;
		}
		const orderById = new Map(args.stageIds.map((id, index) => [id, index]));
		const next = current
			.map((stage) =>
				orderById.has(stage._id)
					? { ...stage, order: orderById.get(stage._id) as number }
					: stage
			)
			.sort((a, b) => a.order - b.order);
		store.setQuery(api.tradeStages.list.list, {}, next);
	});
	const reorderTrades = useMutation(
		api.trades.reorderTrades.reorderTrades
	).withOptimisticUpdate((store, args) => {
		const current = store.getQuery(api.trades.list.list, {});
		if (!current) {
			return;
		}
		const byId = new Map(args.updates.map((u) => [u.tradeId, u]));
		const next = current.map((trade) => {
			const update = byId.get(trade._id);
			return update
				? {
						...trade,
						stageId: update.stageId ?? undefined,
						order: update.order,
					}
				: trade;
		});
		store.setQuery(api.trades.list.list, {}, next);
	});
	const updateTrade = useMutation(api.trades.update.update);

	const [search, setSearch] = useState('');
	const listRef = useRef<StageGroupedListHandle>(null);

	// Fetch the org's Xero accounts once for the whole page: the read-only column
	// resolves codes from `xeroLabelsById`, and every inline combobox reuses the
	// same list instead of fetching per row.
	const { accounts: xeroAccounts, loading: xeroLoading } = useXeroAccounts();
	const xeroLabelsById = useMemo(() => {
		const map = new Map<string, XeroAccountLabel>();
		for (const account of xeroAccounts) {
			map.set(account.id, { code: account.code, name: account.name });
		}
		return map;
	}, [xeroAccounts]);

	// Xero expense accounts that no trade maps to yet, so a builder can spot and
	// map them. Guard on `trades === undefined` so we don't flash "all unmapped"
	// before the trades query resolves.
	const unmappedXeroAccounts = useMemo(() => {
		if (trades === undefined) {
			return [];
		}
		const mapped = new Set(
			trades.map((trade) => trade.xeroAccountId).filter(Boolean)
		);
		return xeroAccounts
			.filter((account) => !mapped.has(account.id))
			.map((account) => ({
				id: account.id,
				code: account.code,
				name: account.name,
			}));
	}, [trades, xeroAccounts]);

	const { isEditing, drafts, begin, setDraft, cancel, getChanges } =
		useXeroMappingEditing();
	const [isSaving, setIsSaving] = useState(false);

	type TradeItem = NonNullable<typeof trades>[number];

	const persistTradeGroups = (
		source: StageGroup<TradeItem>[],
		keys: string[]
	) => {
		const updates: Array<{
			tradeId: Id<'trades'>;
			stageId: Id<'tradeStages'> | null;
			order: number;
		}> = [];
		for (const key of new Set(keys)) {
			const group = source.find((g) => g.key === key);
			if (!group) {
				continue;
			}
			group.items.forEach((trade, index) => {
				updates.push({
					tradeId: trade._id,
					stageId: group.stageId,
					order: index,
				});
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
			(trades ?? []).map((trade) => ({
				tradeId: trade._id,
				xeroAccountId: trade.xeroAccountId ?? null,
			}))
		);
	};

	const handleDone = async () => {
		const changes = getChanges();
		if (changes.length === 0) {
			cancel();
			return;
		}
		const nameById = new Map<string, string>(
			(trades ?? []).map((trade) => [trade._id, trade.name])
		);
		setIsSaving(true);
		try {
			await Promise.all(
				changes.map((change) =>
					updateTrade({
						tradeId: change.tradeId as Id<'trades'>,
						// name is required; pass the existing name (unchanged so it's a no-op).
						name: nameById.get(change.tradeId) ?? '',
						xeroAccountId: change.xeroAccountId,
					})
				)
			);
			toastManager.add({ title: 'Xero mappings saved', type: 'success' });
			cancel();
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not save Xero mappings. Please try again in a moment.'
				),
				title: 'Could not save Xero mappings',
				type: 'error',
			});
		} finally {
			setIsSaving(false);
		}
	};

	const hasNoData = (trades?.length ?? 0) === 0 && (stages?.length ?? 0) === 0;

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<PageHeading
				heading="Trades"
				icon={Wrench}
				rightSlot={
					<>
						<SearchInput
							aria-label="Search trades"
							onValueChange={setSearch}
							placeholder="Search by stage, name or description…"
							value={search}
						/>
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
								variant="outline"
							>
								<Check aria-hidden /> Done
							</Button>
						) : (
							<Button onClick={handleEdit} type="button" variant="outline">
								<Pencil /> Edit Xero codes
							</Button>
						)}
						<AddTradeStage />
						<AddTrade />
					</>
				}
			/>
			<UnmappedXeroCodesAlert
				codes={unmappedXeroAccounts}
				description="These Xero accounts aren’t mapped to any trade. Map a trade to each so its spend is tracked."
				title="Unmapped Xero codes"
			/>
			{hasNoData && stages !== undefined && trades !== undefined ? (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Wrench aria-hidden />
						</EmptyMedia>
						<EmptyTitle>No trades yet</EmptyTitle>
						<EmptyDescription>
							Create a stage or a trade using the buttons above.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			) : (
				<StageGroupedList<TradeItem>
					emptyGroupLabel="No trades in this stage yet."
					getItemId={(trade) => trade._id}
					getItemName={(trade) => trade.name}
					getItemOrder={(trade) => trade.order}
					getItemSearchText={(trade) =>
						`${trade.name} ${trade.description ?? ''}`
					}
					getStageId={(trade) => trade.stageId}
					items={trades}
					loadingLabel="Loading trades…"
					noResults={
						<Empty>
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<Wrench aria-hidden />
								</EmptyMedia>
								<EmptyTitle>No matching trades</EmptyTitle>
								<EmptyDescription>
									Try a different stage or trade name.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					}
					onPersistItems={persistTradeGroups}
					onReorderStages={(stageIds) => {
						reorderStages({ stageIds }).catch(() => {
							/* Convex reactive queries revert the UI automatically */
						});
					}}
					ref={listRef}
					renderRowContent={(trade) => (
						<>
							<div className="min-w-0 flex-1">
								<span className="font-medium text-foreground text-sm">
									{trade.name}
								</span>
								{trade.description ? (
									<div className="truncate text-muted-foreground text-xs">
										{trade.description}
									</div>
								) : null}
							</div>
							<div className="min-w-0 flex-1">
								{isEditing ? (
									<XeroAccountCombobox
										accounts={xeroAccounts}
										currentTradeId={trade._id}
										loading={xeroLoading}
										onChange={(next) => setDraft(trade._id, next)}
										value={drafts[trade._id] ?? null}
									/>
								) : (
									<XeroCodesCell
										accountId={trade.xeroAccountId}
										labelsById={xeroLabelsById}
									/>
								)}
							</div>
							<Group>
								<EditTrade
									initialDescription={trade.description}
									initialName={trade.name}
									initialStageId={trade.stageId}
									tradeId={trade._id}
									trigger={
										<Button
											aria-label="Edit trade"
											size="icon"
											type="button"
											variant="outline"
										>
											<Pencil />
										</Button>
									}
								/>
								<GroupSeparator />
								<DeleteTrade
									tradeId={trade._id}
									tradeName={trade.name}
									trigger={
										<Button
											aria-label="Delete trade"
											size="icon"
											type="button"
											variant="destructive-outline"
										>
											<Trash2 />
										</Button>
									}
								/>
							</Group>
						</>
					)}
					renderStageActions={(group) =>
						group.stageId ? (
							<Group>
								<EditTradeStage
									initialName={group.name}
									stageId={group.stageId}
									trigger={
										<Button
											aria-label="Edit stage"
											size="icon"
											type="button"
											variant="outline"
										>
											<Pencil />
										</Button>
									}
								/>
								<GroupSeparator />
								<DeleteTradeStage
									stageId={group.stageId}
									stageName={group.name}
									trigger={
										<Button
											aria-label="Delete stage"
											size="icon"
											type="button"
											variant="destructive-outline"
										>
											<Trash2 />
										</Button>
									}
								/>
							</Group>
						) : null
					}
					renderStageBadges={(group) => (
						<Badge size="lg" variant="secondary">
							{group.items.length}
						</Badge>
					)}
					search={search}
					stages={stages}
				/>
			)}
		</div>
	);
}
