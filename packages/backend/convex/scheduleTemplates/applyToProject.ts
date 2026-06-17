import { ConvexError, v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { scheduleDependencyTypeValidator } from '../schema';

const stageInputValidator = v.object({
	templateStageId: v.string(),
	name: v.string(),
	order: v.number(),
	offsetDays: v.optional(v.number()),
	dependencyTemplateStageId: v.optional(v.string()),
	dependencyType: v.optional(scheduleDependencyTypeValidator),
	startDate: v.number(),
	endDate: v.number(),
});

const taskInputValidator = v.object({
	templateTaskId: v.string(),
	templateStageId: v.string(),
	name: v.string(),
	durationDays: v.number(),
	order: v.number(),
	offsetDays: v.optional(v.number()),
	dependencyTemplateTaskId: v.optional(v.string()),
	dependencyType: v.optional(scheduleDependencyTypeValidator),
	startDate: v.number(),
	endDate: v.number(),
});

const orderTaskInputValidator = v.object({
	templateOrderTaskId: v.string(),
	templateTaskId: v.string(),
	name: v.string(),
	durationDays: v.number(),
});

export const applyToProject = mutation({
	args: {
		projectId: v.id('projects'),
		stages: v.array(stageInputValidator),
		tasks: v.array(taskInputValidator),
		orderTasks: v.optional(v.array(orderTaskInputValidator)),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		const project = await ctx.db.get(args.projectId);
		if (!project) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Project not found',
			});
		}

		// Insert stages first, building a template → project ID map
		const stageIdMap = new Map<string, string>();
		for (const stage of args.stages) {
			const projectStageId = await ctx.db.insert('projectStages', {
				projectId: args.projectId,
				name: stage.name,
				order: stage.order,
				offsetDays: stage.offsetDays ?? 0,
				dependencyStageId: undefined, // set in second pass
				dependencyType: undefined,
				startDate: stage.startDate,
				endDate: stage.endDate,
				status: 'Pending',
			});
			stageIdMap.set(stage.templateStageId, projectStageId);
		}

		// Second pass: update stage dependencies using mapped IDs
		for (const stage of args.stages) {
			if (stage.dependencyTemplateStageId) {
				const projectStageId = stageIdMap.get(stage.templateStageId);
				const depProjectStageId = stageIdMap.get(
					stage.dependencyTemplateStageId
				);
				if (projectStageId && depProjectStageId) {
					await ctx.db.patch(projectStageId as Id<'projectStages'>, {
						dependencyStageId: depProjectStageId as Id<'projectStages'>,
						dependencyType: stage.dependencyType ?? 'startAfter',
					});
				}
			}
		}

		// Insert tasks, building a template → project ID map
		const taskIdMap = new Map<string, string>();
		for (const task of args.tasks) {
			const projectStageId = stageIdMap.get(task.templateStageId);
			if (!projectStageId) {
				throw new ConvexError({
					code: 'INVALID_STAGE',
					message: `No project stage found for template stage ${task.templateStageId}`,
				});
			}
			const projectTaskId = await ctx.db.insert('projectTasks', {
				projectId: args.projectId,
				stageId: projectStageId as Id<'projectStages'>,
				name: task.name,
				durationDays: task.durationDays,
				order: task.order,
				offsetDays: task.offsetDays ?? 0,
				dependencyTaskId: undefined,
				dependencyType: undefined,
				startDate: task.startDate,
				endDate: task.endDate,
				status: 'Pending',
			});
			taskIdMap.set(task.templateTaskId, projectTaskId);
		}

		// Second pass: update task dependencies using mapped IDs
		for (const task of args.tasks) {
			if (task.dependencyTemplateTaskId) {
				const projectTaskId = taskIdMap.get(task.templateTaskId);
				const depProjectTaskId = taskIdMap.get(task.dependencyTemplateTaskId);
				if (projectTaskId && depProjectTaskId) {
					await ctx.db.patch(projectTaskId as Id<'projectTasks'>, {
						dependencyTaskId: depProjectTaskId as Id<'projectTasks'>,
						dependencyType: task.dependencyType ?? 'startAfter',
					});
				}
			}
		}

		// Insert order tasks using the task ID map
		for (const ot of args.orderTasks ?? []) {
			const projectTaskId = taskIdMap.get(ot.templateTaskId);
			if (!projectTaskId) {
				continue;
			}
			const projectTask = await ctx.db.get(projectTaskId as Id<'projectTasks'>);
			if (!projectTask) {
				continue;
			}
			await ctx.db.insert('projectOrderTasks', {
				projectId: args.projectId,
				stageId: projectTask.stageId,
				parentTaskId: projectTaskId as Id<'projectTasks'>,
				name: ot.name,
				durationDays: ot.durationDays,
			});
		}
	},
});
