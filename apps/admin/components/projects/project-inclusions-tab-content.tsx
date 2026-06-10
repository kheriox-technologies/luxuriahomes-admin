/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: <required complexity> */
'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
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
	CardAction,
	CardDescription,
	CardHeader,
	CardPanel,
	CardTitle,
} from '@workspace/ui/components/card';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
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
	ToggleGroup,
	ToggleGroupItem,
} from '@workspace/ui/components/toggle-group';
import { cn } from '@workspace/ui/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import type { FunctionReturnType } from 'convex/server';
import {
	Check,
	Download,
	EllipsisVertical,
	Info,
	MapPin,
	Pencil,
	Plus,
	SearchIcon,
	SquaresIntersect,
	StickyNote,
	Trash2,
	X,
} from 'lucide-react';
import NextImage from 'next/image';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { signCdnUrls } from '@/actions/cdn';
import LocationCombobox from '@/components/inclusions/location-combobox';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { openProjectInclusionsPdfInNewTab } from '@/lib/pdf/project-inclusions-pdf';
import { useAppModeStore } from '@/stores/app-mode-store';

type ProjectInclusion = NonNullable<
	FunctionReturnType<typeof api.projectInclusions.list.list>
>[number];
type ProjectInclusionNote = Doc<'projectInclusionNotes'>;
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

function DeleteProjectInclusionDialog({
	projectInclusionId,
	title,
	code,
	open,
	onOpenChange,
}: {
	projectInclusionId: Id<'projectInclusions'>;
	title: string;
	code: string;
	open: boolean;
	onOpenChange: (v: boolean) => void;
}) {
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
			onOpenChange(false);
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
		<AlertDialog onOpenChange={onOpenChange} open={open}>
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

function ordinalSuffix(day: number): string {
	const mod100 = day % 100;
	if (mod100 >= 11 && mod100 <= 13) {
		return 'th';
	}
	switch (day % 10) {
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default:
			return 'th';
	}
}

function formatProjectInclusionNoteDate(timestamp: number): string {
	const d = new Date(timestamp);
	const weekday = new Intl.DateTimeFormat('en-AU', { weekday: 'short' }).format(
		d
	);
	const day = d.getDate();
	const month = new Intl.DateTimeFormat('en-AU', { month: 'short' }).format(d);
	const year = d.getFullYear();
	return `${weekday}, ${day}${ordinalSuffix(day)} ${month} ${year}`;
}

function ProjectInclusionNotesCardList({
	notes,
}: {
	notes: ProjectInclusionNote[];
}) {
	const deleteNoteMutation = useMutation(
		api.projectInclusions.deleteNote.deleteNote
	);

	const onDelete = async (noteId: ProjectInclusionNote['_id']) => {
		try {
			await deleteNoteMutation({ noteId });
			toastManager.add({ title: 'Note deleted', type: 'success' });
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete note. Please try again in a moment.'
				),
				title: 'Could not delete note',
				type: 'error',
			});
		}
	};

	return (
		<div className="flex flex-col gap-3">
			{notes.map((entry) => (
				<Card key={entry._id}>
					<CardHeader>
						<CardTitle>{entry.addedBy}</CardTitle>
						<CardDescription>
							{formatProjectInclusionNoteDate(entry.timestamp)}
						</CardDescription>
						<CardAction>
							<Button
								aria-label="Delete note"
								onClick={() => {
									onDelete(entry._id).catch(() => {
										/* Error is handled in onDelete */
									});
								}}
								size="icon"
								type="button"
								variant="destructive-outline"
							>
								<Trash2 />
							</Button>
						</CardAction>
					</CardHeader>
					<CardPanel>
						<p className="whitespace-pre-wrap text-pretty text-sm leading-relaxed">
							{entry.note}
						</p>
					</CardPanel>
				</Card>
			))}
		</div>
	);
}

