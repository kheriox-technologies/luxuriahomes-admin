import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const list = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const stages = await ctx.db
			.query('stages')
			.withIndex('by_display_order')
			.collect();
		return stages;
	},
});
