'use client';
// React Compiler can't track mutations on the TanStack Table instance.
'use no memo';

import type { ColumnDef } from '@tanstack/react-table';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import { DataTable } from '@workspace/ui/components/data-table';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
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
import { Pencil, Wallet } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createContext, useContext, useMemo, useState } from 'react';
import AddBudgetItemDialog from '@/components/budgets/add-budget-item-dialog';
import {
	formatBudgetPrice,
	isValidMoneyString,
	parseMoneyString,
} from '@/components/budgets/budget-form-shared';
import { usePriceEditing } from '@/components/budgets/use-price-editing';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import DeleteProjectBudget from './delete-project-budget';

interface TradeBudgetRow {
	budgetPrice: number | null;
	orderCount: number;
	projectBudgetId: Id<'projectBudgets'> | null;
	quotationCount: number;
	totalOrderPrice: number;
	totalQuotationPrice: number;
	tradeId: Id<'trades'>;
	tradeName: string;
}

interface BudgetEditContextValue {
	drafts: Record<string, string>;
	isEditing: boolean;
	nameDrafts: Record<string, string>;
	onDraftChange: (tradeId: string, value: string) => void;
	onNameDraftChange: (tradeId: string, value: string) => void;
}

const ProjectBudgetsEditContext = createContext<BudgetEditContextValue>({
	isEditing: false,
	drafts: {},
	nameDrafts: {},
	onDraftChange: () => {
		/* default no-op */
	},
	onNameDraftChange: () => {
		/* default no-op */
	},
});

interface BudgetTotalsContextValue {
	totalActual: number;
	totalBudget: number;
}

// Totals live in their own context so the column defs stay stable while editing:
// baking totals into buildColumns() would change the `columns` identity on every
// keystroke and remount the focused price input.
const ProjectBudgetsTotalsContext = createContext<BudgetTotalsContextValue>({
	totalBudget: 0,
	totalActual: 0,
});

function TradeNameCell({ row }: { row: TradeBudgetRow }) {
	const { isEditing, nameDrafts, onNameDraftChange } = useContext(
		ProjectBudgetsEditContext
	);

	if (isEditing) {
		return (
			<Input
				aria-label={`Trade name for ${row.tradeName}`}
				className="max-w-64"
				nativeInput
				onChange={(e) => onNameDraftChange(row.tradeId, e.target.value)}
				placeholder="Trade name"
				type="text"
				value={nameDrafts[row.tradeId] ?? ''}
			/>
		);
	}

	return <span className="font-medium">{row.tradeName}</span>;
}

function BudgetCell({ row }: { row: TradeBudgetRow }) {
	const { isEditing, drafts, onDraftChange } = useContext(
		ProjectBudgetsEditContext
	);

	if (isEditing) {
		return (
			<InputGroup className="max-w-44">
				<InputGroupAddon align="inline-start">
					<InputGroupText>$</InputGroupText>
				</InputGroupAddon>
				<InputGroupInput
					aria-label={`Budget for ${row.tradeName}`}
					inputMode="decimal"
					nativeInput
					onChange={(e) => onDraftChange(row.tradeId, e.target.value)}
					placeholder="0.00"
					type="text"
					value={drafts[row.tradeId] ?? ''}
				/>
				<InputGroupAddon align="inline-end">
					<InputGroupText>AUD</InputGroupText>
				</InputGroupAddon>
			</InputGroup>
		);
	}

	if (row.budgetPrice === null) {
		return <span className="text-muted-foreground text-sm">—</span>;
	}
	return (
		<span className="tabular-nums">{formatBudgetPrice(row.budgetPrice)}</span>
	);
}

