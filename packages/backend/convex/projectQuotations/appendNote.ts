import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { getQuotationOrThrow } from './shared';

function addedByFromIdentity(identity: {
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

export const appendNote = mutation({
	args: {
		quotationId: v.id('projectQuotations'),
		note: v.string(),
		images: v.optional(v.array(v.string())),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		await getQuotationOrThrow(ctx, args.quotationId);
		const trimmed = args.note.trim();
		if (trimmed === '') {
			throw new ConvexError({
				code: 'INVALID_NOTE',
				message: 'Note cannot be empty',
			});
		}
		const images = args.images?.filter((key) => key.trim() !== '');
		const timestamp = Date.now();
		const addedBy = addedByFromIdentity(identity);
		await ctx.db.insert('projectQuotationNotes', {
			projectQuotationId: args.quotationId,
			timestamp,
			addedBy,
			note: trimmed,
			images: images && images.length > 0 ? images : undefined,
		});
		return args.quotationId;
	},
});
