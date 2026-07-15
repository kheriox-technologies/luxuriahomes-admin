import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildProjectOrderSearchText } from '../lib/buildSearchText';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { projectOrderStatusValidator } from '../schema';
import { addedByFromIdentity, allocateUniqueOrderId } from './shared';

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

export const add = mutation({
	args: {
		projectId: v.id('projects'),
		vendor: v.string(),
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
		status: v.optional(projectOrderStatusValidator),
		inclusionIds: v.optional(v.array(v.id('projectInclusions'))),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		const vendor = args.vendor.trim();
		const status = args.status ?? 'Pending';
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
		const orderCode = await allocateUniqueOrderId(ctx);
		const newOrderId = await ctx.db.insert('projectOrders', {
			orderId: orderCode,
			projectId: args.projectId,
			vendor,
			orderBy: args.orderBy,
			items,
			status,
			searchText,
		});
		const changedBy = addedByFromIdentity(identity);
		await ctx.db.insert('projectOrderStatusHistory', {
			orderId: newOrderId,
			status,
			label: 'Order Added',
			changedBy,
			timestamp: Date.now(),
		});
		if (args.inclusionIds && args.inclusionIds.length > 0) {
			const inclusionOrderStatus = orderStatusToInclusionOrderStatus(status);
			await Promise.all(
				args.inclusionIds.map((inclusionId) =>
					ctx.db.patch(inclusionId, {
						orderRefId: orderCode,
						orderStatus: inclusionOrderStatus,
					})
				)
			);
		}
		return newOrderId;
	},
});
