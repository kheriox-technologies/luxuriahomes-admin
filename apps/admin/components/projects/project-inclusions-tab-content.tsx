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
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogPanel,
	DialogTitle,
	DialogTrigger,
} from '@workspace/ui/components/dialog';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import {
	Frame,
	FrameDescription,
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@workspace/ui/components/table';
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import {
	Tooltip,
	TooltipPopup,
	TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { cn } from '@workspace/ui/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import {
	Check,
	Download,
	SearchIcon,
	SquaresIntersect,
	StickyNote,
	Trash2,
	X,
} from 'lucide-react';
import NextImage from 'next/image';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
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

function EmptyProjectInclusionsState() {
	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<SquaresIntersect aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No inclusions on this project yet</EmptyTitle>
					<EmptyDescription>
						Open the Inclusions Catalogue and use Add to project on a product
						variant to attach it here.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</div>
	);
}

function variantClassBadgeVariant(
	className: ProjectInclusion['class']
): 'outline' | 'info' | 'yellow' | 'purple' {
	if (className === 'Standard') {
		return 'info';
	}
	if (className === 'Gold') {
		return 'yellow';
	}
	if (className === 'Platinum') {
		return 'purple';
	}
	return 'outline';
}

function inclusionStatusBadgeVariant(
	status: NonNullable<ProjectInclusion['status']>
): 'success' | 'warning' {
	return status === 'Approved' ? 'success' : 'warning';
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

function ProjectInclusionStatusToggleButton({
	projectInclusionId,
	status,
}: {
	projectInclusionId: Id<'projectInclusions'>;
	status: ProjectInclusion['status'];
}) {
	const [loading, setLoading] = useState(false);
	const updateProjectInclusion = useMutation(
		api.projectInclusions.update.update
	);
	const isApproved = status === 'Approved';
	const tooltip = isApproved ? 'Unapprove inclusion' : 'Approve inclusion';

	const onToggle = async () => {
		setLoading(true);
		try {
			await updateProjectInclusion({
				projectInclusionId,
				status: isApproved ? 'Under Review' : 'Approved',
			});
			toastManager.add({
				title: isApproved
					? 'Inclusion moved to under review'
					: 'Inclusion approved',
				type: 'success',
			});
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not update status. Please try again in a moment.'
				),
				title: 'Could not update status',
				type: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<Button
						aria-label={tooltip}
						loading={loading}
						onClick={() => {
							onToggle().catch(() => {
								/* Error is handled in onToggle */
							});
						}}
						size="icon"
						type="button"
						variant="outline"
					>
						{isApproved ? (
							<X aria-hidden="true" />
						) : (
							<Check aria-hidden="true" />
						)}
					</Button>
				}
			/>
			<TooltipPopup>{tooltip}</TooltipPopup>
		</Tooltip>
	);
}

const projectInclusionNoteDateFormatter = new Intl.DateTimeFormat('en-AU', {
	dateStyle: 'medium',
	timeStyle: 'short',
});

function formatProjectInclusionNoteTimestamp(timestamp: number): string {
	return projectInclusionNoteDateFormatter.format(new Date(timestamp));
}

