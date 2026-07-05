import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import {
	ArrowRightCircle,
	CalendarClock,
	SquareKanban,
} from 'lucide-react-native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { NotificationBell } from '@/components/notifications/notification-bell';
import { ScreenHeader } from '@/components/screen-header';
import { useThemeColors } from '@/components/theme';
import {
	ActionSheet,
	type ActionSheetItem,
} from '@/components/ui/action-sheet';
import { Avatar } from '@/components/ui/avatar';
import { PressableCard } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/skeleton';
import { type KanbanStatus, kanbanLabels } from '@/components/ui/status-pill';
import { formatDate } from '@/lib/format';

type Task = Doc<'tasks'>;

const STATUSES: KanbanStatus[] = ['planned', 'in_progress', 'blocked', 'done'];

export default function TasksScreen() {
	const tasks = useQuery(api.tasks.list.list, {});
	const projects = useQuery(api.projects.list.list, {});
	const admins = useQuery(api.adminUsers.list.list, {});
	const updateStatus = useMutation(api.tasks.updateStatus.updateStatus);

	const [activeStatus, setActiveStatus] = useState<KanbanStatus>('planned');
	const [target, setTarget] = useState<Task | null>(null);
	const sheetRef = useRef<BottomSheetModal>(null);
	const colors = useThemeColors();

	const projectNameById = useMemo(
		() =>
			new Map<string, string>(
				(projects ?? []).map((project) => [project._id, project.name])
			),
		[projects]
	);

	const adminNameById = useMemo(
		() =>
			new Map<string, string>(
				(admins ?? []).map((admin: Doc<'adminUsers'>) => [
					admin.userId,
					admin.fullName,
				])
			),
		[admins]
	);

	const tasksByStatus = useMemo(() => {
		const map = new Map<KanbanStatus, Task[]>();
		for (const status of STATUSES) {
			map.set(status, []);
		}
		for (const task of tasks ?? []) {
			map.get(task.status as KanbanStatus)?.push(task);
		}
		for (const list of map.values()) {
			list.sort((a, b) => a.order - b.order);
		}
		return map;
	}, [tasks]);

	const moveTask = useCallback(
		(task: Task, status: KanbanStatus) => {
			const lane = tasksByStatus.get(status) ?? [];
			// Append to the end of the target lane, matching the portal's
			// fractional ordering convention (last.order + 1, or 1 when empty).
			const last = lane.at(-1);
			updateStatus({
				taskId: task._id,
				status,
				order: last ? last.order + 1 : 1,
			});
		},
		[tasksByStatus, updateStatus]
	);

	const sheetItems: ActionSheetItem[] = useMemo(() => {
		if (!target) {
			return [];
		}
		return STATUSES.filter((status) => status !== target.status).map(
			(status) => ({
				key: status,
				label: `Move to ${kanbanLabels[status]}`,
				icon: ArrowRightCircle,
				onPress: () => {
					sheetRef.current?.dismiss();
					moveTask(target, status);
				},
			})
		);
	}, [target, moveTask]);

	const activeTasks = tasksByStatus.get(activeStatus) ?? [];
	const now = Date.now();

	return (
		<View className="flex-1 bg-background">
			<ScreenHeader
				rightSlot={<NotificationBell />}
				subtitle={tasks ? `${tasks.length} tasks` : undefined}
				title="Tasks"
			/>

			<View className="flex-row flex-wrap gap-2 px-4 pb-3">
				{STATUSES.map((status) => (
					<Chip
						key={status}
						label={`${kanbanLabels[status]} · ${tasksByStatus.get(status)?.length ?? 0}`}
						onPress={() => setActiveStatus(status)}
						selected={activeStatus === status}
					/>
				))}
			</View>

			{tasks === undefined ? (
				<ListSkeleton />
			) : (
				<FlatList
					contentContainerClassName="pb-6"
					data={activeTasks}
					keyExtractor={(item) => item._id}
					ListEmptyComponent={
						<EmptyState
							description={`No ${kanbanLabels[activeStatus].toLowerCase()} tasks.`}
							icon={SquareKanban}
							title="Nothing here"
						/>
					}
					renderItem={({ item }) => {
						const projectName = item.projectId
							? projectNameById.get(item.projectId)
							: undefined;
						const assigneeName = item.assigneeUserId
							? adminNameById.get(item.assigneeUserId)
							: undefined;
						const overdue =
							item.dueDate !== undefined &&
							item.dueDate < now &&
							item.status !== 'done';
						return (
							<PressableCard
								accessibilityLabel={`Task ${item.title}. Tap to move.`}
								className="mx-4 mb-2 gap-2 p-3.5"
								onPress={() => {
									setTarget(item);
									sheetRef.current?.present();
								}}
							>
								<Text className="font-sans-semibold text-foreground text-sm">
									{item.title}
								</Text>
								{item.description ? (
									<Text
										className="font-sans text-muted-foreground text-xs"
										numberOfLines={2}
									>
										{item.description}
									</Text>
								) : null}
								<View className="flex-row items-center gap-2">
									{projectName ? (
										<Text
											className="font-sans text-muted-foreground text-xs"
											numberOfLines={1}
										>
											{projectName}
										</Text>
									) : null}
									{item.dueDate ? (
										<View className="flex-row items-center gap-1">
											<CalendarClock
												color={
													overdue ? colors.destructive : colors.mutedForeground
												}
												size={12}
												strokeWidth={2}
											/>
											<Text
												className={
													overdue
														? 'font-sans-medium text-destructive text-xs'
														: 'font-sans text-muted-foreground text-xs'
												}
											>
												{formatDate(item.dueDate)}
											</Text>
										</View>
									) : null}
									<View className="flex-1" />
									{assigneeName ? (
										<Avatar name={assigneeName} size="sm" />
									) : null}
								</View>
							</PressableCard>
						);
					}}
				/>
			)}

			<ActionSheet
				items={sheetItems}
				onDismiss={() => setTarget(null)}
				ref={sheetRef}
				title={target ? target.title : undefined}
			/>
		</View>
	);
}
