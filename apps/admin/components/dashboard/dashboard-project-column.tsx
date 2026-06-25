import type { Doc } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import {
	Frame,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from '@workspace/ui/components/frame';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '@workspace/ui/lib/utils';
import {
	getOrderStatusVariant,
	getTaskStatusVariant,
} from '@/components/dashboard/dashboard-status';
import ScheduleCard from '@/components/dashboard/schedule-card';
import {
	SCHEDULE_TYPE_META,
	type ScheduleType,
} from '@/components/dashboard/schedule-type';
import TaskCardActions from '@/components/dashboard/task-card-actions';

type OrderWithRange = Doc<'projectOrders'> & {
	start?: number;
	end?: number;
};

type TaskWithStage = Doc<'projectTasks'> & {
	stageName: string;
	isOverdue: boolean;
};

type OrderTaskWithRange = Doc<'projectOrderTasks'> & {
	start: number;
	end: number;
	stageName: string;
	linkedOrderCount: number;
};

interface ProjectOverview {
	orders: OrderWithRange[];
	orderTasks: OrderTaskWithRange[];
	projectId: string;
	projectName: string;
	tasks: TaskWithStage[];
}

function getOrderTaskStatus(linkedOrderCount: number): {
	label: string;
	variant: 'warning' | 'info';
} {
	if (linkedOrderCount === 0) {
		return { label: 'No orders linked', variant: 'warning' };
	}
	const plural = linkedOrderCount === 1 ? 'order' : 'orders';
	return { label: `${linkedOrderCount} ${plural} linked`, variant: 'info' };
}

function GroupHeader({ count, type }: { count: number; type: ScheduleType }) {
	const meta = SCHEDULE_TYPE_META[type];
	const { Icon } = meta;
	return (
		<div className="sticky top-0 z-10 -mx-3 flex items-center gap-1.5 bg-background/95 px-3 py-1.5 backdrop-blur supports-[backdrop-filter]:bg-background/80">
			<span
				aria-hidden
				className={cn('size-2 rounded-full', meta.accentClass)}
			/>
			<Icon aria-hidden className="size-3.5 text-muted-foreground" />
			<span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
				{meta.pluralLabel}
			</span>
			<span className="text-muted-foreground/70 text-xs tabular-nums">
				{count}
			</span>
		</div>
	);
}

export default function DashboardProjectColumn({
	overview,
	windowLabel,
}: {
	overview: ProjectOverview;
	windowLabel: string;
}) {
	const { projectId, projectName, tasks, orderTasks, orders } = overview;

	const scheduleHref = (name: string) =>
		`/projects/${projectId}?tab=schedule&search=${encodeURIComponent(name)}`;
	const totalCount = tasks.length + orderTasks.length + orders.length;
	const isEmpty = totalCount === 0;

	return (
		<Frame className="flex h-full min-h-0 min-w-0 flex-col">
			<FrameHeader className="flex-row items-center justify-between gap-2 py-3">
				<FrameTitle className="truncate font-semibold leading-none">
					{projectName}
				</FrameTitle>
				<Badge
					className="shrink-0 tabular-nums"
					size="lg"
					variant={isEmpty ? 'outline' : 'secondary'}
				>
					{totalCount}
				</Badge>
			</FrameHeader>
			<FramePanel className="flex min-h-24 flex-1 flex-col p-0">
				<ScrollArea className="flex-1">
					<div className="flex flex-col gap-2 p-3">
						{isEmpty ? (
							<p className="py-8 text-center text-muted-foreground text-sm leading-relaxed">
								Nothing scheduled for the {windowLabel}.
							</p>
						) : null}
						{tasks.length > 0 ? (
							<>
								<GroupHeader count={tasks.length} type="task" />
								{tasks.map((task) => (
									<ScheduleCard
										actions={
											<TaskCardActions status={task.status} taskId={task._id} />
										}
										endDate={task.endDate}
										href={scheduleHref(task.name)}
										isOverdue={task.isOverdue}
										key={task._id}
										startDate={task.startDate}
										statusLabel={task.status}
										statusVariant={getTaskStatusVariant(task.status)}
										subtitle={task.stageName}
										title={task.name}
										type="task"
									/>
								))}
							</>
						) : null}
						{orderTasks.length > 0 ? (
							<>
								<GroupHeader count={orderTasks.length} type="orderTask" />
								{orderTasks.map((orderTask) => {
									const status = getOrderTaskStatus(orderTask.linkedOrderCount);
									return (
										<ScheduleCard
											endDate={orderTask.end}
											href={scheduleHref(orderTask.name)}
											key={orderTask._id}
											startDate={orderTask.start}
											statusLabel={status.label}
											statusVariant={status.variant}
											subtitle={orderTask.stageName}
											title={orderTask.name}
											type="orderTask"
										/>
									);
								})}
							</>
						) : null}
						{orders.length > 0 ? (
							<>
								<GroupHeader count={orders.length} type="order" />
								{orders.map((order) => (
									<ScheduleCard
										endDate={order.end}
										key={order._id}
										startDate={order.start}
										statusLabel={order.status}
										statusVariant={getOrderStatusVariant(order.status)}
										subtitle={order.orderId}
										title={order.vendor}
										type="order"
									/>
								))}
							</>
						) : null}
					</div>
				</ScrollArea>
			</FramePanel>
		</Frame>
	);
}
