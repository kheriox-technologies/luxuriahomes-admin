import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const listByProject = query({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const rows = await ctx.db
			.query('quotations')
			.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
			.filter((q) => q.eq(q.field('status'), 'Approved'))
			.collect();
		return Promise.all(
			rows.map(async (row) => {
				const [trade, serviceProvider] = await Promise.all([
					ctx.db.get(row.tradeId),
					ctx.db.get(row.serviceProviderId),
				]);
				return {
					...row,
					tradeName: trade?.name ?? '',
					companyName: serviceProvider?.company ?? '',
				};
			})
		);
	},
});
