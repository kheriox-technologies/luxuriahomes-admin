'use client';

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
	MenuSeparator,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { toastManager } from '@workspace/ui/components/toast';
import { useQuery } from 'convex/react';
import {
	DollarSign,
	EllipsisVertical,
	ExternalLink,
	Pencil,
	Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { signCdnUrl } from '@/actions/cdn';
import AddQuotation from '@/components/quotations/add-quotation';
import DeleteQuotation from '@/components/quotations/delete-quotation';
import EditQuotation from '@/components/quotations/edit-quotation';
import type { QuotationFormValues } from '@/components/quotations/quotation-form-shared';

interface ApprovedQuotation {
	_id: Id<'quotations'>;
	companyName: string;
	price: number;
	projectId: Id<'projects'>;
	s3Key?: string;
	searchText: string;
	serviceProviderId: Id<'serviceProviders'>;
	status: QuotationFormValues['status'];
	tradeIds: Id<'trades'>[];
	tradeNames: string[];
}

function formatPrice(price: number): string {
	return new Intl.NumberFormat('en-AU', {
		style: 'currency',
		currency: 'AUD',
	}).format(price);
}

function QuotationTabActionsCell({ row }: { row: ApprovedQuotation }) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [isViewingDoc, setIsViewingDoc] = useState(false);

	const handleViewDoc = async () => {
		if (!row.s3Key) {
			return;
		}
		setIsViewingDoc(true);
		try {
			const url = await signCdnUrl(row.s3Key);
			window.open(url, '_blank', 'noopener,noreferrer');
		} catch {
			toastManager.add({ title: 'Could not open document.', type: 'error' });
		} finally {
			setIsViewingDoc(false);
		}
	};

	return (
		<>
			<EditQuotation
				initialPrice={row.price}
				initialProjectId={row.projectId}
				initialS3Key={row.s3Key}
				initialServiceProviderId={row.serviceProviderId}
				initialStatus={row.status}
				initialTradeIds={row.tradeIds}
				onOpenChange={setEditOpen}
				open={editOpen}
				quotationId={row._id}
			/>
			<DeleteQuotation
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				quotationId={row._id}
			/>
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label="Quotation actions"
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
						<Pencil /> Edit
					</MenuItem>
					{row.s3Key ? (
						<MenuItem
							disabled={isViewingDoc}
							onClick={() => {
								handleViewDoc().catch(() => {
									/* Error handled in handleViewDoc */
								});
							}}
						>
							<ExternalLink /> View Quotation
						</MenuItem>
					) : (
						<MenuItem disabled>
							<ExternalLink /> View Quotation
						</MenuItem>
					)}
					<MenuSeparator />
					<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
						<Trash2 /> Delete
					</MenuItem>
				</MenuPopup>
			</Menu>
		</>
	);
}

function buildColumns(): ColumnDef<ApprovedQuotation>[] {
	return [
		{
			id: 'trade',
			header: 'Trade',
			cell: ({ row }) => (
				<span className="font-medium">
					{row.original.tradeNames.join(', ')}
				</span>
			),
		},
		{
			id: 'serviceProvider',
			header: 'Service Provider',
			cell: ({ row }) => (
				<span className="text-muted-foreground text-sm">
					{row.original.companyName}
				</span>
			),
		},
		{
			id: 'price',
			header: 'Price',
			cell: ({ row }) => (
				<span className="text-sm">{formatPrice(row.original.price)}</span>
			),
		},
		{
			id: 'actions',
			header: '',
			size: 60,
			cell: ({ row }) => (
				<div className="flex justify-end">
					<QuotationTabActionsCell row={row.original} />
				</div>
			),
		},
	];
}

export default function ProjectQuotationsTabContent({
	projectId,
}: {
	projectId: Id<'projects'>;
}) {
	const [addOpen, setAddOpen] = useState(false);

	const quotations = useQuery(api.quotations.listByProject.listByProject, {
		projectId,
	}) as ApprovedQuotation[] | undefined;

	const columns = buildColumns();

	let content: React.ReactNode;

	if (quotations === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">Loading quotations…</div>
		);
	} else if (quotations.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<DollarSign aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No approved quotations</EmptyTitle>
					<EmptyDescription>
						Approved quotations for this project will appear here.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else {
		content = (
			<DataTable
				columns={columns}
				data={quotations}
				emptyMessage="No approved quotations."
				initialPageSize={20}
			/>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-end">
				<AddQuotation
					defaultProjectId={projectId}
					defaultStatus="Approved"
					onOpenChange={setAddOpen}
					open={addOpen}
					trigger={
						<Button onClick={() => setAddOpen(true)} variant="default">
							Add Quotation
						</Button>
					}
				/>
			</div>
			{content}
		</div>
	);
}
