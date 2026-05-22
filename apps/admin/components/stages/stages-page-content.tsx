'use client';

import { api } from '@workspace/backend/api';
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
import { Tabs, TabsList, TabsTab } from '@workspace/ui/components/tabs';
import { useQuery } from 'convex/react';
import { Layers, SearchIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddStage from '@/components/stages/add-stage';
import {
	computeAllPositions,
	type StageWithTasks,
} from '@/components/stages/gantt-utils';
import StageRow from '@/components/stages/stage-row';
import TaskRow from '@/components/stages/task-row';

const GanttChart = dynamic(() => import('@/components/stages/gantt-chart'), {
	ssr: false,
	loading: () => null,
});

type ViewMode = 'Day' | 'Week' | 'Month';
const VIEW_MODES: ViewMode[] = ['Day', 'Week', 'Month'];

// Must match frappe-gantt defaults: lower_header_height(30) + upper_header_height(45) + 10
const GANTT_HEADER_HEIGHT = 85;

export default function StagesPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [viewMode, setViewMode] = useState<ViewMode>('Day');
	const trimmedSearch = debouncedSearch.trim();

	const leftPanelRef = useRef<HTMLDivElement>(null);
	const ganttWrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	// Sync vertical scroll between left panel and frappe-gantt's container.
	// Uses MutationObserver so it re-attaches when the gantt is recreated.
	useEffect(() => {
		const leftPanel = leftPanelRef.current;
		const ganttWrapper = ganttWrapperRef.current;
		if (!(leftPanel && ganttWrapper)) {
			return;
		}

		const isSyncing = { v: false };
		let activeContainer: HTMLElement | null = null;
		let detachFn: (() => void) | null = null;

		const detach = () => {
			detachFn?.();
			detachFn = null;
			activeContainer = null;
		};

		const reattach = () => {
			const found = ganttWrapper.querySelector<HTMLElement>('.gantt-container');
			if (!found || found === activeContainer) {
				return;
			}

			detach();
			activeContainer = found;

			const onLeft = () => {
				if (isSyncing.v || !activeContainer) {
					return;
				}
				isSyncing.v = true;
				activeContainer.scrollTop = leftPanel.scrollTop;
				requestAnimationFrame(() => {
					isSyncing.v = false;
				});
			};
			const onRight = () => {
				if (isSyncing.v) {
					return;
				}
				isSyncing.v = true;
				leftPanel.scrollTop = activeContainer?.scrollTop ?? 0;
				requestAnimationFrame(() => {
					isSyncing.v = false;
				});
			};

			leftPanel.addEventListener('scroll', onLeft, { passive: true });
			activeContainer.addEventListener('scroll', onRight, { passive: true });

			detachFn = () => {
				leftPanel.removeEventListener('scroll', onLeft);
				activeContainer?.removeEventListener('scroll', onRight);
			};
		};

		reattach();
		const observer = new MutationObserver(reattach);
		observer.observe(ganttWrapper, { childList: true, subtree: true });

		return () => {
			observer.disconnect();
			detach();
		};
	}, []);

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

	const { stagePositions, taskPositions } = useMemo(
		() => computeAllPositions(stagesWithTasks),
		[stagesWithTasks]
	);

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
				<div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
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
					<Tabs
						className="flex-row"
						onValueChange={(v) => setViewMode(v as ViewMode)}
						value={viewMode}
					>
						<TabsList>
							{VIEW_MODES.map((mode) => (
								<TabsTab key={mode} value={mode}>
									{mode}
								</TabsTab>
							))}
						</TabsList>
					</Tabs>
					<AddStage />
				</div>
			</div>

			<div className="flex min-h-0 flex-1">
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
					<div className="flex min-h-0 w-full overflow-hidden rounded-lg border">
						<div
							className="w-64 shrink-0 overflow-y-auto border-r"
							ref={leftPanelRef}
						>
							<div
								className="sticky top-0 z-10 shrink-0 border-b bg-background"
								style={{ height: GANTT_HEADER_HEIGHT }}
							/>
							{stagesWithTasks.map(({ stage, tasks: stageTasks }) => (
								<div key={stage._id}>
									<StageRow allOrders={orders} stage={stage} />
									{stageTasks.map((task) => (
										<TaskRow allOrders={orders} key={task._id} task={task} />
									))}
								</div>
							))}
						</div>
						<div className="min-w-0 flex-1" ref={ganttWrapperRef}>
							<GanttChart
								stagePositions={stagePositions}
								stagesWithTasks={stagesWithTasks}
								taskPositions={taskPositions}
								viewMode={viewMode}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
