import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildProjectOrderSearchText } from '../lib/buildSearchText';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { projectOrderStatusValidator } from '../schema';
import { addedByFromIdentity, getOrderOrThrow } from './shared';

function orderStatusToInclusionOrderStatus(
	status: string
): 'Order Created' | 'Ordered' | 'In Transit' | 'Delivered' {
	switch (status) {
		case 'Ordered':
			return 'Ordered';
		case 'In Transit':
			return 'In Transit';
		case 'Delivered':
			return 'Delivered';
		default:
			return 'Order Created';
	}
}

export const update = mutation({
	args: {
		orderId: v.id('projectOrders'),
		vendor: v.string(),
		tradeId: v.id('trades'),
		orderBy: v.optional(v.number()),
		items: v.array(
			v.object({
				name: v.string(),
				description: v.optional(v.string()),
				quantity: v.number(),
				unit: v.string(),
				price: v.optional(v.number()),
				sku: v.optional(v.string()),
				link: v.optional(v.string()),
			})
		),
		status: projectOrderStatusValidator,
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		const existing = await getOrderOrThrow(ctx, args.orderId);
		const vendor = args.vendor.trim();
		const items = args.items.map((item) => ({
			name: item.name.trim(),
			description: item.description?.trim() || undefined,
			quantity: item.quantity,
			unit: item.unit.trim(),
			price: item.price,
			sku: item.sku?.trim() || undefined,
			link: item.link?.trim() || undefined,
		}));
		const searchText = buildProjectOrderSearchText(vendor, items);
		await ctx.db.patch(args.orderId, {
			vendor,
			tradeId: args.tradeId,
			orderBy: args.orderBy,
			items,
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
			const inclusionOrderStatus = orderStatusToInclusionOrderStatus(
				args.status
			);
			const inclusions = await ctx.db
				.query('projectInclusions')
				.withIndex('by_order_ref', (q) => q.eq('orderRefId', existing.orderId))
				.collect();
			await Promise.all(
				inclusions.map((inc) =>
					ctx.db.patch(inc._id, { orderStatus: inclusionOrderStatus })
				)
			);
		}
		return args.orderId;
	},
});
