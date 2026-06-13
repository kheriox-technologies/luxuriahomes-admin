import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildScheduleTemplateSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { parseScheduleTemplateName } from './shared';

export const add = mutation({
	args: {
		name: v.string(),
		description: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const name = parseScheduleTemplateName(args.name);
		const description = args.description?.trim() || undefined;
		const searchText = buildScheduleTemplateSearchText(name, description);
		return await ctx.db.insert('scheduleTemplates', {
			name,
			description,
			searchText,
		});
	},
});
