'use client';
// React Compiler can't track mutations on the TanStack Table instance.
'use no memo';

import type { ColumnDef } from '@tanstack/react-table';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
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
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { EllipsisVertical, Trash2, Wallet } from 'lucide-react';
import { formatBudgetPrice } from '@/components/budgets/budget-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';

interface TradeBudgetRow {
	budgetPrice: number | null;
	budgetTitle: string | null;
	projectBudgetId: Id<'projectBudgets'> | null;
	quotationCount: number;
	totalQuotationPrice: number;
	tradeId: Id<'trades'>;
	tradeName: string;
}

function BudgetCell({ row }: { row: TradeBudgetRow }) {
	if (row.budgetTitle === null || row.budgetPrice === null) {
		return <span className="text-muted-foreground text-sm">—</span>;
	}
	return (
		<div className="flex flex-col">
			<span className="font-medium text-sm">{row.budgetTitle}</span>
			<span className="text-muted-foreground text-sm tabular-nums">
				{formatBudgetPrice(row.budgetPrice)}
			</span>
		</div>
	);
}

function RemoveBudgetCell({ row }: { row: TradeBudgetRow }) {
	const removeProjectBudget = useMutation(api.projectBudgets.remove.remove);

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
	);
}

const columns: ColumnDef<TradeBudgetRow>[] = [
	{
		id: 'trade',
		header: 'Trade',
		cell: ({ row }) => (
			<span className="font-medium">{row.original.tradeName}</span>
		),
	},
	{
		id: 'budget',
		header: 'Budget',
		cell: ({ row }) => <BudgetCell row={row.original} />,
	},
	{
		id: 'totalQuotationPrice',
		header: 'Total Quotation Price',
		cell: ({ row }) =>
			row.original.quotationCount > 0 ? (
				<span className="tabular-nums">
					{formatBudgetPrice(row.original.totalQuotationPrice)}
				</span>
			) : (
				<span className="text-muted-foreground text-sm">—</span>
			),
	},
	{
		id: 'actions',
		header: '',
		size: 60,
		cell: ({ row }) => (
			<div className="flex justify-end">
				<RemoveBudgetCell row={row.original} />
			</div>
		),
	},
];

export default function ProjectBudgetsTabContent({
	projectId,
}: {
	projectId: Id<'projects'>;
}) {
	const rows = useQuery(api.projectBudgets.tradeSummary.tradeSummary, {
		projectId,
	}) as TradeBudgetRow[] | undefined;

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

	return (
		<DataTable
			columns={columns}
			data={rows}
			emptyMessage="No trades found."
			initialPageSize={20}
		/>
	);
}
