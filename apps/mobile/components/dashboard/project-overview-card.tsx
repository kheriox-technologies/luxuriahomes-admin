import { useRouter } from 'expo-router';
import {
	AlertTriangle,
	ChevronRight,
	ListChecks,
	Package,
	ShoppingCart,
} from 'lucide-react-native';
import { memo, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '@/components/theme';
import { Card } from '@/components/ui/card';
import {
	OrderStatusPill,
	type ScheduleStatus,
	ScheduleStatusPill,
} from '@/components/ui/status-pill';
import { formatShortDate } from '@/lib/format';

interface OverviewTask {
	_id: string;
	endDate: number;
	isOverdue: boolean;
	name: string;
	stageName: string;
	startDate: number;
	status: string;
}

interface OverviewOrderTask {
	_id: string;
	end: number;
	linkedOrderCount: number;
	name: string;
	stageName: string;
	start: number;
}

interface OverviewOrder {
	_id: string;
	end?: number;
	orderId: string;
	start?: number;
	status: string;
	vendor: string;
}

export interface ProjectOverview {
	orders: (OverviewOrder & Record<string, unknown>)[];
	orderTasks: OverviewOrderTask[];
	projectId: string;
	projectName: string;
	tasks: OverviewTask[];
}

function SectionLabel({
	icon,
	label,
	count,
}: {
	icon: ReactNode;
	label: string;
	count: number;
}) {
	return (
		<View className="flex-row items-center gap-1.5 pt-3 pb-1.5">
			{icon}
			<Text className="font-sans-semibold text-muted-foreground text-xs uppercase tracking-wide">
				{label} · {count}
			</Text>
		</View>
	);
}

export const ProjectOverviewCard = memo(
	({ overview, index }: { overview: ProjectOverview; index: number }) => {
		const router = useRouter();
		const colors = useThemeColors();

		const overdue = overview.tasks.filter((task) => task.isOverdue);
		const upcoming = overview.tasks.filter((task) => !task.isOverdue);
		const isEmpty =
			overview.tasks.length === 0 &&
			overview.orderTasks.length === 0 &&
			overview.orders.length === 0;

		return (
			<Animated.View
				entering={FadeInDown.delay(Math.min(index * 60, 300)).duration(350)}
			>
				<Card className="mx-4 mb-3 p-4">
					<Pressable
						accessibilityLabel={`Open ${overview.projectName} schedule`}
						accessibilityRole="button"
						className="flex-row items-center justify-between gap-2"
						onPress={() =>
							router.push({
								pathname: '/(app)/projects/[projectId]/schedule',
								params: { projectId: overview.projectId },
							})
						}
					>
						<Text
							className="flex-1 font-sans-semibold text-base text-foreground"
							numberOfLines={1}
						>
							{overview.projectName}
						</Text>
						<ChevronRight
							color={colors.mutedForeground}
							size={18}
							strokeWidth={2}
						/>
					</Pressable>

					{isEmpty ? (
						<Text className="pt-3 font-sans text-muted-foreground text-sm">
							Nothing scheduled in this window.
						</Text>
					) : null}

					{overdue.length > 0 ? (
						<>
							<SectionLabel
								count={overdue.length}
								icon={
									<AlertTriangle
										color={colors.destructive}
										size={13}
										strokeWidth={2}
									/>
								}
								label="Overdue"
							/>
							{overdue.map((task) => (
								<View
									className="flex-row items-center gap-2 py-1.5"
									key={task._id}
								>
									<View className="h-2 w-2 rounded-full bg-destructive" />
									<View className="flex-1">
										<Text
											className="font-sans-medium text-foreground text-sm"
											numberOfLines={1}
										>
											{task.name}
										</Text>
										<Text className="font-sans text-muted-foreground text-xs">
											{task.stageName} · due {formatShortDate(task.endDate)}
										</Text>
									</View>
									<ScheduleStatusPill status={task.status as ScheduleStatus} />
								</View>
							))}
						</>
					) : null}

					{upcoming.length > 0 ? (
						<>
							<SectionLabel
								count={upcoming.length}
								icon={
									<ListChecks
										color={colors.mutedForeground}
										size={13}
										strokeWidth={2}
									/>
								}
								label="Tasks"
							/>
							{upcoming.map((task) => (
								<View
									className="flex-row items-center gap-2 py-1.5"
									key={task._id}
								>
									<View className="h-2 w-2 rounded-full bg-info" />
									<View className="flex-1">
										<Text
											className="font-sans-medium text-foreground text-sm"
											numberOfLines={1}
										>
											{task.name}
										</Text>
										<Text className="font-sans text-muted-foreground text-xs">
											{task.stageName} · {formatShortDate(task.startDate)} –{' '}
											{formatShortDate(task.endDate)}
										</Text>
									</View>
									<ScheduleStatusPill status={task.status as ScheduleStatus} />
								</View>
							))}
						</>
					) : null}

					{overview.orderTasks.length > 0 ? (
						<>
							<SectionLabel
								count={overview.orderTasks.length}
								icon={
									<Package
										color={colors.mutedForeground}
										size={13}
										strokeWidth={2}
									/>
								}
								label="Order tasks"
							/>
							{overview.orderTasks.map((orderTask) => (
								<View
									className="flex-row items-center gap-2 py-1.5"
									key={orderTask._id}
								>
									<View className="h-2 w-2 rounded-full bg-warning" />
									<View className="flex-1">
										<Text
											className="font-sans-medium text-foreground text-sm"
											numberOfLines={1}
										>
											{orderTask.name}
										</Text>
										<Text className="font-sans text-muted-foreground text-xs">
											{orderTask.stageName} · order by{' '}
											{formatShortDate(orderTask.end)}
											{orderTask.linkedOrderCount > 0
												? ` · ${orderTask.linkedOrderCount} order${orderTask.linkedOrderCount > 1 ? 's' : ''}`
												: ''}
										</Text>
									</View>
								</View>
							))}
						</>
					) : null}

					{overview.orders.length > 0 ? (
						<>
							<SectionLabel
								count={overview.orders.length}
								icon={
									<ShoppingCart
										color={colors.mutedForeground}
										size={13}
										strokeWidth={2}
									/>
								}
								label="Orders"
							/>
							{overview.orders.map((order) => (
								<View
									className="flex-row items-center gap-2 py-1.5"
									key={order._id}
								>
									<View className="flex-1">
										<Text
											className="font-sans-medium text-foreground text-sm"
											numberOfLines={1}
										>
											{order.orderId} · {order.vendor}
										</Text>
										<Text className="font-sans text-muted-foreground text-xs">
											{formatShortDate(order.start)} –{' '}
											{formatShortDate(order.end)}
										</Text>
									</View>
									<OrderStatusPill status={order.status} />
								</View>
							))}
						</>
					) : null}
				</Card>
			</Animated.View>
		);
	}
);

ProjectOverviewCard.displayName = 'ProjectOverviewCard';
