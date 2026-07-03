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
import { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList } from 'react-native';
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

export default function ScheduleScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
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
	const [target, setTarget] = useState<StatusTarget | null>(null);
	const sheetRef = useRef<BottomSheetModal>(null);

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
			<FlatList
				contentContainerClassName="pt-1 pb-6"
				data={stages}
				keyExtractor={(item) => item._id}
				ListEmptyComponent={
					<EmptyState
						description="Apply a schedule template to this project in the web portal."
						icon={CalendarX}
						title="No schedule yet"
					/>
				}
				renderItem={({ item, index }) => (
					<StageCard
						expanded={expandedStages.has(item._id)}
						index={index}
						onStatusPress={openStatusSheet}
						onToggle={() => toggleStage(item._id)}
						stage={item}
						tasks={tasksByStage.get(item._id) ?? []}
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
