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
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { toastManager } from '@workspace/ui/components/toast';
import { cn } from '@workspace/ui/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { EllipsisVertical, Pencil, Trash2, Wallet } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { formatBudgetPrice } from '@/components/budgets/budget-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import EditProjectBudgetPrice from './edit-project-budget-price';

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

function BudgetCell({ row }: { row: TradeBudgetRow }) {
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
	const removeProjectBudget = useMutation(api.projectBudgets.remove.remove);
	const [editOpen, setEditOpen] = useState(false);

	if (!row.projectBudgetId) {
		return null;
	}
	const projectBudgetId = row.projectBudgetId;

	const handleRemove = async () => {
		try {
			await removeProjectBudget({ projectBudgetId });
			toastManager.add({ title: 'Budget removed', type: 'success' });
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not remove budget. Please try again in a moment.'
				),
				title: 'Could not remove budget',
				type: 'error',
			});
		}
	};

	return (
		<>
			<EditProjectBudgetPrice
				initialPrice={row.budgetPrice ?? 0}
				onOpenChange={setEditOpen}
				open={editOpen}
				projectBudgetId={projectBudgetId}
				tradeName={row.tradeName}
			/>
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label="Budget actions"
							size="icon"
							type="button"
							variant="ghost"
						/>
					}
				>
					<EllipsisVertical className="size-4" />
				</MenuTrigger>
				<MenuPopup align="end">
					<MenuItem onClick={() => setEditOpen(true)}>
						<Pencil /> Edit Price
					</MenuItem>
					<MenuSeparator />
					<MenuItem
						onClick={() => {
							handleRemove().catch(() => {
								/* Error handled in handleRemove */
							});
						}}
						variant="destructive"
					>
						<Trash2 /> Remove Budget
					</MenuItem>
				</MenuPopup>
			</Menu>
		</>
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

function buildColumns(
	totalBudget: number,
	totalActual: number
): ColumnDef<TradeBudgetRow>[] {
	return [
		{
			id: 'trade',
			header: 'Trade',
			cell: ({ row }) => (
				<span className="font-medium">{row.original.tradeName}</span>
			),
		},
		{
			id: 'budget',
			header: () => (
				<ColumnHeaderWithTotal
					label="Budget"
					total={totalBudget}
					variant="purple"
				/>
			),
			cell: ({ row }) => <BudgetCell row={row.original} />,
		},
		{
			id: 'actual',
			header: () => (
				<ColumnHeaderWithTotal
					label="Actual"
					total={totalActual}
					variant={
						totalActual <= totalBudget
							? 'success-outline'
							: 'destructive-outline'
					}
				/>
			),
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

	const tradeItems = useMemo(
		() => (rows ?? []).map((row) => row.tradeId),
		[rows]
	);
	const tradeLabelById = useMemo(
		() => new Map((rows ?? []).map((row) => [row.tradeId, row.tradeName])),
		[rows]
	);

	if (rows === undefined) {
		return (
			<div className="text-muted-foreground text-sm">Loading budgets…</div>
		);
	}

	if (rows.length === 0) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Wallet aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No trades yet</EmptyTitle>
					<EmptyDescription>
						Create trades to track budgets and quotations per trade.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	const filteredRows =
		filterTradeIds.length > 0
			? rows.filter((row) => filterTradeIds.includes(row.tradeId))
			: rows;

	const totalBudget = filteredRows.reduce(
		(sum, row) => sum + (row.budgetPrice ?? 0),
		0
	);
	const totalActual = filteredRows.reduce(
		(sum, row) => sum + row.totalQuotationPrice + row.totalOrderPrice,
		0
	);
	const columns = buildColumns(totalBudget, totalActual);

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<div className="sm:max-w-md">
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
			<DataTable
				columns={columns}
				data={filteredRows}
				emptyMessage="No trades found."
				initialPageSize={20}
				key={filterTradeIds.join(',')}
			/>
		</div>
	);
}
