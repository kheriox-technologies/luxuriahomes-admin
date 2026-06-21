import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const list = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const admins = await ctx.db.query('adminUsers').collect();
		return admins.sort((a, b) =>
			a.fullName.localeCompare(b.fullName, undefined, { sensitivity: 'base' })
		);
	},
});