function ProjectInclusionAddNoteButton({
	projectInclusionId,
	title,
	code,
	existingNotes,
}: {
	projectInclusionId: Id<'projectInclusions'>;
	title: string;
	code: string;
	existingNotes: ProjectInclusion['notes'];
}) {
	const [open, setOpen] = useState(false);
	const [noteText, setNoteText] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const appendNoteMutation = useMutation(
		api.projectInclusions.appendNote.appendNote
	);
	const noteCount = existingNotes?.length ?? 0;

	const onSubmit = async () => {
		const trimmed = noteText.trim();
		if (trimmed === '') {
			toastManager.add({
				title: 'Write a note before saving',
				type: 'error',
			});
			return;
		}
		setSubmitting(true);
		try {
			await appendNoteMutation({ projectInclusionId, note: noteText });
			toastManager.add({
				title: 'Note added',
				type: 'success',
			});
			setNoteText('');
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not add note. Please try again in a moment.'
				),
				title: 'Could not add note',
				type: 'error',
			});
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<Tooltip>
				<TooltipTrigger
					render={
						<Button
							aria-label={`Add note for ${title} (${code})`}
							onClick={() => setOpen(true)}
							size="icon"
							type="button"
							variant="outline"
						/>
					}
				>
					<span className="relative inline-flex size-4 items-center justify-center">
						<StickyNote aria-hidden className="size-4" />
						{noteCount > 0 ? (
							<span className="absolute -end-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-medium text-[10px] text-primary-foreground">
								{noteCount > 99 ? '99+' : noteCount}
							</span>
						) : null}
					</span>
				</TooltipTrigger>
				<TooltipPopup>Add note</TooltipPopup>
			</Tooltip>
			<Dialog
				onOpenChange={(next) => {
					setOpen(next);
					if (!next) {
						setNoteText('');
					}
				}}
				open={open}
			>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>Add note</DialogTitle>
						<DialogDescription>
							{`${title} (${code}) — your name and the time are recorded automatically.`}
						</DialogDescription>
					</DialogHeader>
					<DialogPanel className="flex max-h-[min(60vh,28rem)] flex-col gap-4">
						{existingNotes && existingNotes.length > 0 ? (
							<div className="space-y-2 border-b pb-3">
								<p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
									Previous notes
								</p>
								<ul className="space-y-2">
									{existingNotes.map((entry, index) => (
										<li className="text-sm" key={`${entry.timestamp}-${index}`}>
											<p className="text-muted-foreground text-xs">
												{formatProjectInclusionNoteTimestamp(entry.timestamp)} ·{' '}
												{entry.addedBy}
											</p>
											<p className="whitespace-pre-wrap text-pretty">
												{entry.note}
											</p>
										</li>
									))}
								</ul>
							</div>
						) : null}
						<div className="flex flex-col gap-2">
							<label
								className="font-medium text-sm"
								htmlFor={`note-${projectInclusionId}`}
							>
								New note
							</label>
							<Textarea
								className="min-h-[100px] resize-y"
								id={`note-${projectInclusionId}`}
								onChange={(e) => setNoteText(e.target.value)}
								placeholder="Type your note…"
								value={noteText}
							/>
						</div>
					</DialogPanel>
					<DialogFooter>
						<DialogClose render={<Button type="button" variant="outline" />}>
							Cancel
						</DialogClose>
						<Button
							loading={submitting}
							onClick={() => {
								onSubmit().catch(() => {
									/* Error is handled in onSubmit */
								});
							}}
							type="button"
						>
							Save note
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

function ProjectInclusionImageThumbnail({
	inclusion,
}: {
	inclusion: ProjectInclusion;
}) {
	const imageUrl = inclusion.image?.trim() ?? '';
	if (!imageUrl) {
		return <span className="text-muted-foreground text-xs">No image</span>;
	}
	return (
		<Dialog>
			<DialogTrigger
				render={
					<button
						aria-label={`Open image preview for ${inclusion.title} ${inclusion.code}`}
						className="flex size-[75px] cursor-zoom-in items-center justify-center rounded-md border bg-card"
						type="button"
					/>
				}
			>
				<NextImage
					alt={`${inclusion.title} ${inclusion.code}`}
					className="size-[75px] object-contain"
					height={75}
					src={imageUrl}
					unoptimized
					width={75}
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
	);
}

function ProjectInclusionActionsCell({
	inclusion,
}: {
	inclusion: ProjectInclusion;
}) {
	return (
		<Group className="justify-end">
			<ProjectInclusionStatusToggleButton
				projectInclusionId={inclusion._id}
				status={inclusion.status}
			/>
			<GroupSeparator />
			<ProjectInclusionAddNoteButton
				code={inclusion.code}
				existingNotes={inclusion.notes}
				projectInclusionId={inclusion._id}
				title={inclusion.title}
			/>
			<GroupSeparator />
			<DeleteProjectInclusionButton
				code={inclusion.code}
				projectInclusionId={inclusion._id}
				title={inclusion.title}
			/>
		</Group>
	);
}

