import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildProjectOrderSearchText } from '../lib/buildSearchText';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { addedByFromIdentity } from '../projectOrders/shared';

export const addToProject = mutation({
	args: {
		projectId: v.id('projects'),
		variantId: v.id('materialVariants'),
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

		const items = await ctx.db
			.query('materialItems')
			.withIndex('by_material_variant', (q) =>
				q.eq('materialVariantId', args.variantId)
			)
			.collect();

		const changedBy = addedByFromIdentity(identity);
		const status = 'Pending' as const;

		const insertOrder = async (
			name: string,
			vendor: string,
			quantity: number,
			unit: string,
			link?: string,
			description?: string
		) => {
			const searchText = buildProjectOrderSearchText(name, vendor, description);
			const orderId = await ctx.db.insert('projectOrders', {
				projectId: args.projectId,
				name: name.trim(),
				vendor: vendor.trim(),
				quantity,
				unit: unit.trim(),
				link: link?.trim() || undefined,
				description: description?.trim() || undefined,
				status,
				searchText,
			});
			await ctx.db.insert('projectOrderStatusHistory', {
				orderId,
				status,
				label: 'Order Added',
				changedBy,
				timestamp: Date.now(),
			});
		};

		await insertOrder(
			variant.name,
			variant.vendor,
			args.quantity,
			materialUnit.abbr,
			variant.link,
			variant.description
		);

		for (const item of items) {
			if (item.quantity === undefined) {
				continue;
			}
			const itemUnit = await ctx.db.get(item.unit);
			const itemUnitAbbr = itemUnit?.abbr ?? materialUnit.abbr;
			await insertOrder(
				item.name,
				item.vendor,
				item.quantity * args.quantity,
				itemUnitAbbr,
				item.link,
				item.description
			);
		}
	},
});
