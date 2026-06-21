'use client';

import { useUser } from '@clerk/nextjs';
import { api } from '@workspace/backend/api';
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';
import { Calendar } from '@workspace/ui/components/calendar';
import {
	Popover,
	PopoverPopup,
	PopoverTrigger,
} from '@workspace/ui/components/popover';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { CalendarIcon, CornerDownLeft, User, XIcon } from 'lucide-react';
import { type KeyboardEvent, useMemo, useRef, useState } from 'react';
import {
	formatDueDate,
	initialsFromName,
	type TaskStatus,
} from '@/components/tasks/task-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function TaskQuickAdd({
	status,
	onClose,
}: {
	status: TaskStatus;
	onClose: () => void;
}) {
	const { user } = useUser();
	const addTask = useMutation(api.tasks.add.add);
	const admins = useQuery(api.adminUsers.list.list, {});

	const [title, setTitle] = useState('');
	const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
	const [assigneeUserId, setAssigneeUserId] = useState(() => user?.id ?? '');
	const [submitting, setSubmitting] = useState(false);
	const [dueDateOpen, setDueDateOpen] = useState(false);
	const [assigneeOpen, setAssigneeOpen] = useState(false);
	const titleInputRef = useRef<HTMLInputElement>(null);

	const nameByUserId = useMemo(() => {
		const map = new Map<string, string>();
		for (const admin of admins ?? []) {
			map.set(admin.userId, admin.fullName);
		}
		return map;
	}, [admins]);

	const assigneeName = assigneeUserId
		? nameByUserId.get(assigneeUserId)
		: undefined;

	const submit = async () => {
		const trimmed = title.trim();
		if (trimmed === '' || submitting) {
			return;
		}
		setSubmitting(true);
		try {
			await addTask({
				title: trimmed,
				status,
				dueDate: dueDate ? dueDate.getTime() : undefined,
				assigneeUserId: assigneeUserId || undefined,
			});
			toastManager.add({ title: 'Task created', type: 'success' });
			// Keep the composer open so several tasks can be added in a row;
			// clear the title but retain the due date / assignee selections.
			setTitle('');
			setSubmitting(false);
			titleInputRef.current?.focus();
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not create task. Please try again in a moment.'
				),
				title: 'Could not create task',
				type: 'error',
			});
			setSubmitting(false);
		}
	};

	const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			submit().catch(() => {
				/* errors surfaced via toast */
			});
			return;
		}
		if (event.key === 'Escape') {
			event.preventDefault();
			onClose();
		}
	};

	return (
		<div className="flex flex-col gap-2 rounded-xl border-2 border-ring bg-background p-3 shadow-sm">
			<input
				aria-label="Task title"
				autoFocus
				className="w-full bg-transparent font-medium text-sm leading-snug outline-none placeholder:text-muted-foreground"
				onChange={(event) => setTitle(event.target.value)}
				onKeyDown={onKeyDown}
				placeholder="What needs to be done?"
				ref={titleInputRef}
				value={title}
			/>

			<div className="flex items-center gap-1">
				<Popover onOpenChange={setDueDateOpen} open={dueDateOpen}>
					<PopoverTrigger
						render={
							<Button size="sm" type="button" variant="outline">
								<CalendarIcon />
								{dueDate ? (
									<>
										<span>{formatDueDate(dueDate.getTime())}</span>
										<XIcon
											aria-label="Clear due date"
											className="opacity-60 hover:opacity-100"
											onClick={(event) => {
												event.stopPropagation();
												setDueDate(undefined);
											}}
										/>
									</>
								) : null}
							</Button>
						}
					/>
					<PopoverPopup align="start" side="bottom">
						<Calendar
							captionLayout="dropdown"
							mode="single"
							onSelect={(date) => {
								setDueDate(date ?? undefined);
								setDueDateOpen(false);
							}}
							selected={dueDate}
						/>
					</PopoverPopup>
				</Popover>

				<Popover onOpenChange={setAssigneeOpen} open={assigneeOpen}>
					<PopoverTrigger
						render={
							<Button
								aria-label={
									assigneeName ? `Assignee: ${assigneeName}` : 'Set assignee'
								}
								size="icon-sm"
								title={assigneeName ?? 'Assignee'}
								type="button"
								variant="outline"
							>
								{assigneeName ? (
									<Avatar className="size-5">
										<AvatarFallback className="text-[10px]">
											{initialsFromName(assigneeName)}
										</AvatarFallback>
									</Avatar>
								) : (
									<User />
								)}
							</Button>
						}
					/>
					<PopoverPopup align="start" className="w-56" side="bottom">
						<div className="flex flex-col gap-0.5">
							<button
								className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-muted-foreground text-sm hover:bg-accent"
								onClick={() => {
									setAssigneeUserId('');
									setAssigneeOpen(false);
								}}
								type="button"
							>
								<User className="size-5 opacity-60" />
								Unassigned
							</button>
							{(admins ?? []).map((admin) => (
								<button
									className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
									key={admin.userId}
									onClick={() => {
										setAssigneeUserId(admin.userId);
										setAssigneeOpen(false);
									}}
									type="button"
								>
									<Avatar className="size-6">
										<AvatarFallback className="text-[10px]">
											{initialsFromName(admin.fullName)}
										</AvatarFallback>
									</Avatar>
									<span className="truncate">{admin.fullName}</span>
								</button>
							))}
						</div>
					</PopoverPopup>
				</Popover>

				<Button
					aria-label="Add task"
					className="ml-auto"
					disabled={title.trim() === '' || submitting}
					onClick={() => {
						submit().catch(() => {
							/* errors surfaced via toast */
						});
					}}
					size="icon-sm"
					type="button"
					variant="default"
				>
					<CornerDownLeft />
				</Button>
			</div>
		</div>
	);
}
