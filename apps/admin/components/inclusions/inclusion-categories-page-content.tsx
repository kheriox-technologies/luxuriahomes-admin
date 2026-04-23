'use client';

import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardPanel } from '@workspace/ui/components/card';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import { useQuery } from 'convex/react';
import { Layers, Pencil, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import AddInclusionCategory from '@/components/inclusions/add-inclusion-category';
import DeleteInclusionCategory from '@/components/inclusions/delete-inclusion-category';
import EditInclusionCategory from '@/components/inclusions/edit-inclusion-category';
import PageHeading from '@/components/page-heading';

type InclusionCategory = Doc<'inclusionCategories'>;

function InclusionCategoryCard({ category }: { category: InclusionCategory }) {
	return (
		<Card>
			<CardPanel>
				<div className="flex items-center justify-between gap-3">
					<p className="font-semibold leading-none">{category.name}</p>
					<div className="flex items-center gap-2">
						<Badge size="lg" variant="info">
							{category.count}
						</Badge>
						<Group>
							<EditInclusionCategory
								categoryId={category._id}
								initialName={category.name}
								trigger={
									<Button
										aria-label="Edit category"
										size="icon-sm"
										type="button"
										variant="outline"
									>
										<Pencil />
									</Button>
								}
							/>
							<GroupSeparator />
							<DeleteInclusionCategory
								categoryId={category._id}
								categoryName={category.name}
								trigger={
									<Button
										aria-label="Delete category"
										size="icon-sm"
										type="button"
										variant="destructive-outline"
									>
										<Trash2 />
									</Button>
								}
							/>
						</Group>
					</div>
				</div>
			</CardPanel>
		</Card>
	);
}

function EmptyCategoriesState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Layers aria-hidden />
				</EmptyMedia>
				<EmptyTitle>No categories yet</EmptyTitle>
				<EmptyDescription>
					Create your first inclusion category using the Add Category button.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}

export default function InclusionCategoriesPageContent() {
	const categories = useQuery(api.inclusionCategories.list.list, {});
	let content: ReactNode;

	if (categories === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">Loading categories…</div>
		);
	} else if (categories.length === 0) {
		content = <EmptyCategoriesState />;
	} else {
		content = (
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
				{categories.map((category) => (
					<InclusionCategoryCard category={category} key={category._id} />
				))}
			</div>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<PageHeading
				heading="Inclusion Categories"
				rightSlot={<AddInclusionCategory />}
			/>
			{content}
		</div>
	);
}