function ProjectInclusionNotesDialog({
	projectInclusionId,
	title,
	code,
	open,
	onOpenChange,
}: {
	projectInclusionId: Id<'projectInclusions'>;
	title: string;
	code: string;
	open: boolean;
	onOpenChange: (v: boolean) => void;
}) {
	const [noteText, setNoteText] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const appendNoteMutation = useMutation(
		api.projectInclusions.appendNote.appendNote
	);
	const notes = useQuery(
		api.projectInclusions.listNotes.listNotes,
		open ? { projectInclusionId } : 'skip'
	);

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

	let notesBody: ReactNode;
	if (notes === undefined) {
		notesBody = <p className="text-muted-foreground text-sm">Loading notes…</p>;
	} else if (notes.length === 0) {
		notesBody = (
			<Alert variant="info">
				<Info aria-hidden className="size-4 shrink-0" />
				<AlertDescription>
					No notes have been added for this inclusion yet. Use the field above
					to add the first one.
				</AlertDescription>
			</Alert>
		);
	} else {
		notesBody = <ProjectInclusionNotesCardList notes={notes} />;
	}

	return (
		<Dialog
			onOpenChange={(next) => {
				onOpenChange(next);
				if (!next) {
					setNoteText('');
				}
			}}
			open={open}
		>
			<DialogContent className="flex h-[min(88vh,44rem)] w-[min(92vw,40rem)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-none">
				<DialogHeader className="shrink-0 space-y-1.5 px-6 pt-6">
					<DialogTitle>Notes</DialogTitle>
					<DialogDescription>
						<span className="font-medium text-foreground">{title}</span>
						<span className="text-muted-foreground">{` · ${code}`}</span>
					</DialogDescription>
				</DialogHeader>
				<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
					<div className="shrink-0 px-6 py-4">
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
					</div>
					<div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-2">
						<div className="min-h-0 flex-1 overflow-y-auto pe-1">
							{notesBody}
						</div>
					</div>
				</div>
				<DialogFooter className="shrink-0 border-t px-6 py-4">
					<DialogClose render={<Button type="button" variant="outline" />}>
						Close
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
	);
}

function ProjectInclusionImageThumbnail({
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
						aria-label={`Open image preview for ${inclusion.title} ${inclusion.code}`}
						className="flex size-[75px] cursor-zoom-in items-center justify-center rounded-md border bg-card p-1"
						type="button"
					/>
				}
			>
				<NextImage
					alt={`${inclusion.title} ${inclusion.code}`}
					className="size-full object-contain"
					height={75}
					src={signedImageUrl}
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
						src={signedImageUrl}
						unoptimized
						width={1200}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}

interface PendingLocation {
	name: string;
	quantity?: number;
	unit?: string;
}

