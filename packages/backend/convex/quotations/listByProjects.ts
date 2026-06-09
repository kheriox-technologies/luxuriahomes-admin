import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const listByProjects = query({
	args: { projectIds: v.array(v.id('projects')) },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const rowSets = await Promise.all(
			args.projectIds.map((projectId) =>
				ctx.db
					.query('quotations')
					.withIndex('by_project', (q) => q.eq('projectId', projectId))
					.collect()
			)
		);
		const rows = rowSets.flat();
		return Promise.all(
			rows.map(async (row) => {
				const [trade, project, serviceProvider] = await Promise.all([
					ctx.db.get(row.tradeId),
					ctx.db.get(row.projectId),
					ctx.db.get(row.serviceProviderId),
				]);
				return {
					...row,
					tradeName: trade?.name ?? '',
					projectName: project?.name ?? '',
					companyName: serviceProvider?.company ?? '',
				};
			})
		);
	},
});
