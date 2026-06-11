'use client';

import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Card,
	CardAction,
	CardHeader,
	CardTitle,
} from '@workspace/ui/components/card';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import {
	Frame,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from '@workspace/ui/components/frame';
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { useQuery } from 'convex/react';
import { Package, Pencil, Plus, SearchIcon, Trash2 } from 'lucide-react';
import Link, { type LinkProps } from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddMaterial from './add-material';
import AddMaterialVariant from './add-material-variant';
import DeleteMaterial from './delete-material';
import DeleteMaterialVariant from './delete-material-variant';
import EditMaterial from './edit-material';
import EditMaterialVariant from './edit-material-variant';
import { formatItemCountBadgeLabel } from './material-form-shared';

function MaterialVariantCard({
	variant,
}: {
	variant: Doc<'materialVariants'>;
}) {
	const [editOpen, setEditOpen] = useState(false);
	return (
		<Card>
			<CardHeader className="flex flex-row items-start justify-between gap-3">
				<Link
					className="-m-2 flex min-w-0 flex-1 flex-col gap-1 rounded-md p-2 text-foreground no-underline outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
					href={
						`/materials/${variant.materialId}/variants/${variant._id}` as LinkProps<string>['href']
					}
				>
					<CardTitle className="truncate leading-tight">
						{variant.name}
					</CardTitle>
					{variant.description ? (
						<p className="truncate text-muted-foreground text-xs">
							{variant.description}
						</p>
					) : null}
					<p className="truncate text-muted-foreground text-xs">
						{variant.vendor}
					</p>
					<Badge className="mt-1 w-fit" size="lg" variant="secondary">
						{formatItemCountBadgeLabel(variant.itemCount)}
					</Badge>
				</Link>
				<CardAction>
					<Group>
						<Button
							aria-label="Edit variant"
							onClick={() => setEditOpen(true)}
							size="icon"
							type="button"
							variant="outline"
						>
							<Pencil />
						</Button>
						<GroupSeparator />
						<DeleteMaterialVariant
							materialId={variant.materialId}
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
					</Group>
				</CardAction>
			</CardHeader>
			<EditMaterialVariant
				onOpenChange={setEditOpen}
				open={editOpen}
				variant={variant}
			/>
		</Card>
	);
}

function MaterialFrame({
	material,
	unitAbbrById,
}: {
	material: Doc<'materials'>;
	unitAbbrById: Map<string, string>;
}) {
	const variants = useQuery(
		api.materialVariants.listByMaterial.listByMaterial,
		{
			materialId: material._id,
		}
	);

	const unitAbbr = unitAbbrById.get(material.unit);

	return (
		<Frame id={material._id}>
			<FrameHeader className="flex flex-row items-center justify-between gap-3 py-3">
				<div className="flex min-w-0 flex-1 items-center gap-2">
					<FrameTitle className="min-w-0 truncate text-base">
						{material.name}
					</FrameTitle>
					{unitAbbr ? (
						<Badge className="shrink-0" size="sm" variant="outline">
							{unitAbbr}
						</Badge>
					) : null}
				</div>
				<div className="flex flex-wrap items-center justify-end gap-2">
					<EditMaterial
						initialDescription={material.description}
						initialName={material.name}
						initialUnit={material.unit}
						materialId={material._id}
						trigger={
							<Button
								aria-label="Edit material"
								size="icon"
								type="button"
								variant="outline"
							>
								<Pencil />
							</Button>
						}
					/>
					<GroupSeparator />
					<DeleteMaterial
						materialId={material._id}
						materialName={material.name}
						trigger={
							<Button
								aria-label="Delete material"
								size="icon"
								type="button"
								variant="destructive-outline"
							>
								<Trash2 />
							</Button>
						}
					/>
					<GroupSeparator />
					<AddMaterialVariant
						materialId={material._id}
						trigger={
							<Button
								aria-label={`Add variant to ${material.name}`}
								size="icon"
								type="button"
								variant="outline"
							>
								<Plus />
							</Button>
						}
					/>
				</div>
			</FrameHeader>
			{variants !== undefined && variants.length === 0 ? (
				<FramePanel>
					<p className="text-muted-foreground text-sm">
						No variants yet. Add one with the + button.
					</p>
				</FramePanel>
			) : null}
			{variants !== undefined && variants.length > 0 ? (
				<FramePanel className="grid grid-cols-1 gap-4 lg:grid-cols-3">
					{variants.map((variant) => (
						<MaterialVariantCard key={variant._id} variant={variant} />
					))}
				</FramePanel>
			) : null}
		</Frame>
	);
}

export default function MaterialsPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const units = useQuery(api.units.list.list, {});
	const listResults = useQuery(
		api.materials.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.materials.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);
	const materials = trimmedSearch === '' ? listResults : searchResults;

	const unitAbbrById = useMemo(() => {
		const m = new Map<string, string>();
		for (const u of units ?? []) {
			m.set(u._id, u.abbr);
		}
		return m;
	}, [units]);

	const hasScrolledRef = useRef(false);
	useEffect(() => {
		if (hasScrolledRef.current) {
			return;
		}
		if (!materials?.length) {
			return;
		}
		const hash = window.location.hash;
		if (!hash) {
			return;
		}
		const element = document.getElementById(hash.slice(1));
		if (!element) {
			return;
		}
		hasScrolledRef.current = true;
		element.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}, [materials]);

	let content: React.ReactNode;

	if (materials === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">Loading materials…</div>
		);
	} else if (trimmedSearch !== '' && materials.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Package aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching materials</EmptyTitle>
					<EmptyDescription>Try another name or description.</EmptyDescription>
				</EmptyHeader>
			</Empty>
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
						Create your first material using the Add Material button.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else {
		content = (
			<div className="flex flex-col gap-6">
				{materials.map((material) => (
					<MaterialFrame
						key={material._id}
						material={material}
						unitAbbrById={unitAbbrById}
					/>
				))}
			</div>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<div className="mb-0 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
				<PageHeading className="mb-0" heading="Materials" icon={Package} />
				<div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row sm:items-center sm:justify-end">
					<InputGroup className="w-full sm:min-w-80 sm:max-w-2xl">
						<InputGroupAddon align="inline-start">
							<InputGroupText>
								<SearchIcon aria-hidden />
							</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							aria-label="Search materials"
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by name or description…"
							type="search"
							value={search}
						/>
					</InputGroup>
					<AddMaterial />
				</div>
			</div>
			{content}
		</div>
	);
}
