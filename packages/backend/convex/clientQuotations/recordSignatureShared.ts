import { ConvexError, v } from 'convex/values';
import { internal } from '../_generated/api';
import type { Doc, Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import { createNotification, quotationsLink } from '../notifications/shared';
import {
	AWAITING_SIGNATURES_STATUS,
	FIRST_VERSION,
	FULLY_SIGNED_DESCRIPTION,
	initialVersionFrom,
	insertQuotationVersion,
	normalizeSignerEmail,
	type QuotationSignerRole,
	quotationSignatureStyleValidator,
	readActiveSignatures,
	SIGNED_QUOTATION_STATUS,
	signatureProgress,
	signatureVersionDescription,
} from './shared';

/** The document the signer generated and uploaded before calling this. */
export const signedDocumentArgs = {
	fileName: v.string(),
	folderPath: v.string(),
	kebabName: v.string(),
	s3Key: v.string(),
	size: v.optional(v.number()),
};

export const recordSignatureArgs = {
	quotationId: v.id('clientQuotations'),
	// The version the signer was shown. A revision in the meantime invalidates
	// what they signed, so it is checked rather than assumed.
	version: v.number(),
	// The signatures the signer's document was built from. Any difference means
	// someone else signed while they were signing, and their copy is missing that
	// signature — see the staleness guard below.
	basisSignatureIds: v.array(v.id('clientQuotationSignatures')),
	style: quotationSignatureStyleValidator,
	signatureText: v.string(),
	initialsText: v.string(),
	document: v.object(signedDocumentArgs),
};

export const recordSignatureReturns = v.object({
	allClientsSigned: v.boolean(),
	complete: v.boolean(),
});

export interface RecordSignatureArgs {
	basisSignatureIds: Id<'clientQuotationSignatures'>[];
	document: {
		fileName: string;
		folderPath: string;
		kebabName: string;
		s3Key: string;
		size?: number;
	};
	initialsText: string;
	quotationId: Id<'clientQuotations'>;
	signatureText: string;
	style: 'flowing' | 'casual' | 'hand';
	version: number;
}

export interface RecordSignatureSigner {
	clientIndex?: number;
	email: string;
	name: string;
	role: QuotationSignerRole;
	subject: string;
}

function sameIdSet(
	a: Id<'clientQuotationSignatures'>[],
	b: Id<'clientQuotationSignatures'>[]
): boolean {
	if (a.length !== b.length) {
		return false;
	}
	const seen = new Set<string>(a);
	return b.every((id) => seen.has(id));
}

/**
 * Records one signature, files the document it produced, and moves the quotation
 * on if that was the last one outstanding.
 *
 * Shared by the client-portal and admin mutations so a client's signature and
 * the countersignature cannot drift apart in what they write.
 *
 * Signing is optimistic: the signer builds the PDF in their browser from the
 * signatures collected so far, then submits it here. If someone else signed in
 * the meantime, the document they uploaded is missing that signature — so the
 * basis is compared against the live set and the submission is rejected rather
 * than allowed to erase it. Convex mutations are serializable, so two signers
 * racing cannot both pass this check.
 */
export async function recordSignatureFor(
	ctx: MutationCtx,
	quotation: Doc<'clientQuotations'>,
	signer: RecordSignatureSigner,
	args: RecordSignatureArgs
): Promise<{ allClientsSigned: boolean; complete: boolean }> {
	if (quotation.status !== AWAITING_SIGNATURES_STATUS) {
		throw new ConvexError({
			code: 'INVALID_STATUS',
			message: 'This quotation is not awaiting signatures.',
		});
	}

	const version = quotation.version ?? FIRST_VERSION;
	if (args.version !== version) {
		throw new ConvexError({
			code: 'STALE_VERSION',
			message:
				'This quotation was revised while you were signing. Please reopen the latest version.',
		});
	}

	const active = await readActiveSignatures(ctx, quotation._id, version);
	if (
		!sameIdSet(
			active.map((row) => row._id),
			args.basisSignatureIds
		)
	) {
		throw new ConvexError({
			code: 'STALE_SIGNATURES',
			message:
				'Someone else signed while you were signing. Please review the updated document and sign again.',
		});
	}

	const signerEmail = normalizeSignerEmail(signer.email);
	if (active.some((row) => row.signerEmail === signerEmail)) {
		throw new ConvexError({
			code: 'ALREADY_SIGNED',
			message: 'You have already signed this quotation.',
		});
	}

	const { allClientsSigned: clientsDoneBefore } = signatureProgress(
		quotation,
		active
	);
	if (signer.role === 'Representative' && !clientsDoneBefore) {
		throw new ConvexError({
			code: 'CLIENTS_PENDING',
			message: 'Every client has to sign before Luxuria Homes can countersign.',
		});
	}

	const signedAt = Date.now();

	const documentId = await ctx.db.insert('companyDocuments', {
		name: args.document.fileName,
		kebabName: args.document.kebabName,
		s3Key: args.document.s3Key,
		folderPath: args.document.folderPath,
		size: args.document.size,
		mimeType: 'application/pdf',
		uploadedBy: signer.name,
		uploadedAt: signedAt,
	});

	await ctx.db.insert('clientQuotationSignatures', {
		quotationId: quotation._id,
		version,
		role: signer.role,
		signerEmail,
		signerName: signer.name,
		clientIndex: signer.clientIndex,
		style: args.style,
		signatureText: args.signatureText.trim(),
		initialsText: args.initialsText.trim(),
		signedAt,
		signedBySubject: signer.subject,
	});

	// Only the signed fields move. The approved document has to stay openable
	// exactly as it was issued.
	await ctx.db.patch(quotation._id, {
		signedDocumentId: documentId,
		signedS3Key: args.document.s3Key,
		signedFileName: args.document.fileName,
		signedFolderPath: args.document.folderPath,
		updatedAt: signedAt,
		updatedBy: signer.name,
	});

	// Quotations issued before versioning have no history, so the revision this
	// signature happened against is backfilled before the event is recorded.
	const history = await ctx.db
		.query('clientQuotationVersions')
		.withIndex('by_quotation', (q) => q.eq('quotationId', quotation._id))
		.collect();
	if (history.length === 0) {
		await insertQuotationVersion(ctx, {
			quotationId: quotation._id,
			...initialVersionFrom(quotation),
		});
	}

	// Written directly rather than through `recordQuotationStatusEvent`, which
	// deliberately carries no document fields: every intermediate signed copy has
	// to stay openable from the version panel.
	await insertQuotationVersion(ctx, {
		quotationId: quotation._id,
		version,
		changeType: 'Status',
		description: signatureVersionDescription(signer.name),
		updatedBy: signer.name,
		updatedAt: signedAt,
		totalInclGst: quotation.totalInclGst,
		documentId,
		s3Key: args.document.s3Key,
		fileName: args.document.fileName,
		folderPath: args.document.folderPath,
	});

	const after = await readActiveSignatures(ctx, quotation._id, version);
	const { allClientsSigned, complete } = signatureProgress(quotation, after);

	if (complete) {
		await ctx.db.patch(quotation._id, {
			status: SIGNED_QUOTATION_STATUS,
			updatedAt: signedAt,
			updatedBy: signer.name,
		});
		await insertQuotationVersion(ctx, {
			quotationId: quotation._id,
			version,
			changeType: 'Status',
			description: FULLY_SIGNED_DESCRIPTION,
			updatedBy: signer.name,
			updatedAt: signedAt,
			totalInclGst: quotation.totalInclGst,
			documentId,
			s3Key: args.document.s3Key,
			fileName: args.document.fileName,
			folderPath: args.document.folderPath,
		});
		await ctx.scheduler.runAfter(
			0,
			internal.clientQuotations.signatureEmails.notifyFullySigned,
			{ quotationId: quotation._id }
		);
	} else if (allClientsSigned) {
		await ctx.scheduler.runAfter(
			0,
			internal.clientQuotations.signatureEmails.notifyRepresentative,
			{ quotationId: quotation._id }
		);
	}

	await createNotification(ctx, {
		type: 'quotation_signed',
		fromName: signer.name,
		fromEmail: signerEmail,
		message: complete
			? `Quotation ${quotation.reference} (${quotation.projectName}) has been signed by all parties`
			: `signed quotation ${quotation.reference} — ${quotation.projectName}`,
		link: quotationsLink(),
	});

	return { allClientsSigned, complete };
}
