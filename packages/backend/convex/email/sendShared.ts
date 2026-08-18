'use node';

import { ConvexError, v } from 'convex/values';
import { internal } from '../_generated/api';
import type { Id } from '../_generated/dataModel';
import type { ActionCtx } from '../_generated/server';
import {
	type AttachmentInput,
	buildRawMessage,
	getGmailAccessToken,
	getGmailConfig,
	resolveAttachments,
	sendGmailMessage,
} from './shared';
import {
	appendBrandedText,
	getEmailBranding,
	wrapBrandedHtml,
} from './template';

export const attachmentValidator = v.object({
	filename: v.string(),
	contentType: v.string(),
	s3Key: v.optional(v.string()),
	storageId: v.optional(v.id('_storage')),
	contentBase64: v.optional(v.string()),
});

/** Everything a message needs, minus who is allowed to send it. */
export const deliverEmailArgs = {
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
};

export interface DeliverEmailArgs {
	attachments?: AttachmentInput[];
	bcc?: string[];
	cc?: string[];
	html?: string;
	projectId?: Id<'projects'>;
	relatedId?: string;
	relatedTable?: string;
	subject: string;
	text?: string;
	to: string[];
}

/**
 * Brands, sends and logs one message.
 *
 * Deliberately takes no view on authorization: `email.send.send` gates on the
 * admin role, while the signature workflow sends on behalf of a client who has
 * just signed — and has to be able to, without holding that role. Whoever the
 * send is attributed to is passed in as `sentBy`.
 */
export async function deliverEmail(
	ctx: ActionCtx,
	args: DeliverEmailArgs & { sentBy: string }
): Promise<{ messageId: string; threadId: string }> {
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

	const branding = getEmailBranding();
	const raw = await buildRawMessage({
		from: config.sender,
		to: args.to,
		cc: args.cc,
		bcc: args.bcc,
		subject: args.subject,
		html: args.html ? wrapBrandedHtml(args.html, branding) : undefined,
		text: args.text ? appendBrandedText(args.text, branding) : undefined,
		attachments: resolvedAttachments,
	});

	const result = await sendGmailMessage(accessToken, raw);

	await ctx.runMutation(internal.email.logSent.logSent, {
		to: args.to,
		cc: args.cc,
		bcc: args.bcc,
		subject: args.subject,
		sentBy: args.sentBy,
		gmailMessageId: result.messageId,
		gmailThreadId: result.threadId,
		attachmentNames: resolvedAttachments.map((a) => a.filename),
		projectId: args.projectId,
		relatedTable: args.relatedTable,
		relatedId: args.relatedId,
		timestamp: Date.now(),
	});

	return result;
}
