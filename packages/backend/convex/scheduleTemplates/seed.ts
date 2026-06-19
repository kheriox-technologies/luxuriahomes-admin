import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { internalMutation } from '../_generated/server';

type DependencyType = 'startAfter' | 'startWith';

const DEPENDENCY_TYPES: DependencyType[] = ['startAfter', 'startWith'];

const STAGES: {
	name: string;
	tasks: { name: string; durationDays: number }[];
}[] = [
	{
		name: 'Site Preparation',
		tasks: [
			{ name: 'Site survey and marking', durationDays: 2 },
			{ name: 'Vegetation clearing', durationDays: 3 },
			{ name: 'Temporary fencing installation', durationDays: 1 },
			{ name: 'Erosion control setup', durationDays: 1 },
		],
	},
	{
		name: 'Earthworks & Excavation',
		tasks: [
			{ name: 'Bulk earthworks', durationDays: 5 },
			{ name: 'Foundation excavation', durationDays: 4 },
			{ name: 'Soil compaction testing', durationDays: 2 },
		],
	},
	{
		name: 'Footings & Foundations',
		tasks: [
			{ name: 'Set out and formwork', durationDays: 3 },
			{ name: 'Steel reinforcement placement', durationDays: 4 },
			{ name: 'Concrete pour — footings', durationDays: 2 },
			{ name: 'Concrete cure period', durationDays: 7 },
		],
	},
	{
		name: 'Concrete Slab',
		tasks: [
			{ name: 'Plumbing rough-in under slab', durationDays: 3 },
			{ name: 'Slab formwork and mesh', durationDays: 3 },
			{ name: 'Concrete pour — slab', durationDays: 1 },
			{ name: 'Slab cure and strip', durationDays: 7 },
		],
	},
	{
		name: 'Framing',
		tasks: [
			{ name: 'Wall frame fabrication', durationDays: 5 },
			{ name: 'Wall frame erection', durationDays: 4 },
			{ name: 'Roof truss delivery and install', durationDays: 3 },
			{ name: 'Frame inspection', durationDays: 1 },
		],
	},
	{
		name: 'Roofing',
		tasks: [
			{ name: 'Sarking and battens', durationDays: 2 },
			{ name: 'Roof tile / sheet installation', durationDays: 5 },
			{ name: 'Flashings and ridgecapping', durationDays: 2 },
			{ name: 'Gutters and downpipes', durationDays: 2 },
		],
	},
	{
		name: 'Rough-in Services',
		tasks: [
			{ name: 'Electrical rough-in', durationDays: 5 },
			{ name: 'Plumbing rough-in', durationDays: 5 },
			{ name: 'HVAC rough-in', durationDays: 3 },
			{ name: 'Services inspection', durationDays: 1 },
		],
	},
	{
		name: 'Insulation & Lining',
		tasks: [
			{ name: 'Wall and ceiling insulation', durationDays: 3 },
			{ name: 'Plasterboard supply and fix', durationDays: 6 },
			{ name: 'Cornice and set', durationDays: 4 },
		],
	},
	{
		name: 'Internal Fitout',
		tasks: [
			{ name: 'Painting — first and second coats', durationDays: 8 },
			{ name: 'Kitchen and cabinetry install', durationDays: 5 },
			{ name: 'Flooring installation', durationDays: 5 },
			{ name: 'Doors, architraves and skirting', durationDays: 3 },
			{ name: 'Tiling — wet areas', durationDays: 5 },
		],
	},
	{
		name: 'Completion & Handover',
		tasks: [
			{ name: 'Final electrical fit-off', durationDays: 3 },
			{ name: 'Final plumbing fit-off', durationDays: 3 },
			{ name: 'Final painting touch-ups', durationDays: 2 },
			{ name: 'Deep clean', durationDays: 1 },
			{ name: 'Practical completion inspection', durationDays: 1 },
		],
	},
];

function pickRandom<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)] as T;
}

function maybePickDependency<T>(pool: T[]): T | undefined {
	if (pool.length === 0) {
		return undefined;
	}
	// ~60% chance of having a dependency
	if (Math.random() < 0.4) {
		return undefined;
	}
	return pickRandom(pool);
}

export const populate = internalMutation({
	args: {
		scheduleTemplateId: v.id('scheduleTemplates'),
	},
	handler: async (ctx, { scheduleTemplateId }) => {
		const stageIds: Id<'scheduleStages'>[] = [];
		let totalTasks = 0;

		for (let i = 0; i < STAGES.length; i++) {
			const stage = STAGES[i];
			if (!stage) {
				continue;
			}

			const dependencyStageId = maybePickDependency(stageIds);
			const dependencyType = dependencyStageId
				? pickRandom(DEPENDENCY_TYPES)
				: undefined;

			const stageId = await ctx.db.insert('scheduleStages', {
				scheduleTemplateId,
				name: stage.name,
				order: i + 1,
				...(dependencyStageId && { dependencyStageId, dependencyType }),
			});

			stageIds.push(stageId);

			const taskIds: Id<'scheduleTasks'>[] = [];

			for (let j = 0; j < stage.tasks.length; j++) {
				const task = stage.tasks[j];
				if (!task) {
					continue;
				}

				const dependencyTaskId = maybePickDependency(taskIds);
				const taskDependencyType = dependencyTaskId
					? pickRandom(DEPENDENCY_TYPES)
					: undefined;

				const taskId = await ctx.db.insert('scheduleTasks', {
					scheduleTemplateId,
					stageId,
					name: task.name,
					durationDays: task.durationDays,
					order: j + 1,
					...(dependencyTaskId && {
						dependencyTaskId,
						dependencyType: taskDependencyType,
					}),
				});

				taskIds.push(taskId);
				totalTasks++;
			}
		}

		return {
			inserted: true,
			stages: STAGES.length,
			tasks: totalTasks,
		};
	},
});
