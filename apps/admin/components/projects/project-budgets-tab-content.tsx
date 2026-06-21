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
import { useMutation, useQuery } from 'convex/react';
import { EllipsisVertical, Pencil, Trash2, Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatBudgetPrice } from '@/components/budgets/budget-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import EditProjectBudgetPrice from './edit-project-budget-price';

interface TradeBudgetRow {
	budgetPrice: number | null;
	projectBudgetId: Id<'projectBudgets'> | null;
	quotationCount: number;
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

function ColumnHeaderWithTotal({
	label,
	total,
}: {
	label: string;
	total: number;
}) {
	return (
		<div className="flex items-center gap-2">
			<span>{label}</span>
			<Badge size="lg" variant="outline">
				{formatBudgetPrice(total)}
			</Badge>
		</div>
	);
}

function buildColumns(
	totalBudget: number,
	totalQuotationPrice: number
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
				<ColumnHeaderWithTotal label="Budget" total={totalBudget} />
			),
			cell: ({ row }) => <BudgetCell row={row.original} />,
		},
		{
			id: 'totalQuotationPrice',
			header: () => (
				<ColumnHeaderWithTotal
					label="Quotation Price"
					total={totalQuotationPrice}
				/>
			),
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
	const totalQuotationPrice = filteredRows.reduce(
		(sum, row) => sum + row.totalQuotationPrice,
		0
	);
	const columns = buildColumns(totalBudget, totalQuotationPrice);

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
