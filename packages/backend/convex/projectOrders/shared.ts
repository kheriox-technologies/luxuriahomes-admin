import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';

const ORDER_ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const ORDER_ID_LEN = 6;
const MAX_ORDER_ID_ATTEMPTS = 24;

function randomAlphanumericSuffix(length: number): string {
	const buf = new Uint8Array(length);
	crypto.getRandomValues(buf);
	let out = '';
	const radix = ORDER_ID_CHARS.length;
	for (let i = 0; i < length; i++) {
		const byte = buf[i];
		if (byte === undefined) {
			break;
		}
		const ch = ORDER_ID_CHARS[byte % radix];
		if (ch !== undefined) {
			out += ch;
		}
	}
	return out;
}

export async function allocateUniqueOrderId(ctx: MutationCtx): Promise<string> {
	for (let attempt = 0; attempt < MAX_ORDER_ID_ATTEMPTS; attempt++) {
		const suffix = randomAlphanumericSuffix(ORDER_ID_LEN);
		const code = `LHA-${suffix}`;
		const clash = await ctx.db
			.query('projectOrders')
			.withIndex('by_order_id', (q) => q.eq('orderId', code))
			.first();
		if (!clash) {
			return code;
		}
	}
	throw new ConvexError({
		code: 'CODE_GENERATION_FAILED',
		message: 'Could not generate a unique order ID',
	});
}

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
