import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildScheduleTemplateSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import {
	getScheduleTemplateOrThrow,
	parseScheduleTemplateName,
} from './shared';

export const update = mutation({
	args: {
		scheduleTemplateId: v.id('scheduleTemplates'),
		name: v.string(),
		description: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getScheduleTemplateOrThrow(ctx, args.scheduleTemplateId);
		const name = parseScheduleTemplateName(args.name);
		const description = args.description?.trim() || undefined;
		const searchText = buildScheduleTemplateSearchText(name, description);
		await ctx.db.patch(args.scheduleTemplateId, {
			name,
			description,
			searchText,
		});
		return args.scheduleTemplateId;
	},
});
