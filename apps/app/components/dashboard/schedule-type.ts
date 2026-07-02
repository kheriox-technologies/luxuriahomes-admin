import {
	ClipboardList,
	ListChecks,
	type LucideIcon,
	Package,
} from 'lucide-react';

/** The three kinds of items shown on the dashboard schedule. */
export type ScheduleType = 'task' | 'orderTask' | 'order';

type BadgeVariant = 'info' | 'warning' | 'purple';

interface ScheduleTypeMeta {
	/** Tailwind background class for the card's left accent bar. */
	accentClass: string;
	/** Badge variant used for the type chip. */
	badgeVariant: BadgeVariant;
	/** Lucide icon representing the type. */
	Icon: LucideIcon;
	/** Full, human-readable label (used for legends, tooltips, aria-labels). */
	label: string;
	/** Plural label for group headers and counts. */
	pluralLabel: string;
	/** Short code shown historically (T / OT / O). */
	shortLabel: string;
}

/**
 * Single source of truth for how each schedule item type is presented across
 * the dashboard (cards, column group headers, and the legend).
 */
export const SCHEDULE_TYPE_META: Record<ScheduleType, ScheduleTypeMeta> = {
	task: {
		accentClass: 'bg-info',
		badgeVariant: 'info',
		Icon: ListChecks,
		label: 'Task',
		pluralLabel: 'Tasks',
		shortLabel: 'T',
	},
	orderTask: {
		accentClass: 'bg-warning',
		badgeVariant: 'warning',
		Icon: ClipboardList,
		label: 'Order task',
		pluralLabel: 'Order tasks',
		shortLabel: 'OT',
	},
	order: {
		accentClass: 'bg-violet-500',
		badgeVariant: 'purple',
		Icon: Package,
		label: 'Order',
		pluralLabel: 'Orders',
		shortLabel: 'O',
	},
};

/** Ordered list of types for legends and consistent rendering order. */
export const SCHEDULE_TYPES: ScheduleType[] = ['task', 'orderTask', 'order'];
