'use node';

/**
 * Renders the client quotation PDF.
 *
 * The document used to be built in the browser, which meant only the portal
 * could issue one — mobile had no pdfmake, and a quotation with no PDF can be
 * neither sent nor signed. Rendering here gives both clients the same file from
 * the same code, and keeps the figures printed on it derived from the snapshot
 * the server is about to store rather than from whatever the caller computed.
 *
 * Two entry points, for the two moments a document is produced:
 *
 *  - `generateQuotationPdf` renders a snapshot that has not been saved yet. The
 *    composer needs this because the PDF's key is part of what `create` stores,
 *    so the file has to exist first. A preview lands on a throwaway key and
 *    records nothing.
 *  - `generateSigningPdf` re-renders a saved quotation with the marks collected
 *    so far, and reports where every signing box landed.
 */

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { ConvexError, v } from 'convex/values';
import { api } from '../../_generated/api';
import type { Doc, Id } from '../../_generated/dataModel';
import { type ActionCtx, action } from '../../_generated/server';
import { checkIdentity, requireAdmin } from '../../lib/checkIdentity';
import { renderPdfToBuffer } from '../../projectInclusions/pdf/render';
import {
	quotationSignatureStyleValidator,
	quotationSnapshotArgs,
} from '../shared';
import { DEFAULT_SIGNATURE_STYLE } from '../signatureStyles';
import type { QuotationPdfAnchor } from './anchors';
import {
	buildQuotationDocDefinition,
	buildQuotationSignatureDocDefinition,
	collectAnchors,
} from './docDefinition';
import { QUOTATION_FONTS, QUOTATION_SIGNATURE_FONTS } from './fonts';
import {
	buildPendingVersionHistory,
	buildQuotationPdfInput,
	buildSignerSlots,
	pdfInputFromSnapshot,
	type StoredVersion,
} from './input';

/**
 * Where a rendered document ended up. Spelled out as a type as well as a
 * validator because the handlers call sibling actions through `ctx.runAction`,
 * and Convex's generated api types cannot be inferred through that cycle —
 * every handler here needs an explicit return annotation.
 */
interface RenderedDocument {
	documentId?: Id<'companyDocuments'>;
	fileName: string;
	folderPath: string;
	s3Key: string;
	size: number;
	url: string;
}

interface SigningRender {
	anchors: QuotationPdfAnchor[];
	basisSignatureIds: Id<'clientQuotationSignatures'>[];
	document?: {
		fileName: string;
		folderPath: string;
		kebabName: string;
		s3Key: string;
		size: number;
	};
	url: string;
	version: number;
}

const PDF_CONTENT_TYPE = 'application/pdf';
const QUOTATION_FOLDER_NAME = 'Client Quotations';
const SIGNED_URL_TTL_MS = 3_600_000;
const PREVIEW_PREFIX = 'company/quotations/previews';
const TRAILING_SLASH = /\/$/;

/**
 * Whose name the countersignature slot carries before it is signed. Matches the
 * portal's placeholder so a document rebuilt from either surface reads the same.
 */
const REPRESENTATIVE_PLACEHOLDER_NAME = 'Luxuria Homes';

/** Where one signing box landed, in PDF points from the page's top-left corner. */
const anchorValidator = v.object({
	height: v.number(),
	id: v.string(),
	kind: v.union(v.literal('initials'), v.literal('signature')),
	left: v.number(),
	page: v.number(),
	section: v.optional(v.number()),
	slotKey: v.string(),
	top: v.number(),
	width: v.number(),
});

/** Where a rendered document ended up, and how to open it. */
const renderedDocument = v.object({
	documentId: v.optional(v.id('companyDocuments')),
	fileName: v.string(),
	folderPath: v.string(),
	s3Key: v.string(),
	size: v.number(),
	url: v.string(),
});

const versionHistoryRow = v.object({
	changeType: v.union(v.literal('Revision'), v.literal('Status')),
	description: v.string(),
	updatedAt: v.number(),
	updatedBy: v.string(),
	version: v.number(),
});

function s3Config() {
	const region = process.env.AWS_REGION;
	const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
	const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
	const bucket = process.env.CDN_BUCKET_NAME;
	if (!(region && accessKeyId && secretAccessKey && bucket)) {
		throw new Error('Missing AWS configuration');
	}
	return { accessKeyId, bucket, region, secretAccessKey };
}

