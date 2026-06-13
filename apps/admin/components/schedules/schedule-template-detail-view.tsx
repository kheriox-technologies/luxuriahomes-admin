'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { useQuery } from 'convex/react';
import { useMemo } from 'react';
import PageHeading from '@/components/page-heading';
import AddStage from './add-stage';
import GanttPanel from './gantt-panel';
import { computeLayouts } from './schedule-dependency-algorithm';

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

	const projectDuration = useMemo(() => {
		let max = 0;
		for (const [, layout] of stageLayouts) {
			if (layout.endOffset + 1 > max) {
				max = layout.endOffset + 1;
			}
		}
		return max;
	}, [stageLayouts]);

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
		<div className="flex min-h-0 min-w-0 flex-1 flex-col">
			<PageHeading
				backLink="/schedules"
				heading={scheduleTemplate.name}
				headingActions={
					<AddStage
						scheduleTemplateId={scheduleTemplateId}
						stages={stages ?? []}
					/>
				}
				metaSlot={
					projectDuration > 0 ? (
						<Badge size="lg" variant="outline">
							{projectDuration} Days
						</Badge>
					) : null
				}
			/>
			<div className="flex min-h-0 flex-1 overflow-hidden rounded-lg border">
				<GanttPanel
					scheduleTemplateId={scheduleTemplateId}
					stageLayouts={stageLayouts}
					stages={stages ?? []}
					taskLayouts={taskLayouts}
					tasks={tasks ?? []}
				/>
			</div>
		</div>
	);
}
