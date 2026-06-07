import { mutation } from '../_generated/server';

const UNITS_DATA: { category: string; abbr: string; label: string }[] = [
	// Area
	{ category: 'Area', abbr: 'm²', label: 'Square metre' },
	{ category: 'Area', abbr: 'ha', label: 'Hectare' },
	// Volume
	{ category: 'Volume', abbr: 'm³', label: 'Cubic metre' },
	{ category: 'Volume', abbr: 'L', label: 'Litre' },
	{ category: 'Volume', abbr: 'kL', label: 'Kilolitre' },
	{ category: 'Volume', abbr: 'mL', label: 'Millilitre' },
	// Linear
	{ category: 'Linear', abbr: 'm', label: 'Metre' },
	{ category: 'Linear', abbr: 'lm', label: 'Linear metre' },
	{ category: 'Linear', abbr: 'mm', label: 'Millimetre' },
	{ category: 'Linear', abbr: 'cm', label: 'Centimetre' },
	// Weight
	{ category: 'Weight', abbr: 'kg', label: 'Kilogram' },
	{ category: 'Weight', abbr: 't', label: 'Metric tonne' },
	{ category: 'Weight', abbr: 'g', label: 'Gram' },
	// Count
	{ category: 'Count', abbr: 'no.', label: 'Number' },
	{ category: 'Count', abbr: 'ea', label: 'Each' },
	{ category: 'Count', abbr: 'set', label: 'Set' },
	{ category: 'Count', abbr: 'lot', label: 'Lot' },
	{ category: 'Count', abbr: 'pair', label: 'Pair' },
	{ category: 'Count', abbr: 'pkt', label: 'Packet' },
	// Packaged Goods
	{ category: 'Packaged Goods', abbr: 'bag', label: 'Bag' },
	{ category: 'Packaged Goods', abbr: 'pallet', label: 'Pallet' },
	{ category: 'Packaged Goods', abbr: 'roll', label: 'Roll' },
	{ category: 'Packaged Goods', abbr: 'bundle', label: 'Bundle' },
	{ category: 'Packaged Goods', abbr: 'sheet', label: 'Sheet' },
	{ category: 'Packaged Goods', abbr: 'box', label: 'Box' },
	{ category: 'Packaged Goods', abbr: 'drum', label: 'Drum' },
];

export const populate = mutation({
	args: {},
	handler: async (ctx) => {
		const existing = await ctx.db.query('units').first();
		if (existing) {
			return { skipped: true, message: 'Units already populated' };
		}
		for (const unit of UNITS_DATA) {
			await ctx.db.insert('units', unit);
		}
		return { inserted: UNITS_DATA.length };
	},
});
