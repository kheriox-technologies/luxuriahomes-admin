import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	takeoffCategoryValidator,
	takeoffLegendValidator,
	takeoffMeasurementValidator,
	takeoffMethodValidator,
	takeoffTextValidator,
} from '../schema';

export const save = mutation({
	args: {
		takeoffId: v.id('takeoffs'),
		measurements: v.array(takeoffMeasurementValidator),
		legends: v.array(takeoffLegendValidator),
		texts: v.array(takeoffTextValidator),
		measurementPages: v.array(v.number()),
		pageTitles: v.array(v.object({ page: v.number(), title: v.string() })),
		categories: v.array(takeoffCategoryValidator),
		documentMethod: v.optional(takeoffMethodValidator),
		pageMethods: v.array(
			v.object({ page: v.number(), method: takeoffMethodValidator })
		),
		globalWastage: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const { takeoffId, ...data } = args;
		await ctx.db.patch(takeoffId, { ...data, updatedAt: Date.now() });
	},
});
