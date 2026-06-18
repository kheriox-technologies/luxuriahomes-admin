import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getSignatureOrThrow } from './shared';

export const remove = mutation({
	args: {
		signatureId: v.id('emailSignatures'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getSignatureOrThrow(ctx, args.signatureId);
		// Detach the signature from any templates that reference it.
		const templates = await ctx.db.query('emailTemplates').collect();
		for (const template of templates) {
			if (template.signatureId === args.signatureId) {
				await ctx.db.patch(template._id, { signatureId: undefined });
			}
		}
		await ctx.db.delete(args.signatureId);
		return args.signatureId;
	},
});