function actualColorClass(actual: number, budgetPrice: number | null): string {
	if (budgetPrice === null) {
		return '';
	}
	return actual <= budgetPrice
		? 'text-success-foreground'
		: 'text-destructive-foreground';
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

function BudgetActionsCell({ row }: { row: TradeBudgetRow }) {
	if (!row.projectBudgetId) {
		return null;
	}
	return (
		<DeleteProjectBudget
			projectBudgetId={row.projectBudgetId}
			tradeName={row.tradeName}
		/>
	);
}

const FILTER_PARAMS = [
	'orderId',
	'orderTaskId',
	'orderTradeId',
	'quotationTradeId',
	'quotationStatus',
] as const;

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

function ColumnHeaderWithTotal({
	label,
	total,
	variant = 'outline',
}: {
	label: string;
	total: number;
	variant?: 'outline' | 'purple' | 'success-outline' | 'destructive-outline';
}) {
	return (
		<div className="flex items-center gap-2">
			<span>{label}</span>
			<Badge size="lg" variant={variant}>
				{formatBudgetPrice(total)}
			</Badge>
		</div>
	);
}

function BudgetTotalHeader() {
	const { totalBudget } = useContext(ProjectBudgetsTotalsContext);
	return (
		<ColumnHeaderWithTotal
			label="Budget"
			total={totalBudget}
			variant="purple"
		/>
	);
}

function ActualTotalHeader() {
	const { totalActual, totalBudget } = useContext(ProjectBudgetsTotalsContext);
	return (
		<ColumnHeaderWithTotal
			label="Actual"
			total={totalActual}
			variant={
				totalActual <= totalBudget ? 'success-outline' : 'destructive-outline'
			}
		/>
	);
}

function buildColumns(): ColumnDef<TradeBudgetRow>[] {
	return [
		{
			id: 'trade',
			header: 'Trade',
			cell: ({ row }) => <TradeNameCell row={row.original} />,
		},
		{
			id: 'budget',
			header: () => <BudgetTotalHeader />,
			cell: ({ row }) => <BudgetCell row={row.original} />,
		},
		{
			id: 'actual',
			header: () => <ActualTotalHeader />,
			cell: ({ row }) => <ActualCell row={row.original} />,
		},
		{
			id: 'quotations',
			header: 'Quotations',
			cell: ({ row }) => <QuotationsCountCell row={row.original} />,
		},
		{
			id: 'orders',
			header: 'Orders',
			cell: ({ row }) => <OrdersCountCell row={row.original} />,
		},
		{
			id: 'actions',
			header: '',
			size: 60,
			cell: ({ row }) => (
				<div className="flex justify-end">
					<BudgetActionsCell row={row.original} />
				</div>
			),
		},
	];
}

export default function ProjectBudgetsTabContent({
	projectId,
}: {
	projectId: Id<'projects'>;
}) {
	const rows = useQuery(api.projectBudgets.tradeSummary.tradeSummary, {
		projectId,
	}) as TradeBudgetRow[] | undefined;

	const [filterTradeIds, setFilterTradeIds] = useState<Id<'trades'>[]>([]);
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

	const setPrices = useMutation(api.projectBudgets.setPrices.setPrices);
	const addItem = useMutation(api.projectBudgets.addItem.addItem);
	const updateTrade = useMutation(api.trades.update.update);

	const tradeItems = useMemo(
		() => (rows ?? []).map((row) => row.tradeId),
		[rows]
	);
	const tradeLabelById = useMemo(
		() => new Map((rows ?? []).map((row) => [row.tradeId, row.tradeName])),
		[rows]
	);
	const budgetedTradeIds = useMemo(
		() =>
			(rows ?? [])
				.filter((row) => row.budgetPrice !== null)
				.map((row) => row.tradeId),
		[rows]
	);

	const filteredRows = useMemo(() => {
		if (rows === undefined) {
			return [];
		}
		return filterTradeIds.length > 0
			? rows.filter((row) => filterTradeIds.includes(row.tradeId))
			: rows;
	}, [rows, filterTradeIds]);

	// While editing, reflect the draft values live so the header total updates in
	// real time before "Done"; blank/invalid drafts fall back to the saved price
	// (consistent with getChanges() treating blanks as no-ops).
	const totalBudget = filteredRows.reduce((sum, row) => {
		if (isEditing) {
			const raw = (drafts[row.tradeId] ?? '').trim();
			if (raw.length > 0 && isValidMoneyString(raw)) {
				return sum + parseMoneyString(raw);
			}
		}
		return sum + (row.budgetPrice ?? 0);
	}, 0);
	const totalActual = filteredRows.reduce(
		(sum, row) => sum + row.totalQuotationPrice + row.totalOrderPrice,
		0
	);

	// Stable identity so per-keystroke re-renders (drafts/totals) don't rebuild the
	// table and remount the price inputs. Totals reach the header via context.
	const columns = useMemo(() => buildColumns(), []);

	const editContextValue = useMemo<BudgetEditContextValue>(
		() => ({
			isEditing,
			drafts,
			nameDrafts,
			onDraftChange: setDraft,
			onNameDraftChange: setNameDraft,
		}),
		[isEditing, drafts, nameDrafts, setDraft, setNameDraft]
	);

	const totalsContextValue = useMemo<BudgetTotalsContextValue>(
		() => ({ totalBudget, totalActual }),
		[totalBudget, totalActual]
	);

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

	if (rows === undefined) {
		return (
			<div className="text-muted-foreground text-sm">Loading budgets…</div>
		);
	}

	return (
		<ProjectBudgetsTotalsContext.Provider value={totalsContextValue}>
			<ProjectBudgetsEditContext.Provider value={editContextValue}>
				<div className="flex min-h-0 flex-1 flex-col gap-4">
					<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
						<div className="sm:max-w-md sm:flex-1">
							<Combobox<Id<'trades'>, true>
								items={tradeItems}
								itemToStringLabel={(item) => tradeLabelById.get(item) ?? ''}
								multiple
								onValueChange={(next) =>
									setFilterTradeIds((next as Id<'trades'>[] | null) ?? [])
								}
								value={filterTradeIds}
							>
								<ComboboxChips>
									{filterTradeIds.map((id) => (
										<ComboboxChip key={id}>
											{tradeLabelById.get(id) ?? id}
										</ComboboxChip>
									))}
									<ComboboxChipsInput placeholder="Filter trades…" />
								</ComboboxChips>
								<ComboboxPopup>
									<ComboboxEmpty>No trades found.</ComboboxEmpty>
									<ComboboxList>
										{(item: Id<'trades'>) => (
											<ComboboxItem key={item} value={item}>
												{tradeLabelById.get(item) ?? item}
											</ComboboxItem>
										)}
									</ComboboxList>
								</ComboboxPopup>
							</Combobox>
						</div>
						<div className="flex items-center gap-2">
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
						<div className="flex min-h-0 flex-1 flex-col">
							<DataTable
								columns={columns}
								data={filteredRows}
								emptyMessage="No trades found."
								initialPageSize={20}
								key={filterTradeIds.join(',')}
								stickyHeader
							/>
						</div>
					)}
				</div>
			</ProjectBudgetsEditContext.Provider>
		</ProjectBudgetsTotalsContext.Provider>
	);
}
