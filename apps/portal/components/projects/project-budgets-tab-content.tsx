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
import { SearchInput } from '@workspace/ui/components/search-input';
import { toastManager } from '@workspace/ui/components/toast';
import { cn } from '@workspace/ui/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import {
	Check,
	ChevronsDownIcon,
	ChevronsUpIcon,
	Pencil,
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
import AddTradeStage from '@/components/trades/add-trade-stage';
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
	paymentPrice: number | null;
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
// The actions track is a fixed width (not `auto`) so the header — whose actions
// cell is empty — keeps the same column boundaries as the data rows.
const ROW_GRID =
	'grid grid-cols-[minmax(0,2.5fr)_minmax(0,1.3fr)_minmax(0,1.3fr)_minmax(0,1.3fr)_5rem] items-center gap-3';

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

// `budget` and `payment` are the live (draft-aware) values so the Actual amount
// and its over/under color react while the row is being edited.
function ActualCell({
	row,
	budget,
	payment,
}: {
	row: TradeBudgetRow;
	budget: number | null;
	payment: number;
}) {
	if (row.quotationCount === 0 && row.orderCount === 0 && payment === 0) {
		return <span className="text-muted-foreground text-sm">—</span>;
	}
	const actual = row.totalQuotationPrice + row.totalOrderPrice + payment;
	return (
		<div className="flex flex-col items-start gap-1">
			<span
				className={cn(
					'font-medium tabular-nums',
					actualColorClass(actual, budget)
				)}
			>
				{formatBudgetPrice(actual)}
			</span>
			{row.quotationCount > 0 || row.orderCount > 0 ? (
				<div className="flex flex-wrap items-center gap-1">
					<QuotationsCountCell row={row} />
					<OrdersCountCell row={row} />
				</div>
			) : null}
		</div>
	);
}

