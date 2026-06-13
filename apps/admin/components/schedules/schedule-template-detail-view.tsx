'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import { CalendarDays } from 'lucide-react';
import { useMemo } from 'react';
import PageHeading from '@/components/page-heading';
import AddStage from './add-stage';
import GanttPanel from './gantt-panel';
import { computeLayouts } from './schedule-dependency-algorithm';
import StageListPanel from './stage-list-panel';

export default function ScheduleTemplateDetailView({
	scheduleTemplateId,
}: {
	scheduleTemplateId: Id<'scheduleTemplates'>;
}) {
	const scheduleTemplate = useQuery(api.scheduleTemplates.get.get, {
		scheduleTemplateId,
	});
	const stages = useQuery(api.scheduleStages.listByTemplate.listByTemplate, {
		scheduleTemplateId,
	});
	const tasks = useQuery(api.scheduleTasks.listByTemplate.listByTemplate, {
		scheduleTemplateId,
	});

	const { stageLayouts, taskLayouts } = useMemo(
		() => computeLayouts(stages ?? [], tasks ?? []),
		[stages, tasks]
	);

	if (scheduleTemplate === undefined) {
		return <div className="text-muted-foreground text-sm">Loading…</div>;
	}

	if (scheduleTemplate === null) {
		return (
			<div className="text-muted-foreground text-sm">
				Schedule template not found.
			</div>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<PageHeading
				backLink="/schedules"
				description={scheduleTemplate.description}
				heading={scheduleTemplate.name}
				headingActions={
					<AddStage
						scheduleTemplateId={scheduleTemplateId}
						stages={stages ?? []}
					/>
				}
				icon={CalendarDays}
			/>
			<div className="flex min-h-0 flex-1 overflow-hidden rounded-lg border">
				<StageListPanel
					scheduleTemplateId={scheduleTemplateId}
					stages={stages ?? []}
					tasks={tasks ?? []}
				/>
				<GanttPanel
					stageLayouts={stageLayouts}
					stages={stages ?? []}
					taskLayouts={taskLayouts}
					tasks={tasks ?? []}
				/>
			</div>
		</div>
	);
}