function buildSignedUrl(s3Key: string): string {
	const baseUrl = process.env.CDN_BASE_URL;
	const keyPairId = process.env.CDN_KEY_PAIR_ID;
	const privateKey = process.env.CDN_PRIVATE_KEY?.replace(/\\n/g, '\n');
	if (!(baseUrl && keyPairId && privateKey)) {
		throw new Error('Missing CDN configuration');
	}
	return getSignedUrl({
		url: `${baseUrl.replace(TRAILING_SLASH, '')}/${s3Key}`,
		keyPairId,
		privateKey,
		dateLessThan: new Date(Date.now() + SIGNED_URL_TTL_MS).toISOString(),
	});
}

async function putObject(s3Key: string, body: Buffer): Promise<void> {
	const { accessKeyId, bucket, region, secretAccessKey } = s3Config();
	const client = new S3Client({
		region,
		credentials: { accessKeyId, secretAccessKey },
		requestChecksumCalculation: 'WHEN_REQUIRED',
		responseChecksumValidation: 'WHEN_REQUIRED',
	});
	await client.send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: s3Key,
			Body: body,
			ContentType: PDF_CONTENT_TYPE,
		})
	);
}

/**
 * The document's filename. Version 1 is just the reference and project so the
 * client's copy reads cleanly; later revisions carry the version so a folder of
 * them sorts and reads sensibly.
 */
function quotationFileName(
	reference: string,
	projectName: string,
	version: number
): string {
	return version <= 1
		? `${reference} - ${projectName}.pdf`
		: `${reference} - ${projectName} - v${version}.pdf`;
}

/**
 * Files a rendered PDF in company documents and records it.
 *
 * Goes through `companyDocuments.generateUploadUrl` rather than putting the
 * object directly, because that action owns the kebab-name deduplication — two
 * revisions of the same quotation would otherwise collide on the same key.
 */
async function fileDocument(
	ctx: ActionCtx,
	options: { buffer: Buffer; fileName: string }
): Promise<RenderedDocument> {
	const folderPath: string = await ctx.runMutation(
		api.companyDocuments.ensureFolder.ensureFolder,
		{ parentPath: '', segments: [QUOTATION_FOLDER_NAME] }
	);
	const generated = await ctx.runAction(
		api.companyDocuments.generateUploadUrl.generateUploadUrl,
		{ folderPath, fileName: options.fileName, contentType: PDF_CONTENT_TYPE }
	);
	const response = await fetch(generated.uploadUrl, {
		method: 'PUT',
		body: new Uint8Array(options.buffer),
		headers: { 'Content-Type': PDF_CONTENT_TYPE },
	});
	if (!response.ok) {
		throw new ConvexError({
			code: 'UPLOAD_FAILED',
			message: 'Could not upload the quotation PDF',
		});
	}
	const documentId = await ctx.runMutation(api.companyDocuments.create.create, {
		folderPath,
		kebabName: generated.kebabName,
		name: options.fileName,
		s3Key: generated.s3Key,
		size: options.buffer.byteLength,
		mimeType: PDF_CONTENT_TYPE,
	});
	return {
		documentId,
		fileName: options.fileName,
		folderPath,
		s3Key: generated.s3Key,
		size: options.buffer.byteLength,
		url: buildSignedUrl(generated.s3Key),
	};
}

export const generateQuotationPdf = action({
	args: {
		...quotationSnapshotArgs,
		reference: v.string(),
		issuedAt: v.number(),
		version: v.number(),
		/**
		 * The revisions already issued. The row for the version being written is
		 * replaced when `amending`, appended otherwise — see
		 * `buildPendingVersionHistory`.
		 */
		issuedVersions: v.array(versionHistoryRow),
		amending: v.boolean(),
		pendingDescription: v.string(),
		/**
		 * A preview renders the document without filing it, so the composer's
		 * Preview button leaves nothing behind in company documents.
		 */
		preview: v.boolean(),
	},
	returns: renderedDocument,
	handler: async (ctx, args): Promise<RenderedDocument> => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		const savedBy = identity.name ?? identity.email ?? 'Unknown user';

		const {
			amending,
			issuedAt,
			issuedVersions,
			pendingDescription,
			preview,
			reference,
			version,
			...snapshot
		} = args;

		const input = pdfInputFromSnapshot({
			issuedAt,
			reference,
			snapshot,
			version,
			versionHistory: buildPendingVersionHistory({
				amending,
				issued: issuedVersions,
				pendingDescription,
				savedAt: Date.now(),
				savedBy,
				version,
			}),
		});

		const buffer = await renderPdfToBuffer(
			buildQuotationDocDefinition(input),
			QUOTATION_FONTS
		);
		const fileName = quotationFileName(
			reference,
			snapshot.projectName,
			version
		);

		if (preview) {
			// A throwaway key: no document row, no folder, and nothing for the
			// delete path to have to clean up later.
			const s3Key = `${PREVIEW_PREFIX}/${reference}-v${version}-${Date.now()}.pdf`;
			await putObject(s3Key, buffer);
			return {
				fileName,
				folderPath: '',
				s3Key,
				size: buffer.byteLength,
				url: buildSignedUrl(s3Key),
			};
		}

		return await fileDocument(ctx, { buffer, fileName });
	},
});

