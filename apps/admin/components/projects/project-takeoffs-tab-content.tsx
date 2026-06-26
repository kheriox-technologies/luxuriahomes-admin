'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
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
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { toastManager } from '@workspace/ui/components/toast';
import { cn } from '@workspace/ui/lib/utils';
import { useAction, useQuery } from 'convex/react';
import { Download, Maximize, Minimize, Ruler, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { TakeoffsHandle } from '@/components/takeoffs/takeoffs-content';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import ProjectTakeoffWorkspace from './project-takeoff-workspace';

export default function ProjectTakeoffsTabContent({
	projectId,
}: {
	projectId: Id<'projects'>;
}) {
	const takeoffs = useQuery(api.takeoffs.list.list, { projectId });
	const [selectedId, setSelectedId] = useState<Id<'takeoffs'> | null>(null);
	const contentRef = useRef<TakeoffsHandle>(null);
	const [downloadingPdf, setDownloadingPdf] = useState(false);
	const [deletingTakeoff, setDeletingTakeoff] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const removeTakeoff = useAction(api.takeoffs.remove.remove);

	const onDownloadPdf = async () => {
		setDownloadingPdf(true);
		try {
			await contentRef.current?.downloadPdf();
		} finally {
			setDownloadingPdf(false);
		}
	};

	const onDeleteTakeoff = async () => {
		if (!selectedId) {
			return;
		}
		setDeletingTakeoff(true);
		try {
			await removeTakeoff({ takeoffId: selectedId });
			toastManager.add({
				title: 'Take-off deleted',
				type: 'success',
			});
			setDeleteDialogOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete take-off. Please try again in a moment.'
				),
				title: 'Could not delete take-off',
				type: 'error',
			});
		} finally {
			setDeletingTakeoff(false);
		}
	};

	// Default to the first takeoff once the list loads (or when the current
	// selection disappears, e.g. after a delete).
	useEffect(() => {
		if (!takeoffs) {
			return;
		}
		setSelectedId((prev) => {
			if (prev && takeoffs.some((t) => t._id === prev)) {
				return prev;
			}
			return takeoffs[0]?._id ?? null;
		});
	}, [takeoffs]);

	// Exit full screen on Escape, but let an open delete dialog consume it first.
	useEffect(() => {
		if (!isFullscreen) {
			return;
		}
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && !deleteDialogOpen) {
				setIsFullscreen(false);
			}
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [isFullscreen, deleteDialogOpen]);

	const items = useMemo(() => (takeoffs ?? []).map((t) => t._id), [takeoffs]);
	const labelById = useMemo(() => {
		const map = new Map<Id<'takeoffs'>, string>();
		for (const t of takeoffs ?? []) {
			map.set(t._id, t.name);
		}
		return map;
	}, [takeoffs]);

	if (takeoffs === undefined) {
		return <p className="text-muted-foreground text-sm">Loading…</p>;
	}

	if (takeoffs.length === 0) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Ruler aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No take-offs yet</EmptyTitle>
					<EmptyDescription>
						Open the Documents tab, then use a PDF&apos;s &ldquo;Add to
						take-offs&rdquo; action to start measuring.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div
			className={cn(
				'flex h-full min-h-0 w-full min-w-0 flex-1 flex-col gap-3',
				isFullscreen && 'fixed inset-0 z-50 bg-background p-4'
			)}
		>
			<div className="flex w-full items-center justify-between gap-2">
				<h2 className="min-w-0 truncate font-semibold text-lg">
					{selectedId ? (
						(labelById.get(selectedId) ?? 'Untitled take-off')
					) : (
						<span className="text-muted-foreground">No take-off selected</span>
					)}
				</h2>
				<div className="flex shrink-0 items-center gap-2">
					<div className="w-full max-w-sm">
						<Combobox<Id<'takeoffs'>>
							items={items}
							itemToStringLabel={(item) => labelById.get(item) ?? ''}
							onValueChange={(next) => setSelectedId(next ?? null)}
							value={selectedId}
						>
							<ComboboxInput placeholder="Select a PDF" />
							<ComboboxPopup>
								<ComboboxEmpty>No take-offs available.</ComboboxEmpty>
								<ComboboxList>
									{(item: Id<'takeoffs'>) => (
										<ComboboxItem key={item} value={item}>
											{labelById.get(item) ?? item}
										</ComboboxItem>
									)}
								</ComboboxList>
							</ComboboxPopup>
						</Combobox>
					</div>
					{selectedId ? (
						<>
							<Button
								onClick={() => setIsFullscreen((v) => !v)}
								size="sm"
								type="button"
								variant="outline"
							>
								{isFullscreen ? <Minimize /> : <Maximize />}
								{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
							</Button>
							<Button
								loading={downloadingPdf}
								onClick={() => onDownloadPdf().catch(() => undefined)}
								size="sm"
								type="button"
								variant="outline"
							>
								<Download />
								Download PDF
							</Button>
							<AlertDialog
								onOpenChange={setDeleteDialogOpen}
								open={deleteDialogOpen}
							>
								<AlertDialogTrigger
									render={
										<Button
											size="sm"
											type="button"
											variant="destructive-outline"
										>
											<Trash2 />
											Delete Take Off
										</Button>
									}
								/>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Delete take-off?</AlertDialogTitle>
										<AlertDialogDescription>
											{`This will permanently delete ${
												labelById.get(selectedId) ?? 'this take-off'
											} and its PDF. This action cannot be undone.`}
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogClose
											render={<Button type="button" variant="outline" />}
										>
											Cancel
										</AlertDialogClose>
										<Button
											loading={deletingTakeoff}
											onClick={() => {
												onDeleteTakeoff().catch(() => {
													/* Error is handled in onDeleteTakeoff */
												});
											}}
											variant="destructive"
										>
											Delete Take Off
										</Button>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</>
					) : null}
				</div>
			</div>
			<div className="min-h-0 w-full min-w-0 flex-1">
				{selectedId ? (
					<ProjectTakeoffWorkspace
						contentRef={contentRef}
						key={selectedId}
						takeoffId={selectedId}
					/>
				) : null}
			</div>
		</div>
	);
}