function ProjectInclusionsTableInFrame({
	section,
	mode,
}: {
	section: InclusionSection;
	mode: 'builder' | 'client';
}) {
	const showPricing = mode === 'builder';
	return (
		<Frame className="w-full">
			<FrameHeader className="flex flex-row items-center justify-between gap-3">
				<div className="min-w-0">
					<FrameTitle>{section.categoryName}</FrameTitle>
					<FrameDescription>
						{section.inclusions.length}{' '}
						{section.inclusions.length === 1 ? 'inclusion' : 'inclusions'}
					</FrameDescription>
				</div>
				<Badge className="shrink-0" size="lg" variant="purple">
					{formatSignedAud(section.totalVariationSalePrice)}
				</Badge>
			</FrameHeader>
			<FramePanel className="p-0">
				<div className="w-full min-w-0 overflow-x-auto">
					<Table
						className={cn(
							'w-full',
							showPricing ? 'min-w-[56rem]' : 'min-w-[44rem]'
						)}
					>
						<TableHeader>
							<TableRow>
								<TableHead className="min-w-[11rem]">Title</TableHead>
								<TableHead className="min-w-[14rem]">
									Vendor & details
								</TableHead>
								<TableHead className="whitespace-nowrap">Status</TableHead>
								{showPricing ? (
									<TableHead className="whitespace-nowrap text-end">
										Cost
									</TableHead>
								) : null}
								{showPricing ? (
									<TableHead className="whitespace-nowrap text-end">
										Sale
									</TableHead>
								) : null}
								<TableHead className="min-w-[6rem] whitespace-nowrap text-end">
									Variation
								</TableHead>
								<TableHead className="w-[6rem] min-w-[6rem] max-w-[6rem] text-end">
									Image
								</TableHead>
								<TableHead className="w-[150px] min-w-[150px] max-w-[150px] whitespace-nowrap text-end">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{section.inclusions.map((inclusion) => {
								const displayStatus = inclusion.status ?? 'Under Review';
								const variation =
									inclusion.class !== 'Standard' &&
									inclusion.variationSalePrice !== undefined
										? formatSignedAud(inclusion.variationSalePrice)
										: null;
								return (
									<TableRow key={inclusion._id}>
										<TableCell className="whitespace-normal align-top leading-snug">
											<div className="flex min-w-0 flex-col gap-1.5">
												<span className="font-medium">{inclusion.title}</span>
												<div className="flex flex-wrap items-center gap-2">
													<Badge
														size="lg"
														variant={variantClassBadgeVariant(inclusion.class)}
													>
														{inclusion.class}
													</Badge>
													<span className="font-mono text-muted-foreground text-xs">
														{inclusion.code}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="whitespace-normal align-top leading-snug">
											<div className="flex min-w-0 flex-col gap-2 text-sm">
												<p className="text-muted-foreground">
													{inclusion.vendor}
												</p>
												<p className="text-muted-foreground">
													{inclusion.models.join(', ')}
												</p>
												{inclusion.details ? (
													<p className="whitespace-pre-wrap text-pretty">
														{inclusion.details}
													</p>
												) : null}
												{inclusion.notes && inclusion.notes.length > 0 ? (
													<div className="max-h-40 overflow-y-auto rounded-md border bg-muted/30 p-2">
														<p className="mb-1.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">
															Notes
														</p>
														<ul className="space-y-2">
															{inclusion.notes.map((entry, index) => (
																<li
																	className="text-sm"
																	key={`${entry.timestamp}-${index}`}
																>
																	<p className="text-muted-foreground text-xs">
																		{formatProjectInclusionNoteTimestamp(
																			entry.timestamp
																		)}{' '}
																		· {entry.addedBy}
																	</p>
																	<p className="whitespace-pre-wrap text-pretty">
																		{entry.note}
																	</p>
																</li>
															))}
														</ul>
													</div>
												) : null}
											</div>
										</TableCell>
										<TableCell className="whitespace-normal align-top">
											<Badge
												size="lg"
												variant={inclusionStatusBadgeVariant(displayStatus)}
											>
												{displayStatus}
											</Badge>
										</TableCell>
										{showPricing ? (
											<TableCell className="whitespace-normal text-end align-top tabular-nums">
												{formatAud(inclusion.costPrice)}
											</TableCell>
										) : null}
										{showPricing ? (
											<TableCell className="whitespace-normal text-end align-top tabular-nums">
												{formatAud(inclusion.salePrice)}
											</TableCell>
										) : null}
										<TableCell className="whitespace-normal text-end align-top tabular-nums">
											{variation ?? (
												<span className="text-muted-foreground">—</span>
											)}
										</TableCell>
										<TableCell className="w-[6rem] min-w-[6rem] max-w-[6rem] text-end align-middle">
											<div className="flex justify-end">
												<ProjectInclusionImageThumbnail inclusion={inclusion} />
											</div>
										</TableCell>
										<TableCell className="w-[150px] min-w-[150px] max-w-[150px] whitespace-nowrap align-middle">
											<div className="flex justify-end">
												<ProjectInclusionActionsCell inclusion={inclusion} />
											</div>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</FramePanel>
		</Frame>
	);
}

interface InclusionSection {
	categoryId: InclusionCategory['_id'];
	categoryName: string;
	inclusions: ProjectInclusion[];
	totalVariationSalePrice: number;
}

export default function ProjectInclusionsTabContent({
	projectId,
}: {
	projectId: Id<'projects'>;
}) {
	const inclusions = useQuery(api.projectInclusions.list.list, { projectId });
	const categories = useQuery(api.inclusionCategories.list.list, {});
	const mode = useAppModeStore((state) => state.mode);

	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const trimmedSearch = debouncedSearch.trim();
	const variantSearchResults = useQuery(
		api.inclusionVariants.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);

	const categoryById = useMemo(() => {
		const map = new Map<InclusionCategory['_id'], string>();
		if (!categories) {
			return map;
		}
		for (const category of categories) {
			map.set(category._id, category.name);
		}
		return map;
	}, [categories]);

	const sections = useMemo((): InclusionSection[] => {
		if (!inclusions) {
			return [];
		}
		const grouped = new Map<InclusionCategory['_id'], ProjectInclusion[]>();
		for (const inclusion of inclusions) {
			const existing = grouped.get(inclusion.categoryId) ?? [];
			existing.push(inclusion);
			grouped.set(inclusion.categoryId, existing);
		}
		return [...grouped.entries()]
			.map(([categoryId, groupedInclusions]) => ({
				categoryId,
				categoryName: categoryById.get(categoryId) ?? 'Unknown category',
				inclusions: [...groupedInclusions].sort((a, b) =>
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
	}, [inclusions, categoryById]);

	const visibleSections = useMemo(() => {
		if (trimmedSearch === '') {
			return { loading: false as const, list: sections };
		}
		if (variantSearchResults === undefined) {
			return { loading: true as const, list: null };
		}
		const codes = new Set(variantSearchResults.map((v) => v.code));
		const list = sections
			.map((section) => {
				const filteredInclusions = section.inclusions.filter((inclusion) =>
					codes.has(inclusion.code)
				);
				const totalVariationSalePrice = filteredInclusions.reduce(
					(total, inclusion) =>
						total +
						(inclusion.class === 'Standard'
							? 0
							: (inclusion.variationSalePrice ?? 0)),
					0
				);
				return {
					...section,
					inclusions: filteredInclusions,
					totalVariationSalePrice,
				};
			})
			.filter((section) => section.inclusions.length > 0);
		return { loading: false as const, list };
	}, [trimmedSearch, variantSearchResults, sections]);

	if (inclusions === undefined || categories === undefined) {
		return <p className="text-muted-foreground text-sm">Loading inclusions…</p>;
	}

	const toolbar = (
		<div className="flex min-w-0 flex-row items-center gap-2">
			<InputGroup className="min-w-0 flex-1">
				<InputGroupAddon align="inline-start">
					<InputGroupText>
						<SearchIcon aria-hidden />
					</InputGroupText>
				</InputGroupAddon>
				<InputGroupInput
					aria-label="Search inclusions by product variant"
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search product variants (vendor, models, code…)"
					type="search"
					value={search}
				/>
			</InputGroup>
			<Button
				aria-label="Download project inclusions"
				className="shrink-0"
				type="button"
				variant="outline"
			>
				<Download aria-hidden />
				Download
			</Button>
		</div>
	);

	if (inclusions.length === 0) {
		return (
			<div className={cn('flex min-h-0 flex-1 flex-col gap-4')}>
				{toolbar}
				<EmptyProjectInclusionsState />
			</div>
		);
	}

	let listBody: ReactNode;
	if (visibleSections.loading) {
		listBody = (
			<p className="text-muted-foreground text-sm">
				Searching product variants…
			</p>
		);
	} else if (
		trimmedSearch !== '' &&
		visibleSections.list !== null &&
		visibleSections.list.length === 0
	) {
		listBody = (
			<div className="flex min-h-0 flex-1 flex-col">
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<SearchIcon aria-hidden />
						</EmptyMedia>
						<EmptyTitle>No matching inclusions</EmptyTitle>
						<EmptyDescription>
							Try another code, vendor, or model.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</div>
		);
	} else {
		const frames = visibleSections.list ?? sections;
		listBody = (
			<div className={cn('flex flex-col gap-4')}>
				{frames.map((section) => (
					<ProjectInclusionsTableInFrame
						key={section.categoryId}
						mode={mode}
						section={section}
					/>
				))}
			</div>
		);
	}

	return (
		<div className={cn('flex min-h-0 flex-1 flex-col gap-4')}>
			{toolbar}
			{listBody}
		</div>
	);
}
