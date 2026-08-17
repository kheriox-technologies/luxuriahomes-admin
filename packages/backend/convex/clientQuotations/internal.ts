import { v } from 'convex/values';
import type { Doc } from '../_generated/dataModel';
import { internalMutation, internalQuery } from '../_generated/server';
import {
	DEFAULT_VERSION_CHANGE_TYPE,
	FIRST_VERSION,
	getClientQuotationOrThrow,
	INITIAL_QUOTATION_STATUS,
	INITIAL_VERSION_DESCRIPTION,
	REVIEW_QUOTATION_STATUS,
	recordQuotationStatusEvent,
	SENT_VERSION_DESCRIPTION,
} from './shared';

/**
 * Database access for `sendToClients`, which runs in Node and therefore cannot
 * touch `ctx.db` directly. Both functions are internal: the action has already
 * checked that the caller is an admin.
 */

export const getForSend = internalQuery({
	args: { quotationId: v.id('clientQuotations') },
	handler: async (ctx, args): Promise<Doc<'clientQuotations'>> => {
		return await getClientQuotationOrThrow(ctx, args.quotationId);
	},
});

/**
 * The quotation plus the description of the revision it currently sits at, for
 * the email that tells clients a new version has been issued.
 *
 * Status events share a version number with the revision they happened against,
 * so only `Revision` rows are considered — otherwise a quotation approved at v2
 * would describe its latest version as "Approved".
 */
export const getRevisionForSend = internalQuery({
	args: { quotationId: v.id('clientQuotations') },
	handler: async (
		ctx,
		args
	): Promise<{
		description: string;
		quotation: Doc<'clientQuotations'>;
		version: number;
	}> => {
		const quotation = await getClientQuotationOrThrow(ctx, args.quotationId);
		const version = quotation.version ?? FIRST_VERSION;

		const rows = await ctx.db
			.query('clientQuotationVersions')
			.withIndex('by_quotation', (q) => q.eq('quotationId', args.quotationId))
			.collect();
		const revision = rows
			.filter(
				(row) =>
					row.version === version &&
					(row.changeType ?? DEFAULT_VERSION_CHANGE_TYPE) === 'Revision'
			)
			.sort((a, b) => b.updatedAt - a.updatedAt)[0];

		return {
			description: revision?.description ?? INITIAL_VERSION_DESCRIPTION,
			quotation,
			version,
		};
	},
});

/**
 * Moves a quotation into review once its clients have been emailed, and records
 * the send in the history against the version that was sent.
 *
 * Re-sending a quotation that is already under review is allowed — the status
 * stays put and the history simply gains another row.
 */
export const markSent = internalMutation({
	args: {
		quotationId: v.id('clientQuotations'),
		sentBy: v.string(),
	},
	handler: async (ctx, args) => {
		const quotation = await getClientQuotationOrThrow(ctx, args.quotationId);
		const sentAt = Date.now();

		if (quotation.status === INITIAL_QUOTATION_STATUS) {
			await ctx.db.patch(args.quotationId, {
				status: REVIEW_QUOTATION_STATUS,
				updatedAt: sentAt,
				updatedBy: args.sentBy,
			});
		}

		return await recordQuotationStatusEvent(ctx, {
			description: SENT_VERSION_DESCRIPTION,
			quotation,
			updatedAt: sentAt,
			updatedBy: args.sentBy,
		});
	},
});
