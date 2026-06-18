import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const list = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const rows = await ctx.db.query('emailSignatures').collect();
		return rows.sort((a, b) => {
			if (a.isDefault !== b.isDefault) {
				return a.isDefault ? -1 : 1;
			}
			return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
		});
	},
});
