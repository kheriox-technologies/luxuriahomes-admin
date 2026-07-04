import type { Doc } from '@workspace/backend/dataModel';
import {
	CalendarRange,
	ChevronDown,
	Clock,
	MoreVertical,
} from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
	FadeInDown,
	LinearTransition,
} from 'react-native-reanimated';
import { ProgressBar } from '@/components/schedule/progress-bar';
import { useThemeColors } from '@/components/theme';
import { Card } from '@/components/ui/card';
import {
	type ScheduleStatus,
	ScheduleStatusPill,
} from '@/components/ui/status-pill';
import { cn } from '@/lib/cn';
import { formatShortDate } from '@/lib/format';

export type Stage = Doc<'projectStages'>;
export type Task = Doc<'projectTasks'>;

export interface StatusTarget {
	id: string;
	kind: 'stage' | 'task';
	name: string;
	status: ScheduleStatus;
}

function TaskRow({
	task,
	onStatusPress,
}: {
	task: Task;
	onStatusPress: (target: StatusTarget) => void;
}) {
	const colors = useThemeColors();
	return (
		<View className="flex-row items-center gap-3 border-border border-t px-4 py-3">
			<View className="flex-1 gap-1">
				<Text className="font-sans-medium text-foreground text-sm">
					{task.name}
				</Text>
				<View className="flex-row items-center gap-3">
					<View className="flex-row items-center gap-1">
						<CalendarRange
							color={colors.mutedForeground}
							size={12}
							strokeWidth={2}
						/>
						<Text className="font-sans text-muted-foreground text-xs">
							{formatShortDate(task.startDate)} –{' '}
							{formatShortDate(task.endDate)}
						</Text>
					</View>
					<View className="flex-row items-center gap-1">
						<Clock color={colors.mutedForeground} size={12} strokeWidth={2} />
						<Text className="font-sans text-muted-foreground text-xs">
							{task.durationDays}d
						</Text>
					</View>
				</View>
			</View>
			<View>
				<ScheduleStatusPill status={task.status as ScheduleStatus} />
			</View>
			<Pressable
				accessibilityLabel={`Change status of ${task.name}`}
				accessibilityRole="button"
				className="h-9 w-9 items-center justify-center rounded-full active:bg-muted"
				hitSlop={4}
				onPress={() =>
					onStatusPress({
						kind: 'task',
						id: task._id,
						name: task.name,
						status: task.status as ScheduleStatus,
					})
				}
			>
				<MoreVertical
					color={colors.mutedForeground}
					size={18}
					strokeWidth={2}
				/>
			</Pressable>
		</View>
	);
}

export const StageCard = memo(
	({
		stage,
		tasks,
		expanded,
		onToggle,
		onStatusPress,
		index,
	}: {
		stage: Stage;
		tasks: Task[];
		expanded: boolean;
		onToggle: () => void;
		onStatusPress: (target: StatusTarget) => void;
		index: number;
	}) => {
		const colors = useThemeColors();
		const completed = tasks.filter((task) => task.status === 'Complete').length;

		return (
			<Animated.View
				entering={FadeInDown.delay(Math.min(index * 40, 320)).duration(350)}
				layout={LinearTransition.duration(200)}
			>
				<Card className="mx-4 mb-3 overflow-hidden">
					<Pressable
						accessibilityLabel={`${expanded ? 'Collapse' : 'Expand'} stage ${stage.name}`}
						accessibilityRole="button"
						accessibilityState={{ expanded }}
						className="gap-3 p-4 active:bg-muted/50"
						onPress={onToggle}
					>
						<View className="flex-row items-center gap-3">
							<View className="flex-1 gap-1">
								<Text className="font-sans-semibold text-base text-foreground">
									{stage.name}
								</Text>
								<Text className="font-sans text-muted-foreground text-xs">
									{formatShortDate(stage.startDate)} –{' '}
									{formatShortDate(stage.endDate)}
									{tasks.length > 0
										? `  ·  ${completed}/${tasks.length} tasks`
										: ''}
								</Text>
							</View>
							<View>
								<ScheduleStatusPill status={stage.status as ScheduleStatus} />
							</View>
							<Pressable
								accessibilityLabel={`Change status of ${stage.name}`}
								accessibilityRole="button"
								className="h-9 w-9 items-center justify-center rounded-full active:bg-muted"
								hitSlop={4}
								onPress={() =>
									onStatusPress({
										kind: 'stage',
										id: stage._id,
										name: stage.name,
										status: stage.status as ScheduleStatus,
									})
								}
							>
								<MoreVertical
									color={colors.mutedForeground}
									size={18}
									strokeWidth={2}
								/>
							</Pressable>
							<View className={cn('rotate-0', expanded && 'rotate-180')}>
								<ChevronDown
									color={colors.mutedForeground}
									size={18}
									strokeWidth={2}
								/>
							</View>
						</View>
						{tasks.length > 0 ? (
							<ProgressBar completed={completed} total={tasks.length} />
						) : null}
					</Pressable>

					{expanded &&
						tasks.map((task) => (
							<TaskRow
								key={task._id}
								onStatusPress={onStatusPress}
								task={task}
							/>
						))}
					{expanded && tasks.length === 0 ? (
						<Text className="border-border border-t px-4 py-3 font-sans text-muted-foreground text-sm">
							No tasks in this stage.
						</Text>
					) : null}
				</Card>
			</Animated.View>
		);
	}
);

StageCard.displayName = 'StageCard';
