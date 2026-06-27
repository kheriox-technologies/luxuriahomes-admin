import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { mutation } from '../_generated/server';
import { buildTakeoffCategorySearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { parseTakeoffCategoryName } from './shared';

export const addMany = mutation({
	args: {
		names: v.array(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const ids: Id<'takeoffCategories'>[] = [];
		for (const raw of args.names) {
			const name = parseTakeoffCategoryName(raw);
			const searchText = buildTakeoffCategorySearchText(name);
			ids.push(await ctx.db.insert('takeoffCategories', { name, searchText }));
		}
		return ids;
	},
});