function QuotationsCountCell({ row }: { row: TradeBudgetRow }) {
	const router = useRouter();
	const searchParams = useSearchParams();

	if (row.quotationCount === 0) {
		return null;
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
		return null;
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
		paymentDrafts,
		nameDrafts,
		begin,
		setDraft,
		setPaymentDraft,
		setNameDraft,
		cancel,
		getChanges,
		getPaymentChanges,
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

	// Live values reflect draft prices while editing so totals update before
	// "Done"; blank/invalid drafts fall back to the saved value.
	const liveBudget = (row: TradeBudgetRow) => {
		if (isEditing) {
			const raw = (drafts[row.tradeId] ?? '').trim();
			if (raw.length > 0 && isValidMoneyString(raw)) {
				return parseMoneyString(raw);
			}
		}
		return row.budgetPrice ?? 0;
	};
	const livePayment = (row: TradeBudgetRow) => {
		if (isEditing) {
			const raw = (paymentDrafts[row.tradeId] ?? '').trim();
			if (raw.length > 0 && isValidMoneyString(raw)) {
				return parseMoneyString(raw);
			}
		}
		return row.paymentPrice ?? 0;
	};
	// Actual includes payments (quotations + orders + payments).
	const liveActual = (row: TradeBudgetRow) =>
		row.totalQuotationPrice + row.totalOrderPrice + livePayment(row);

	const totalBudget = (rows ?? []).reduce(
		(sum, row) => sum + liveBudget(row),
		0
	);
	const totalActual = (rows ?? []).reduce(
		(sum, row) => sum + liveActual(row),
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
				payments: row.paymentPrice,
				name: row.tradeName,
			}))
		);
	};

	const handleDone = async () => {
		const changes = getChanges();
		const paymentChanges = getPaymentChanges();
		const nameChanges = getNameChanges();
		// Merge price + payment changes by trade so each trade is upserted once.
		const itemsByTrade = new Map<
			Id<'trades'>,
			{ tradeId: Id<'trades'>; price?: number; payments?: number }
		>();
		for (const change of changes) {
			const tradeId = change.tradeId as Id<'trades'>;
			itemsByTrade.set(tradeId, { tradeId, price: change.price });
		}
		for (const change of paymentChanges) {
			const tradeId = change.tradeId as Id<'trades'>;
			const existing = itemsByTrade.get(tradeId) ?? { tradeId };
			existing.payments = change.payments;
			itemsByTrade.set(tradeId, existing);
		}
		const items = Array.from(itemsByTrade.values());
		if (items.length === 0 && nameChanges.length === 0) {
			cancel();
			return;
		}
		setIsSaving(true);
		try {
			await Promise.all([
				items.length > 0 ? setPrices({ projectId, items }) : Promise.resolve(),
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
			{isEditing ? (
				<InputGroup>
					<InputGroupAddon align="inline-start">
						<InputGroupText>$</InputGroupText>
					</InputGroupAddon>
					<InputGroupInput
						aria-label={`Payments for ${row.tradeName}`}
						inputMode="decimal"
						nativeInput
						onChange={(e) => setPaymentDraft(row.tradeId, e.target.value)}
						placeholder="0.00"
						type="text"
						value={paymentDrafts[row.tradeId] ?? ''}
					/>
					<InputGroupAddon align="inline-end">
						<InputGroupText>AUD</InputGroupText>
					</InputGroupAddon>
				</InputGroup>
			) : (
				<BudgetValue price={row.paymentPrice} />
			)}
			<ActualCell
				budget={liveBudget(row)}
				payment={livePayment(row)}
				row={row}
			/>
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

	// Count badge sits with the stage name (Trade column).
	const renderStageBadges = (group: StageGroup<TradeBudgetRow>) => (
		<Badge size="lg" variant="secondary">
			{group.items.length}
		</Badge>
	);

	// Per-stage subtotals, one cell per column so they align under Budget /
	// Payments / Actual. Empty stages still emit the cells to keep the grid tracks.
	const renderStageColumns = (group: StageGroup<TradeBudgetRow>) => {
		if (group.items.length === 0) {
			return (
				<>
					<span />
					<span />
					<span />
				</>
			);
		}
		const budgetSubtotal = group.items.reduce(
			(sum, row) => sum + liveBudget(row),
			0
		);
		const paymentSubtotal = group.items.reduce(
			(sum, row) => sum + livePayment(row),
			0
		);
		const actualSubtotal = group.items.reduce(
			(sum, row) => sum + liveActual(row),
			0
		);
		return (
			<>
				<span className="flex items-center">
					<Badge size="lg" variant="purple">
						B {formatBudgetPrice(budgetSubtotal)}
					</Badge>
				</span>
				<span className="flex items-center">
					<Badge size="lg" variant="secondary">
						P {formatBudgetPrice(paymentSubtotal)}
					</Badge>
				</span>
				<span className="flex items-center">
					<Badge
						size="lg"
						variant={
							actualSubtotal <= budgetSubtotal
								? 'success-outline'
								: 'destructive-outline'
						}
					>
						A {formatBudgetPrice(actualSubtotal)}
					</Badge>
				</span>
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
				<SearchInput
					aria-label="Search budgets"
					onValueChange={setSearch}
					placeholder="Search by stage or trade…"
					value={search}
				/>
				<div className="flex flex-wrap items-center gap-2">
					{rows.length > 0 ? (
						<>
							<Badge size="lg" variant="purple">
								B {formatBudgetPrice(totalBudget)}
							</Badge>
							<Badge
								size="lg"
								variant={
									totalActual <= totalBudget
										? 'success-outline'
										: 'destructive-outline'
								}
							>
								A {formatBudgetPrice(totalActual)}
							</Badge>
						</>
					) : null}
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
								variant="outline"
							>
								<Check aria-hidden /> Done
							</Button>
						) : (
							<Button onClick={handleEdit} type="button" variant="outline">
								<Pencil />
								Edit
							</Button>
						))}
					<AddTradeStage />
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
							Use “Add Trade” to add a budget for a trade.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			) : (
				<div className="flex min-h-0 flex-1 flex-col gap-2">
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
						renderStageColumns={renderStageColumns}
						search={search}
						stageColumnsClassName={ROW_GRID}
						stages={stages}
					/>
				</div>
			)}
		</div>
	);
}