function EditInclusionQuantitiesDialog({
	inclusion,
	open,
	onOpenChange,
}: {
	inclusion: ProjectInclusion;
	open: boolean;
	onOpenChange: (v: boolean) => void;
}) {
	const [localLocations, setLocalLocations] = useState<PendingLocation[]>([]);
	const [selectedLocationId, setSelectedLocationId] = useState('');
	const [pendingQuantity, setPendingQuantity] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	const unitAbbr = inclusion.locations?.[0]?.unit ?? '';

	const locations = useQuery(api.locations.list.list, open ? {} : 'skip');
	const updateProjectInclusion = useMutation(
		api.projectInclusions.update.update
	);

	const locationNameById = useMemo(() => {
		const map = new Map<Id<'locations'>, string>();
		for (const loc of locations ?? []) {
			map.set(loc._id, loc.name);
		}
		return map;
	}, [locations]);

	const locationIdByName = useMemo(() => {
		const map = new Map<string, Id<'locations'>>();
		for (const loc of locations ?? []) {
			map.set(loc.name, loc._id);
		}
		return map;
	}, [locations]);

	useEffect(() => {
		if (open) {
			setLocalLocations(inclusion.locations ?? []);
			setSelectedLocationId('');
			setPendingQuantity('');
			setEditingIndex(null);
		}
	}, [open, inclusion.locations]);

	const handleEditLocation = (i: number) => {
		const entry = localLocations[i];
		const locationId = locationIdByName.get(entry.name);
		if (locationId) {
			setSelectedLocationId(locationId);
		}
		setPendingQuantity(entry.quantity?.toString() ?? '');
		setEditingIndex(i);
	};

	const handleSaveAction = () => {
		const name = locationNameById.get(selectedLocationId as Id<'locations'>);
		if (!name) {
			return;
		}
		const qty =
			pendingQuantity !== '' ? Number.parseFloat(pendingQuantity) : undefined;
		const updated = { name, quantity: qty, unit: unitAbbr || undefined };
		if (editingIndex !== null) {
			setLocalLocations((prev) => {
				const next = [...prev];
				next[editingIndex] = updated;
				return next;
			});
			setEditingIndex(null);
		} else {
			setLocalLocations((prev) => [...prev, updated]);
		}
		setSelectedLocationId('');
		setPendingQuantity('');
	};

	const onSave = async () => {
		setIsSubmitting(true);
		try {
			await updateProjectInclusion({
				projectInclusionId: inclusion._id,
				locations: localLocations.length > 0 ? localLocations : null,
			});
			toastManager.add({ title: 'Quantities updated', type: 'success' });
			onOpenChange(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not update quantities. Please try again.'
				),
				title: 'Could not update quantities',
				type: 'error',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Quantities</DialogTitle>
					<DialogDescription>
						<span className="font-medium text-foreground">
							{inclusion.title}
						</span>
						<span className="text-muted-foreground">{` · ${inclusion.code}`}</span>
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-3 px-6 pb-2">
					<div className="flex items-center gap-2">
						<div className="min-w-0 flex-1">
							<LocationCombobox
								id={`edit-quantities-location-${inclusion._id}`}
								locations={locations}
								onBlur={() => undefined}
								onChange={setSelectedLocationId}
								value={selectedLocationId}
							/>
						</div>
						<InputGroup className="w-32 shrink-0">
							<InputGroupInput
								min="0"
								onChange={(e) => setPendingQuantity(e.target.value)}
								placeholder="Qty"
								type="number"
								value={pendingQuantity}
							/>
							{unitAbbr ? (
								<InputGroupAddon align="inline-end">
									<InputGroupText>{unitAbbr}</InputGroupText>
								</InputGroupAddon>
							) : null}
						</InputGroup>
						<Button
							aria-label={editingIndex !== null ? 'Save edit' : 'Add location'}
							disabled={!selectedLocationId}
							onClick={handleSaveAction}
							size="icon"
							type="button"
							variant={editingIndex !== null ? 'default' : 'outline'}
						>
							{editingIndex !== null ? <Check /> : <Plus />}
						</Button>
					</div>
					{localLocations.length > 0 ? (
						<div className="flex flex-col gap-1.5">
							{localLocations.map((entry, i) => (
								<Card key={`${entry.name}-${i}`}>
									<CardPanel className="flex items-center justify-between">
										<CardTitle className="text-sm">{entry.name}</CardTitle>
										<div className="inline-flex items-center gap-2">
											<span className="text-muted-foreground text-sm">
												{entry.quantity != null
													? `${entry.quantity}${entry.unit ? ` ${entry.unit}` : ''}`
													: (entry.unit ?? '')}
											</span>
											<Button
												aria-label={`Edit ${entry.name}`}
												onClick={() => handleEditLocation(i)}
												size="icon-sm"
												type="button"
												variant="outline"
											>
												<Pencil className="size-4" />
											</Button>
											<Button
												aria-label={`Remove ${entry.name}`}
												onClick={() => {
													if (editingIndex === i) {
														setEditingIndex(null);
													}
													setLocalLocations((prev) =>
														prev.filter((_, idx) => idx !== i)
													);
												}}
												size="icon-sm"
												type="button"
												variant="destructive-outline"
											>
												<Trash2 className="size-4" />
											</Button>
										</div>
									</CardPanel>
								</Card>
							))}
						</div>
					) : (
						<p className="text-muted-foreground text-sm">
							No locations added yet. Use the row above to add one.
						</p>
					)}
				</div>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						disabled={isSubmitting}
						loading={isSubmitting}
						onClick={() => {
							onSave().catch(() => {
								/* Error handled in onSave */
							});
						}}
						type="button"
					>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function ProjectInclusionNotesLink({
	inclusion,
}: {
	inclusion: ProjectInclusion;
}) {
	const [notesOpen, setNotesOpen] = useState(false);
	if (!inclusion.hasNotes) {
		return null;
	}
	return (
		<>
			<button
				className="text-left text-muted-foreground text-xs underline hover:text-foreground"
				onClick={() => setNotesOpen(true)}
				type="button"
			>
				View Notes
			</button>
			<ProjectInclusionNotesDialog
				code={inclusion.code}
				onOpenChange={setNotesOpen}
				open={notesOpen}
				projectInclusionId={inclusion._id}
				title={inclusion.title}
			/>
		</>
	);
}

function ProjectInclusionActionsCell({
	inclusion,
}: {
	inclusion: ProjectInclusion;
}) {
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [notesOpen, setNotesOpen] = useState(false);
	const [editQuantitiesOpen, setEditQuantitiesOpen] = useState(false);
	const [approveLoading, setApproveLoading] = useState(false);

	const updateProjectInclusion = useMutation(
		api.projectInclusions.update.update
	);
	const isApproved = inclusion.status === 'Approved';

	const onToggleApprove = async () => {
		setApproveLoading(true);
		try {
			await updateProjectInclusion({
				projectInclusionId: inclusion._id,
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
			setApproveLoading(false);
		}
	};

	return (
		<>
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label="Inclusion actions"
							loading={approveLoading}
							size="icon-sm"
							type="button"
							variant="ghost"
						/>
					}
				>
					<EllipsisVertical className="size-4" />
				</MenuTrigger>
				<MenuPopup align="end">
					<MenuItem
						onClick={() => {
							onToggleApprove().catch(() => {
								/* Error handled in onToggleApprove */
							});
						}}
					>
						{isApproved ? <X /> : <Check />}
						{isApproved ? 'Unapprove Inclusion' : 'Approve Inclusion'}
					</MenuItem>
					<MenuItem onClick={() => setNotesOpen(true)}>
						<StickyNote />
						View / Edit Notes
					</MenuItem>
					<MenuItem onClick={() => setEditQuantitiesOpen(true)}>
						<MapPin />
						Edit Quantities
					</MenuItem>
					<MenuSeparator />
					<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
						<Trash2 />
						Delete Inclusion
					</MenuItem>
				</MenuPopup>
			</Menu>
			<DeleteProjectInclusionDialog
				code={inclusion.code}
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				projectInclusionId={inclusion._id}
				title={inclusion.title}
			/>
			<ProjectInclusionNotesDialog
				code={inclusion.code}
				onOpenChange={setNotesOpen}
				open={notesOpen}
				projectInclusionId={inclusion._id}
				title={inclusion.title}
			/>
			<EditInclusionQuantitiesDialog
				inclusion={inclusion}
				onOpenChange={setEditQuantitiesOpen}
				open={editQuantitiesOpen}
			/>
		</>
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
	const [bulkLoading, setBulkLoading] = useState(false);
	const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
	const [signedImageUrls, setSignedImageUrls] = useState<
		Record<string, string>
	>({});

	useEffect(() => {
		const keys = section.inclusions
			.map((inc) => inc.image)
			.filter((img): img is string => Boolean(img));
		if (keys.length === 0) {
			return;
		}
		signCdnUrls(keys)
			.then(setSignedImageUrls)
			.catch(() => {
				/* images will show as loading if signing fails */
			});
	}, [section.inclusions]);
	const updateProjectInclusion = useMutation(
		api.projectInclusions.update.update
	);
	const allApproved = section.inclusions.every(
		(inclusion) => inclusion.status === 'Approved'
	);
	const bulkActionLabel = allApproved ? 'Unapprove All' : 'Approve All';

	const onBulkToggle = async () => {
		setBulkLoading(true);
		const targetStatus = allApproved ? 'Under Review' : 'Approved';
		try {
			await Promise.all(
				section.inclusions
					.filter(
						(inclusion) => (inclusion.status ?? 'Under Review') !== targetStatus
					)
					.map((inclusion) =>
						updateProjectInclusion({
							projectInclusionId: inclusion._id,
							status: targetStatus,
						})
					)
			);
			toastManager.add({
				title: allApproved
					? `${section.groupName} inclusions moved to under review`
					: `${section.groupName} inclusions approved`,
				type: 'success',
			});
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					`Could not update ${section.groupName} inclusions. Please try again in a moment.`
				),
				title: `Could not update ${section.groupName} inclusions`,
				type: 'error',
			});
		} finally {
			setBulkLoading(false);
		}
	};

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
				<div className="flex shrink-0 items-center gap-2">
					<Badge className="shrink-0" size="lg" variant="purple">
						{formatSignedAud(section.totalVariationPrice)}
					</Badge>
					<AlertDialog onOpenChange={setBulkConfirmOpen} open={bulkConfirmOpen}>
						<AlertDialogTrigger
							render={
								<Button loading={bulkLoading} type="button" variant="outline" />
							}
						>
							{bulkActionLabel}
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>{`${bulkActionLabel} in ${section.groupName}?`}</AlertDialogTitle>
								<AlertDialogDescription>
									{allApproved
										? `This will set all inclusions in ${section.groupName} to Under Review.`
										: `This will set all inclusions in ${section.groupName} to Approved.`}
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogClose
									render={<Button type="button" variant="outline" />}
								>
									Cancel
								</AlertDialogClose>
								<Button
									loading={bulkLoading}
									onClick={() => {
										onBulkToggle()
											.then(() => setBulkConfirmOpen(false))
											.catch(() => {
												/* Error is handled in onBulkToggle */
											});
									}}
									type="button"
								>
									Confirm
								</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</FrameHeader>
			<FramePanel className="p-0">
				<div className="w-full min-w-0 overflow-x-auto">
					<Table
						className={cn(
							'w-full',
							showPricing ? 'min-w-[62rem]' : 'min-w-[50rem]'
						)}
					>
						<TableHeader>
							<TableRow>
								<TableHead className="min-w-[11rem]">Title</TableHead>
								<TableHead className="min-w-[14rem]">
									Vendor & details
								</TableHead>
								<TableHead className="whitespace-nowrap">Colour</TableHead>
								<TableHead className="whitespace-nowrap">Status</TableHead>
								<TableHead className="whitespace-nowrap">Quantity</TableHead>
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
								<TableHead className="w-[3rem] min-w-[3rem] max-w-[3rem]">
									<span className="sr-only">Actions</span>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{section.inclusions.map((inclusion) => {
								const displayStatus = inclusion.status ?? 'Under Review';
								const variation =
									inclusion.class !== 'Standard' &&
									inclusion.variationPrice !== undefined
										? formatSignedAud(inclusion.variationPrice)
										: null;
								const totalQty =
									inclusion.locations?.reduce(
										(sum, l) => sum + (l.quantity ?? 0),
										0
									) ?? 0;
								const unit = inclusion.locations?.[0]?.unit;
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
												<ProjectInclusionNotesLink inclusion={inclusion} />
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
											</div>
										</TableCell>
										<TableCell className="whitespace-normal align-top text-sm">
											{inclusion.color ?? (
												<span className="text-muted-foreground">—</span>
											)}
										</TableCell>
										<TableCell className="whitespace-normal align-top">
											<Badge
												size="lg"
												variant={inclusionStatusBadgeVariant(displayStatus)}
											>
												{displayStatus}
											</Badge>
										</TableCell>
										<TableCell className="whitespace-normal align-top">
											{inclusion.locations && inclusion.locations.length > 0 ? (
												<div className="flex flex-col gap-0.5 text-sm">
													<span className="font-medium tabular-nums">
														{totalQty
															? `${totalQty}${unit ? ` ${unit}` : ''}`
															: '—'}
													</span>
													{inclusion.locations.map((loc, i) => (
														<span
															className="text-muted-foreground text-xs"
															key={`${loc.name}-${i}`}
														>
															{loc.name}
															{loc.quantity != null
																? ` (${loc.quantity}${loc.unit ? ` ${loc.unit}` : ''})`
																: ''}
														</span>
													))}
												</div>
											) : (
												<span className="text-muted-foreground">—</span>
											)}
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
												<ProjectInclusionImageThumbnail
													inclusion={inclusion}
													signedImageUrl={
														signedImageUrls[inclusion.image ?? ''] ?? ''
													}
												/>
											</div>
										</TableCell>
										<TableCell className="w-[3rem] min-w-[3rem] max-w-[3rem] align-middle">
											<ProjectInclusionActionsCell inclusion={inclusion} />
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

type GroupBy = 'category' | 'location' | 'vendor';

interface InclusionSection {
	groupKey: string;
	groupName: string;
	inclusions: ProjectInclusion[];
	totalVariationPrice: number;
}

export default function ProjectInclusionsTabContent({
	projectId,
}: {
	projectId: Id<'projects'>;
}) {
	const inclusions = useQuery(api.projectInclusions.list.list, { projectId });
	const categories = useQuery(api.inclusionCategories.list.list, {});
	const project = useQuery(api.projects.get.get, { projectId });
	const mode = useAppModeStore((state) => state.mode);

	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [groupBy, setGroupBy] = useState<GroupBy>('category');

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

	const categorySections = useMemo((): InclusionSection[] => {
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
				groupKey: String(categoryId),
				groupName: categoryById.get(categoryId) ?? 'Unknown category',
				inclusions: [...groupedInclusions].sort((a, b) =>
					a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
				),
				totalVariationPrice: groupedInclusions.reduce(
					(total, inclusion) =>
						total +
						(inclusion.class === 'Standard'
							? 0
							: (inclusion.variationPrice ?? 0)),
					0
				),
			}))
			.sort((a, b) =>
				a.groupName.localeCompare(b.groupName, undefined, {
					sensitivity: 'base',
				})
			);
	}, [inclusions, categoryById]);

	const sections = useMemo((): InclusionSection[] => {
		if (!inclusions) {
			return [];
		}

		const computeTotal = (group: ProjectInclusion[]) =>
			group.reduce(
				(total, inc) =>
					total + (inc.class === 'Standard' ? 0 : (inc.variationPrice ?? 0)),
				0
			);
		const sortByTitle = (group: ProjectInclusion[]) =>
			[...group].sort((a, b) =>
				a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
			);

		if (groupBy === 'category') {
			return categorySections;
		}

		if (groupBy === 'location') {
			const grouped = new Map<string, ProjectInclusion[]>();
			for (const inclusion of inclusions) {
				const locationNames = inclusion.locations?.map((l) => l.name) ?? [];
				const keys = locationNames.length > 0 ? locationNames : ['No Location'];
				for (const key of keys) {
					const existing = grouped.get(key) ?? [];
					existing.push(inclusion);
					grouped.set(key, existing);
				}
			}
			return [...grouped.entries()]
				.map(([key, group]) => ({
					groupKey: key,
					groupName: key,
					inclusions: sortByTitle(group),
					totalVariationPrice: computeTotal(group),
				}))
				.sort((a, b) =>
					a.groupName.localeCompare(b.groupName, undefined, {
						sensitivity: 'base',
					})
				);
		}

		const grouped = new Map<string, ProjectInclusion[]>();
		for (const inclusion of inclusions) {
			const existing = grouped.get(inclusion.vendor) ?? [];
			existing.push(inclusion);
			grouped.set(inclusion.vendor, existing);
		}
		return [...grouped.entries()]
			.map(([key, group]) => ({
				groupKey: key,
				groupName: key,
				inclusions: sortByTitle(group),
				totalVariationPrice: computeTotal(group),
			}))
			.sort((a, b) =>
				a.groupName.localeCompare(b.groupName, undefined, {
					sensitivity: 'base',
				})
			);
	}, [inclusions, groupBy, categorySections]);

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
				const totalVariationPrice = filteredInclusions.reduce(
					(total, inclusion) =>
						total +
						(inclusion.class === 'Standard'
							? 0
							: (inclusion.variationPrice ?? 0)),
					0
				);
				return {
					...section,
					inclusions: filteredInclusions,
					totalVariationPrice,
				};
			})
			.filter((section) => section.inclusions.length > 0);
		return { loading: false as const, list };
	}, [trimmedSearch, variantSearchResults, sections]);

	const onDownloadPdf = async () => {
		if (!project) {
			toastManager.add({
				title: 'Could not download PDF',
				description: 'Project details are still loading. Please try again.',
				type: 'error',
			});
			return;
		}
		try {
			await openProjectInclusionsPdfInNewTab({
				projectName: project.name,
				projectAddress: project.address,
				clients: project.clients.map((client) => ({
					firstName: client.firstName,
					lastName: client.lastName,
					email: client.email,
					phone: client.phone,
				})),
				sections: categorySections.map((section) => ({
					categoryId: section.groupKey,
					categoryName: section.groupName,
					inclusions: section.inclusions.map((inclusion) => ({
						_id: String(inclusion._id),
						title: inclusion.title,
						code: inclusion.code,
						vendor: inclusion.vendor,
						models: inclusion.models,
						details: inclusion.details,
						status: inclusion.status,
						class: inclusion.class,
						variationPrice: inclusion.variationPrice,
						image: inclusion.image,
					})),
					totalVariationSalePrice: section.totalVariationPrice,
				})),
			});
		} catch (error) {
			toastManager.add({
				title: 'Could not generate PDF',
				description:
					error instanceof Error
						? error.message
						: 'Please try again in a moment.',
				type: 'error',
			});
		}
	};

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
			<ToggleGroup
				aria-label="Group inclusions by"
				className="shrink-0"
				onValueChange={(val) => {
					if (val.length > 0) {
						setGroupBy(val[0] as GroupBy);
					}
				}}
				value={[groupBy]}
				variant="outline"
			>
				<ToggleGroupItem value="category">Category</ToggleGroupItem>
				<ToggleGroupItem value="location">Location</ToggleGroupItem>
				<ToggleGroupItem value="vendor">Vendor</ToggleGroupItem>
			</ToggleGroup>
			<Button
				aria-label="Download project inclusions"
				className="shrink-0"
				onClick={() => {
					onDownloadPdf().catch(() => {
						/* Error handled in onDownloadPdf */
					});
				}}
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
						key={section.groupKey}
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
