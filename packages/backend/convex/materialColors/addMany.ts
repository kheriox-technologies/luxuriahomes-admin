import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { mutation } from '../_generated/server';
import { buildMaterialColorSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { parseMaterialColorName } from './shared';

export const addMany = mutation({
	args: {
		names: v.array(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const ids: Id<'materialColors'>[] = [];
		for (const raw of args.names) {
			const name = parseMaterialColorName(raw);
			const searchText = buildMaterialColorSearchText(name);
			ids.push(await ctx.db.insert('materialColors', { name, searchText }));
		}
		return ids;
	},
});
