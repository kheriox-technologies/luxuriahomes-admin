import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildProjectOrderSearchText } from '../lib/buildSearchText';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import {
	addedByFromIdentity,
	allocateUniqueOrderId,
} from '../projectOrders/shared';

interface OrderItem {
	description?: string;
	link?: string;
	name: string;
	price?: number;
	quantity: number;
	sku?: string;
	unit: string;
}

export const addToProject = mutation({
	args: {
		projectId: v.id('projects'),
		materialId: v.id('materials'),
		quantity: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);

		if (args.quantity <= 0) {
			throw new ConvexError({
				code: 'INVALID_QUANTITY',
				message: 'Quantity must be greater than zero',
			});
		}

		const material = await ctx.db.get(args.materialId);
		if (!material) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Material not found',
			});
		}

		const materialUnit = await ctx.db.get(material.unit);
		if (!materialUnit) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Material unit not found',
			});
		}

		const materialItems = await ctx.db
			.query('materialItems')
			.withIndex('by_material', (q) => q.eq('materialId', args.materialId))
			.collect();

		const vendorMap = new Map<string, OrderItem[]>();

		const addToVendor = (vendorKey: string, item: OrderItem) => {
			const existing = vendorMap.get(vendorKey);
			if (existing) {
				existing.push(item);
			} else {
				vendorMap.set(vendorKey, [item]);
			}
		};

		addToVendor(material.vendor.trim(), {
			name: material.name.trim(),
			description: material.description?.trim() || undefined,
			quantity: args.quantity,
			unit: materialUnit.abbr,
			price: material.price,
			sku: material.sku?.trim() || undefined,
			link: material.link?.trim() || undefined,
		});

		for (const item of materialItems) {
			if (item.quantity === undefined) {
				continue;
			}
			const itemUnit = await ctx.db.get(item.unit);
			const itemUnitAbbr = itemUnit?.abbr ?? materialUnit.abbr;
			addToVendor(item.vendor.trim(), {
				name: item.name.trim(),
				description: item.description?.trim() || undefined,
				quantity: item.quantity * args.quantity,
				unit: itemUnitAbbr,
				price: item.price,
				sku: item.sku?.trim() || undefined,
				link: item.link?.trim() || undefined,
			});
		}

		const changedBy = addedByFromIdentity(identity);
		const status = 'Pending' as const;

		for (const [vendor, items] of vendorMap) {
			const searchText = buildProjectOrderSearchText(vendor, items);
			const orderCode = await allocateUniqueOrderId(ctx);
			const newOrderId = await ctx.db.insert('projectOrders', {
				orderId: orderCode,
				projectId: args.projectId,
				vendor,
				items,
				status,
				searchText,
			});
			await ctx.db.insert('projectOrderStatusHistory', {
				orderId: newOrderId,
				status,
				label: 'Order Added',
				changedBy,
				timestamp: Date.now(),
			});
		}
	},
});
