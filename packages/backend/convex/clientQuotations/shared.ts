import { ConvexError, type Infer, v } from 'convex/values';
import type { Doc, Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import { buildClientQuotationSearchText } from '../lib/buildSearchText';
import { australianAddressValidator } from '../projects/shared';

const AUSTRALIAN_POSTCODE_REGEX = /^\d{4}$/;
const MAX_CLIENTS = 4;
const PERCENT_TOTAL = 100;
// Percentages are entered to two decimals, so anything inside half a cent of
// 100 is a rounding artefact rather than a real imbalance.
const PERCENT_EPSILON = 0.005;
const GST_DIVISOR = 1.1;
const MAX_VERSION_DESCRIPTION_LENGTH = 200;

/** Every quotation starts here; only later revisions are described by the user. */
export const INITIAL_VERSION_DESCRIPTION = 'Initial version';
export const FIRST_VERSION = 1;

/**
 * Where a quotation sits in its lifecycle. 'Draft' and 'Approved' are reachable
 * today; the rest arrive with the send and signature workflows.
 */
export const clientQuotationStatusValidator = v.union(
	v.literal('Draft'),
	v.literal('Under Review'),
	v.literal('Approved'),
	v.literal('Awaiting Signatures'),
	v.literal('Signed')
);

/** Every quotation starts here. */
export const INITIAL_QUOTATION_STATUS = 'Draft' as const;

/** The only status a quotation can be approved from. */
export const REVIEW_QUOTATION_STATUS = 'Under Review' as const;
export const APPROVED_QUOTATION_STATUS = 'Approved' as const;

/** How an approval reads in the version history. */
export const APPROVAL_VERSION_DESCRIPTION = 'Approved' as const;

/** How a revision that undoes an approval reads in the version history. */
export const REOPENED_VERSION_DESCRIPTION =
	'Returned to review — revised after approval' as const;

export type ClientQuotationStatus = Infer<
	typeof clientQuotationStatusValidator
>;

/**
 * Whether issuing a new version from this status has to send the quotation back
 * for approval. What the clients approved — or signed off on — no longer exists
 * once the figures change, so their decision cannot carry over to the revision.
 */
export function requiresReapproval(status: ClientQuotationStatus): boolean {
	return (
		status === APPROVED_QUOTATION_STATUS ||
		status === 'Awaiting Signatures' ||
		status === 'Signed'
	);
}

/** How issuing a quotation to its clients reads in the version history. */
export const SENT_VERSION_DESCRIPTION = 'Sent to client' as const;

/** Collecting signatures, and the terminal state once everyone has signed. */
export const AWAITING_SIGNATURES_STATUS = 'Awaiting Signatures' as const;
export const SIGNED_QUOTATION_STATUS = 'Signed' as const;

/** How the signature ceremony reads in the version history. */
export const SIGNATURES_REQUESTED_DESCRIPTION = 'Signatures requested' as const;
export const SIGNATURES_VOIDED_DESCRIPTION =
	'Signatures voided — quotation revised' as const;
export const FULLY_SIGNED_DESCRIPTION = 'Fully signed' as const;

export function signatureVersionDescription(signerName: string): string {
	return `Signed by ${signerName}`;
}

/**
 * Who a signature belongs to. Clients sign what they were quoted; the
 * representative countersigns on behalf of Luxuria Homes once they all have.
 */
export const quotationSignerRoleValidator = v.union(
	v.literal('Client'),
	v.literal('Representative')
);

export type QuotationSignerRole = Infer<typeof quotationSignerRoleValidator>;

/**
 * The script face a signature is drawn in. Mirrors `SIGNATURE_STYLES` in
 * apps/portal/lib/client/pdf/signature-styles.ts, which owns the font files —
 * adding a style means editing both.
 */
export const quotationSignatureStyleValidator = v.union(
	v.literal('flowing'),
	v.literal('casual'),
	v.literal('hand')
);

/**
 * The key a signature's marks are anchored to in the PDF. Quotation clients have
 * no stable id, so the slot is their position in `quotation.clients` — which is
 * why a signature stores the index it was collected against rather than
 * recomputing it from the email each time the document is rebuilt.
 */
export function signatureSlotKey(signature: {
	clientIndex?: number;
	role: QuotationSignerRole;
}): string {
	return signature.role === 'Representative'
		? 'rep'
		: `client-${signature.clientIndex ?? 0}`;
}

export const REPRESENTATIVE_SLOT_KEY = 'rep';

/** The key an email is matched on, here and in `isQuotationClient`. */
export function normalizeSignerEmail(email: string): string {
	return email.trim().toLowerCase();
}

/**
 * The signatures still standing against a version. Voided rows are kept so the
 * trail survives a revision, but they no longer count towards completion and are
 * never drawn into the document.
 */
export async function readActiveSignatures(
	ctx: QueryCtx,
	quotationId: Id<'clientQuotations'>,
	version: number
): Promise<Doc<'clientQuotationSignatures'>[]> {
	const rows = await ctx.db
		.query('clientQuotationSignatures')
		.withIndex('by_quotation_version', (q) =>
			q.eq('quotationId', quotationId).eq('version', version)
		)
		.collect();
	return rows
		.filter((row) => row.voidedAt === undefined)
		.sort((a, b) => a.signedAt - b.signedAt);
}

/**
 * Retires every signature collected against a version, because the document
 * those signers accepted no longer exists. Returns how many were voided so the
 * caller only writes a history row when something actually changed.
 */
export async function voidSignaturesForVersion(
	ctx: MutationCtx,
	quotationId: Id<'clientQuotations'>,
	version: number,
	voidedAt: number
): Promise<number> {
	const active = await readActiveSignatures(ctx, quotationId, version);
	await Promise.all(active.map((row) => ctx.db.patch(row._id, { voidedAt })));
	return active.length;
}

/** The four fields that hold the signed PDF, cleared together when it is voided. */
export const CLEARED_SIGNED_DOCUMENT = {
	signedDocumentId: undefined,
	signedS3Key: undefined,
	signedFileName: undefined,
	signedFolderPath: undefined,
} as const;

/**
 * How far through the ceremony a quotation is. A client with no email address
 * cannot be sent a link, so they are not counted as an outstanding signer —
 * otherwise the quotation could never complete.
 */
export function signatureProgress(
	quotation: Doc<'clientQuotations'>,
	active: Doc<'clientQuotationSignatures'>[]
): { allClientsSigned: boolean; complete: boolean } {
	const signed = new Set(active.map((row) => row.signerEmail));
	const expected = quotation.clients
		.map((client) => normalizeSignerEmail(client.email))
		.filter((email) => email.length > 0);
	const allClientsSigned =
		expected.length > 0 && expected.every((email) => signed.has(email));
	return {
		allClientsSigned,
		complete:
			allClientsSigned && active.some((row) => row.role === 'Representative'),
	};
}

export const quotationClientValidator = v.object({
	name: v.string(),
	email: v.string(),
	phone: v.string(),
});

export const quotationItemSnapshotValidator = v.object({
	// Provenance only — the catalogue row may later be renamed or deleted, which
	// must never change an issued quotation.
	itemId: v.optional(v.id('quoteItems')),
	name: v.string(),
	order: v.number(),
});

export const quotationSectionSnapshotValidator = v.object({
	sectionId: v.optional(v.id('quoteSections')),
	name: v.string(),
	order: v.number(),
	items: v.array(quotationItemSnapshotValidator),
});

export const quotationStageSnapshotValidator = v.object({
	stageId: v.optional(v.id('quoteStages')),
	name: v.string(),
	order: v.number(),
	// Share of the contract sum; the set totals exactly 100.
	percent: v.number(),
	// Inclusive-of-GST dollars; the set sums exactly to `totalInclGst`.
	amount: v.number(),
	scopeSummary: v.optional(v.string()),
	// Empty when every item under the stage was deselected — the stage still
	// prints in the payment schedule, just without an inclusions block.
	sections: v.array(quotationSectionSnapshotValidator),
});

/** One exclusion or important note, snapshotted in the order it prints. */
export const quotationEntrySnapshotValidator = v.object({
	text: v.string(),
	order: v.number(),
});

/**
 * An extra inclusion specific to one quotation, on top of everything pulled
 * from the template. The amount is admin reference only — it is added to the
 * contract total but never printed on the client-facing PDF.
 */
export const quotationSpecialInclusionValidator = v.object({
	text: v.string(),
	amount: v.optional(v.number()),
	order: v.number(),
});

export const quotationTermsSnapshotValidator = v.object({
	disclaimerHtml: v.string(),
	acknowledgementHtml: v.string(),
	sections: v.array(
		v.object({
			name: v.string(),
			order: v.number(),
			items: v.array(v.string()),
		})
	),
});

/**
 * Everything the composer posts about the body of a quotation, shared by
 * `create`, `update` and `saveVersion`. The fields that identify a quotation —
 * the reference, the issue date, the version being written — are declared by
 * each mutation instead, because only some of them accept each one.
 */
export const quotationSnapshotArgs = {
	projectName: v.string(),
	description: v.optional(v.string()),
	clients: v.array(quotationClientValidator),
	address: australianAddressValidator,
	budgetTemplateId: v.optional(v.id('budgetTemplates')),
	budgetTemplateTitle: v.optional(v.string()),
	budgetTemplateTotal: v.optional(v.number()),
	budgetAmount: v.number(),
	marginPercent: v.optional(v.number()),
	totalInclGst: v.number(),
	stages: v.array(quotationStageSnapshotValidator),
	terms: quotationTermsSnapshotValidator,
	specialInclusions: v.array(quotationSpecialInclusionValidator),
	exclusions: v.array(quotationEntrySnapshotValidator),
	notes: v.array(quotationEntrySnapshotValidator),
	// The template the quotation was composed from. Provenance only — the body
	// above is a complete snapshot, so the template can be edited or deleted
	// later without touching an issued quotation.
	templateId: v.optional(v.id('quoteTemplates')),
	documentId: v.optional(v.id('companyDocuments')),
	s3Key: v.optional(v.string()),
	fileName: v.optional(v.string()),
	folderPath: v.optional(v.string()),
};

const quotationSnapshotValidator = v.object(quotationSnapshotArgs);

export type QuotationSnapshotArgs = Infer<typeof quotationSnapshotValidator>;

export interface QuotationClient {
	email: string;
	name: string;
	phone: string;
}

export interface QuotationStageSnapshot {
	amount: number;
	name: string;
	percent: number;
}

function round2(value: number): number {
	return Math.round(value * 100) / 100;
}

/**
 * All prices are quoted inclusive of GST, so the contract sum and GST line are
 * derived from the total rather than stored independently.
 */
export function splitGst(totalInclGst: number): {
	contractSumExclGst: number;
	gstAmount: number;
} {
	const contractSumExclGst = round2(totalInclGst / GST_DIVISOR);
	return {
		contractSumExclGst,
		gstAmount: round2(totalInclGst - contractSumExclGst),
	};
}

export function parseQuotationClients(
	clients: QuotationClient[]
): QuotationClient[] {
	const parsed = clients.map((client) => ({
		name: client.name.trim(),
		email: client.email.trim(),
		phone: client.phone.trim(),
	}));
	if (parsed.length === 0 || parsed.length > MAX_CLIENTS) {
		throw new ConvexError({
			code: 'INVALID_CLIENTS',
			message: `A quotation needs between 1 and ${MAX_CLIENTS} clients`,
		});
	}
	if (parsed.some((client) => client.name.length === 0)) {
		throw new ConvexError({
			code: 'INVALID_CLIENTS',
			message: 'Every client needs a name',
		});
	}
	return parsed;
}

export function assertStagePercentsTotal(
	stages: QuotationStageSnapshot[]
): void {
	const total = stages.reduce((sum, stage) => sum + stage.percent, 0);
	if (Math.abs(total - PERCENT_TOTAL) > PERCENT_EPSILON) {
		throw new ConvexError({
			code: 'INVALID_PERCENTAGES',
			message: `Stage percentages total ${total}% — they must total exactly 100%`,
		});
	}
}

export function assertAustralianPostcode(postcode: string): void {
	if (!AUSTRALIAN_POSTCODE_REGEX.test(postcode)) {
		throw new ConvexError({
			code: 'INVALID_POSTCODE',
			message: 'Postcode must be 4 digits',
		});
	}
}

export function assertPositiveTotal(totalInclGst: number): void {
	if (!Number.isFinite(totalInclGst) || totalInclGst <= 0) {
		throw new ConvexError({
			code: 'INVALID_TOTAL',
			message: 'Total price must be greater than zero',
		});
	}
}

export function parseVersionDescription(description: string): string {
	const trimmed = description.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_DESCRIPTION',
			message: 'Describe what changed in this version',
		});
	}
	if (trimmed.length > MAX_VERSION_DESCRIPTION_LENGTH) {
		throw new ConvexError({
			code: 'INVALID_DESCRIPTION',
			message: `Keep the version description under ${MAX_VERSION_DESCRIPTION_LENGTH} characters`,
		});
	}
	return trimmed;
}

