'use client';
// React Compiler can't track mutations on the TanStack Table instance (setOptions during render).
'use no memo';

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { DataTablePagination } from '@workspace/ui/components/data-table-pagination';
import { Frame, FrameFooter } from '@workspace/ui/components/frame';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@workspace/ui/components/table';

function getColumnWidth(
	columnSize: number | undefined,
	_size: number
): string | undefined {
	// Only set fixed width for narrow columns (e.g. actions) so the table fits container width
	if (columnSize != null && columnSize <= 80) {
		return `${columnSize}px`;
	}
	return undefined;
}

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	emptyMessage?: string;
	initialPageSize?: number;
	onRowClick?: (row: TData) => void;
	showPagination?: boolean;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	initialPageSize = 20,
	onRowClick,
	emptyMessage = 'No results.',
	showPagination = true,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		autoResetPageIndex: false,
		initialState: {
			pagination: {
				pageIndex: 0,
				pageSize: initialPageSize,
			},
		},
	});

	const { pageIndex, pageSize } = table.getState().pagination;
	const rowCount = data.length;
	const rangeLabel =
		rowCount > 0 ? (
			<span className="text-muted-foreground text-sm">
				{pageIndex * pageSize + 1}–
				{Math.min((pageIndex + 1) * pageSize, rowCount)} / {rowCount}
			</span>
		) : undefined;

	return (
		<Frame className="min-w-0 overflow-hidden">
			<Table className="w-full table-fixed">
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								const size = header.getSize();
								const columnSize = header.column.columnDef.size;
								const width = getColumnWidth(columnSize, size);
								return (
									<TableHead
										className={width ? undefined : 'min-w-0'}
										key={header.id}
										style={
											width
												? { width, minWidth: width, maxWidth: width }
												: undefined
										}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								className={onRowClick ? 'cursor-pointer' : undefined}
								data-state={row.getIsSelected() && 'selected'}
								key={row.id}
								onClick={onRowClick ? () => onRowClick(row.original) : undefined}
							>
								{row.getVisibleCells().map((cell) => {
									const size = cell.column.getSize();
									const columnSize = cell.column.columnDef.size;
									const width = getColumnWidth(columnSize, size);
									return (
										<TableCell
											className="min-w-0 whitespace-normal"
											key={cell.id}
											style={
												width
													? { width, minWidth: width, maxWidth: width }
													: undefined
											}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									);
								})}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								className="h-24 text-center"
								colSpan={columns.length}
							>
								{emptyMessage}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			{showPagination && rowCount > 0 && (
				<FrameFooter>
					<DataTablePagination label={rangeLabel} table={table} />
				</FrameFooter>
			)}
		</Frame>
	);
}
