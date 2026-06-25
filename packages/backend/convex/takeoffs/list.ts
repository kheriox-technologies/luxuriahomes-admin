import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const list = query({
	args: {
		projectId: v.id('projects'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const takeoffs = await ctx.db
			.query('takeoffs')
			.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
			.collect();
		return takeoffs
			.map((t) => ({ _id: t._id, name: t.name, documentId: t.documentId }))
			.sort((a, b) =>
				a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
			);
	},
});
