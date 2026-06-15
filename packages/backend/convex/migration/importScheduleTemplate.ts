import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { internalMutation } from '../_generated/server';
import { buildScheduleTemplateSearchText } from '../lib/buildSearchText';

const dependencyTypeValidator = v.optional(
	v.union(v.literal('startAfter'), v.literal('startWith'))
);

export const importScheduleTemplate = internalMutation({
	args: {
		name: v.string(),
		description: v.optional(v.string()),
		stages: v.array(
			v.object({
				devId: v.string(),
				name: v.string(),
				order: v.number(),
				dependencyStageDevId: v.optional(v.string()),
				dependencyType: dependencyTypeValidator,
				offsetDays: v.optional(v.number()),
			})
		),
		tasks: v.array(
			v.object({
				devId: v.string(),
				devStageId: v.string(),
				name: v.string(),
				durationDays: v.number(),
				order: v.number(),
				dependencyTaskDevId: v.optional(v.string()),
				dependencyType: dependencyTypeValidator,
				offsetDays: v.optional(v.number()),
			})
		),
	},
	handler: async (ctx, args) => {
		const searchText = buildScheduleTemplateSearchText(
			args.name,
			args.description
		);
		const templateId = await ctx.db.insert('scheduleTemplates', {
			name: args.name,
			description: args.description,
			searchText,
		});

		// Insert stages in ascending order, building devId → prodId map
		const stageIdMap = new Map<string, Id<'scheduleStages'>>();
		const sortedStages = [...args.stages].sort((a, b) => a.order - b.order);

		for (const stage of sortedStages) {
			const depStageId = stage.dependencyStageDevId
				? stageIdMap.get(stage.dependencyStageDevId)
				: undefined;

			const stageId = await ctx.db.insert('scheduleStages', {
				scheduleTemplateId: templateId,
				name: stage.name,
				order: stage.order,
				dependencyStageId: depStageId,
				dependencyType: depStageId
					? (stage.dependencyType ?? 'startAfter')
					: undefined,
				offsetDays: stage.offsetDays ?? 0,
			});
			stageIdMap.set(stage.devId, stageId);
		}

		// Insert tasks per stage in ascending order, building devId → prodId map
		const taskIdMap = new Map<string, Id<'scheduleTasks'>>();

		for (const stage of sortedStages) {
			const prodStageId = stageIdMap.get(stage.devId);
			if (!prodStageId) {
				continue;
			}

			const stageTasks = args.tasks
				.filter((t) => t.devStageId === stage.devId)
				.sort((a, b) => a.order - b.order);

			for (const task of stageTasks) {
				const depTaskId = task.dependencyTaskDevId
					? taskIdMap.get(task.dependencyTaskDevId)
					: undefined;

				const taskId = await ctx.db.insert('scheduleTasks', {
					scheduleTemplateId: templateId,
					stageId: prodStageId,
					name: task.name,
					durationDays: task.durationDays,
					order: task.order,
					dependencyTaskId: depTaskId,
					dependencyType: depTaskId
						? (task.dependencyType ?? 'startAfter')
						: undefined,
					offsetDays: task.offsetDays ?? 0,
				});
				taskIdMap.set(task.devId, taskId);
			}
		}

		return templateId;
	},
});