/**
 * Re-renders a quotation with the signatures collected so far, and reports
 * where every signing box landed.
 *
 * Called twice per signer: once with no `pending` mark to produce the document
 * they read and initial, and again with their mark to produce the copy that is
 * filed. The second call returns exactly what `recordSignature` needs, so the
 * caller never has to know how the signed PDF is named or where it lives.
 */
export const generateSigningPdf = action({
	args: {
		quotationId: v.id('clientQuotations'),
		surface: v.union(v.literal('admin'), v.literal('client')),
		/**
		 * The mark this signer is adding. Absent renders the document as it
		 * stands, which is what the signing UI opens with.
		 */
		pending: v.optional(
			v.object({
				initialsText: v.string(),
				signatureText: v.string(),
				style: quotationSignatureStyleValidator,
			})
		),
		/** A preview renders and reports anchors without filing anything. */
		preview: v.boolean(),
	},
	returns: v.object({
		anchors: v.array(anchorValidator),
		basisSignatureIds: v.array(v.id('clientQuotationSignatures')),
		/** Present only when the document was filed — absent on a preview. */
		document: v.optional(
			v.object({
				fileName: v.string(),
				folderPath: v.string(),
				kebabName: v.string(),
				s3Key: v.string(),
				size: v.number(),
			})
		),
		/** A signed CDN link to whatever was just rendered. */
		url: v.string(),
		version: v.number(),
	}),
	handler: async (ctx, args): Promise<SigningRender> => {
		const context = await ctx.runQuery(
			args.surface === 'client'
				? api.clientPortal.quotations.signingContext.signingContext
				: api.clientQuotations.signingContext.signingContext,
			{ quotationId: args.quotationId }
		);
		if (!context.authorized) {
			throw new ConvexError({
				code: 'FORBIDDEN',
				message: 'You are not a party to this quotation',
			});
		}

		const quotation = context.quotation as Doc<'clientQuotations'>;
		const style = args.pending?.style ?? DEFAULT_SIGNATURE_STYLE;

		// The final document carries everyone else's marks plus this signer's.
		const signatures = args.pending
			? [
					...context.signatures,
					{
						initialsText: args.pending.initialsText,
						name: context.signer.name,
						signatureText: args.pending.signatureText,
						signedAt: Date.now(),
						slotKey: context.signer.slotKey,
						style,
					},
				]
			: context.signatures;

		const built = buildQuotationSignatureDocDefinition(
			buildQuotationPdfInput({
				quotation,
				signers: buildSignerSlots(
					quotation,
					signatures,
					REPRESENTATIVE_PLACEHOLDER_NAME,
					style
				),
				versions: context.versions as StoredVersion[],
			})
		);
		const buffer = await renderPdfToBuffer(
			built.docDefinition,
			QUOTATION_SIGNATURE_FONTS
		);
		const anchors = collectAnchors(built.anchors);
		const version = quotation.version ?? 1;

		if (args.preview) {
			const s3Key = `${PREVIEW_PREFIX}/${quotation.reference}-signing-${Date.now()}.pdf`;
			await putObject(s3Key, buffer);
			return {
				anchors,
				basisSignatureIds: context.basisSignatureIds,
				url: buildSignedUrl(s3Key),
				version,
			};
		}

		// The signed copy is filed by the signature path, not the composer's:
		// that action derives the key and the filename server-side from the
		// quotation's own folder, and authorizes clients as well as admins.
		const upload = await ctx.runAction(
			api.clientQuotations.generateSignatureUploadUrl
				.generateSignatureUploadUrl,
			{ quotationId: args.quotationId }
		);
		const response = await fetch(upload.uploadUrl, {
			method: 'PUT',
			body: new Uint8Array(buffer),
			headers: { 'Content-Type': PDF_CONTENT_TYPE },
		});
		if (!response.ok) {
			throw new ConvexError({
				code: 'UPLOAD_FAILED',
				message: 'Could not upload the signed quotation',
			});
		}

		return {
			anchors,
			basisSignatureIds: context.basisSignatureIds,
			document: {
				fileName: upload.fileName,
				folderPath: upload.folderPath,
				kebabName: upload.kebabName,
				s3Key: upload.s3Key,
				size: buffer.byteLength,
			},
			url: buildSignedUrl(upload.s3Key),
			version,
		};
	},
});
