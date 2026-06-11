import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildProjectOrderSearchText } from '../lib/buildSearchText';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import {
	addedByFromIdentity,
	allocateUniqueOrderId,
} from '../projectOrders/shared';

export const addToProject = mutation({
	args: {
		projectId: v.id('projects'),
		variantId: v.id('materialVariants'),
		quantity: v.number(),
		orderBy: v.optional(v.number()),
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

		const variant = await ctx.db.get(args.variantId);
		if (!variant) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Variant not found',
			});
		}

		const material = await ctx.db.get(variant.materialId);
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
			.withIndex('by_material_variant', (q) =>
				q.eq('materialVariantId', args.variantId)
			)
			.collect();

		interface OrderItem {
			description?: string;
			link?: string;
			name: string;
			quantity: number;
			sku?: string;
			unit: string;
		}

		const vendorMap = new Map<string, OrderItem[]>();

		const addToVendor = (vendorKey: string, item: OrderItem) => {
			const existing = vendorMap.get(vendorKey);
			if (existing) {
				existing.push(item);
			} else {
				vendorMap.set(vendorKey, [item]);
			}
		};

		addToVendor(variant.vendor.trim(), {
			name: variant.name.trim(),
			description: variant.description?.trim() || undefined,
			quantity: args.quantity,
			unit: materialUnit.abbr,
			sku: variant.sku?.trim() || undefined,
			link: variant.link?.trim() || undefined,
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
				orderBy: args.orderBy,
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
