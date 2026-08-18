'use node';

import { ConvexError, v } from 'convex/values';
import { api, internal } from '../_generated/api';
import { action } from '../_generated/server';
import {
	findExistingClerkUserId,
	generatePortalPassword,
	getClerkSecretKey,
	getPortalUrl,
	mergePortalRoles,
	PORTAL_ROLES,
} from '../clientPortal/shared';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { getClerkClient } from '../lib/clerk';
import { buildQuotationEmail, type NewAccount } from './emailContent';
import { addedByFromIdentity } from './shared';

/**
 * Clerk wants a first and last name; a quotation carries a single display name.
 * Everything before the first space is the first name, the rest the last.
 */
function splitName(name: string): { firstName: string; lastName: string } {
	const trimmed = name.trim();
	const spaceAt = trimmed.indexOf(' ');
	if (spaceAt === -1) {
		return { firstName: trimmed, lastName: '' };
	}
	return {
		firstName: trimmed.slice(0, spaceAt),
		lastName: trimmed.slice(spaceAt + 1).trim(),
	};
}

/**
 * Emails a quotation to every client named on it, creating portal logins for any
 * who don't have one yet, and moves a draft into review.
 *
 * Doubles as the re-send: available at any status, because a client who has lost
 * the email needs another copy whether the quotation is under review, approved or
 * signed. Only a Draft changes status as a result.
 *
 * Each client gets their own message because the temporary password differs per
 * recipient — a single combined send would leak one client's credentials to the
 * others.
 */
export const sendToClients = action({
	args: {
		quotationId: v.id('clientQuotations'),
	},
	returns: v.object({
		accountsCreated: v.array(v.string()),
		sent: v.number(),
	}),
	handler: async (
		ctx,
		args
	): Promise<{ accountsCreated: string[]; sent: number }> => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);

		const quotation = await ctx.runQuery(
			internal.clientQuotations.internal.getForSend,
			{ quotationId: args.quotationId }
		);

		// Deliberately no status guard. Sending is also how a quotation is re-sent —
		// clients lose emails and ask for another copy — so it stays available at
		// every stage of the lifecycle. `markSent` is what keeps a re-send from
		// disturbing the status: it only promotes a Draft.
		const { s3Key, fileName } = quotation;
		if (!(s3Key && fileName)) {
			throw new ConvexError({
				code: 'NO_PDF',
				message:
					'This quotation has no PDF to attach. Save it again to generate one.',
			});
		}

		const clerk = getClerkClient(getClerkSecretKey());
		const accountsCreated: string[] = [];
		let sent = 0;

		// Sequential rather than parallel: each iteration writes to Clerk and sends
		// a message, and a partial failure is far easier to reason about — and to
		// retry — when the clients are processed in order.
		for (const client of quotation.clients) {
			const email = client.email.trim();
			if (email === '') {
				continue;
			}

			const existingUserId = await findExistingClerkUserId(clerk, email);
			let account: NewAccount | null = null;

			if (existingUserId) {
				// Reuse the existing account; just make sure it can reach the portal.
				const existingUser = await clerk.users.getUser(existingUserId);
				await clerk.users.updateUser(existingUserId, {
					publicMetadata: {
						...existingUser.publicMetadata,
						roles: mergePortalRoles(existingUser.publicMetadata?.roles),
					},
				});
			} else {
				const password = generatePortalPassword();
				const { firstName, lastName } = splitName(client.name);
				await clerk.users.createUser({
					emailAddress: [email],
					password,
					firstName,
					lastName,
					publicMetadata: { roles: [...PORTAL_ROLES] },
				});
				account = { password };
				accountsCreated.push(email);
			}

			const { html, text } = buildQuotationEmail(
				quotation,
				{ ...client, email },
				account,
				getPortalUrl()
			);
			await ctx.runAction(api.email.send.send, {
				to: [email],
				subject: `Your quotation ${quotation.reference} — ${quotation.projectName}`,
				html,
				text,
				attachments: [
					{ filename: fileName, contentType: 'application/pdf', s3Key },
				],
				relatedTable: 'clientQuotations',
				relatedId: args.quotationId,
			});
			sent += 1;
		}

		if (sent === 0) {
			throw new ConvexError({
				code: 'NO_RECIPIENTS',
				message: 'This quotation has no client email addresses to send to.',
			});
		}

		await ctx.runMutation(internal.clientQuotations.internal.markSent, {
			quotationId: args.quotationId,
			sentBy: addedByFromIdentity(identity),
		});

		return { accountsCreated, sent };
	},
});
