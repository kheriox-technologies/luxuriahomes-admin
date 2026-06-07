import { mutation } from '../_generated/server';
import { buildLocationSearchText } from '../lib/buildSearchText';

const LOCATIONS_DATA: string[] = [
	'Porch',
	'GuestBed',
	'Walk in Robe',
	'Guest Ensuite',
	'Formal Living',
	'Prayer',
	'Garage',
	'Media Room',
	'Laundry',
	'Powder Room',
	'Dining',
	'Kitchen',
	'Butlers Pantry',
	'Pantry',
	'Lounge',
	'Master Bed',
	'Master Ensuite',
	'Master WIR',
	'Study',
	'Bed 2',
	'Bed 3',
	'Bed 4',
	'Bed 5',
	'Bed 6',
	'Bed 2 Ensuite',
	'Bed 3 Ensuite',
	'Bed 4 Ensuite',
	'Bed 5 Ensuite',
	'Bed 6 Ensuite',
	'Bath 2',
	'Bath 3',
	'Bath 4',
	'Bath 5',
	'Bath 6',
	'Retreat',
	'Balcony',
];

export const populate = mutation({
	args: {},
	handler: async (ctx) => {
		const existing = await ctx.db.query('locations').first();
		if (existing) {
			return { skipped: true, message: 'Locations already populated' };
		}
		for (const name of LOCATIONS_DATA) {
			await ctx.db.insert('locations', {
				name,
				searchText: buildLocationSearchText(name),
			});
		}
		return { inserted: LOCATIONS_DATA.length };
	},
});
