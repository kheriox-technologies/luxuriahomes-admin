import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const listByProject = query({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const rows = await ctx.db
			.query('projectQuotations')
			.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
			.collect();
		return Promise.all(
			rows.map(async (row) => {
				const [trade, serviceProvider, notes] = await Promise.all([
					ctx.db.get(row.tradeId),
					ctx.db.get(row.serviceProviderId),
					ctx.db
						.query('projectQuotationNotes')
						.withIndex('by_project_quotation', (q) =>
							q.eq('projectQuotationId', row._id)
						)
						.collect(),
				]);
				return {
					...row,
					tradeName: trade?.name ?? '',
					companyName: serviceProvider?.company ?? '',
					noteCount: notes.length,
				};
			})
		);
	},
});
