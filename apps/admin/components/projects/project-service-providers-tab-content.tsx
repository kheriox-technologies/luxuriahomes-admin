'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';
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
import { EllipsisVertical, Handshake, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

type ServiceProvider = Doc<'serviceProviders'>;

function RemoveFromProjectCell({
	serviceProvider,
	projectId,
}: {
	serviceProvider: ServiceProvider;
	projectId: Id<'projects'>;
}) {
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [isRemoving, setIsRemoving] = useState(false);
	const removeFromProject = useMutation(
		api.projectServiceProviders.remove.remove
	);

	const handleRemove = async () => {
		setIsRemoving(true);
		try {
			await removeFromProject({
				projectId,
				serviceProviderId: serviceProvider._id,
			});
			toastManager.add({
				title: 'Removed from project',
				type: 'success',
			});
			setConfirmOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not remove service provider. Please try again in a moment.'
				),
				title: 'Could not remove service provider',
				type: 'error',
			});
		} finally {
			setIsRemoving(false);
		}
	};

	return (
		<>
			<AlertDialog onOpenChange={setConfirmOpen} open={confirmOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Remove service provider?</AlertDialogTitle>
						<AlertDialogDescription>
							{`Remove ${serviceProvider.company} from this project?`}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogClose
							render={<Button type="button" variant="outline" />}
						>
							Cancel
						</AlertDialogClose>
						<Button
							loading={isRemoving}
							onClick={() => {
								handleRemove().catch(() => {
									/* Error handled in handleRemove */
								});
							}}
							variant="destructive"
						>
							Remove
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label="Service provider actions"
							size="icon"
							type="button"
							variant="ghost"
						/>
					}
				>
					<EllipsisVertical className="size-4" />
				</MenuTrigger>
				<MenuPopup align="end">
					<MenuItem onClick={() => setConfirmOpen(true)} variant="destructive">
						<Trash2 /> Remove from Project
					</MenuItem>
				</MenuPopup>
			</Menu>
		</>
	);
}

function buildColumns(
	projectId: Id<'projects'>,
	tradeMap: Map<string, string>
): ColumnDef<ServiceProvider>[] {
	return [
		{
			accessorKey: 'company',
			header: 'Company',
			cell: ({ row }) => (
				<span className="font-medium">{row.original.company}</span>
			),
		},
		{
			accessorKey: 'name',
			header: 'Contact Name',
			cell: ({ row }) => <span className="text-sm">{row.original.name}</span>,
		},
		{
			accessorKey: 'email',
			header: 'Email',
			cell: ({ row }) => (
				<span className="text-muted-foreground text-sm">
					{row.original.email}
				</span>
			),
		},
		{
			accessorKey: 'phone',
			header: 'Phone',
			cell: ({ row }) => (
				<span className="text-muted-foreground text-sm">
					{row.original.phone}
				</span>
			),
		},
		{
			id: 'trades',
			header: 'Trades',
			cell: ({ row }) => {
				const names = row.original.tradeIds
					.map((id) => tradeMap.get(id))
					.filter(Boolean)
					.join(', ');
				return names ? (
					<span className="text-muted-foreground text-sm">{names}</span>
				) : null;
			},
		},
		{
			id: 'contacts',
			header: 'Contacts',
			cell: ({ row }) => {
				const { contacts } = row.original;
				if (contacts.length === 0) {
					return null;
				}
				return (
					<div className="flex flex-col gap-2">
						{contacts.map((c, i) => (
							<div className="space-y-0.5" key={`${c.email}-${i}`}>
								<p className="text-sm">{c.name}</p>
								<p className="text-muted-foreground text-xs">{c.email}</p>
								<p className="text-muted-foreground text-xs">{c.phone}</p>
							</div>
						))}
					</div>
				);
			},
		},
		{
			id: 'actions',
			header: '',
			size: 56,
			cell: ({ row }) => (
				<div className="flex justify-end">
					<RemoveFromProjectCell
						projectId={projectId}
						serviceProvider={row.original}
					/>
				</div>
			),
		},
	];
}

export default function ProjectServiceProvidersTabContent({
	projectId,
}: {
	projectId: Id<'projects'>;
}) {
	const serviceProviders = useQuery(
		api.projectServiceProviders.listByProject.list,
		{ projectId }
	);
	const allTrades = useQuery(api.trades.list.list, {});

	const tradeMap = new Map<string, string>(
		allTrades?.map((t) => [t._id, t.name]) ?? []
	);

	const columns = buildColumns(projectId, tradeMap);

	if (serviceProviders === undefined) {
		return (
			<div className="text-muted-foreground text-sm">
				Loading service providers…
			</div>
		);
	}

	if (serviceProviders.length === 0) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Handshake aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No service providers linked</EmptyTitle>
					<EmptyDescription>
						Add service providers to this project from the Service Providers
						list.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<DataTable
			columns={columns}
			data={serviceProviders}
			emptyMessage="No service providers."
		/>
	);
}
