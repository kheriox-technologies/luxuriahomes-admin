'use client';
'use no memo';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import {
	Select,
	SelectItem,
	SelectPopup,
	SelectTrigger,
	SelectValue,
} from '@workspace/ui/components/select';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import { LayoutDashboard } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import DashboardProjectColumn from '@/components/dashboard/dashboard-project-column';
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

	const overview = useQuery(
		api.dashboard.scheduleOverview.scheduleOverview,
		selectedIds.length > 0
			? {
					projectIds: selectedIds as Id<'projects'>[],
					rangeStart,
					rangeEnd,
				}
			: 'skip'
	);

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
							<SelectValue />
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

			<div className="min-h-0 flex-1">
				{selectedIds.length === 0 ? (
					<p className="py-12 text-center text-muted-foreground text-sm">
						Select one or more projects to see their schedule.
					</p>
				) : (
					<div className="grid h-full min-h-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
						{(overview ?? []).map((projectOverview) => (
							<DashboardProjectColumn
								key={projectOverview.projectId}
								overview={projectOverview}
								windowLabel={windowLabel}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