/**
 * Validates a snapshot posted from the composer and returns the fields written
 * to the quotation row. Every rule a quotation must satisfy lives here, so
 * `create`, `update` and `saveVersion` cannot drift apart.
 *
 * The derived figures are computed here rather than trusted from the client, so
 * the stored contract sum and GST always agree with the total that was quoted.
 */
/**
 * Drops blank rows, discards a zero or negative amount and reindexes the order
 * so the stored list matches exactly what the composer showed.
 */
function parseSpecialInclusions(
	entries: QuotationSnapshotArgs['specialInclusions']
) {
	return entries
		.map((entry) => ({ ...entry, text: entry.text.trim() }))
		.filter((entry) => entry.text.length > 0)
		.map((entry, index) => ({
			text: entry.text,
			amount:
				entry.amount !== undefined && entry.amount > 0
					? entry.amount
					: undefined,
			order: index,
		}));
}

export function buildQuotationSnapshotPatch(
	args: QuotationSnapshotArgs,
	reference: string
) {
	const projectName = args.projectName.trim();
	if (projectName.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Project name is required',
		});
	}

	const clients = parseQuotationClients(args.clients);
	assertAustralianPostcode(args.address.postcode);
	assertPositiveTotal(args.totalInclGst);
	assertStagePercentsTotal(args.stages);
	const { contractSumExclGst, gstAmount } = splitGst(args.totalInclGst);

	return {
		projectName,
		description: args.description?.trim() || undefined,
		clients,
		address: args.address,
		budgetTemplateId: args.budgetTemplateId,
		budgetTemplateTitle: args.budgetTemplateTitle,
		budgetTemplateTotal: args.budgetTemplateTotal,
		budgetAmount: args.budgetAmount,
		marginPercent: args.marginPercent,
		totalInclGst: args.totalInclGst,
		contractSumExclGst,
		gstAmount,
		stages: args.stages,
		terms: args.terms,
		specialInclusions: parseSpecialInclusions(args.specialInclusions),
		exclusions: args.exclusions,
		notes: args.notes,
		templateId: args.templateId,
		documentId: args.documentId,
		s3Key: args.s3Key,
		fileName: args.fileName,
		folderPath: args.folderPath,
		searchText: buildClientQuotationSearchText({
			address: args.address,
			clients,
			projectName,
			reference,
		}),
	};
}

