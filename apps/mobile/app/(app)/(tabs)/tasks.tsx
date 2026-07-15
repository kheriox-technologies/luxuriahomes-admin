import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import {
	ArrowRightCircle,
	CalendarClock,
	Plus,
	SquareKanban,
} from 'lucide-react-native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { NotificationBell } from '@/components/notifications/notification-bell';
import { ScreenHeader } from '@/components/screen-header';
import {
	TaskFormSheet,
	type TaskFormSheetHandle,
} from '@/components/tasks/task-form-sheet';
import { useThemeColors } from '@/components/theme';
import {
	ActionSheet,
	type ActionSheetItem,
} from '@/components/ui/action-sheet';
import { Avatar } from '@/components/ui/avatar';
import { PressableCard } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchBar } from '@/components/ui/search-bar';
import { Select, type SelectOption } from '@/components/ui/select';
import { ListSkeleton } from '@/components/ui/skeleton';
import { type KanbanStatus, kanbanLabels } from '@/components/ui/status-pill';
import { formatDate } from '@/lib/format';

type Task = Doc<'tasks'>;

const STATUSES: KanbanStatus[] = ['planned', 'in_progress', 'blocked', 'done'];

const ALL = 'all';

export default function TasksScreen() {
	const tasks = useQuery(api.tasks.list.list, {});
	const projects = useQuery(api.projects.list.list, {});
	const admins = useQuery(api.adminUsers.list.list, {});
	const updateStatus = useMutation(api.tasks.updateStatus.updateStatus);

	const [search, setSearch] = useState('');
	const [projectId, setProjectId] = useState<string>(ALL);
	const [assigneeId, setAssigneeId] = useState<string>(ALL);
	const [status, setStatus] = useState<KanbanStatus>('planned');
	const [target, setTarget] = useState<Task | null>(null);
	const sheetRef = useRef<BottomSheetModal>(null);
	const formRef = useRef<TaskFormSheetHandle>(null);
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

	const countByStatus = useMemo(() => {
		const counts = new Map<KanbanStatus, number>();
		for (const s of STATUSES) {
			counts.set(s, 0);
		}
		for (const task of tasks ?? []) {
			const key = task.status as KanbanStatus;
			counts.set(key, (counts.get(key) ?? 0) + 1);
		}
		return counts;
	}, [tasks]);

	const projectOptions = useMemo<SelectOption<string>[]>(
		() => [
			{ value: ALL, label: 'All projects' },
			...(projects ?? []).map((project) => ({
				value: project._id,
				label: project.name,
			})),
		],
		[projects]
	);

	const assigneeOptions = useMemo<SelectOption<string>[]>(
		() => [
			{ value: ALL, label: 'All assignees' },
			...(admins ?? []).map((admin: Doc<'adminUsers'>) => ({
				value: admin.userId,
				label: admin.fullName,
			})),
		],
		[admins]
	);

	const statusOptions = useMemo<SelectOption<KanbanStatus>[]>(
		() =>
			STATUSES.map((s) => ({
				value: s,
				label: `${kanbanLabels[s]} · ${countByStatus.get(s) ?? 0}`,
			})),
		[countByStatus]
	);

	const filtered = useMemo(() => {
		const term = search.trim().toLowerCase();
		return (tasks ?? [])
			.filter((task) => {
				if (task.status !== status) {
					return false;
				}
				if (projectId !== ALL && task.projectId !== projectId) {
					return false;
				}
				if (assigneeId !== ALL && task.assigneeUserId !== assigneeId) {
					return false;
				}
				if (term && !task.searchText.toLowerCase().includes(term)) {
					return false;
				}
				return true;
			})
			.sort((a, b) => a.order - b.order);
	}, [tasks, status, projectId, assigneeId, search]);

	const moveTask = useCallback(
		(task: Task, next: KanbanStatus) => {
			const lane = (tasks ?? [])
				.filter((t) => t.status === next)
				.sort((a, b) => a.order - b.order);
			// Append to the end of the target lane, matching the portal's
			// fractional ordering convention (last.order + 1, or 1 when empty).
			const last = lane.at(-1);
			updateStatus({
				taskId: task._id,
				status: next,
				order: last ? last.order + 1 : 1,
			});
		},
		[tasks, updateStatus]
	);

	const sheetItems: ActionSheetItem[] = useMemo(() => {
		if (!target) {
			return [];
		}
		return STATUSES.filter((s) => s !== target.status).map((s) => ({
			key: s,
			label: `Move to ${kanbanLabels[s]}`,
			icon: ArrowRightCircle,
			onPress: () => {
				sheetRef.current?.dismiss();
				moveTask(target, s);
			},
		}));
	}, [target, moveTask]);

	const now = Date.now();
	const isFiltering =
		search.trim() !== '' || projectId !== ALL || assigneeId !== ALL;

	return (
		<View className="flex-1 bg-background">
			<ScreenHeader
				rightSlot={<NotificationBell />}
				subtitle={tasks ? `${tasks.length} tasks` : undefined}
				title="Tasks"
			/>

			<View className="flex-row items-center gap-2 px-4 pb-3">
				<View className="flex-1">
					<SearchBar
						onChangeText={setSearch}
						placeholder="Search tasks"
						value={search}
					/>
				</View>
				<Pressable
					accessibilityLabel="Add task"
					accessibilityRole="button"
					className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
					hitSlop={4}
					onPress={() => formRef.current?.present()}
				>
					<Plus color={colors.foreground} size={18} strokeWidth={2} />
				</Pressable>
			</View>

			<View className="flex-row items-center gap-2 px-4 pb-3">
				<Select
					className="flex-1"
					onChange={setProjectId}
					options={projectOptions}
					title="Filter by project"
					value={projectId}
				/>
				<Select
					className="flex-1"
					onChange={setAssigneeId}
					options={assigneeOptions}
					title="Filter by assignee"
					value={assigneeId}
				/>
				<Select
					className="flex-1"
					onChange={setStatus}
					options={statusOptions}
					title="Filter by status"
					value={status}
				/>
			</View>

			{tasks === undefined ? (
				<ListSkeleton />
			) : (
				<FlatList
					contentContainerClassName="pb-6"
					data={filtered}
					keyExtractor={(item) => item._id}
					ListEmptyComponent={
						<EmptyState
							description={
								isFiltering
									? 'Try a different search or filter.'
									: `No ${kanbanLabels[status].toLowerCase()} tasks.`
							}
							icon={SquareKanban}
							title={isFiltering ? 'No matching tasks' : 'Nothing here'}
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

			<TaskFormSheet ref={formRef} />
		</View>
	);
}
