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
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { useMutation, useQuery } from 'convex/react';
import {
	ChevronsDownIcon,
	ChevronsUpIcon,
	Pencil,
	SearchIcon,
	Trash2,
	Wrench,
} from 'lucide-react';
import { useRef, useState } from 'react';
import PageHeading from '@/components/page-heading';
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

	const [search, setSearch] = useState('');
	const listRef = useRef<StageGroupedListHandle>(null);

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

	const hasNoData = (trades?.length ?? 0) === 0 && (stages?.length ?? 0) === 0;

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<PageHeading
				heading="Trades"
				icon={Wrench}
				rightSlot={
					<>
						<InputGroup className="w-full sm:min-w-80 sm:max-w-2xl">
							<InputGroupAddon align="inline-start">
								<InputGroupText>
									<SearchIcon aria-hidden />
								</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								aria-label="Search trades"
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search by stage, name or description…"
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
						<AddTradeStage />
						<AddTrade />
					</>
				}
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
								<div className="font-medium text-foreground text-sm">
									{trade.name}
								</div>
								{trade.description ? (
									<div className="truncate text-muted-foreground text-xs">
										{trade.description}
									</div>
								) : null}
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
