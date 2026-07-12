'use node';

import { ConvexError, v } from 'convex/values';
import { internal } from '../_generated/api';
import { action, internalAction } from '../_generated/server';
import {
	buildRawMessage,
	getGmailAccessToken,
	getGmailConfig,
	resolveAttachments,
	sendGmailMessage,
} from '../email/shared';
import { requireAdmin } from '../lib/checkIdentity';

/** Extracts a human-readable message from a thrown value for the status record. */
function describeError(error: unknown): string {
	if (error instanceof ConvexError) {
		return String(error.data);
	}
	if (error instanceof Error) {
		return error.message;
	}
	return 'Unknown error';
}

/**
 * Emails a bill PDF to the organisation's unique Xero bills inbox so Xero
 * drafts a bill and auto-populates the extractable fields (Contact, Date,
 * Total, Due Date, Reference). Xero owns the resulting draft, so the project
 * can't be attached via the API — the project name is put in the subject as a
 * hint for whoever approves the draft. Reuses the shared Gmail send path.
 *
 * The send outcome is recorded on the document (`xeroBillStatus`) so the portal
 * can show it and offer a retry. Scheduled from `insertProjectDocument` when a
 * PDF lands in the "bills" folder.
 */
export const emailBillToXero = internalAction({
	args: { documentId: v.id('projectDocuments') },
	handler: async (ctx, args): Promise<{ ok: boolean; error?: string }> => {
		const billsEmail = process.env.XERO_BILLS_EMAIL;

		try {
			if (!billsEmail) {
				throw new ConvexError({
					code: 'CONFIG_ERROR',
					message:
						'Xero bill forwarding is not configured (missing XERO_BILLS_EMAIL).',
				});
			}

			const doc = await ctx.runQuery(
				internal.projectDocuments.shared.getDocumentById,
				{ documentId: args.documentId }
			);
			// Already forwarded — don't send a duplicate (e.g. a manual retry race).
			if (doc.xeroBillStatus === 'sent') {
				return { ok: true };
			}

			const project = await ctx.runQuery(internal.projects.get.getInternal, {
				projectId: doc.projectId,
			});
			const projectName = project?.name ?? 'Unknown project';

			const attachments = await resolveAttachments(ctx, [
				{
					s3Key: doc.s3Key,
					filename: doc.name,
					contentType: doc.mimeType ?? 'application/pdf',
				},
			]);

			const config = getGmailConfig();
			const accessToken = await getGmailAccessToken(config);
			const raw = await buildRawMessage({
				from: config.sender,
				to: [billsEmail],
				subject: `Bill — ${projectName}`,
				text: `Automated bill upload for project "${projectName}".\n\nAttached: ${doc.name}`,
				attachments,
			});
			const { messageId } = await sendGmailMessage(accessToken, raw);

			await ctx.runMutation(
				internal.projectDocuments.shared.setXeroBillStatus,
				{
					documentId: args.documentId,
					status: 'sent',
					sentAt: Date.now(),
					messageId,
				}
			);
			return { ok: true };
		} catch (error) {
			const message = describeError(error);
			await ctx.runMutation(
				internal.projectDocuments.shared.setXeroBillStatus,
				{
					documentId: args.documentId,
					status: 'failed',
					error: message,
				}
			);
			return { ok: false, error: message };
		}
	},
});

/**
 * Admin-triggered retry for a bill whose earlier forward failed. Re-runs the
 * same send path and returns its result. Wired to the portal "Send to Xero"
 * button on failed bill documents.
 */
export const sendBillToXeroNow = action({
	args: { documentId: v.id('projectDocuments') },
	handler: async (ctx, args): Promise<{ ok: boolean; error?: string }> => {
		await requireAdmin(ctx);
		return await ctx.runAction(internal.xero.emailBillToXero.emailBillToXero, {
			documentId: args.documentId,
		});
	},
});
