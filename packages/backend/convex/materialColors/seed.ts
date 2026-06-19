import { internalMutation } from '../_generated/server';
import { buildMaterialColorSearchText } from '../lib/buildSearchText';

const MATERIAL_COLORS_DATA: string[] = [
	'AW0021',
	'Beige',
	'Black',
	'French Gold',
	'Gloss White',
	'Ice',
	'Integrated',
	'Ivory Matte',
	'Light Gold',
	'Polished',
	'Smoke',
	'White',
	'Grey',
];

export const populate = internalMutation({
	args: {},
	handler: async (ctx) => {
		const existing = await ctx.db.query('materialColors').first();
		if (existing) {
			return { skipped: true, message: 'Material colors already populated' };
		}
		for (const name of MATERIAL_COLORS_DATA) {
			await ctx.db.insert('materialColors', {
				name,
				searchText: buildMaterialColorSearchText(name),
			});
		}
		return { inserted: MATERIAL_COLORS_DATA.length };
	},
});
