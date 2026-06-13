'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { useQuery } from 'convex/react';
import { useMemo, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddStage from './add-stage';
import GanttPanel, { type ViewMode } from './gantt-panel';
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

	const [viewMode, setViewMode] = useState<ViewMode>('days');

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

	const durationLabel = useMemo(() => {
		if (viewMode === 'weeks') {
			return `${Math.ceil(projectDuration / 7)} Weeks`;
		}
		if (viewMode === 'months') {
			return `${Math.ceil(projectDuration / 30)} Months`;
		}
		return `${projectDuration} Days`;
	}, [viewMode, projectDuration]);

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
							{durationLabel}
						</Badge>
					) : null
				}
			/>
			<div className="flex min-h-0 flex-1 overflow-hidden rounded-lg border">
				<GanttPanel
					onViewModeChange={setViewMode}
					scheduleTemplateId={scheduleTemplateId}
					stageLayouts={stageLayouts}
					stages={stages ?? []}
					taskLayouts={taskLayouts}
					tasks={tasks ?? []}
					viewMode={viewMode}
				/>
			</div>
		</div>
	);
}
