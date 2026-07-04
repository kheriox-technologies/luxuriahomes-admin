import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import {
	CalendarX,
	CheckCircle2,
	CircleDashed,
	CirclePlay,
} from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
	FlatList,
	type StyleProp,
	View,
	type ViewProps,
	type ViewStyle,
} from 'react-native';
import {
	computeScheduleSpan,
	ScheduleToolbar,
} from '@/components/schedule/schedule-toolbar';
import {
	StageCard,
	type StatusTarget,
	type Task,
} from '@/components/schedule/stage-card';
import {
	ActionSheet,
	type ActionSheetItem,
} from '@/components/ui/action-sheet';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchBar } from '@/components/ui/search-bar';
import { ListSkeleton } from '@/components/ui/skeleton';
import type { ScheduleStatus } from '@/components/ui/status-pill';

const STATUS_OPTIONS: {
	status: ScheduleStatus;
	icon: typeof CircleDashed;
}[] = [
	{ status: 'Pending', icon: CircleDashed },
	{ status: 'In Progress', icon: CirclePlay },
	{ status: 'Complete', icon: CheckCircle2 },
];

// Earlier cells get a higher zIndex so an expanding stage paints on top of the
// following card during the layout transition (otherwise its newly revealed
// rows are drawn behind the next stage).
function ScheduleCell({
	index,
	children,
	style,
	onLayout,
}: {
	index: number;
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
	onLayout?: ViewProps['onLayout'];
}) {
	return (
		<View onLayout={onLayout} style={[style, { zIndex: 10_000 - index }]}>
			{children}
		</View>
	);
}

