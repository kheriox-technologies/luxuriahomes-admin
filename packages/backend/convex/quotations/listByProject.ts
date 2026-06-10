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
				const [trades, serviceProvider, notes] = await Promise.all([
					Promise.all(row.tradeIds.map((id) => ctx.db.get(id))),
					ctx.db.get(row.serviceProviderId),
					ctx.db
						.query('quotationNotes')
						.withIndex('by_quotation', (q) => q.eq('quotationId', row._id))
						.collect(),
				]);
				return {
					...row,
					tradeNames: trades.map((t) => t?.name ?? '').filter(Boolean),
					companyName: serviceProvider?.company ?? '',
					noteCount: notes.length,
				};
			})
		);
	},
});
