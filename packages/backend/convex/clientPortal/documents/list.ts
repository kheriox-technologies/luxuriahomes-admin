import { v } from 'convex/values';
import { query } from '../../_generated/server';
import { requireProjectClient } from '../../lib/clientAccess';

export const list = query({
	args: {
		projectId: v.id('projects'),
	},
	handler: async (ctx, args) => {
		await requireProjectClient(ctx, args.projectId);
		const documents = await ctx.db
			.query('projectDocuments')
			.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
			.collect();
		return documents
			.filter((doc) => doc.clientPortalVisible === true)
			.sort((a, b) => b.uploadedAt - a.uploadedAt);
	},
});
