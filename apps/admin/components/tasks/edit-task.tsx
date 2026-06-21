'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Button } from '@workspace/ui/components/button';
import {
	Card,
	CardAction,
	CardDescription,
	CardHeader,
	CardPanel,
	CardTitle,
} from '@workspace/ui/components/card';
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import {
	Frame,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from '@workspace/ui/components/frame';
import { Input } from '@workspace/ui/components/input';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetPanel,
	SheetTitle,
} from '@workspace/ui/components/sheet';
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { ImagePlus, Info, Trash2 } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import {
	NoteImageUploader,
	type NoteImageUploaderHandle,
} from '@/components/notes/note-image-uploader';
import { NoteImagesRow } from '@/components/notes/note-images-row';
import TaskAssigneeCombobox from '@/components/tasks/task-assignee-combobox';
import TaskDueDatePicker from '@/components/tasks/task-due-date-picker';
import {
	emptyTaskFormValues,
	type TaskStatus,
	taskFormFieldError,
	taskFormSchema,
} from '@/components/tasks/task-form-shared';
import TaskProjectCombobox from '@/components/tasks/task-project-combobox';
import TaskStatusSelect from '@/components/tasks/task-status-select';
import { getConvexErrorMessage } from '@/lib/convex-errors';

const FORM_ID = 'edit-task-form';

function formatNoteDate(timestamp: number): string {
	return new Date(timestamp).toLocaleDateString('en-AU', {
		day: 'numeric',
		month: 'long',
		weekday: 'short',
		year: 'numeric',
	});
}