/** The PDF issued for one version, and where it is filed. */
export interface QuotationVersionDocument {
	documentId?: Id<'companyDocuments'>;
	fileName?: string;
	folderPath?: string;
	s3Key?: string;
}

/** What a history row records: a new snapshot, or a move through the lifecycle. */
export type QuotationVersionChangeType = 'Revision' | 'Status';

/** Rows written before status events existed are all revisions. */
export const DEFAULT_VERSION_CHANGE_TYPE = 'Revision' as const;

/**
 * Appends a history row. Shared by `create`, `update` and `approve` so the row
 * shape — and the document fields that make each version's PDF openable — live
 * in one place.
 */
export async function insertQuotationVersion(
	ctx: MutationCtx,
	args: QuotationVersionDocument & {
		changeType?: QuotationVersionChangeType;
		description: string;
		quotationId: Id<'clientQuotations'>;
		totalInclGst: number;
		updatedAt: number;
		updatedBy: string;
		version: number;
	}
): Promise<Id<'clientQuotationVersions'>> {
	return await ctx.db.insert('clientQuotationVersions', {
		quotationId: args.quotationId,
		version: args.version,
		changeType: args.changeType,
		description: args.description,
		updatedBy: args.updatedBy,
		updatedAt: args.updatedAt,
		totalInclGst: args.totalInclGst,
		documentId: args.documentId,
		s3Key: args.s3Key,
		fileName: args.fileName,
		folderPath: args.folderPath,
	});
}

