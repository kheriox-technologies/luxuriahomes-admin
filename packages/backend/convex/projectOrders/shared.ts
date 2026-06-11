import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';

export async function getOrderOrThrow(
	ctx: MutationCtx | QueryCtx,
	orderId: Id<'projectOrders'>
) {
	const order = await ctx.db.get(orderId);
	if (!order) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Order not found',
		});
	}
	return order;
}

export function addedByFromIdentity(identity: {
	email?: string;
	name?: string;
}): string {
	const name = identity.name?.trim();
	if (name) {
		return name;
	}
	const email = identity.email?.trim();
	if (email) {
		return email;
	}
	return 'Unknown user';
}
