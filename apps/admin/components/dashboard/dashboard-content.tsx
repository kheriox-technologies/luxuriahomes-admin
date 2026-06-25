'use client';
'use no memo';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { Frame, FrameHeader, FramePanel } from '@workspace/ui/components/frame';
import {
	Select,
	SelectItem,
	SelectPopup,
	SelectTrigger,
	SelectValue,
} from '@workspace/ui/components/select';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import { LayoutDashboard } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import DashboardProjectColumn from '@/components/dashboard/dashboard-project-column';
import {
	SCHEDULE_TYPE_META,
	SCHEDULE_TYPES,
} from '@/components/dashboard/schedule-type';
import PageHeading from '@/components/page-heading';
import TaskMultiSelectFilter from '@/components/tasks/task-multi-select-filter';

const MAX_PROJECTS = 5;
type WindowKey = '1week' | '2weeks' | '3weeks' | '1month' | '2months';

const WINDOW_OPTIONS: { value: WindowKey; label: string }[] = [
	{ value: '1week', label: 'Next 1 Week' },
	{ value: '2weeks', label: 'Next 2 Weeks' },
	{ value: '3weeks', label: 'Next 3 Weeks' },
	{ value: '1month', label: 'Next 1 Month' },
	{ value: '2months', label: 'Next 2 Months' },
];

function getWindowRange(windowKey: WindowKey) {
	const now = new Date();
	const start = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate()
	).getTime();
	const end = new Date(start);
	switch (windowKey) {
		case '1week':
			end.setDate(end.getDate() + 7);
			break;
		case '2weeks':
			end.setDate(end.getDate() + 14);
			break;
		case '3weeks':
			end.setDate(end.getDate() + 21);
			break;
		case '1month':
			end.setMonth(end.getMonth() + 1);
			break;
		case '2months':
			end.setMonth(end.getMonth() + 2);
			break;
		default:
			break;
	}
	return { rangeStart: start, rangeEnd: end.getTime() };
}

function ScheduleLegend() {
	return (
		<div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
			{SCHEDULE_TYPES.map((type) => {
				const meta = SCHEDULE_TYPE_META[type];
				const { Icon } = meta;
				return (
					<div
						className="flex items-center gap-1.5 text-muted-foreground text-xs"
						key={type}
					>
						<span
							aria-hidden
							className={cn('size-2 rounded-full', meta.accentClass)}
						/>
						<Icon aria-hidden className="size-3.5" />
						<span>{meta.label}</span>
					</div>
				);
			})}
		</div>
	);
}

function ColumnsSkeleton({ count }: { count: number }) {
	const placeholders = Array.from({ length: count }, (_, index) => index);
	return (
		<div className="grid h-full min-h-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
			{placeholders.map((key) => (
				<Frame className="flex h-full min-h-0 min-w-0 flex-col" key={key}>
					<FrameHeader className="flex-row items-center justify-between gap-2 py-3">
						<Skeleton className="h-4 w-28" />
						<Skeleton className="h-5 w-6 rounded-md" />
					</FrameHeader>
					<FramePanel className="flex min-h-24 flex-1 flex-col gap-2 p-3">
						{['a', 'b', 'c'].map((cardKey) => (
							<Skeleton className="h-24 w-full rounded-xl" key={cardKey} />
						))}
					</FramePanel>
				</Frame>
			))}
		</div>
	);
}

type ProjectOverview = NonNullable<
	ReturnType<typeof useScheduleOverview>
>[number];

function useScheduleOverview(
	args:
		| { projectIds: Id<'projects'>[]; rangeStart: number; rangeEnd: number }
		| 'skip'
) {
	return useQuery(api.dashboard.scheduleOverview.scheduleOverview, args);
}

