import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const list = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const rows = await ctx.db.query('materials').collect();
		const enriched = await Promise.all(
			rows.map(async (material) => {
				const unit = await ctx.db.get(material.unit);
				const trade = await ctx.db.get(material.tradeId);
				return {
					...material,
					unitAbbr: unit?.abbr ?? '',
					tradeName: trade?.name ?? 'Unassigned',
				};
			})
		);
		return enriched.sort((a, b) =>
			a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
		);
	},
});
