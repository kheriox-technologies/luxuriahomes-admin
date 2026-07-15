import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
	ArrowLeft,
	CalendarClock,
	EllipsisVertical,
	Pencil,
	Trash2,
} from 'lucide-react-native';
import { useRef } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
	TaskFormSheet,
	type TaskFormSheetHandle,
} from '@/components/tasks/task-form-sheet';
import { TaskNotesSection } from '@/components/tasks/task-notes-section';
import { useThemeColors } from '@/components/theme';
import { ActionSheet } from '@/components/ui/action-sheet';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Select, type SelectOption } from '@/components/ui/select';
import { ListSkeleton } from '@/components/ui/skeleton';
import { type KanbanStatus, kanbanLabels } from '@/components/ui/status-pill';
import { formatDate } from '@/lib/format';

type Task = Doc<'tasks'>;

const STATUSES: KanbanStatus[] = ['planned', 'in_progress', 'blocked', 'done'];

const STATUS_OPTIONS: SelectOption<KanbanStatus>[] = STATUSES.map((status) => ({
	value: status,
	label: kanbanLabels[status],
}));

export default function TaskDetailsScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();
	const { taskId } = useLocalSearchParams<{ taskId: Id<'tasks'> }>();

	const task = useQuery(api.tasks.get.get, { taskId }) as Task | undefined;
	const projects = useQuery(api.projects.list.list, {});
	const admins = useQuery(api.adminUsers.list.list, {});
	const updateTask = useMutation(api.tasks.update.update);
	const removeTask = useMutation(api.tasks.remove.remove);

	const menuRef = useRef<BottomSheetModal>(null);
	const formRef = useRef<TaskFormSheetHandle>(null);

	const projectName = task?.projectId
		? projects?.find((project) => project._id === task.projectId)?.name
		: undefined;
	const assigneeName = task?.assigneeUserId
		? admins?.find(
				(admin: Doc<'adminUsers'>) => admin.userId === task.assigneeUserId
			)?.fullName
		: undefined;

	const overdue =
		task?.dueDate !== undefined &&
		task.dueDate < Date.now() &&
		task.status !== 'done';

	const changeStatus = (status: KanbanStatus) => {
		if (!task || task.status === status) {
			return;
		}
		// update() requires the full task payload; resend existing values with
		// only the new status. The backend re-slots the task into the new lane.
		updateTask({
			taskId: task._id,
			title: task.title,
			description: task.description,
			status,
			dueDate: task.dueDate,
			projectId: task.projectId,
			assigneeUserId: task.assigneeUserId,
		}).catch(() => {
			Alert.alert('Unable to update', 'Please try again.');
		});
	};

	const confirmDelete = () => {
		if (!task) {
			return;
		}
		Alert.alert(
			'Delete task',
			`Delete “${task.title}”? This also removes its notes.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						removeTask({ taskId: task._id })
							.then(() => router.back())
							.catch(() => {
								Alert.alert('Unable to delete', 'Please try again.');
							});
					},
				},
			]
		);
	};

	const menuItems = task
		? [
				{
					key: 'edit',
					label: 'Edit',
					icon: Pencil,
					onPress: () => {
						menuRef.current?.dismiss();
						formRef.current?.present(task);
					},
				},
				{
					key: 'delete',
					label: 'Delete',
					icon: Trash2,
					destructive: true,
					onPress: () => {
						menuRef.current?.dismiss();
						confirmDelete();
					},
				},
			]
		: [];

	return (
		<View className="flex-1 bg-background">
			<View
				className="flex-row items-center gap-3 bg-background px-4 pb-3"
				style={{ paddingTop: insets.top + 8 }}
			>
				<Pressable
					accessibilityLabel="Back"
					accessibilityRole="button"
					className="h-10 w-10 items-center justify-center rounded-lg border border-border bg-card"
					hitSlop={4}
					onPress={() => router.back()}
				>
					<ArrowLeft color={colors.foreground} size={20} strokeWidth={2} />
				</Pressable>
				<View className="flex-1">
					<Text
						className="font-sans-bold text-2xl text-foreground"
						numberOfLines={1}
					>
						{task?.title ?? 'Task'}
					</Text>
					{projectName ? (
						<Text
							className="font-sans text-muted-foreground text-sm"
							numberOfLines={1}
						>
							{projectName}
						</Text>
					) : null}
				</View>
			</View>

			{task === undefined ? (
				<ListSkeleton />
			) : (
				<ScrollView
					contentContainerClassName="gap-4 px-4 pb-6"
					contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
				>
					<View className="flex-row items-center gap-2">
						<Select<KanbanStatus>
							className="flex-1"
							onChange={changeStatus}
							options={STATUS_OPTIONS}
							title="Update status"
							value={task.status as KanbanStatus}
						/>
						<Pressable
							accessibilityLabel="Task actions"
							accessibilityRole="button"
							className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
							hitSlop={4}
							onPress={() => menuRef.current?.present()}
						>
							<EllipsisVertical
								color={colors.foreground}
								size={18}
								strokeWidth={2}
							/>
						</Pressable>
					</View>

					<Card className="gap-3 p-3.5">
						<Text className="font-sans-semibold text-base text-foreground">
							Details
						</Text>
						{task.description ? (
							<Text className="font-sans text-foreground text-sm">
								{task.description}
							</Text>
						) : (
							<Text className="font-sans text-muted-foreground text-sm">
								No description.
							</Text>
						)}
						<View className="flex-row items-center gap-2">
							{task.dueDate ? (
								<View className="flex-row items-center gap-1.5">
									<CalendarClock
										color={
											overdue ? colors.destructive : colors.mutedForeground
										}
										size={14}
										strokeWidth={2}
									/>
									<Text
										className={
											overdue
												? 'font-sans-medium text-destructive text-sm'
												: 'font-sans text-muted-foreground text-sm'
										}
									>
										{formatDate(task.dueDate)}
									</Text>
								</View>
							) : (
								<Text className="font-sans text-muted-foreground text-sm">
									No due date
								</Text>
							)}
							<View className="flex-1" />
							{assigneeName ? (
								<View className="flex-row items-center gap-2">
									<Avatar name={assigneeName} size="sm" variant="outline" />
									<Text className="font-sans text-foreground text-sm">
										{assigneeName}
									</Text>
								</View>
							) : (
								<Text className="font-sans text-muted-foreground text-sm">
									Unassigned
								</Text>
							)}
						</View>
					</Card>

					<Card className="p-3.5">
						<TaskNotesSection taskId={task._id} />
					</Card>
				</ScrollView>
			)}

			{task ? (
				<>
					<ActionSheet items={menuItems} ref={menuRef} title="Task actions" />
					<TaskFormSheet ref={formRef} />
				</>
			) : null}
		</View>
	);
}
