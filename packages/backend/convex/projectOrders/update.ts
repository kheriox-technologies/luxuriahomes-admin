import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildProjectOrderSearchText } from '../lib/buildSearchText';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { projectOrderStatusValidator } from '../schema';
import { addedByFromIdentity, getOrderOrThrow } from './shared';

export const update = mutation({
	args: {
		orderId: v.id('projectOrders'),
		name: v.string(),
		description: v.optional(v.string()),
		vendor: v.string(),
		quantity: v.number(),
		unit: v.string(),
		link: v.optional(v.string()),
		status: projectOrderStatusValidator,
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		const existing = await getOrderOrThrow(ctx, args.orderId);
		const name = args.name.trim();
		const vendor = args.vendor.trim();
		const description = args.description?.trim() || undefined;
		const link = args.link?.trim() || undefined;
		const searchText = buildProjectOrderSearchText(name, vendor, description);
		await ctx.db.patch(args.orderId, {
			name,
			description,
			vendor,
			quantity: args.quantity,
			unit: args.unit.trim(),
			link,
			status: args.status,
			searchText,
		});
		if (args.status !== existing.status) {
			const changedBy = addedByFromIdentity(identity);
			await ctx.db.insert('projectOrderStatusHistory', {
				orderId: args.orderId,
				status: args.status,
				label: 'Status Changed',
				changedBy,
				timestamp: Date.now(),
			});
		}
		return args.orderId;
	},
});
