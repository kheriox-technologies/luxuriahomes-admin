import { v } from 'convex/values';
import { query } from '../../_generated/server';
import { requireProjectClient } from '../../lib/clientAccess';

export const get = query({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		const { project } = await requireProjectClient(ctx, args.projectId);
		return project;
	},
});
