'use node';

import { ConvexError, v } from 'convex/values';
import { internal } from '../_generated/api';
import { action } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { addedByFromIdentity } from '../projectOrders/shared';
import {
	type AttachmentInput,
	buildRawMessage,
	getGmailAccessToken,
	getGmailConfig,
	resolveAttachments,
	sendGmailMessage,
} from './shared';

const attachmentValidator = v.object({
	filename: v.string(),
	contentType: v.string(),
	s3Key: v.optional(v.string()),
	storageId: v.optional(v.id('_storage')),
	contentBase64: v.optional(v.string()),
});

export const send = action({
	args: {
		to: v.array(v.string()),
		cc: v.optional(v.array(v.string())),
		bcc: v.optional(v.array(v.string())),
		subject: v.string(),
		html: v.optional(v.string()),
		text: v.optional(v.string()),
		attachments: v.optional(v.array(attachmentValidator)),
		projectId: v.optional(v.id('projects')),
		relatedTable: v.optional(v.string()),
		relatedId: v.optional(v.string()),
	},
	returns: v.object({ messageId: v.string(), threadId: v.string() }),
	handler: async (
		ctx,
		args
	): Promise<{ messageId: string; threadId: string }> => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);

		if (args.to.length === 0) {
			throw new ConvexError({
				code: 'NO_RECIPIENTS',
				message: 'At least one recipient is required',
			});
		}

		const config = getGmailConfig();
		const accessToken = await getGmailAccessToken(config);

		const attachmentInputs: AttachmentInput[] = args.attachments ?? [];
		const resolvedAttachments = await resolveAttachments(ctx, attachmentInputs);

		const raw = await buildRawMessage({
			from: config.sender,
			to: args.to,
			cc: args.cc,
			bcc: args.bcc,
			subject: args.subject,
			html: args.html,
			text: args.text,
			attachments: resolvedAttachments,
		});

		const result = await sendGmailMessage(accessToken, raw);

		await ctx.runMutation(internal.email.logSent.logSent, {
			to: args.to,
			cc: args.cc,
			bcc: args.bcc,
			subject: args.subject,
			sentBy: addedByFromIdentity(identity),
			gmailMessageId: result.messageId,
			gmailThreadId: result.threadId,
			attachmentNames: resolvedAttachments.map((a) => a.filename),
			projectId: args.projectId,
			relatedTable: args.relatedTable,
			relatedId: args.relatedId,
			timestamp: Date.now(),
		});

		return result;
	},
});
