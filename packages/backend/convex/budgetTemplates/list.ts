import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const list = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const rows = await ctx.db.query('budgetTemplates').order('desc').collect();
		return rows.sort((a, b) =>
			a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
		);
	},
});
