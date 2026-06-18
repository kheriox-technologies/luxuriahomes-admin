import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';

export const logSent = internalMutation({
	args: {
		to: v.array(v.string()),
		cc: v.optional(v.array(v.string())),
		bcc: v.optional(v.array(v.string())),
		subject: v.string(),
		sentBy: v.string(),
		gmailMessageId: v.string(),
		gmailThreadId: v.string(),
		attachmentNames: v.array(v.string()),
		projectId: v.optional(v.id('projects')),
		relatedTable: v.optional(v.string()),
		relatedId: v.optional(v.string()),
		timestamp: v.number(),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert('sentEmails', args);
	},
});
