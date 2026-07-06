'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Alert, AlertAction, AlertTitle } from '@workspace/ui/components/alert';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@workspace/ui/components/dialog';
import {
	Empty,
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
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { SearchInput } from '@workspace/ui/components/search-input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@workspace/ui/components/table';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import {
	Check,
	CheckCircle2,
	Download,
	EllipsisVertical,
	Info,
	NotebookPen,
	SquaresIntersect,
	TriangleAlert,
} from 'lucide-react';
import NextImage from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { signCdnUrls } from '@/actions/cdn';
import ProjectInclusionNotesDialog from '@/components/client/projects/project-inclusions-notes-dialog';
import { formatSignedAud } from '@/lib/client/format';
import { openProjectInclusionsPdfInNewTab } from '@/lib/client/pdf/project-inclusions-pdf';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { fetchUrlAsJpegDataUrl } from '@/lib/pdf/pdf-assets';

type ProjectInclusion = Doc<'projectInclusions'> & {
	hasNotes: boolean;
	categoryName: string;
};

interface InclusionSection {
	groupKey: string;
	groupName: string;
	inclusions: ProjectInclusion[];
	totalVariationPrice: number;
}

function classBadgeVariant(
	className: ProjectInclusion['class']
): 'info' | 'yellow' | 'purple' | 'outline' {
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

function statusBadgeVariant(
	status: NonNullable<ProjectInclusion['status']>
): 'success' | 'warning' {
	return status === 'Approved' ? 'success' : 'warning';
}

function matchesSearch(inclusion: ProjectInclusion, search: string): boolean {
	if (search === '') {
		return true;
	}
	const haystack = [
		inclusion.title,
		inclusion.code,
		inclusion.vendor,
		inclusion.color ?? '',
		...inclusion.models,
	]
		.join(' ')
		.toLowerCase();
	return haystack.includes(search.toLowerCase());
}

function buildSections(inclusions: ProjectInclusion[]): InclusionSection[] {
	const grouped = new Map<string, ProjectInclusion[]>();
	for (const inclusion of inclusions) {
		const key = inclusion.categoryName;
		const list = grouped.get(key) ?? [];
		list.push(inclusion);
		grouped.set(key, list);
	}
	return [...grouped.entries()]
		.map(([groupName, items]) => ({
			groupKey: groupName,
			groupName,
			inclusions: items,
			totalVariationPrice: items.reduce(
				(sum, inc) =>
					inc.class === 'Standard' ? sum : sum + (inc.variationPrice ?? 0),
				0
			),
		}))
		.sort((a, b) => a.groupName.localeCompare(b.groupName));
}

function InclusionImageCell({
	inclusion,
	signedImageUrl,
}: {
	inclusion: ProjectInclusion;
	signedImageUrl: string;
}) {
	if (!signedImageUrl) {
		if (!inclusion.image) {
			return <span className="text-muted-foreground text-xs">No image</span>;
		}
		return <span className="text-muted-foreground text-xs">Loading…</span>;
	}
	return (
		<Dialog>
			<DialogTrigger
				render={
					<button
						aria-label={`Open image preview for ${inclusion.title}`}
						className="flex size-[60px] cursor-zoom-in items-center justify-center rounded-md border bg-card p-1"
						type="button"
					/>
				}
			>
				<NextImage
					alt={inclusion.title}
					className="size-full object-contain"
					height={60}
					src={signedImageUrl}
					unoptimized
					width={60}
				/>
			</DialogTrigger>
			<DialogContent className="sm:max-w-3xl">
				<DialogHeader>
					<DialogTitle>{`${inclusion.title} ${inclusion.code}`}</DialogTitle>
				</DialogHeader>
				<div className="flex max-h-[75vh] items-center justify-center overflow-hidden rounded-md bg-card p-2">
					<NextImage
						alt={inclusion.title}
						className="h-auto max-h-[70vh] w-auto max-w-full object-contain"
						height={1200}
						src={signedImageUrl}
						unoptimized
						width={1200}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function InclusionRowActions({
	inclusion,
	onToggleStatus,
	onOpenNotes,
}: {
	inclusion: ProjectInclusion;
	onToggleStatus: () => void;
	onOpenNotes: () => void;
}) {
	const isApproved = inclusion.status === 'Approved';
	return (
		<Menu>
			<MenuTrigger
				render={
					<Button
						aria-label="Inclusion actions"
						size="icon-sm"
						type="button"
						variant="ghost"
					/>
				}
			>
				<EllipsisVertical className="size-4" />
			</MenuTrigger>
			<MenuPopup align="end">
				<MenuItem onClick={onToggleStatus}>
					<CheckCircle2 />
					{isApproved ? 'Unapprove' : 'Approve'}
				</MenuItem>
				<MenuItem onClick={onOpenNotes}>
					<NotebookPen />
					View / edit notes
				</MenuItem>
			</MenuPopup>
		</Menu>
	);
}

function InclusionTitleCell({ inclusion }: { inclusion: ProjectInclusion }) {
	return (
		<div className="space-y-1">
			<p className="font-medium">{inclusion.title}</p>
			<div className="flex flex-wrap items-center gap-1">
				<Badge size="lg" variant={classBadgeVariant(inclusion.class)}>
					{inclusion.class}
				</Badge>
				<Badge size="lg" variant="outline">
					{inclusion.code}
				</Badge>
			</div>
		</div>
	);
}

function InclusionVendorCell({ inclusion }: { inclusion: ProjectInclusion }) {
	return (
		<div className="space-y-0.5 text-muted-foreground text-sm">
			<p>{inclusion.vendor}</p>
			{inclusion.models.length > 0 ? (
				<p>{inclusion.models.join(', ')}</p>
			) : null}
			{inclusion.details ? (
				<p className="whitespace-pre-wrap">{inclusion.details}</p>
			) : null}
		</div>
	);
}

function InclusionVariationCell({
	inclusion,
}: {
	inclusion: ProjectInclusion;
}) {
	if (inclusion.class === 'Standard' || inclusion.variationPrice == null) {
		return <span className="text-muted-foreground">—</span>;
	}
	return (
		<span className="tabular-nums">
			{formatSignedAud(inclusion.variationPrice)}
		</span>
	);
}

function VariationSummaryAlert({ total }: { total: number }) {
	if (total === 0) {
		return (
			<Alert variant="info">
				<Info aria-hidden />
				<AlertTitle>No variations</AlertTitle>
			</Alert>
		);
	}
	return (
		<Alert variant="warning">
			<TriangleAlert aria-hidden />
			<AlertTitle>Variations</AlertTitle>
			<AlertAction className="max-sm:col-start-3 max-sm:row-start-1 max-sm:mt-0 max-sm:self-center">
				<Badge size="lg" variant="purple">
					{formatSignedAud(total)}
				</Badge>
			</AlertAction>
		</Alert>
	);
}

function CategorySection({
	section,
	signedImageUrls,
	onSetStatus,
	onBulkSetStatus,
	onOpenNotes,
}: {
	section: InclusionSection;
	signedImageUrls: Record<string, string>;
	onSetStatus: (id: Id<'projectInclusions'>, approved: boolean) => void;
	onBulkSetStatus: (section: InclusionSection, approved: boolean) => void;
	onOpenNotes: (inclusion: ProjectInclusion) => void;
}) {
	const allApproved = section.inclusions.every(
		(inclusion) => inclusion.status === 'Approved'
	);

	return (
		<Frame className="w-full">
			<FrameHeader className="flex flex-row items-center justify-between gap-3">
				<div className="min-w-0">
					<FrameTitle>{section.groupName}</FrameTitle>
					<FrameDescription>
						{section.inclusions.length}{' '}
						{section.inclusions.length === 1 ? 'inclusion' : 'inclusions'}
					</FrameDescription>
				</div>
				<Button
					className="shrink-0"
					onClick={() => onBulkSetStatus(section, !allApproved)}
					size="sm"
					type="button"
					variant="outline"
				>
					<Check aria-hidden /> {allApproved ? 'Unapprove all' : 'Approve all'}
				</Button>
			</FrameHeader>
			<FramePanel className="p-0">
				{/* Mobile cards */}
				<div className="flex flex-col gap-3 p-3 md:hidden">
					{section.inclusions.map((inclusion) => (
						<div
							className="flex flex-col gap-2 rounded-lg border p-3"
							key={inclusion._id}
						>
							<div className="flex items-start justify-between gap-2">
								<InclusionTitleCell inclusion={inclusion} />
								<InclusionRowActions
									inclusion={inclusion}
									onOpenNotes={() => onOpenNotes(inclusion)}
									onToggleStatus={() =>
										onSetStatus(inclusion._id, inclusion.status !== 'Approved')
									}
								/>
							</div>
							<div className="flex items-center gap-3">
								<InclusionImageCell
									inclusion={inclusion}
									signedImageUrl={signedImageUrls[inclusion.image ?? ''] ?? ''}
								/>
								<div className="min-w-0 flex-1">
									<InclusionVendorCell inclusion={inclusion} />
								</div>
							</div>
							{inclusion.color ? (
								<span className="text-muted-foreground text-sm">
									Colour: {inclusion.color}
								</span>
							) : null}
							{inclusion.locations?.length ? (
								<span className="text-muted-foreground text-sm">
									Locations: {inclusion.locations.map((l) => l.name).join(', ')}
								</span>
							) : null}
							<div className="flex flex-wrap items-center gap-2 text-sm">
								<Badge
									size="lg"
									variant={statusBadgeVariant(
										inclusion.status ?? 'Under Review'
									)}
								>
									{inclusion.status ?? 'Under Review'}
								</Badge>
								{inclusion.class === 'Standard' ||
								inclusion.variationPrice == null ? (
									<span className="text-muted-foreground tabular-nums">—</span>
								) : (
									<Badge size="lg" variant="purple">
										{formatSignedAud(inclusion.variationPrice)}
									</Badge>
								)}
							</div>
						</div>
					))}
				</div>

				{/* Desktop table */}
				<div className="hidden md:block">
					<Table className="w-full">
						<TableHeader>
							<TableRow>
								<TableHead className="min-w-[11rem]">Title</TableHead>
								<TableHead className="min-w-[14rem]">
									Vendor &amp; details
								</TableHead>
								<TableHead className="whitespace-nowrap">Colour</TableHead>
								<TableHead className="whitespace-nowrap">Location</TableHead>
								<TableHead className="whitespace-nowrap">Status</TableHead>
								<TableHead className="whitespace-nowrap text-end">
									Variation
								</TableHead>
								<TableHead className="w-[6rem] text-end">Image</TableHead>
								<TableHead className="w-[3rem]">
									<span className="sr-only">Actions</span>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{section.inclusions.map((inclusion) => (
								<TableRow key={inclusion._id}>
									<TableCell>
										<InclusionTitleCell inclusion={inclusion} />
									</TableCell>
									<TableCell>
										<InclusionVendorCell inclusion={inclusion} />
									</TableCell>
									<TableCell className="text-sm">
										{inclusion.color ?? '—'}
									</TableCell>
									<TableCell className="text-sm">
										{inclusion.locations?.length
											? inclusion.locations.map((l) => l.name).join(', ')
											: '—'}
									</TableCell>
									<TableCell>
										<Badge
											size="lg"
											variant={statusBadgeVariant(
												inclusion.status ?? 'Under Review'
											)}
										>
											{inclusion.status ?? 'Under Review'}
										</Badge>
									</TableCell>
									<TableCell className="text-end">
										<InclusionVariationCell inclusion={inclusion} />
									</TableCell>
									<TableCell className="text-end">
										<div className="flex justify-end">
											<InclusionImageCell
												inclusion={inclusion}
												signedImageUrl={
													signedImageUrls[inclusion.image ?? ''] ?? ''
												}
											/>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex justify-end">
											<InclusionRowActions
												inclusion={inclusion}
												onOpenNotes={() => onOpenNotes(inclusion)}
												onToggleStatus={() =>
													onSetStatus(
														inclusion._id,
														inclusion.status !== 'Approved'
													)
												}
											/>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</FramePanel>
		</Frame>
	);
}

export default function ProjectInclusionsTabContent({
	projectId,
}: {
	projectId: Id<'projects'>;
}) {
	const inclusions = useQuery(api.clientPortal.inclusions.list.list, {
		projectId,
	});
	const project = useQuery(api.clientPortal.projects.get.get, { projectId });
	const setStatus = useMutation(
		api.clientPortal.inclusions.setStatus.setStatus
	);

	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [signedImageUrls, setSignedImageUrls] = useState<
		Record<string, string>
	>({});
	const [notesFor, setNotesFor] = useState<ProjectInclusion | null>(null);
	const [downloading, setDownloading] = useState(false);

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	useEffect(() => {
		if (!inclusions) {
			return;
		}
		const keys = inclusions
			.map((inc) => inc.image)
			.filter((img): img is string => Boolean(img));
		if (keys.length === 0) {
			return;
		}
		signCdnUrls(keys)
			.then(setSignedImageUrls)
			.catch(() => {
				/* images show as loading if signing fails */
			});
	}, [inclusions]);

	const sections = useMemo(() => {
		if (!inclusions) {
			return [];
		}
		const filtered = inclusions.filter((inc) =>
			matchesSearch(inc, debouncedSearch.trim())
		);
		return buildSections(filtered);
	}, [inclusions, debouncedSearch]);

	const totalVariationPrice = useMemo(() => {
		if (!inclusions) {
			return 0;
		}
		return inclusions.reduce(
			(sum, inc) =>
				inc.class === 'Standard' ? sum : sum + (inc.variationPrice ?? 0),
			0
		);
	}, [inclusions]);

	const onSetStatus = async (
		id: Id<'projectInclusions'>,
		approved: boolean
	) => {
		try {
			await setStatus({
				projectInclusionId: id,
				status: approved ? 'Approved' : 'Under Review',
			});
		} catch (error) {
			toastManager.add({
				title: 'Could not update inclusion',
				description: getConvexErrorMessage(error, 'Please try again.'),
				type: 'error',
			});
		}
	};

	const onBulkSetStatus = async (
		section: InclusionSection,
		approved: boolean
	) => {
		const targetStatus = approved ? 'Approved' : 'Under Review';
		try {
			await Promise.all(
				section.inclusions
					.filter((inc) => (inc.status ?? 'Under Review') !== targetStatus)
					.map((inc) =>
						setStatus({ projectInclusionId: inc._id, status: targetStatus })
					)
			);
		} catch (error) {
			toastManager.add({
				title: `Could not update ${section.groupName} inclusions`,
				description: getConvexErrorMessage(error, 'Please try again.'),
				type: 'error',
			});
		}
	};

	const onDownload = async () => {
		if (!project) {
			toastManager.add({
				title: 'Could not generate PDF',
				description: 'Project details are still loading. Please try again.',
				type: 'error',
			});
			return;
		}
		setDownloading(true);
		try {
			const allInclusions = sections.flatMap((s) => s.inclusions);
			const imageKeys = allInclusions
				.map((inc) => inc.image)
				.filter((img): img is string => Boolean(img));
			const pdfImageDataUrls: Record<string, string> = {};
			if (imageKeys.length > 0) {
				const signed = await signCdnUrls(imageKeys);
				await Promise.all(
					Object.entries(signed).map(async ([key, url]) => {
						const dataUrl = await fetchUrlAsJpegDataUrl(url);
						if (dataUrl) {
							pdfImageDataUrls[key] = dataUrl;
						}
					})
				);
			}
			await openProjectInclusionsPdfInNewTab({
				projectName: project.name,
				projectAddress: project.address,
				clients: project.clients.map((client) => ({
					firstName: client.firstName,
					lastName: client.lastName,
					email: client.email,
					phone: client.phone,
				})),
				sections: sections.map((section) => ({
					sectionId: section.groupKey,
					sectionName: section.groupName,
					totalVariationSalePrice: section.totalVariationPrice,
					inclusions: section.inclusions.map((inclusion) => ({
						_id: String(inclusion._id),
						title: inclusion.title,
						code: inclusion.code,
						vendor: inclusion.vendor,
						models: inclusion.models,
						color: inclusion.color,
						locations: inclusion.locations,
						details: inclusion.details,
						status: inclusion.status,
						class: inclusion.class,
						variationPrice: inclusion.variationPrice,
						link: inclusion.link,
						image: pdfImageDataUrls[inclusion.image ?? ''],
					})),
				})),
			});
		} catch (error) {
			toastManager.add({
				title: 'Could not generate PDF',
				description: getConvexErrorMessage(error, 'Please try again.'),
				type: 'error',
			});
		} finally {
			setDownloading(false);
		}
	};

	if (inclusions === undefined) {
		return <p className="text-muted-foreground text-sm">Loading inclusions…</p>;
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<div className="flex flex-row items-center gap-2">
				<SearchInput
					aria-label="Search inclusions"
					onValueChange={setSearch}
					placeholder="Search by title, vendor, code, colour…"
					value={search}
				/>
				<Button
					aria-label="Download"
					className="shrink-0"
					disabled={downloading || sections.length === 0}
					onClick={() => onDownload().catch(() => undefined)}
					type="button"
					variant="outline"
				>
					<Download />
					<span className="hidden sm:inline">Download</span>
				</Button>
			</div>

			{inclusions.length > 0 ? (
				<VariationSummaryAlert total={totalVariationPrice} />
			) : null}

			{sections.length === 0 ? (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<SquaresIntersect aria-hidden />
						</EmptyMedia>
						<EmptyTitle>
							{inclusions.length === 0
								? 'No inclusions yet'
								: 'No matching inclusions'}
						</EmptyTitle>
					</EmptyHeader>
				</Empty>
			) : (
				<div className="flex flex-col gap-4">
					{sections.map((section) => (
						<CategorySection
							key={section.groupKey}
							onBulkSetStatus={(s, approved) =>
								onBulkSetStatus(s, approved).catch(() => undefined)
							}
							onOpenNotes={setNotesFor}
							onSetStatus={(id, approved) =>
								onSetStatus(id, approved).catch(() => undefined)
							}
							section={section}
							signedImageUrls={signedImageUrls}
						/>
					))}
				</div>
			)}

			{notesFor ? (
				<ProjectInclusionNotesDialog
					inclusionId={notesFor._id}
					inclusionTitle={notesFor.title}
					onOpenChange={(open) => {
						if (!open) {
							setNotesFor(null);
						}
					}}
					open={notesFor !== null}
					projectId={projectId}
				/>
			) : null}
		</div>
	);
}
