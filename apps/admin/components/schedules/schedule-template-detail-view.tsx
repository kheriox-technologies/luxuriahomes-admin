'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { useQuery } from 'convex/react';
import { SearchIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddStage from './add-stage';
import AddTemplateToProject from './add-template-to-project';
import GanttPanel from './gantt-panel';
import {
	businessDayToCalendarOffset,
	MONDAY_ANCHOR,
} from './schedule-calendar-utils';
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

	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const { stageLayouts, taskLayouts } = useMemo(
		() => computeLayouts(stages ?? [], tasks ?? []),
		[stages, tasks]
	);

	const projectDuration = useMemo(() => {
		let minStart = Number.POSITIVE_INFINITY;
		let maxEnd = -1;
		for (const [, layout] of stageLayouts) {
			if (layout.startOffset < minStart) {
				minStart = layout.startOffset;
			}
			if (layout.endOffset > maxEnd) {
				maxEnd = layout.endOffset;
			}
		}
		if (maxEnd < 0) {
			return 0;
		}
		const start = Number.isFinite(minStart) ? minStart : 0;
		const calStart = businessDayToCalendarOffset(start, MONDAY_ANCHOR);
		const calEnd = businessDayToCalendarOffset(maxEnd, MONDAY_ANCHOR);
		return calEnd - calStart + 1;
	}, [stageLayouts]);

	const durationLabel = `${projectDuration} Days`;

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
				metaSlot={
					projectDuration > 0 ? (
						<Badge size="lg" variant="outline">
							{durationLabel}
						</Badge>
					) : null
				}
				rightSlot={
					<div className="flex items-center gap-2">
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
						<AddTemplateToProject
							scheduleTemplateId={scheduleTemplateId}
							stages={stages ?? []}
							tasks={tasks ?? []}
						/>
						<AddStage
							scheduleTemplateId={scheduleTemplateId}
							stages={stages ?? []}
						/>
					</div>
				}
			/>
			<div className="flex min-h-0 flex-1 overflow-hidden rounded-lg border">
				<GanttPanel
					scheduleTemplateId={scheduleTemplateId}
					search={debouncedSearch.trim()}
					stageLayouts={stageLayouts}
					stages={stages ?? []}
					taskLayouts={taskLayouts}
					tasks={tasks ?? []}
				/>
			</div>
		</div>
	);
}
