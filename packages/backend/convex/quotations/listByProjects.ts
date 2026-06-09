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
				const [trades, project, serviceProvider] = await Promise.all([
					Promise.all(row.tradeIds.map((id) => ctx.db.get(id))),
					ctx.db.get(row.projectId),
					ctx.db.get(row.serviceProviderId),
				]);
				return {
					...row,
					tradeNames: trades.map((t) => t?.name ?? '').filter(Boolean),
					projectName: project?.name ?? '',
					companyName: serviceProvider?.company ?? '',
				};
			})
		);
	},
});
