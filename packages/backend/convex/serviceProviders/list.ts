import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const list = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const rows = await ctx.db.query('serviceProviders').order('desc').collect();
		return rows.sort((a, b) => {
			const companyCompare = a.company.localeCompare(b.company, undefined, {
				sensitivity: 'base',
			});
			if (companyCompare !== 0) {
				return companyCompare;
			}
			return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
		});
	},
});
