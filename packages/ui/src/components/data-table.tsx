'use client';

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	type OnChangeFn,
	type PaginationState,
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
	manualPagination?: boolean;
	onPaginationChange?: OnChangeFn<PaginationState>;
	onRowClick?: (row: TData) => void;
	pagination?: {
		pageIndex: number;
		pageSize: number;
		pageCount: number;
	};
	totalCount?: number;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	pagination,
	onPaginationChange,
	onRowClick,
	manualPagination = false,
	emptyMessage = 'No results.',
	totalCount,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination,
		pageCount: pagination?.pageCount ?? -1,
		state: pagination
			? {
					pagination,
				}
			: undefined,
		onPaginationChange,
	});

	const rangeLabel =
		pagination && totalCount !== undefined
			? (() => {
					const start = pagination.pageIndex * pagination.pageSize + 1;
					const end = Math.min(
						(pagination.pageIndex + 1) * pagination.pageSize,
						totalCount
					);
					return (
						<span className="text-muted-foreground text-sm">
							{start}–{end} / {totalCount}
						</span>
					);
				})()
			: undefined;

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
											className="min-w-0 whitespace-normal align-top"
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
			{pagination && (
				<FrameFooter>
					<DataTablePagination label={rangeLabel} table={table} />
				</FrameFooter>
			)}
		</Frame>
	);
}
