import { Badge, type BadgeVariant } from '@/components/ui/badge';

// projectStages / projectTasks schedule statuses
export type ScheduleStatus = 'Pending' | 'In Progress' | 'Complete';

// standalone tasks (kanban) statuses
export type KanbanStatus = 'planned' | 'in_progress' | 'blocked' | 'done';

// projectOrders statuses
export type OrderStatus = 'Pending' | 'Ordered' | 'In Transit' | 'Delivered';

const scheduleVariants: Record<ScheduleStatus, BadgeVariant> = {
	Pending: 'default',
	'In Progress': 'info',
	Complete: 'success',
};

const kanbanVariants: Record<KanbanStatus, BadgeVariant> = {
	planned: 'default',
	in_progress: 'info',
	blocked: 'destructive',
	done: 'success',
};

export const kanbanLabels: Record<KanbanStatus, string> = {
	planned: 'Planned',
	in_progress: 'In Progress',
	blocked: 'Blocked',
	done: 'Done',
};

const orderVariants: Record<OrderStatus, BadgeVariant> = {
	Pending: 'default',
	Ordered: 'info',
	'In Transit': 'warning',
	Delivered: 'success',
};

export function ScheduleStatusPill({ status }: { status: ScheduleStatus }) {
	return (
		<Badge variant={scheduleVariants[status] ?? 'default'}>{status}</Badge>
	);
}

export function KanbanStatusPill({ status }: { status: KanbanStatus }) {
	return (
		<Badge variant={kanbanVariants[status] ?? 'default'}>
			{kanbanLabels[status] ?? status}
		</Badge>
	);
}

export function OrderStatusPill({ status }: { status: string }) {
	return (
		<Badge variant={orderVariants[status as OrderStatus] ?? 'default'}>
			{status}
		</Badge>
	);
}
