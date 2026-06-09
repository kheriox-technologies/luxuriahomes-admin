'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
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
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import {
	EllipsisVertical,
	Handshake,
	Pencil,
	SearchIcon,
	Trash2,
	UserPlus,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddServiceProvider from './add-service-provider';
import AddServiceProviderToProject from './add-service-provider-to-project';
import DeleteServiceProvider from './delete-service-provider';
import EditServiceProvider from './edit-service-provider';

type ServiceProvider = Doc<'serviceProviders'>;

function ServiceProviderActionsCell({ row }: { row: ServiceProvider }) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [addToProjectOpen, setAddToProjectOpen] = useState(false);

	return (
		<>
			<EditServiceProvider
				initialAddress={row.address}
				initialCompany={row.company}
				initialContacts={row.contacts}
				initialEmail={row.email}
				initialLandline={row.landline}
				initialName={row.name}
				initialPhone={row.phone}
				initialPosition={row.position}
				initialQbccLicense={row.qbccLicense}
				initialTradeIds={row.tradeIds}
				initialWebsite={row.website}
				onOpenChange={setEditOpen}
				open={editOpen}
				serviceProviderId={row._id}
			/>
			<DeleteServiceProvider
				companyName={row.company}
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				serviceProviderId={row._id}
			/>
			<AddServiceProviderToProject
				onOpenChange={setAddToProjectOpen}
				open={addToProjectOpen}
				serviceProviderId={row._id}
			/>
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
					<MenuItem onClick={() => setEditOpen(true)}>
						<Pencil /> Edit
					</MenuItem>
					<MenuItem onClick={() => setAddToProjectOpen(true)}>
						<UserPlus /> Add to Project
					</MenuItem>
					<MenuSeparator />
					<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
						<Trash2 /> Delete
					</MenuItem>
				</MenuPopup>
			</Menu>
		</>
	);
}

function buildColumns(
	tradeMap: Map<string, string>
): ColumnDef<ServiceProvider>[] {
	return [
		{
			accessorKey: 'company',
			header: 'Company',
			cell: ({ row }) => (
				<div className="space-y-0.5">
					<p className="font-medium">{row.original.company}</p>
					{row.original.website ? (
						<a
							className="text-blue-600 text-xs underline-offset-4 hover:underline"
							href={row.original.website}
							rel="noopener noreferrer"
							target="_blank"
						>
							{row.original.website}
						</a>
					) : null}
					{row.original.qbccLicense ? (
						<p className="text-muted-foreground text-xs">
							QBCC {row.original.qbccLicense}
						</p>
					) : null}
				</div>
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
				return names ? <span>{names}</span> : null;
			},
		},
		{
			id: 'mainContact',
			header: 'Main Contact',
			cell: ({ row }) => {
				const { name, email, phone, landline, position, address } =
					row.original;
				const phoneDisplay = [phone, landline].filter(Boolean).join(' | ');
				return (
					<div className="space-y-0.5">
						<p className="text-sm">{name}</p>
						{position ? (
							<p className="text-muted-foreground text-xs">{position}</p>
						) : null}
						{email ? (
							<p className="text-muted-foreground text-xs">{email}</p>
						) : null}
						{phoneDisplay ? (
							<p className="text-muted-foreground text-xs">{phoneDisplay}</p>
						) : null}
						{address ? (
							<p className="text-muted-foreground text-xs">{address}</p>
						) : null}
					</div>
				);
			},
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
						{contacts.map((c) => {
							const phoneDisplay = [c.phone, c.landline]
								.filter(Boolean)
								.join(' | ');
							return (
								<div className="space-y-0.5" key={c.name}>
									<p className="text-sm">{c.name}</p>
									{c.position ? (
										<p className="text-muted-foreground text-xs">
											{c.position}
										</p>
									) : null}
									{c.email ? (
										<p className="text-muted-foreground text-xs">{c.email}</p>
									) : null}
									{phoneDisplay ? (
										<p className="text-muted-foreground text-xs">
											{phoneDisplay}
										</p>
									) : null}
								</div>
							);
						})}
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
					<ServiceProviderActionsCell row={row.original} />
				</div>
			),
		},
	];
}

function EmptyServiceProvidersState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Handshake aria-hidden />
				</EmptyMedia>
				<EmptyTitle>No service providers yet</EmptyTitle>
				<EmptyDescription>
					Create your first service provider using the Add Service Provider
					button.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}

export default function ServiceProvidersPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const listResults = useQuery(
		api.serviceProviders.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.serviceProviders.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);
	const allTrades = useQuery(api.trades.list.list, {});
	const serviceProviders = trimmedSearch === '' ? listResults : searchResults;

	const tradeMap = new Map<string, string>(
		allTrades?.map((t) => [t._id, t.name]) ?? []
	);

	const columns = buildColumns(tradeMap);

	let content: React.ReactNode;

	if (serviceProviders === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">
				Loading service providers…
			</div>
		);
	} else if (trimmedSearch !== '' && serviceProviders.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Handshake aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching service providers</EmptyTitle>
					<EmptyDescription>
						Try a different company name, contact name, email, or phone.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else if (serviceProviders.length === 0) {
		content = <EmptyServiceProvidersState />;
	} else {
		content = (
			<DataTable
				columns={columns}
				data={serviceProviders}
				emptyMessage="No matching service providers."
				key={trimmedSearch}
			/>
		);
	}

	return (
		<div className={cn('flex min-h-0 flex-1 flex-col gap-4')}>
			<div className="mb-0 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
				<PageHeading
					className="mb-0"
					heading="Service Providers"
					icon={Handshake}
				/>
				<div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row sm:items-center sm:justify-end">
					<InputGroup className="w-full sm:min-w-80 sm:max-w-2xl">
						<InputGroupAddon align="inline-start">
							<InputGroupText>
								<SearchIcon aria-hidden />
							</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							aria-label="Search service providers"
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by company, trade, name, email, phone…"
							type="search"
							value={search}
						/>
					</InputGroup>
					<AddServiceProvider />
				</div>
			</div>
			{content}
		</div>
	);
}
