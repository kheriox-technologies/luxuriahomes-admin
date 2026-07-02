'use client';

import type { Doc, Id } from '@workspace/backend/dataModel';
import { useCallback, useMemo, useState } from 'react';
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
	const [collapsedStages, setCollapsedStages] = useState<Set<string>>(
		new Set()
	);

	const toggleCollapse = useCallback((stageId: string) => {
		setCollapsedStages((prev) => {
			const next = new Set(prev);
			if (next.has(stageId)) {
				next.delete(stageId);
			} else {
				next.add(stageId);
			}
			return next;
		});
	}, []);

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
					isCollapsed={collapsedStages.has(stage._id)}
					key={stage._id}
					onToggleCollapse={() => toggleCollapse(stage._id)}
					scheduleTemplateId={scheduleTemplateId}
					stage={stage}
					stageLayout={undefined}
					stages={stages}
					tasks={tasksByStage.get(stage._id) ?? []}
				/>
			))}
		</div>
	);
}
