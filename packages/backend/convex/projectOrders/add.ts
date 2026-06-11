import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildProjectOrderSearchText } from '../lib/buildSearchText';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { projectOrderStatusValidator } from '../schema';
import { addedByFromIdentity } from './shared';

export const add = mutation({
	args: {
		projectId: v.id('projects'),
		name: v.string(),
		description: v.optional(v.string()),
		vendor: v.string(),
		quantity: v.number(),
		unit: v.string(),
		link: v.optional(v.string()),
		status: v.optional(projectOrderStatusValidator),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		const name = args.name.trim();
		const vendor = args.vendor.trim();
		const description = args.description?.trim() || undefined;
		const link = args.link?.trim() || undefined;
		const status = args.status ?? 'Pending';
		const searchText = buildProjectOrderSearchText(name, vendor, description);
		const orderId = await ctx.db.insert('projectOrders', {
			projectId: args.projectId,
			name,
			description,
			vendor,
			quantity: args.quantity,
			unit: args.unit.trim(),
			link,
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
