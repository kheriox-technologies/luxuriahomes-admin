import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildStageSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { parseDescription, parseStageName } from './shared';

export const add = mutation({
	args: {
		name: v.string(),
		description: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const name = parseStageName(args.name);
		const description = parseDescription(args.description);
		const searchText = buildStageSearchText(name, description);

		const allStages = await ctx.db.query('stages').collect();
		const displayOrder = allStages.length;

		return await ctx.db.insert('stages', {
			name,
			description,
			taskCount: 0,
			totalDuration: 0,
			displayOrder,
			dependsOn: [],
			searchText,
		});
	},
});
