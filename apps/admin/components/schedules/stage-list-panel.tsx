'use client';

import type { Doc, Id } from '@workspace/backend/dataModel';
import { useMemo } from 'react';
import StageRow from './stage-row';

export default function StageListPanel({
	stages,
	tasks,
	scheduleTemplateId,
}: {
	stages: Doc<'scheduleStages'>[];
	tasks: Doc<'scheduleTasks'>[];
	scheduleTemplateId: Id<'scheduleTemplates'>;
}) {
	const tasksByStage = useMemo(() => {
		const map = new Map<string, Doc<'scheduleTasks'>[]>();
		for (const stage of stages) {
			map.set(stage._id, []);
		}
		for (const task of tasks) {
			const list = map.get(task.stageId);
			if (list) {
				list.push(task);
			}
		}
		return map;
	}, [stages, tasks]);

	if (stages.length === 0) {
		return (
			<div className="flex w-[280px] shrink-0 items-center justify-center border-r p-6">
				<p className="text-center text-muted-foreground text-sm">
					No stages yet. Add a stage to get started.
				</p>
			</div>
		);
	}

	return (
		<div className="w-[280px] shrink-0 overflow-y-auto border-r">
			{stages.map((stage) => (
				<StageRow
					key={stage._id}
					scheduleTemplateId={scheduleTemplateId}
					stage={stage}
					stages={stages}
					tasks={tasksByStage.get(stage._id) ?? []}
				/>
			))}
		</div>
	);
}
