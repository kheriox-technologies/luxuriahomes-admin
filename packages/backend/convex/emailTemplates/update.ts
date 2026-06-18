import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildEmailTemplateSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getTemplateOrThrow, parseTemplateName } from './shared';

export const update = mutation({
	args: {
		templateId: v.id('emailTemplates'),
		name: v.string(),
		subject: v.string(),
		body: v.string(),
		signatureId: v.optional(v.id('emailSignatures')),
		isActive: v.boolean(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getTemplateOrThrow(ctx, args.templateId);
		const name = parseTemplateName(args.name);
		const subject = args.subject.trim();
		await ctx.db.patch(args.templateId, {
			name,
			subject,
			body: args.body,
			signatureId: args.signatureId,
			isActive: args.isActive,
			searchText: buildEmailTemplateSearchText(name, subject),
		});
		return args.templateId;
	},
});
