'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { DataTable } from '@workspace/ui/components/data-table';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { formatAud, formatAudWhole } from '@/lib/currency';

type Transaction = Doc<'investmentTransactions'>;

const dateFormat = new Intl.DateTimeFormat('en-AU', {
	day: '2-digit',
	month: 'short',
	year: 'numeric',
});

export default function InvestmentTransactionsTable({
	description,
	onAdd,
	onEdit,
	title,
	transactions,
}: {
	description: string;
	onAdd: () => void;
	onEdit: (transaction: Transaction) => void;
	title: string;
	transactions: Transaction[];
}) {
	const removeTransaction = useMutation(
		api.investments.removeTransaction.removeTransaction
	);

	const total = transactions.reduce((sum, row) => sum + row.amount, 0);

	const columns = useMemo<ColumnDef<Transaction>[]>(
		() => [
			{
				accessorKey: 'date',
				header: 'Date',
				cell: ({ row }) => (
					<span className="whitespace-nowrap tabular-nums">
						{dateFormat.format(new Date(row.original.date))}
					</span>
				),
			},
			{
				accessorKey: 'description',
				header: 'Description',
				cell: ({ row }) => (
					<div className="min-w-0">
						<p className="truncate">{row.original.description}</p>
						{row.original.notes ? (
							<p className="truncate text-muted-foreground text-xs">
								{row.original.notes}
							</p>
						) : null}
					</div>
				),
			},
			{
				accessorKey: 'category',
				header: 'Category',
				cell: ({ row }) => (
					<Badge variant="outline">{row.original.category}</Badge>
				),
			},
			{
				accessorKey: 'amount',
				header: () => <div className="text-right">Amount</div>,
				cell: ({ row }) => (
					<div className="text-right font-mono tabular-nums">
						{formatAud(row.original.amount)}
					</div>
				),
			},
			{
				id: 'actions',
				header: () => <span className="sr-only">Actions</span>,
				cell: ({ row }) => (
					<div className="flex justify-end gap-1">
						<Button
							aria-label={`Edit ${row.original.description}`}
							onClick={() => onEdit(row.original)}
							size="icon"
							type="button"
							variant="ghost"
						>
							<Pencil aria-hidden />
						</Button>
						<Button
							aria-label={`Delete ${row.original.description}`}
							onClick={async () => {
								try {
									await removeTransaction({
										transactionId: row.original._id,
									});
								} catch (error) {
									toastManager.add({
										title: 'Could not delete entry',
										description: getConvexErrorMessage(
											error,
											'Please try again.'
										),
										type: 'error',
									});
								}
							}}
							size="icon"
							type="button"
							variant="ghost"
						>
							<Trash2 aria-hidden />
						</Button>
					</div>
				),
			},
		],
		[onEdit, removeTransaction]
	);

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-end justify-between gap-2">
				<div className="min-w-0">
					<h3 className="font-semibold">{title}</h3>
					<p className="text-muted-foreground text-xs">{description}</p>
				</div>
				<div className="flex items-center gap-3">
					<div className="text-right">
						<p className="text-muted-foreground text-xs uppercase tracking-wide">
							Total
						</p>
						<p className="font-semibold tabular-nums">
							{formatAudWhole(total)}
						</p>
					</div>
					<Button onClick={onAdd} type="button" variant="outline">
						<Plus aria-hidden /> Add
					</Button>
				</div>
			</div>
			<DataTable
				columns={columns}
				data={transactions}
				emptyMessage="No entries yet."
				initialPageSize={10}
			/>
		</div>
	);
}
