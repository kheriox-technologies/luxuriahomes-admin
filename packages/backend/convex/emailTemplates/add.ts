import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildEmailTemplateSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { parseTemplateName } from './shared';

export const add = mutation({
	args: {
		name: v.string(),
		subject: v.string(),
		body: v.string(),
		signatureId: v.optional(v.id('emailSignatures')),
		isActive: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const name = parseTemplateName(args.name);
		const subject = args.subject.trim();
		return await ctx.db.insert('emailTemplates', {
			name,
			subject,
			body: args.body,
			signatureId: args.signatureId,
			isActive: args.isActive ?? true,
			searchText: buildEmailTemplateSearchText(name, subject),
		});
	},
});