/**
 * The version-1 row a quotation would have had if versioning had existed when it
 * was issued. Used both to backfill on first edit and to answer `listVersions`
 * for rows that have no history yet, so no migration is needed.
 */
export function initialVersionFrom(quotation: Doc<'clientQuotations'>): {
	description: string;
	documentId?: Id<'companyDocuments'>;
	fileName?: string;
	folderPath?: string;
	s3Key?: string;
	totalInclGst: number;
	updatedAt: number;
	updatedBy: string;
	version: number;
} {
	return {
		description: INITIAL_VERSION_DESCRIPTION,
		documentId: quotation.documentId,
		fileName: quotation.fileName,
		folderPath: quotation.folderPath,
		s3Key: quotation.s3Key,
		totalInclGst: quotation.totalInclGst,
		updatedAt: quotation.createdAt,
		updatedBy: quotation.createdBy,
		version: FIRST_VERSION,
	};
}

/**
 * Records a lifecycle event — an approval, an issue to the clients — against the
 * quotation's current version.
 *
 * A status event changes nothing about what was quoted, so the version is
 * deliberately left where it is and no new PDF is issued. Quotations issued
 * before versioning existed have no history rows, so the revision the event
 * happened against is backfilled first — otherwise the event would be the only
 * entry in the trail.
 *
 * Shared by the admin and client-portal paths so both write an identical row.
 */
