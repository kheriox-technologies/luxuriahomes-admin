import { internalMutation } from '../_generated/server';
import { buildVendorSearchText } from '../lib/buildSearchText';

const VENDORS_DATA: string[] = [
	'Bella Vista',
	'Elenni',
	'Fisher & Paykel',
	'Moda Living',
	'SPC Flooring',
	'Stoddart',
	'Schweigen',
	'Tile Collective',
	'Westing House',
];

export const populate = internalMutation({
	args: {},
	handler: async (ctx) => {
		const existing = await ctx.db.query('vendors').first();
		if (existing) {
			return { skipped: true, message: 'Vendors already populated' };
		}
		for (const name of VENDORS_DATA) {
			await ctx.db.insert('vendors', {
				name,
				searchText: buildVendorSearchText(name),
			});
		}
		return { inserted: VENDORS_DATA.length };
	},
});