function DashboardBody({
	hasSelection,
	isLoading,
	overview,
	selectionCount,
	windowLabel,
}: {
	hasSelection: boolean;
	isLoading: boolean;
	overview: ProjectOverview[] | undefined;
	selectionCount: number;
	windowLabel: string;
}) {
	if (!hasSelection) {
		return (
			<Empty className="h-full">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<LayoutDashboard aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No projects selected</EmptyTitle>
					<EmptyDescription>
						Select up to {MAX_PROJECTS} projects above to see their tasks, order
						tasks, and orders for the chosen time window.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	if (isLoading) {
		return <ColumnsSkeleton count={selectionCount} />;
	}

	return (
		<div className="grid h-full min-h-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
			{(overview ?? []).map((projectOverview) => (
				<DashboardProjectColumn
					key={projectOverview.projectId}
					overview={projectOverview}
					windowLabel={windowLabel}
				/>
			))}
		</div>
	);
}

export default function DashboardContent() {
	const projects = useQuery(api.projects.list.list, {});
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [windowKey, setWindowKey] = useState<WindowKey>('1week');
	const initializedRef = useRef(false);

	// Projects sorted by start date ascending (undefined start dates sort last).
	const sortedProjects = useMemo(() => {
		if (!projects) {
			return [];
		}
		return [...projects].sort((a, b) => {
			const aStart = a.startDate ?? Number.POSITIVE_INFINITY;
			const bStart = b.startDate ?? Number.POSITIVE_INFINITY;
			return aStart - bStart;
		});
	}, [projects]);

	const options = useMemo(
		() =>
			sortedProjects.map((project) => ({
				label: project.name,
				value: project._id,
			})),
		[sortedProjects]
	);

	// Auto-select the first 5 projects once, after they load.
	useEffect(() => {
		if (initializedRef.current || sortedProjects.length === 0) {
			return;
		}
		initializedRef.current = true;
		setSelectedIds(sortedProjects.slice(0, MAX_PROJECTS).map((p) => p._id));
	}, [sortedProjects]);

	const { rangeStart, rangeEnd } = useMemo(
		() => getWindowRange(windowKey),
		[windowKey]
	);

	const windowLabel = (
		WINDOW_OPTIONS.find((option) => option.value === windowKey)?.label ?? ''
	).toLowerCase();

	const overview = useScheduleOverview(
		selectedIds.length > 0
			? {
					projectIds: selectedIds as Id<'projects'>[],
					rangeStart,
					rangeEnd,
				}
			: 'skip'
	);

	const hasSelection = selectedIds.length > 0;
	const isLoading = hasSelection && overview === undefined;

	return (
		<div className={cn('flex h-full min-h-0 w-full flex-col')}>
			<div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
				<PageHeading
					className="mb-0"
					heading="Dashboard"
					icon={LayoutDashboard}
				/>
				<div className="flex w-full min-w-0 flex-col gap-2 lg:flex-1 lg:flex-row lg:items-center">
					<div className="w-full min-w-0 lg:flex-1">
						<TaskMultiSelectFilter
							id="dashboard-projects"
							maxSelected={MAX_PROJECTS}
							onChange={(next) => setSelectedIds(next.slice(0, MAX_PROJECTS))}
							options={options}
							placeholder="Select up to 5 projects…"
							value={selectedIds}
						/>
					</div>
					<Select
						onValueChange={(value) => setWindowKey(value as WindowKey)}
						value={windowKey}
					>
						<SelectTrigger className="w-40 shrink-0">
							<SelectValue>
								{(value) =>
									WINDOW_OPTIONS.find((option) => option.value === value)
										?.label ?? value
								}
							</SelectValue>
						</SelectTrigger>
						<SelectPopup>
							{WINDOW_OPTIONS.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectPopup>
					</Select>
				</div>
			</div>

			{hasSelection ? (
				<div className="mb-3 flex items-center justify-between gap-3 border-border/60 border-b pb-3">
					<p className="text-muted-foreground text-sm">
						Showing the schedule for the{' '}
						<span className="font-medium text-foreground">{windowLabel}</span>
					</p>
					<ScheduleLegend />
				</div>
			) : null}

			<div className="min-h-0 flex-1">
				<DashboardBody
					hasSelection={hasSelection}
					isLoading={isLoading}
					overview={overview}
					selectionCount={selectedIds.length}
					windowLabel={windowLabel}
				/>
			</div>
		</div>
	);
}
