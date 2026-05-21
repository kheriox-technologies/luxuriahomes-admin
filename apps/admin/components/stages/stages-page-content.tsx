'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { useQuery } from 'convex/react';
import { Layers, SearchIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddStage from '@/components/stages/add-stage';
import GanttTable from '@/components/stages/gantt-table';
import {
	computeStagePositions,
	computeTaskPositions,
	type StageWithTasks,
	type TaskPosition,
} from '@/components/stages/gantt-utils';

export default function StagesPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const stages = useQuery(api.stages.list.list, {});
	const tasks = useQuery(api.tasks.listAll.listAll, {});
	const orders = useQuery(api.orders.list.list, {});

	const filteredStages = useMemo(() => {
		if (!stages) {
			return stages;
		}
		if (!trimmedSearch) {
			return stages;
		}
		const q = trimmedSearch.toLowerCase();
		return stages.filter((s) => s.name.toLowerCase().includes(q));
	}, [stages, trimmedSearch]);

	const tasksByStage = useMemo(() => {
		const map = new Map<string, NonNullable<typeof tasks>>();
		for (const task of tasks ?? []) {
			const existing = map.get(task.stageId) ?? [];
			map.set(task.stageId, [...existing, task]);
		}
		return map;
	}, [tasks]);

	const stagesWithTasks = useMemo<StageWithTasks[]>(() => {
		if (!filteredStages) {
			return [];
		}
		return filteredStages.map((stage) => ({
			stage,
			tasks: (tasksByStage.get(stage._id) ?? []).sort(
				(a, b) => a.displayOrder - b.displayOrder
			),
		}));
	}, [filteredStages, tasksByStage]);

	const stagePositions = useMemo(() => {
		if (!filteredStages) {
			return new Map();
		}
		return computeStagePositions(filteredStages);
	}, [filteredStages]);

	const taskPositions = useMemo(() => {
		const allPositions = new Map<Id<'tasks'>, TaskPosition>();
		for (const { stage, tasks: stageTasks } of stagesWithTasks) {
			const stagePos = stagePositions.get(stage._id);
			const startDay = stagePos?.startDay ?? 0;
			const positions = computeTaskPositions(stageTasks, startDay);
			for (const [taskId, pos] of positions) {
				allPositions.set(taskId, pos);
			}
		}
		return allPositions;
	}, [stagesWithTasks, stagePositions]);

	if (stages === undefined || tasks === undefined || orders === undefined) {
		return (
			<div className="flex h-full min-h-0 w-full flex-col">
				<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<PageHeading heading="Stages" icon={Layers} />
				</div>
				<div className="text-muted-foreground text-sm">Loading stages…</div>
			</div>
		);
	}

	return (
		<div className="flex h-full min-h-0 w-full flex-col">
			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<PageHeading heading="Stages" icon={Layers} />
				<div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
					<InputGroup className="w-full sm:w-64">
						<InputGroupAddon>
							<InputGroupText>
								<SearchIcon className="size-4" />
							</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search stages…"
							value={search}
						/>
					</InputGroup>
					<AddStage />
				</div>
			</div>

			<div className="flex min-h-0 flex-1 flex-col">
				{stagesWithTasks.length === 0 ? (
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<Layers aria-hidden />
							</EmptyMedia>
							<EmptyTitle>
								{trimmedSearch !== '' ? 'No matching stages' : 'No stages yet'}
							</EmptyTitle>
							<EmptyDescription>
								{trimmedSearch !== ''
									? 'Try a different search term.'
									: 'Create your first stage using the Add Stage button.'}
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				) : (
					<GanttTable
						allOrders={orders}
						stagePositions={stagePositions}
						stagesWithTasks={stagesWithTasks}
						taskPositions={taskPositions}
					/>
				)}
			</div>
		</div>
	);
}
