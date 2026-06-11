'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
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
import { useQuery } from 'convex/react';
import {
	EllipsisVertical,
	ExternalLink,
	Package,
	Pencil,
	SearchIcon,
	Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddMaterialItem from './add-material-item';
import DeleteMaterialItem from './delete-material-item';
import DeleteMaterialVariant from './delete-material-variant';
import EditMaterialItem from './edit-material-item';
import EditMaterialVariant from './edit-material-variant';
import { formatItemCountBadgeLabel } from './material-form-shared';

type MaterialItem = Doc<'materialItems'>;

function ItemActionsCell({ item }: { item: MaterialItem }) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		<>
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label="Item actions"
							size="icon-sm"
							type="button"
							variant="ghost"
						/>
					}
				>
					<EllipsisVertical className="size-4" />
				</MenuTrigger>
				<MenuPopup align="end">
					<MenuItem onClick={() => setEditOpen(true)}>
						<Pencil />
						Edit Item
					</MenuItem>
					<MenuSeparator />
					<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
						<Trash2 />
						Delete Item
					</MenuItem>
				</MenuPopup>
			</Menu>
			<EditMaterialItem
				item={item}
				onOpenChange={setEditOpen}
				open={editOpen}
			/>
			<DeleteMaterialItem
				itemId={item._id}
				itemName={item.name}
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
			/>
		</>
	);
}

export default function MaterialVariantDetailView({
	variantId,
}: {
	materialId: Id<'materials'>;
	variantId: Id<'materialVariants'>;
}) {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const trimmedSearch = debouncedSearch.trim();
	const [editVariantOpen, setEditVariantOpen] = useState(false);

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const data = useQuery(api.materialVariants.get.get, { variantId });
	const itemsData = useQuery(api.materialItems.listByVariant.listByVariant, {
		variantId,
	});
	const units = useQuery(api.units.list.list, {});

	const unitAbbrById = useMemo(() => {
		const m = new Map<string, string>();
		for (const u of units ?? []) {
			m.set(u._id, u.abbr);
		}
		return m;
	}, [units]);

	const filteredItems = useMemo(() => {
		if (!itemsData) {
			return [];
		}
		if (!trimmedSearch) {
			return itemsData;
		}
		const q = trimmedSearch.toLowerCase();
		return itemsData.filter(
			(item) =>
				item.name.toLowerCase().includes(q) ||
				item.vendor.toLowerCase().includes(q) ||
				item.description?.toLowerCase().includes(q) ||
				item.link?.toLowerCase().includes(q)
		);
	}, [itemsData, trimmedSearch]);

	const columns: ColumnDef<MaterialItem>[] = useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				cell: ({ row }) => (
					<span className="font-medium">{row.original.name}</span>
				),
			},
			{
				accessorKey: 'vendor',
				header: 'Vendor',
				cell: ({ row }) => (
					<span className="text-muted-foreground text-sm">
						{row.original.vendor}
					</span>
				),
			},
			{
				id: 'unit',
				header: 'Unit',
				cell: ({ row }) =>
					unitAbbrById.get(row.original.unit) ? (
						<Badge size="sm" variant="outline">
							{unitAbbrById.get(row.original.unit)}
						</Badge>
					) : (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'description',
				header: 'Description',
				cell: ({ row }) =>
					row.original.description ? (
						<span className="text-muted-foreground text-sm">
							{row.original.description}
						</span>
					) : (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				id: 'link',
				header: 'Link',
				cell: ({ row }) =>
					row.original.link ? (
						<a
							className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
							href={row.original.link}
							rel="noopener noreferrer"
							target="_blank"
						>
							<ExternalLink className="h-3 w-3 shrink-0" />
							<span className="max-w-40 truncate">{row.original.link}</span>
						</a>
					) : (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				id: 'actions',
				header: '',
				size: 60,
				cell: ({ row }) => (
					<div className="flex justify-end">
						<ItemActionsCell item={row.original} />
					</div>
				),
			},
		],
		[unitAbbrById]
	);

	if (data === undefined || itemsData === undefined) {
		return (
			<div className="text-muted-foreground text-sm">Loading variant…</div>
		);
	}

	if (data === null) {
		return (
			<div className="text-muted-foreground text-sm">Variant not found.</div>
		);
	}

	const { variant, material, unit } = data;

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<PageHeading
				backLink={`/materials#${material._id}`}
				heading={variant.name}
				headingActions={
					<>
						<InputGroup className="w-full sm:min-w-60 sm:max-w-xs">
							<InputGroupAddon align="inline-start">
								<InputGroupText>
									<SearchIcon aria-hidden />
								</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								aria-label="Search items"
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search items…"
								type="search"
								value={search}
							/>
						</InputGroup>
						<Button
							aria-label="Edit variant"
							onClick={() => setEditVariantOpen(true)}
							size="icon"
							type="button"
							variant="outline"
						>
							<Pencil />
						</Button>
						<DeleteMaterialVariant
							materialId={material._id}
							redirectAfterDelete
							trigger={
								<Button
									aria-label="Delete variant"
									size="icon"
									type="button"
									variant="destructive-outline"
								>
									<Trash2 />
								</Button>
							}
							variantId={variant._id}
							variantName={variant.name}
						/>
					</>
				}
				metaSlot={
					<>
						<Badge size="sm" variant="secondary">
							{material.name}
						</Badge>
						{unit ? (
							<Badge size="sm" variant="outline">
								{unit.abbr}
							</Badge>
						) : null}
						<Badge size="sm" variant="secondary">
							{formatItemCountBadgeLabel(variant.itemCount)}
						</Badge>
					</>
				}
				rightSlot={<AddMaterialItem variantId={variantId} />}
			/>

			{(() => {
				if (filteredItems.length === 0 && trimmedSearch !== '') {
					return (
						<Empty>
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<Package aria-hidden />
								</EmptyMedia>
								<EmptyTitle>No matching items</EmptyTitle>
								<EmptyDescription>Try another search term.</EmptyDescription>
							</EmptyHeader>
						</Empty>
					);
				}
				if (filteredItems.length === 0) {
					return (
						<Empty>
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<Package aria-hidden />
								</EmptyMedia>
								<EmptyTitle>No items yet</EmptyTitle>
								<EmptyDescription>
									Add items using the Add Item button above.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					);
				}
				return (
					<DataTable
						columns={columns}
						data={filteredItems}
						initialPageSize={20}
					/>
				);
			})()}

			<EditMaterialVariant
				onOpenChange={setEditVariantOpen}
				open={editVariantOpen}
				variant={variant}
			/>
		</div>
	);
}
