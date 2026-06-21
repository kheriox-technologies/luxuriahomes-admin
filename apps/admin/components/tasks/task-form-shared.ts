import { z } from 'zod';

export const TASK_STATUSES = [
	'planned',
	'in_progress',
	'blocked',
	'done',
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
	planned: 'Planned',
	in_progress: 'In Progress',
	blocked: 'Blocked',
	done: 'Done',
};

// Lane order for the Kanban board (left to right).
export const TASK_STATUS_ORDER: TaskStatus[] = [
	'planned',
	'in_progress',
	'blocked',
	'done',
];

// Badge variant per status, used on the board lanes and cards.
export const TASK_STATUS_BADGE_VARIANT: Record<
	TaskStatus,
	'info' | 'warning' | 'error' | 'success'
> = {
	planned: 'info',
	in_progress: 'warning',
	blocked: 'error',
	done: 'success',
};

export const taskFormSchema = z.object({
	title: z.string().trim().min(1, 'Title is required'),
	description: z.string().optional(),
	status: z.enum(TASK_STATUSES),
	dueDate: z.date().optional(),
	projectId: z.string().optional(),
	assigneeUserId: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export const emptyTaskFormValues: TaskFormValues = {
	title: '',
	description: '',
	status: 'planned',
	dueDate: undefined,
	projectId: '',
	assigneeUserId: '',
};

export function taskFormFieldError(
	errors: readonly unknown[] | undefined
): string {
	if (!errors || errors.length === 0) {
		return '';
	}
	return errors
		.map((error) =>
			error instanceof Error ? error.message : String(error ?? '')
		)
		.filter(Boolean)
		.join(' ');
}

const WHITESPACE_REGEX = /\s+/;

/** Initials (max 2 chars) for an avatar fallback. */
export function initialsFromName(name: string): string {
	const parts = name.trim().split(WHITESPACE_REGEX).filter(Boolean).slice(0, 2);
	if (parts.length === 0) {
		return '?';
	}
	return parts.map((part) => part.charAt(0).toUpperCase()).join('');
}

/** Formats a due-date timestamp for compact display on cards. */
export function formatDueDate(timestamp: number): string {
	return new Date(timestamp).toLocaleDateString('en-AU', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
}
