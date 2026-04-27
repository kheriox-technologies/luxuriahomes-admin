'use client';

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
	AlertDialogTrigger,
} from '@workspace/ui/components/alert-dialog';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Card,
	CardFrame,
	CardFrameAction,
	CardFrameDescription,
	CardFrameHeader,
	CardFrameTitle,
	CardHeader,
	CardPanel,
} from '@workspace/ui/components/card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@workspace/ui/components/dialog';
import { toastManager } from '@workspace/ui/components/toast';
import { cn } from '@workspace/ui/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { Trash2 } from 'lucide-react';
import NextImage from 'next/image';
import { useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { useAppModeStore } from '@/stores/app-mode-store';

type ProjectInclusion = Doc<'projectInclusions'>;
type InclusionCategory = Doc<'inclusionCategories'>;

const audFormatter = new Intl.NumberFormat('en-AU', {
	style: 'currency',
	currency: 'AUD',
});

function formatAud(amount: number): string {
	return audFormatter.format(amount);
}

function formatSignedAud(amount: number): string {
	if (amount === 0) {
		return '$0.00';
	}
	return `${amount > 0 ? '+' : '-'} ${formatAud(Math.abs(amount))}`;
}

function variantClassBadgeVariant(
	className: ProjectInclusion['class']
): 'outline' | 'teal' | 'yellow' | 'purple' {
	if (className === 'Standard') {
		return 'teal';
	}
	if (className === 'Gold') {
		return 'yellow';
	}
	if (className === 'Platinum') {
		return 'purple';
	}
	return 'outline';
}

function DeleteProjectInclusionButton({
	projectInclusionId,
	title,
	code,
}: {
	projectInclusionId: Id<'projectInclusions'>;
	title: string;
	code: string;
}) {
	const [open, setOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const removeProjectInclusion = useMutation(
		api.projectInclusions.remove.remove
	);

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await removeProjectInclusion({ projectInclusionId });
			toastManager.add({
				title: 'Inclusion deleted',
				type: 'success',
			});
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete inclusion. Please try again in a moment.'
				),
				title: 'Could not delete inclusion',
				type: 'error',
			});
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<AlertDialog onOpenChange={setOpen} open={open}>
			<AlertDialogTrigger
				render={
					<Button
						aria-label={`Delete inclusion ${title} ${code}`}
						size="icon"
						type="button"
						variant="destructive-outline"
					/>
				}
			>
				<Trash2 />
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete inclusion?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will permanently delete ${title} (${code}) from this project.`}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</AlertDialogClose>
					<Button
						loading={isDeleting}
						onClick={() => {
							onDelete().catch(() => {
								/* Error is handled in onDelete */
							});
						}}
						type="button"
						variant="destructive"
					>
						Delete inclusion
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function ProjectInclusionCard({
	inclusion,
	mode,
}: {
	inclusion: ProjectInclusion;
	mode: 'builder' | 'client';
}) {
	const imageUrl = inclusion.image?.trim() ?? '';

	return (
		<Card className="flex h-full flex-row items-stretch overflow-hidden">
			<div className="flex min-w-0 flex-1 flex-col">
				<CardHeader className="space-y-2 pb-2">
					<div className="flex flex-wrap items-center gap-2">
						<p className="font-semibold leading-snug">{inclusion.title}</p>
						<Badge
							size="lg"
							variant={variantClassBadgeVariant(inclusion.class)}
						>
							{inclusion.class}
						</Badge>
						<div className="flex items-center gap-1">
							<span className="font-mono text-muted-foreground text-xs">
								{inclusion.code}
							</span>
							<DeleteProjectInclusionButton
								code={inclusion.code}
								projectInclusionId={inclusion._id}
								title={inclusion.title}
							/>
						</div>
					</div>
				</CardHeader>
				<CardPanel className="space-y-2 pt-0 text-sm">
					<p className="text-muted-foreground">{`${inclusion.vendor} - ${inclusion.models.join(', ')}`}</p>
					{inclusion.details ? (
						<p className="whitespace-pre-wrap text-pretty">
							{inclusion.details}
						</p>
					) : null}
					<div className="flex flex-wrap items-center gap-2 pt-1">
						{mode === 'builder' ? (
							<>
								<Badge className="shrink-0" size="lg" variant="warning">
									Cost {formatAud(inclusion.costPrice)}
								</Badge>
								<Badge className="shrink-0" size="lg" variant="success">
									Sale {formatAud(inclusion.salePrice)}
								</Badge>
							</>
						) : null}
						{inclusion.class !== 'Standard' &&
						inclusion.variationSalePrice !== undefined ? (
							<Badge className="shrink-0" size="lg" variant="purple">
								{formatSignedAud(inclusion.variationSalePrice)}
							</Badge>
						) : null}
					</div>
				</CardPanel>
			</div>
			{imageUrl ? (
				<div className="flex shrink-0 items-center py-5 pr-5 pl-3">
					<Dialog>
						<DialogTrigger
							render={
								<button
									aria-label={`Open image preview for ${inclusion.title} ${inclusion.code}`}
									className="flex h-[150px] w-[150px] cursor-zoom-in items-center justify-center bg-card"
									type="button"
								/>
							}
						>
							<NextImage
								alt={`${inclusion.title} ${inclusion.code}`}
								className="h-[150px] max-h-[150px] w-auto max-w-[150px] object-contain"
								height={150}
								src={imageUrl}
								unoptimized
								width={150}
							/>
						</DialogTrigger>
						<DialogContent className="sm:max-w-3xl">
							<DialogHeader>
								<DialogTitle>{`${inclusion.title} ${inclusion.code}`}</DialogTitle>
							</DialogHeader>
							<div className="flex max-h-[75vh] items-center justify-center overflow-hidden rounded-md bg-card p-2">
								<NextImage
									alt={`${inclusion.title} ${inclusion.code}`}
									className="h-auto max-h-[70vh] w-auto max-w-full object-contain"
									height={1200}
									src={imageUrl}
									unoptimized
									width={1200}
								/>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			) : null}
		</Card>
	);
}

export default function ProjectInclusionsTabContent({
	projectId,
}: {
	projectId: Id<'projects'>;
}) {
	const inclusions = useQuery(api.projectInclusions.list.list, { projectId });
	const categories = useQuery(api.inclusionCategories.list.list, {});
	const mode = useAppModeStore((state) => state.mode);

	if (inclusions === undefined || categories === undefined) {
		return <p className="text-muted-foreground text-sm">Loading inclusions…</p>;
	}

	if (inclusions.length === 0) {
		return (
			<p className="text-muted-foreground text-sm">
				No inclusions added to this project yet.
			</p>
		);
	}

	const categoryById = new Map<InclusionCategory['_id'], string>();
	for (const category of categories) {
		categoryById.set(category._id, category.name);
	}

	const grouped = new Map<InclusionCategory['_id'], ProjectInclusion[]>();
	for (const inclusion of inclusions) {
		const existing = grouped.get(inclusion.categoryId) ?? [];
		existing.push(inclusion);
		grouped.set(inclusion.categoryId, existing);
	}

	const sections = [...grouped.entries()]
		.map(([categoryId, groupedInclusions]) => ({
			categoryId,
			categoryName: categoryById.get(categoryId) ?? 'Unknown category',
			inclusions: groupedInclusions.sort((a, b) =>
				a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
			),
			totalVariationSalePrice: groupedInclusions.reduce(
				(total, inclusion) =>
					total +
					(inclusion.class === 'Standard'
						? 0
						: (inclusion.variationSalePrice ?? 0)),
				0
			),
		}))
		.sort((a, b) =>
			a.categoryName.localeCompare(b.categoryName, undefined, {
				sensitivity: 'base',
			})
		);

	return (
		<div className={cn('flex flex-col gap-4')}>
			{sections.map((section) => (
				<CardFrame key={section.categoryId}>
					<CardFrameHeader>
						<CardFrameTitle>{section.categoryName}</CardFrameTitle>
						<CardFrameAction>
							<Badge
								className="shrink-0 self-center"
								size="lg"
								variant="purple"
							>
								{formatSignedAud(section.totalVariationSalePrice)}
							</Badge>
						</CardFrameAction>
						<CardFrameDescription>
							{section.inclusions.length}{' '}
							{section.inclusions.length === 1 ? 'inclusion' : 'inclusions'}
						</CardFrameDescription>
					</CardFrameHeader>
					{section.inclusions.map((inclusion) => (
						<ProjectInclusionCard
							inclusion={inclusion}
							key={inclusion._id}
							mode={mode}
						/>
					))}
				</CardFrame>
			))}
		</div>
	);
}
