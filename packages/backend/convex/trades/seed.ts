import { internalMutation } from '../_generated/server';
import { buildTradeSearchText } from '../lib/buildSearchText';

const TRADES_DATA: string[] = [
	'Earthworks & Excavation',
	'Demolition',
	'Surveying',
	'Structural Engineering',
	'Formwork',
	'Concrete',
	'Steel Fixing',
	'Scaffolding',
	'Bricklaying',
	'Carpentry',
	'Roofing',
	'Waterproofing',
	'Insulation',
	'Plumbing',
	'Gas Fitting',
	'Electrical',
	'Air Conditioning & HVAC',
	'Solar',
	'Fire Protection',
	'Security Systems',
	'Plastering',
	'Rendering',
	'Tiling',
	'Painting',
	'Flooring',
	'Glazing',
	'Cabinetry',
	'Stone Masonry',
	'Swimming Pool',
	'Landscaping',
	'Paving',
	'Fencing',
	'Pest Control',
	'Cleaning',
	'Building Certification',
];

export const populate = internalMutation({
	args: {},
	handler: async (ctx) => {
		const existing = await ctx.db.query('trades').first();
		if (existing) {
			return { skipped: true, message: 'Trades already populated' };
		}
		for (const name of TRADES_DATA) {
			await ctx.db.insert('trades', {
				name,
				searchText: buildTradeSearchText(name),
			});
		}
		return { inserted: TRADES_DATA.length };
	},
});
