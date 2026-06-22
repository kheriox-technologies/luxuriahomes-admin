import type { Doc } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import {
	Frame,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from '@workspace/ui/components/frame';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import {
	getOrderStatusVariant,
	getTaskStatusVariant,
} from '@/components/dashboard/dashboard-status';
import ScheduleCard from '@/components/dashboard/schedule-card';
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
				<FrameTitle className="truncate leading-none">{projectName}</FrameTitle>
				<Badge className="shrink-0" size="lg" variant="outline">
					{totalCount}
				</Badge>
			</FrameHeader>
			<FramePanel className="flex min-h-24 flex-1 flex-col p-0">
				<ScrollArea className="flex-1">
					<div className="flex flex-col gap-2 p-3">
						{isEmpty ? (
							<p className="py-6 text-center text-muted-foreground text-sm">
								Nothing scheduled for the {windowLabel} for this project.
							</p>
						) : null}
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
								typeLabel="T"
							/>
						))}
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
									typeLabel="OT"
								/>
							);
						})}
						{orders.map((order) => (
							<ScheduleCard
								endDate={order.end}
								key={order._id}
								startDate={order.start}
								statusLabel={order.status}
								statusVariant={getOrderStatusVariant(order.status)}
								subtitle={order.orderId}
								title={order.vendor}
								typeLabel="O"
							/>
						))}
					</div>
				</ScrollArea>
			</FramePanel>
		</Frame>
	);
}