export async function recordQuotationStatusEvent(
	ctx: MutationCtx,
	args: {
		description: string;
		quotation: Doc<'clientQuotations'>;
		updatedAt: number;
		updatedBy: string;
	}
): Promise<number> {
	const history = await ctx.db
		.query('clientQuotationVersions')
		.withIndex('by_quotation', (q) => q.eq('quotationId', args.quotation._id))
		.collect();
	if (history.length === 0) {
		await insertQuotationVersion(ctx, {
			quotationId: args.quotation._id,
			...initialVersionFrom(args.quotation),
		});
	}

	const currentVersion = args.quotation.version ?? FIRST_VERSION;

	// No document fields: a status event issues no new PDF, so the row points at
	// nothing to open.
	await insertQuotationVersion(ctx, {
		quotationId: args.quotation._id,
		version: currentVersion,
		changeType: 'Status',
		description: args.description,
		updatedBy: args.updatedBy,
		updatedAt: args.updatedAt,
		totalInclGst: args.quotation.totalInclGst,
	});

	return currentVersion;
}

/**
 * The history of one quotation, newest first — its revisions plus the lifecycle
 * events recorded against them.
 *
 * Rows issued before versioning existed have no history, so a version-1 row is
 * synthesised from the quotation itself — callers never have to special-case
 * legacy data, and `update` writes the same row when it backfills.
 */
function statusEventRank(changeType: QuotationVersionChangeType): number {
	return changeType === 'Status' ? 1 : 0;
}

export async function readQuotationVersions(
	ctx: QueryCtx,
	quotation: Doc<'clientQuotations'>
) {
	const rows = await ctx.db
		.query('clientQuotationVersions')
		.withIndex('by_quotation', (q) => q.eq('quotationId', quotation._id))
		.collect();

	const versions =
		rows.length === 0
			? [
					{
						...initialVersionFrom(quotation),
						changeType: DEFAULT_VERSION_CHANGE_TYPE,
					},
				]
			: rows.map((row) => ({
					changeType: row.changeType ?? DEFAULT_VERSION_CHANGE_TYPE,
					description: row.description,
					documentId: row.documentId,
					fileName: row.fileName,
					folderPath: row.folderPath,
					s3Key: row.s3Key,
					totalInclGst: row.totalInclGst,
					updatedAt: row.updatedAt,
					updatedBy: row.updatedBy,
					version: row.version,
				}));

	// A status event shares its version with the revision it happened against, so
	// the tiebreak puts the newer entry — the event — on top. Both can be written
	// in the same instant (a revision that reopens the quotation for approval), so
	// an equal timestamp falls back to the event, which can only have come after.
	return versions.sort(
		(a, b) =>
			b.version - a.version ||
			b.updatedAt - a.updatedAt ||
			statusEventRank(b.changeType) - statusEventRank(a.changeType)
	);
}

export async function getClientQuotationOrThrow(
	ctx: QueryCtx,
	quotationId: Id<'clientQuotations'>
) {
	const quotation = await ctx.db.get(quotationId);
	if (!quotation) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Quotation not found',
		});
	}
	return quotation;
}

/**
 * Attaches a note count to each row so the list can flag which quotations carry
 * commentary without fanning out a query per row on the client.
 */
export async function withNoteCounts(
	ctx: QueryCtx,
	rows: Doc<'clientQuotations'>[]
) {
	return await Promise.all(
		rows.map(async (row) => {
			const notes = await ctx.db
				.query('clientQuotationNotes')
				.withIndex('by_quotation', (q) => q.eq('quotationId', row._id))
				.collect();
			return { ...row, noteCount: notes.length };
		})
	);
}

/** The display name stored on a note — the identity's name, else its email. */
export function addedByFromIdentity(identity: {
	email?: string;
	name?: string;
}): string {
	const name = identity.name?.trim();
	if (name) {
		return name;
	}
	const email = identity.email?.trim();
	if (email) {
		return email;
	}
	return 'Unknown user';
}
