import { v } from 'convex/values';
import type { Doc } from '../_generated/dataModel';
import type { QueryCtx } from '../_generated/server';
import {
	AWAITING_SIGNATURES_STATUS,
	FIRST_VERSION,
	normalizeSignerEmail,
	type QuotationSignerRole,
	REPRESENTATIVE_SLOT_KEY,
	readActiveSignatures,
	readQuotationVersions,
	signatureProgress,
	signatureSlotKey,
} from './shared';

/**
 * Everything a signing session needs, for whichever party is signing.
 *
 * One shape for both surfaces so the signing UI is written once: a client and
 * the Luxuria Homes representative see the same document and the same marks
 * already on it, and differ only in which slot is theirs to fill.
 */
export const signingContextValidator = v.union(
	v.object({ authorized: v.literal(false) }),
	v.object({
		authorized: v.literal(true),
		alreadySigned: v.boolean(),
		// The ids of the signatures the browser is about to build its PDF from.
		// Handed back on submit so a signature collected in the meantime is caught
		// rather than silently overwritten.
		basisSignatureIds: v.array(v.id('clientQuotationSignatures')),
		canSign: v.boolean(),
		// Why not, when `canSign` is false — so the page can say so plainly.
		blockedReason: v.optional(
			v.union(
				v.literal('NOT_REQUESTED'),
				v.literal('CLIENTS_PENDING'),
				v.literal('ALREADY_SIGNED')
			)
		),
		quotation: v.any(),
		signatures: v.array(
			v.object({
				initialsText: v.string(),
				name: v.string(),
				signatureText: v.string(),
				signedAt: v.number(),
				slotKey: v.string(),
				style: v.string(),
			})
		),
		signer: v.object({
			clientIndex: v.optional(v.number()),
			email: v.string(),
			name: v.string(),
			role: v.union(v.literal('Client'), v.literal('Representative')),
			slotKey: v.string(),
		}),
		versions: v.array(v.any()),
	})
);

export interface SigningSigner {
	clientIndex?: number;
	email: string;
	name: string;
	role: QuotationSignerRole;
}

/**
 * Assembles the signing context. The caller has already established *who* is
 * signing; this only works out what they can see and do.
 */
export async function buildSigningContext(
	ctx: QueryCtx,
	quotation: Doc<'clientQuotations'>,
	signer: SigningSigner
) {
	const version = quotation.version ?? FIRST_VERSION;
	const active = await readActiveSignatures(ctx, quotation._id, version);
	const versions = await readQuotationVersions(ctx, quotation);

	const slotKey =
		signer.role === 'Representative'
			? REPRESENTATIVE_SLOT_KEY
			: signatureSlotKey({ role: 'Client', clientIndex: signer.clientIndex });

	const signerEmail = normalizeSignerEmail(signer.email);
	const alreadySigned = active.some((row) => row.signerEmail === signerEmail);
	const { allClientsSigned } = signatureProgress(quotation, active);

	// The representative countersigns what the clients have agreed to, so their
	// slot only opens once every client has signed.
	const blockedReason = (() => {
		if (quotation.status !== AWAITING_SIGNATURES_STATUS) {
			return 'NOT_REQUESTED' as const;
		}
		if (alreadySigned) {
			return 'ALREADY_SIGNED' as const;
		}
		if (signer.role === 'Representative' && !allClientsSigned) {
			return 'CLIENTS_PENDING' as const;
		}
		return;
	})();

	return {
		authorized: true as const,
		alreadySigned,
		basisSignatureIds: active.map((row) => row._id),
		canSign: blockedReason === undefined,
		blockedReason,
		quotation,
		signatures: active.map((row) => ({
			initialsText: row.initialsText,
			name: row.signerName,
			signatureText: row.signatureText,
			signedAt: row.signedAt,
			slotKey: signatureSlotKey(row),
			style: row.style,
		})),
		signer: {
			clientIndex: signer.clientIndex,
			email: signerEmail,
			name: signer.name,
			role: signer.role,
			slotKey,
		},
		versions,
	};
}