function TaskNotesSection({ taskId }: { taskId: Id<'tasks'> }) {
	const [noteText, setNoteText] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [images, setImages] = useState<string[]>([]);
	const [imagesUploading, setImagesUploading] = useState(false);
	const [uploaderKey, setUploaderKey] = useState(0);
	const uploaderRef = useRef<NoteImageUploaderHandle>(null);

	const appendNote = useMutation(api.tasks.appendNote.appendNote);
	const deleteNote = useMutation(api.tasks.deleteNote.deleteNote);
	const notes = useQuery(api.tasks.listNotes.listNotes, { taskId });

	const resetForm = () => {
		setNoteText('');
		setImages([]);
		setImagesUploading(false);
		setUploaderKey((key) => key + 1);
	};

	const onSubmit = async () => {
		if (noteText.trim() === '') {
			toastManager.add({ title: 'Write a note before saving', type: 'error' });
			return;
		}
		setSubmitting(true);
		try {
			await appendNote({ taskId, note: noteText, images });
			toastManager.add({ title: 'Note added', type: 'success' });
			resetForm();
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

	const onDelete = async (noteId: Id<'taskNotes'>) => {
		try {
			await deleteNote({ noteId });
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

	let notesBody: ReactNode;
	if (notes === undefined) {
		notesBody = <p className="text-muted-foreground text-sm">Loading notes…</p>;
	} else if (notes.length === 0) {
		notesBody = (
			<Alert variant="info">
				<Info aria-hidden className="size-4 shrink-0" />
				<AlertDescription>
					No notes yet. Use the field above to add the first one.
				</AlertDescription>
			</Alert>
		);
	} else {
		notesBody = (
			<div className="flex flex-col gap-3">
				{notes.map((entry) => (
					<Card key={entry._id}>
						<CardHeader>
							<CardTitle>{entry.addedBy}</CardTitle>
							<CardDescription>
								{formatNoteDate(entry.timestamp)}
							</CardDescription>
							<CardAction>
								<Button
									aria-label="Delete note"
									onClick={() => {
										onDelete(entry._id).catch(() => {
											/* handled in onDelete */
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
						<CardPanel className="flex flex-col gap-3">
							<p className="whitespace-pre-wrap text-pretty text-sm leading-relaxed">
								{entry.note}
							</p>
							{entry.images && entry.images.length > 0 ? (
								<NoteImagesRow
									imageKeys={entry.images}
									title={`Note by ${entry.addedBy}`}
								/>
							) : null}
						</CardPanel>
					</Card>
				))}
			</div>
		);
	}

	return (
		<Frame>
			<FrameHeader className="flex flex-row items-center py-3">
				<FrameTitle className="min-w-0 truncate leading-none">Notes</FrameTitle>
			</FrameHeader>
			<FramePanel className="flex flex-col gap-3">
				<Textarea
					className="min-h-[90px] resize-y"
					onChange={(e) => setNoteText(e.target.value)}
					placeholder="Type your note…"
					value={noteText}
				/>
				<NoteImageUploader
					key={uploaderKey}
					onChange={setImages}
					onUploadingChange={setImagesUploading}
					ref={uploaderRef}
				/>
				<div className="flex justify-end gap-2">
					<Button
						disabled={imagesUploading}
						loading={imagesUploading}
						onClick={() => uploaderRef.current?.open()}
						type="button"
						variant="outline"
					>
						<ImagePlus />
						Add image
					</Button>
					<Button
						disabled={imagesUploading}
						loading={submitting}
						onClick={() => {
							onSubmit().catch(() => {
								/* handled in onSubmit */
							});
						}}
						type="button"
					>
						Save note
					</Button>
				</div>
				{notesBody}
			</FramePanel>
		</Frame>
	);
}

export default function EditTask({
	task,
	open,
	onOpenChange,
}: {
	task: Doc<'tasks'>;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const updateTask = useMutation(api.tasks.update.update);
	const removeTask = useMutation(api.tasks.remove.remove);

	const form = useForm({
		defaultValues: emptyTaskFormValues,
		validators: {
			onChange: taskFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			const parsed = taskFormSchema.parse(value);
			try {
				await updateTask({
					taskId: task._id,
					title: parsed.title,
					description: parsed.description?.trim() || undefined,
					status: parsed.status,
					dueDate: parsed.dueDate ? parsed.dueDate.getTime() : undefined,
					projectId: parsed.projectId
						? (parsed.projectId as Id<'projects'>)
						: undefined,
					assigneeUserId: parsed.assigneeUserId || undefined,
				});
				toastManager.add({ title: 'Task updated', type: 'success' });
				onOpenChange(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update task. Please try again in a moment.'
					),
					title: 'Could not update task',
					type: 'error',
				});
			}
		},
	});

	useEffect(() => {
		if (open) {
			form.reset(
				{
					title: task.title,
					description: task.description ?? '',
					status: task.status,
					dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
					projectId: task.projectId ?? '',
					assigneeUserId: task.assigneeUserId ?? '',
				},
				{ keepDefaultValues: true }
			);
			return;
		}
		form.reset();
	}, [form, open, task]);

	const onDeleteTask = async () => {
		try {
			await removeTask({ taskId: task._id });
			toastManager.add({ title: 'Task deleted', type: 'success' });
			onOpenChange(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete task. Please try again in a moment.'
				),
				title: 'Could not delete task',
				type: 'error',
			});
		}
	};

	return (
		<Sheet onOpenChange={onOpenChange} open={open}>
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0"
				side="right"
			>
				<SheetHeader>
					<SheetTitle>Edit task</SheetTitle>
				</SheetHeader>
				<SheetPanel className="flex flex-col gap-6">
					<form
						className="flex flex-col gap-4"
						id={FORM_ID}
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit().catch(() => {
								/* TanStack Form handles validation errors */
							});
						}}
					>
						<form.Field name="title">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Title</FieldLabel>
										<Input
											aria-invalid={invalid}
											id={field.name}
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Task title"
											value={field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{taskFormFieldError(field.state.meta.errors)}
											</FieldError>
										) : null}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="description">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Description</FieldLabel>
									<Textarea
										className="min-h-[90px] resize-y"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Optional description"
										value={field.state.value ?? ''}
									/>
								</Field>
							)}
						</form.Field>

						<form.Field name="status">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Status</FieldLabel>
									<TaskStatusSelect
										id={field.name}
										onChange={(next) => field.handleChange(next)}
										value={field.state.value as TaskStatus}
									/>
								</Field>
							)}
						</form.Field>

						<form.Field name="dueDate">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Due date</FieldLabel>
									<TaskDueDatePicker
										onBlur={field.handleBlur}
										onChange={(date) => field.handleChange(date as never)}
										value={field.state.value as Date | undefined}
									/>
								</Field>
							)}
						</form.Field>

						<form.Field name="projectId">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Project</FieldLabel>
									<TaskProjectCombobox
										id={field.name}
										onBlur={field.handleBlur}
										onChange={(next) => field.handleChange(next)}
										value={field.state.value ?? ''}
									/>
								</Field>
							)}
						</form.Field>

						<form.Field name="assigneeUserId">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Assignee</FieldLabel>
									<TaskAssigneeCombobox
										id={field.name}
										onBlur={field.handleBlur}
										onChange={(next) => field.handleChange(next)}
										value={field.state.value ?? ''}
									/>
								</Field>
							)}
						</form.Field>
					</form>

					<TaskNotesSection taskId={task._id} />
				</SheetPanel>
				<SheetFooter className="justify-between">
					<Button
						onClick={() => {
							onDeleteTask().catch(() => {
								/* handled in onDeleteTask */
							});
						}}
						type="button"
						variant="destructive-outline"
					>
						<Trash2 />
						Delete
					</Button>
					<div className="flex gap-2">
						<SheetClose render={<Button type="button" variant="outline" />}>
							Cancel
						</SheetClose>
						<Button
							disabled={
								!(
									form.state.isValid &&
									!form.state.isValidating &&
									!form.state.isSubmitting
								)
							}
							form={FORM_ID}
							type="submit"
							variant="default"
						>
							Save
						</Button>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
