'use client';

import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { useQuery } from 'convex/react';
import { Plus, SearchIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AddProjectStage from './add-project-stage';
import ProjectGanttPanel from './project-gantt-panel';
import { startOfDay } from './project-schedule-date-utils';

export default function ProjectScheduleTabContent({
	project,
}: {
	project: Doc<'projects'>;
}) {
	const projectId = project._id;
	const stages = useQuery(api.projectStages.listByProject.listByProject, {
		projectId,
	});
	const tasks = useQuery(api.projectTasks.listByProject.listByProject, {
		projectId,
	});

	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [addStageOpen, setAddStageOpen] = useState(false);

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const projectStartDate = useMemo(() => {
		if (project.startDate) {
			return project.startDate;
		}
		return startOfDay(new Date()).getTime();
	}, [project.startDate]);

	if (stages === undefined || tasks === undefined) {
		return (
			<div className="flex flex-1 items-center justify-center p-6">
				<p className="text-muted-foreground text-sm">Loading schedule…</p>
			</div>
		);
	}

	return (
		<div className="flex min-h-0 min-w-0 flex-1 flex-col">
			{/* Toolbar */}
			<div className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-2">
				<InputGroup className="w-48">
					<InputGroupAddon align="inline-start">
						<InputGroupText>
							<SearchIcon aria-hidden />
						</InputGroupText>
					</InputGroupAddon>
					<InputGroupInput
						aria-label="Search stages and tasks"
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search…"
						type="search"
						value={search}
					/>
				</InputGroup>
				<Button
					onClick={() => setAddStageOpen(true)}
					size="sm"
					type="button"
					variant="outline"
				>
					<Plus />
					Add Stage
				</Button>
			</div>

			<div className="flex min-h-0 flex-1 overflow-hidden">
				<ProjectGanttPanel
					projectId={projectId}
					projectStartDate={projectStartDate}
					search={debouncedSearch.trim()}
					stages={stages}
					tasks={tasks}
				/>
			</div>

			<AddProjectStage
				onOpenChange={setAddStageOpen}
				open={addStageOpen}
				projectId={projectId}
				projectStartDate={projectStartDate}
				stages={stages}
			/>
		</div>
	);
}
