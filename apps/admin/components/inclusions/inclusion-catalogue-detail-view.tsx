'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import { Pencil, Trash2 } from 'lucide-react';
import AddInclusionVariant from '@/components/inclusions/add-inclusion-variant';
import DeleteInclusion from '@/components/inclusions/delete-inclusion';
import EditInclusion from '@/components/inclusions/edit-inclusion';
import { formatVariantBadgeLabel } from '@/components/inclusions/inclusion-form-shared';
import PageHeading from '@/components/page-heading';

export default function InclusionCatalogueDetailView({
	inclusionId,
}: {
	inclusionId: Id<'inclusions'>;
}) {
	const data = useQuery(api.inclusions.get.get, { inclusionId });

	if (data === undefined) {
		return (
			<div className={cn('flex h-full w-full flex-col')}>
				<PageHeading backLink="/inclusions/catalogue" heading="Inclusion" />
				<p className="text-muted-foreground text-sm">Loading…</p>
			</div>
		);
	}

	if (data === null) {
		return (
			<div className={cn('flex h-full w-full flex-col')}>
				<PageHeading backLink="/inclusions/catalogue" heading="Inclusion" />
				<p className="text-muted-foreground text-sm">Inclusion not found.</p>
			</div>
		);
	}

	const { categoryName, inclusion } = data;

	return (
		<div className={cn('flex h-full w-full flex-col')}>
			<PageHeading
				backLink="/inclusions/catalogue"
				className="mb-0"
				heading={inclusion.title}
				headingActions={
					<>
						<EditInclusion
							inclusionId={inclusionId}
							initialCategoryId={inclusion.categoryId}
							initialTitle={inclusion.title}
							trigger={
								<Button
									aria-label="Edit inclusion"
									size="icon"
									type="button"
									variant="outline"
								>
									<Pencil />
								</Button>
							}
						/>
						<DeleteInclusion
							inclusionId={inclusionId}
							inclusionTitle={inclusion.title}
							redirectToCatalogueAfterDelete
							trigger={
								<Button
									aria-label="Delete inclusion"
									size="icon"
									type="button"
									variant="destructive-outline"
								>
									<Trash2 />
								</Button>
							}
						/>
					</>
				}
				metaSlot={
					<>
						<Badge size="lg" variant="outline">
							{categoryName}
						</Badge>
						<Badge size="lg" variant="info">
							{formatVariantBadgeLabel(inclusion.variantCount)}
						</Badge>
					</>
				}
				rightSlot={
					<AddInclusionVariant
						inclusionId={inclusionId}
						trigger={<Button variant="default">Add Variant</Button>}
					/>
				}
			/>
		</div>
	);
}
