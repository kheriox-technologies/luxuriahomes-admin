'use no memo';
'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
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
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { SearchInput } from '@workspace/ui/components/search-input';
import { useQuery } from 'convex/react';
import {
	EllipsisVertical,
	ExternalLink,
	Package,
	Pencil,
	Trash2,
} from 'lucide-react';
import Link, { type LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import PageHeading from '@/components/page-heading';
import { formatAud } from '@/lib/currency';
import AddMaterial from './add-material';
import DeleteMaterial from './delete-material';
import EditMaterial from './edit-material';

type MaterialRow = Doc<'materials'> & {
	unitAbbr: string;
	tradeName: string;
};

function MaterialActionsCell({ material }: { material: MaterialRow }) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		<div className="flex justify-end">
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label="Material actions"
							onClick={(e) => e.stopPropagation()}
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
						Edit
					</MenuItem>
					<MenuSeparator />
					<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
						<Trash2 />
						Delete
					</MenuItem>
				</MenuPopup>
			</Menu>
			<EditMaterial
				material={material}
				onOpenChange={setEditOpen}
				open={editOpen}
			/>
			<DeleteMaterial
				materialId={material._id}
				materialName={material.name}
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
			/>
		</div>
	);
}

function buildColumns(): ColumnDef<MaterialRow>[] {
	return [
		{
			accessorKey: 'name',
			header: 'Name',
			cell: ({ row }) => (
				<Link
					className="font-medium text-foreground hover:underline"
					href={`/materials/${row.original._id}` as LinkProps<string>['href']}
				>
					{row.original.name}
				</Link>
			),
		},
		{
			accessorKey: 'description',
			header: 'Description',
			cell: ({ row }) =>
				row.original.description ? (
					<span>{row.original.description}</span>
				) : (
					<span className="text-muted-foreground">—</span>
				),
		},
		{
			id: 'unit',
			header: 'Unit',
			size: 80,
			cell: ({ row }) =>
				row.original.unitAbbr ? (
					<Badge size="lg" variant="outline">
						{row.original.unitAbbr}
					</Badge>
				) : (
					<span className="text-muted-foreground">—</span>
				),
		},
		{
			id: 'price',
			header: 'Price',
			cell: ({ row }) => (
				<span className="text-sm">{formatAud(row.original.price)}</span>
			),
		},
		{
			accessorKey: 'vendor',
			header: 'Vendor',
			cell: ({ row }) => <span>{row.original.vendor}</span>,
		},
		{
			id: 'sku',
			header: 'SKU',
			cell: ({ row }) =>
				row.original.sku ? (
					<span className="font-mono text-sm">{row.original.sku}</span>
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
						onClick={(e) => e.stopPropagation()}
						rel="noopener noreferrer"
						target="_blank"
					>
						<ExternalLink className="size-3 shrink-0" />
						<span className="max-w-32 truncate">{row.original.link}</span>
					</a>
				) : (
					<span className="text-muted-foreground">—</span>
				),
		},
		{
			id: 'actions',
			header: '',
			size: 60,
			cell: ({ row }) => <MaterialActionsCell material={row.original} />,
		},
	];
}

export default function MaterialsPageContent() {
	const materials = useQuery(api.materials.list.list, {});
	const router = useRouter();
	const [search, setSearch] = useState('');
	const trimmedSearch = search.trim();

	const columns = useMemo(() => buildColumns(), []);

	const filtered = useMemo(() => {
		if (!materials) {
			return [];
		}
		if (!trimmedSearch) {
			return materials;
		}
		const q = trimmedSearch.toLowerCase();
		return materials.filter(
			(m) =>
				m.name.toLowerCase().includes(q) ||
				m.description?.toLowerCase().includes(q) ||
				m.vendor.toLowerCase().includes(q) ||
				m.sku?.toLowerCase().includes(q) ||
				m.tradeName.toLowerCase().includes(q) ||
				m.unitAbbr.toLowerCase().includes(q)
		);
	}, [materials, trimmedSearch]);

	const groups = useMemo(() => {
		const byTrade = new Map<string, MaterialRow[]>();
		for (const material of filtered) {
			const existing = byTrade.get(material.tradeName);
			if (existing) {
				existing.push(material);
			} else {
				byTrade.set(material.tradeName, [material]);
			}
		}
		return Array.from(byTrade.entries()).sort((a, b) =>
			a[0].localeCompare(b[0], undefined, { sensitivity: 'base' })
		);
	}, [filtered]);

	let content: React.ReactNode;
	if (materials === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">Loading materials…</div>
		);
	} else if (materials.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Package aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No materials yet</EmptyTitle>
					<EmptyDescription>
						Add your first material using the Add Material button.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else if (groups.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Package aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching materials</EmptyTitle>
					<EmptyDescription>Try another search term.</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else {
		content = (
			<div className="flex flex-col gap-6">
				{groups.map(([tradeName, rows]) => (
					<div className="flex flex-col gap-3" key={tradeName}>
						<div className="flex items-center gap-2">
							<h4 className="font-semibold text-base">{tradeName}</h4>
							<Badge size="lg" variant="secondary">
								{rows.length}
							</Badge>
						</div>
						<DataTable
							columns={columns}
							data={rows}
							initialPageSize={20}
							key={`${tradeName}-${trimmedSearch}`}
							onRowClick={(row) =>
								router.push(`/materials/${row._id}` as never)
							}
						/>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<PageHeading
				heading="Materials"
				icon={Package}
				rightSlot={
					<>
						<SearchInput
							aria-label="Search materials"
							onValueChange={setSearch}
							placeholder="Search materials…"
							value={search}
						/>
						<AddMaterial />
					</>
				}
			/>
			{content}
		</div>
	);
}
