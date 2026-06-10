import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const list = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const rows = await ctx.db.query('quotations').collect();
		return Promise.all(
			rows.map(async (row) => {
				const [trades, project, serviceProvider, notes] = await Promise.all([
					Promise.all(row.tradeIds.map((id) => ctx.db.get(id))),
					ctx.db.get(row.projectId),
					ctx.db.get(row.serviceProviderId),
					ctx.db
						.query('quotationNotes')
						.withIndex('by_quotation', (q) => q.eq('quotationId', row._id))
						.collect(),
				]);
				return {
					...row,
					tradeNames: trades.map((t) => t?.name ?? '').filter(Boolean),
					projectName: project?.name ?? '',
					companyName: serviceProvider?.company ?? '',
					noteCount: notes.length,
				};
			})
		);
	},
});
