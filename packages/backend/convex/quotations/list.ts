import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const list = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const rows = await ctx.db.query('quotations').collect();
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
