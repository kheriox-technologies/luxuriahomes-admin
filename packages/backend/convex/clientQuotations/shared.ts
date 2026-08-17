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
	exclusions: v.array(quotationEntrySnapshotValidator),
	notes: v.array(quotationEntrySnapshotValidator),
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
		exclusions: args.exclusions,
		notes: args.notes,
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
