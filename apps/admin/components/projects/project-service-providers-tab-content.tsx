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
import AddExistingServiceProviderToProject from '@/components/service-providers/add-existing-service-provider-to-project';
import AddServiceProvider from '@/components/service-providers/add-service-provider';
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
			id: 'mainContact',
			header: 'Main Contact',
			cell: ({ row }) => {
				const { name, email, phone, position } = row.original;
				return (
					<div className="space-y-0.5">
						<p className="text-sm">{name}</p>
						{position ? (
							<p className="text-muted-foreground text-xs">{position}</p>
						) : null}
						<p className="text-muted-foreground text-xs">{email}</p>
						<p className="text-muted-foreground text-xs">{phone}</p>
					</div>
				);
			},
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
			accessorKey: 'qbccLicense',
			header: 'QBCC Licence',
			cell: ({ row }) =>
				row.original.qbccLicense ? (
					<span className="text-muted-foreground text-sm">
						{row.original.qbccLicense}
					</span>
				) : null,
		},
		{
			accessorKey: 'website',
			header: 'Website',
			cell: ({ row }) =>
				row.original.website ? (
					<a
						className="text-blue-600 text-sm underline-offset-4 hover:underline"
						href={row.original.website}
						rel="noopener noreferrer"
						target="_blank"
					>
						{row.original.website}
					</a>
				) : null,
		},
		{
			id: 'contacts',
			header: 'Additional Contacts',
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
								{c.position ? (
									<p className="text-muted-foreground text-xs">{c.position}</p>
								) : null}
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

	const header = (
		<div className="flex justify-end gap-2">
			<AddExistingServiceProviderToProject
				projectId={projectId}
				trigger={<Button variant="outline">Add Existing</Button>}
			/>
			<AddServiceProvider
				projectId={projectId}
				trigger={<Button variant="outline">New Service Provider</Button>}
			/>
		</div>
	);

	if (serviceProviders === undefined) {
		return (
			<div className="flex flex-col gap-4">
				{header}
				<div className="text-muted-foreground text-sm">
					Loading service providers…
				</div>
			</div>
		);
	}

	if (serviceProviders.length === 0) {
		return (
			<div className="flex flex-col gap-4">
				{header}
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Handshake aria-hidden />
						</EmptyMedia>
						<EmptyTitle>No service providers linked</EmptyTitle>
						<EmptyDescription>
							Add existing service providers or create new ones using the
							buttons above.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			{header}
			<DataTable
				columns={columns}
				data={serviceProviders}
				emptyMessage="No service providers."
			/>
		</div>
	);
}
