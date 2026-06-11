import { mutation } from '../_generated/server';
import { buildProjectOrderSearchText } from '../lib/buildSearchText';

/** One-time backfill: creates projectOrders for every existing projectInclusion that has quantity > 0. */
export const backfillFromInclusions = mutation({
	args: {},
	handler: async (ctx) => {
		const inclusions = await ctx.db.query('projectInclusions').collect();
		let created = 0;
		for (const inc of inclusions) {
			const totalQuantity = inc.locations
				? inc.locations.reduce((sum, loc) => sum + (loc.quantity ?? 0), 0)
				: 0;
			if (totalQuantity <= 0) {
				continue;
			}
			const existing = await ctx.db
				.query('projectOrders')
				.withIndex('by_project_inclusion', (q) =>
					q.eq('projectInclusionId', inc._id)
				)
				.unique();
			if (existing !== null) {
				continue;
			}
			const orderUnit = inc.locations?.find((loc) => loc.unit)?.unit ?? '';
			const description = inc.color || undefined;
			const searchText = buildProjectOrderSearchText(
				inc.title,
				inc.vendor,
				description
			);
			const orderId = await ctx.db.insert('projectOrders', {
				projectId: inc.projectId,
				projectInclusionId: inc._id,
				name: inc.title,
				description,
				vendor: inc.vendor,
				quantity: totalQuantity,
				unit: orderUnit,
				link: inc.link,
				status: 'Pending',
				searchText,
			});
			await ctx.db.insert('projectOrderStatusHistory', {
				orderId,
				status: 'Pending',
				label: 'Order Added',
				changedBy: 'System',
				timestamp: Date.now(),
			});
			created++;
		}
		return { created };
	},
});
