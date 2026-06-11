import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildProjectOrderSearchText } from '../lib/buildSearchText';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { projectOrderStatusValidator } from '../schema';
import { addedByFromIdentity } from './shared';

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
				sku: v.optional(v.string()),
				link: v.optional(v.string()),
			})
		),
		status: v.optional(projectOrderStatusValidator),
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
			sku: item.sku?.trim() || undefined,
			link: item.link?.trim() || undefined,
		}));
		const searchText = buildProjectOrderSearchText(vendor, items);
		const orderId = await ctx.db.insert('projectOrders', {
			projectId: args.projectId,
			vendor,
			orderBy: args.orderBy,
			items,
			status,
			searchText,
		});
		const changedBy = addedByFromIdentity(identity);
		await ctx.db.insert('projectOrderStatusHistory', {
			orderId,
			status,
			label: 'Order Added',
			changedBy,
			timestamp: Date.now(),
		});
		return orderId;
	},
});
