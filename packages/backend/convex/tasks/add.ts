import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildTaskSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getStageOrThrow } from '../stages/shared';
import {
	nextDisplayOrderForStage,
	parseDescription,
	parseDuration,
	parseTaskName,
	syncStageCounters,
} from './shared';

export const add = mutation({
	args: {
		stageId: v.id('stages'),
		name: v.string(),
		description: v.optional(v.string()),
		duration: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getStageOrThrow(ctx, args.stageId);

		const name = parseTaskName(args.name);
		const description = parseDescription(args.description);
		const duration = parseDuration(args.duration);
		const displayOrder = await nextDisplayOrderForStage(ctx, args.stageId);
		const searchText = buildTaskSearchText(name, description);

		const taskId = await ctx.db.insert('tasks', {
			stageId: args.stageId,
			name,
			description,
			duration,
			displayOrder,
			dependsOn: [],
			searchText,
		});

		await syncStageCounters(ctx, args.stageId);
		return taskId;
	},
});