export default function ScheduleScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	const project = useQuery(api.projects.get.get, {
		projectId: projectId as Id<'projects'>,
	});
	const stages = useQuery(api.projectStages.listByProject.listByProject, {
		projectId: projectId as Id<'projects'>,
	});
	const tasks = useQuery(api.projectTasks.listByProject.listByProject, {
		projectId: projectId as Id<'projects'>,
	});
	const updateStageStatus = useMutation(
		api.projectStages.updateStatus.updateStatus
	);
	const updateTaskStatus = useMutation(
		api.projectTasks.updateStatus.updateStatus
	);

	const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
	const [search, setSearch] = useState('');
	const [target, setTarget] = useState<StatusTarget | null>(null);
	const sheetRef = useRef<BottomSheetModal>(null);
	const listRef = useRef<FlatList>(null);

	const span = useMemo(
		() => computeScheduleSpan(project?.startDate, stages ?? [], tasks ?? []),
		[project, stages, tasks]
	);

	const tasksByStage = useMemo(() => {
		const map = new Map<string, Task[]>();
		if (!tasks) {
			return map;
		}
		for (const task of tasks) {
			const list = map.get(task.stageId) ?? [];
			list.push(task);
			map.set(task.stageId, list);
		}
		for (const list of map.values()) {
			list.sort((a, b) => a.order - b.order);
		}
		return map;
	}, [tasks]);

	// Filter stages/tasks by the search query. When a stage name matches, all its
	// tasks are shown; otherwise only matching tasks are shown and the stage is
	// force-expanded so the matches are visible. Mirrors the portal behavior.
	const { displayedStages, tasksByStageFiltered, forceExpandedStageIds } =
		useMemo(() => {
			const lowerSearch = search.trim().toLowerCase();
			if (!lowerSearch) {
				return {
					displayedStages: stages ?? [],
					tasksByStageFiltered: tasksByStage,
					forceExpandedStageIds: new Set<string>(),
				};
			}
			const matches = (name: string) =>
				name.toLowerCase().includes(lowerSearch);
			const filteredStages: NonNullable<typeof stages> = [];
			const filteredMap = new Map<string, Task[]>();
			const forceExpanded = new Set<string>();
			for (const stage of stages ?? []) {
				const allTasks = tasksByStage.get(stage._id) ?? [];
				const stageNameMatches = matches(stage.name);
				const matchingTasks = allTasks.filter((t) => matches(t.name));
				if (!stageNameMatches && matchingTasks.length === 0) {
					continue;
				}
				filteredStages.push(stage);
				filteredMap.set(stage._id, stageNameMatches ? allTasks : matchingTasks);
				if (matchingTasks.length > 0) {
					forceExpanded.add(stage._id);
				}
			}
			return {
				displayedStages: filteredStages,
				tasksByStageFiltered: filteredMap,
				forceExpandedStageIds: forceExpanded,
			};
		}, [search, stages, tasksByStage]);

	const toggleStage = useCallback((stageId: string) => {
		setExpandedStages((prev) => {
			const next = new Set(prev);
			if (next.has(stageId)) {
				next.delete(stageId);
			} else {
				next.add(stageId);
			}
			return next;
		});
	}, []);

	const expandAll = useCallback(() => {
		setExpandedStages(new Set((stages ?? []).map((stage) => stage._id)));
	}, [stages]);

	const collapseAll = useCallback(() => {
		setExpandedStages(new Set());
	}, []);

	const scrollToToday = useCallback(() => {
		if (!stages || stages.length === 0) {
			return;
		}
		const now = new Date();
		const todayMs = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate()
		).getTime();
		let index = stages.findIndex(
			(stage) => todayMs >= stage.startDate && todayMs <= stage.endDate
		);
		if (index === -1) {
			index = stages.findIndex((stage) => stage.startDate >= todayMs);
		}
		if (index === -1) {
			index = stages.length - 1;
		}
		const targetStage = stages[index];
		setExpandedStages((prev) => new Set(prev).add(targetStage._id));
		listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0 });
	}, [stages]);

	const openStatusSheet = useCallback((statusTarget: StatusTarget) => {
		setTarget(statusTarget);
		sheetRef.current?.present();
	}, []);

	const sheetItems: ActionSheetItem[] = useMemo(() => {
		if (!target) {
			return [];
		}
		return STATUS_OPTIONS.map(({ status, icon }) => ({
			key: status,
			label: status === target.status ? `${status} (current)` : status,
			icon,
			selected: status === target.status,
			onPress: () => {
				sheetRef.current?.dismiss();
				if (status === target.status) {
					return;
				}
				if (target.kind === 'stage') {
					updateStageStatus({
						stageId: target.id as Id<'projectStages'>,
						status,
					});
				} else {
					updateTaskStatus({
						taskId: target.id as Id<'projectTasks'>,
						status,
					});
				}
			},
		}));
	}, [target, updateStageStatus, updateTaskStatus]);

	if (stages === undefined || tasks === undefined) {
		return <ListSkeleton />;
	}

	return (
		<>
			{stages.length > 0 ? (
				<>
					<ScheduleToolbar
						days={span.days}
						endDate={span.end}
						onCollapseAll={collapseAll}
						onExpandAll={expandAll}
						onToday={scrollToToday}
						startDate={span.start}
					/>
					<View className="px-4 pt-3">
						<SearchBar
							onChangeText={setSearch}
							placeholder="Search stages or tasks"
							value={search}
						/>
					</View>
				</>
			) : null}
			<FlatList
				CellRendererComponent={ScheduleCell}
				contentContainerClassName="pt-4 pb-6"
				data={displayedStages}
				keyExtractor={(item) => item._id}
				ListEmptyComponent={
					search.trim().length > 0 ? (
						<EmptyState
							description="No stages or tasks match your search."
							icon={CalendarX}
							title="No results"
						/>
					) : (
						<EmptyState
							description="Apply a schedule template to this project in the web portal."
							icon={CalendarX}
							title="No schedule yet"
						/>
					)
				}
				onScrollToIndexFailed={({ index, averageItemLength }) => {
					listRef.current?.scrollToOffset({
						offset: index * averageItemLength,
						animated: true,
					});
					setTimeout(() => {
						listRef.current?.scrollToIndex({
							index,
							animated: true,
							viewPosition: 0,
						});
					}, 400);
				}}
				ref={listRef}
				renderItem={({ item, index }) => (
					<StageCard
						expanded={
							forceExpandedStageIds.has(item._id) ||
							expandedStages.has(item._id)
						}
						index={index}
						onStatusPress={openStatusSheet}
						onToggle={() => toggleStage(item._id)}
						stage={item}
						tasks={tasksByStageFiltered.get(item._id) ?? []}
					/>
				)}
			/>
			<ActionSheet
				items={sheetItems}
				onDismiss={() => setTarget(null)}
				ref={sheetRef}
				title={target ? `Set status — ${target.name}` : undefined}
			/>
		</>
	);
}
