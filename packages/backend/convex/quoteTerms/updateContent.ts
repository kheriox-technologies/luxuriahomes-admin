import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

/**
 * Patches the template's settings row, creating it on first use. Both fields are
 * optional so the disclaimer and acknowledgement cards can save independently
 * without clobbering each other.
 */
export const updateContent = mutation({
	args: {
		templateId: v.id('quoteTemplates'),
		acknowledgementHtml: v.optional(v.string()),
		disclaimerHtml: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await ctx.db
			.query('quoteTermsSettings')
			.withIndex('by_template', (q) => q.eq('templateId', args.templateId))
			.first();
		if (existing) {
			await ctx.db.patch(existing._id, {
				...(args.acknowledgementHtml === undefined
					? {}
					: { acknowledgementHtml: args.acknowledgementHtml }),
				...(args.disclaimerHtml === undefined
					? {}
					: { disclaimerHtml: args.disclaimerHtml }),
			});
			return existing._id;
		}
		return await ctx.db.insert('quoteTermsSettings', {
			acknowledgementHtml: args.acknowledgementHtml ?? '',
			disclaimerHtml: args.disclaimerHtml ?? '',
			templateId: args.templateId,
		});
	},
});
