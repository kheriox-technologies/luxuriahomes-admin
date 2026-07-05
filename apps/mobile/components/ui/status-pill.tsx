import { Badge, type BadgeVariant } from '@/components/ui/badge';

// projectStages / projectTasks schedule statuses
export type ScheduleStatus = 'Pending' | 'In Progress' | 'Complete';

// standalone tasks (kanban) statuses
export type KanbanStatus = 'planned' | 'in_progress' | 'blocked' | 'done';

// projectOrders statuses
export type OrderStatus = 'Pending' | 'Ordered' | 'In Transit' | 'Delivered';

// projectQuotations statuses
export type QuotationStatus = 'Under Review' | 'Approved' | 'Rejected';

const scheduleVariants: Record<ScheduleStatus, BadgeVariant> = {
	Pending: 'default',
	'In Progress': 'warning',
	Complete: 'success',
};

const kanbanVariants: Record<KanbanStatus, BadgeVariant> = {
	planned: 'info',
	in_progress: 'warning',
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
	Pending: 'warning',
	Ordered: 'info',
	'In Transit': 'purple',
	Delivered: 'success',
};

const quotationVariants: Record<QuotationStatus, BadgeVariant> = {
	'Under Review': 'warning',
	Approved: 'success',
	Rejected: 'destructive',
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

export function QuotationStatusPill({ status }: { status: string }) {
	return (
		<Badge variant={quotationVariants[status as QuotationStatus] ?? 'default'}>
			{status}
		</Badge>
	);
}
