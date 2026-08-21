import type { Doc } from '../../_generated/dataModel';
import { formatIssueDate } from '../formatting';
import { type QuotationSnapshotArgs, splitGst } from '../shared';
import type { SignatureStyleId } from '../signatureStyles';
import type {
	QuotationPdfInput,
	QuotationPdfSignerSlot,
	QuotationPdfVersion,
} from './docDefinition';

/**
 * Rebuilds a quotation's PDF input from the stored snapshot.
 *
 * The composer builds the same shape from its form state and cannot reuse this
 * — it renders a document that has not been saved yet — so the two live side by
 * side here and have to be kept in step. This one is for regenerating a saved
 * quotation, which is what the signing flow does on every signature.
 */

/** One signature already collected, as the signing context returns it. */
export interface StoredSignature {
	initialsText: string;
	name: string;
	signatureText: string;
	signedAt: number;
	slotKey: string;
	style: string;
}

/** A history row, as `readQuotationVersions` returns it. */
export interface StoredVersion {
	changeType: 'Revision' | 'Status';
	description: string;
	updatedAt: number;
	updatedBy: string;
	version: number;
}

export const REPRESENTATIVE_SLOT_KEY = 'rep';

export function clientSlotKey(clientIndex: number): string {
	return `client-${clientIndex}`;
}

/**
 * The signing parties, in the order their boxes print: every client on the
 * quotation, then Luxuria Homes.
 *
 * Built from the quotation's own client list rather than from the signatures, so
 * a client who has not signed yet still gets an empty box to fill — which is the
 * whole point of showing it.
 */
export function buildSignerSlots(
	quotation: Doc<'clientQuotations'>,
	signatures: StoredSignature[],
	representativeName: string,
	fallbackStyle: SignatureStyleId
): QuotationPdfSignerSlot[] {
	const bySlot = new Map(signatures.map((row) => [row.slotKey, row]));

	const toSlot = (
		key: string,
		name: string,
		role: 'client' | 'representative'
	): QuotationPdfSignerSlot => {
		const signed = bySlot.get(key);
		return {
			key,
			name: signed?.name || name,
			role,
			// A signed slot keeps the style its signer chose, so several hands on
			// one document stay visibly distinct.
			style: (signed?.style as SignatureStyleId) ?? fallbackStyle,
			initials: signed?.initialsText || undefined,
			signature: signed?.signatureText
				? {
						text: signed.signatureText,
						dateLabel: formatIssueDate(new Date(signed.signedAt)),
					}
				: undefined,
		};
	};

	return [
		...quotation.clients.map((client, index) =>
			toSlot(clientSlotKey(index), client.name, 'client')
		),
		toSlot(REPRESENTATIVE_SLOT_KEY, representativeName, 'representative'),
	];
}

/**
 * The trail printed on page 2: revisions only.
 *
 * Matches the composer's rule — a PDF is built when its version is saved, so a
 * lifecycle event recorded afterwards could never appear on it. The live history
 * in the app is where the lifecycle is read.
 */
export function buildPdfVersionHistory(
	versions: StoredVersion[]
): QuotationPdfVersion[] {
	return versions
		.filter((row) => row.changeType === 'Revision')
		.sort((a, b) => a.version - b.version || a.updatedAt - b.updatedAt)
		.map((row) => ({
			description: row.description,
			updatedAtLabel: formatIssueDate(new Date(row.updatedAt)),
			updatedBy: row.updatedBy,
			version: row.version,
		}));
}

export function buildQuotationPdfInput(options: {
	quotation: Doc<'clientQuotations'>;
	signers: QuotationPdfSignerSlot[];
	versions: StoredVersion[];
}): QuotationPdfInput {
	const { quotation, signers, versions } = options;

	return {
		acknowledgementHtml: quotation.terms.acknowledgementHtml,
		address: quotation.address,
		clients: quotation.clients,
		contractSumExclGst: quotation.contractSumExclGst,
		description: quotation.description || undefined,
		disclaimerHtml: quotation.terms.disclaimerHtml,
		exclusions: (quotation.exclusions ?? [])
			.slice()
			.sort((a, b) => a.order - b.order)
			.map((entry) => entry.text),
		gstAmount: quotation.gstAmount,
		issuedAtLabel: formatIssueDate(new Date(quotation.issuedAt)),
		notes: (quotation.notes ?? [])
			.slice()
			.sort((a, b) => a.order - b.order)
			.map((entry) => entry.text),
		projectName: quotation.projectName,
		reference: quotation.reference,
		signers,
		// Text only — the amounts stored alongside these are admin reference and
		// must never reach the document.
		specialInclusions: (quotation.specialInclusions ?? [])
			.slice()
			.sort((a, b) => a.order - b.order)
			.map((entry) => entry.text),
		stages: quotation.stages
			.slice()
			.sort((a, b) => a.order - b.order)
			.map((stage) => ({
				amount: stage.amount,
				name: stage.name,
				percent: stage.percent,
				scopeSummary: stage.scopeSummary,
				sections: stage.sections
					.slice()
					.sort((a, b) => a.order - b.order)
					.filter((section) => section.items.length > 0)
					.map((section) => ({
						name: section.name,
						items: section.items
							.slice()
							.sort((a, b) => a.order - b.order)
							.map((item) => ({ name: item.name })),
					})),
			})),
		termSections: quotation.terms.sections
			.slice()
			.sort((a, b) => a.order - b.order)
			.map((section) => ({ name: section.name, items: section.items })),
		totalInclGst: quotation.totalInclGst,
		version: quotation.version ?? 1,
		versionHistory: buildPdfVersionHistory(versions),
	};
}

/**
 * The PDF input for a quotation that has not been saved yet.
 *
 * The composer renders a document before the row exists — that is how the
 * issued PDF's key reaches `create` — so it posts the same snapshot it is about
 * to save and the input is assembled here. Mirrors `buildQuotationPdfInput`
 * above field for field; the only difference is that the GST split is derived
 * rather than read back off a stored row.
 */
export function pdfInputFromSnapshot(options: {
	issuedAt: number;
	reference: string;
	signers?: QuotationPdfSignerSlot[];
	snapshot: QuotationSnapshotArgs;
	version: number;
	versionHistory: QuotationPdfVersion[];
}): QuotationPdfInput {
	const { issuedAt, reference, signers, snapshot, version, versionHistory } =
		options;
	const { contractSumExclGst, gstAmount } = splitGst(snapshot.totalInclGst);

	return {
		acknowledgementHtml: snapshot.terms.acknowledgementHtml,
		address: snapshot.address,
		clients: snapshot.clients,
		contractSumExclGst,
		description: snapshot.description || undefined,
		disclaimerHtml: snapshot.terms.disclaimerHtml,
		exclusions: byOrder(snapshot.exclusions).map((entry) => entry.text),
		gstAmount,
		issuedAtLabel: formatIssueDate(new Date(issuedAt)),
		notes: byOrder(snapshot.notes).map((entry) => entry.text),
		projectName: snapshot.projectName || 'Untitled project',
		reference,
		signers,
		// Text only — the amounts kept alongside these are admin reference and
		// must never reach the document.
		specialInclusions: byOrder(snapshot.specialInclusions).map(
			(entry) => entry.text
		),
		stages: byOrder(snapshot.stages).map((stage) => ({
			amount: stage.amount,
			name: stage.name,
			percent: stage.percent,
			scopeSummary: stage.scopeSummary,
			sections: byOrder(stage.sections)
				.filter((section) => section.items.length > 0)
				.map((section) => ({
					name: section.name,
					items: byOrder(section.items).map((item) => ({ name: item.name })),
				})),
		})),
		termSections: byOrder(snapshot.terms.sections).map((section) => ({
			name: section.name,
			items: section.items,
		})),
		totalInclGst: snapshot.totalInclGst,
		version,
		versionHistory,
	};
}

/** The stored arrays all carry an explicit print order; nothing relies on insertion order. */
function byOrder<T extends { order: number }>(rows: readonly T[]): T[] {
	return rows.slice().sort((a, b) => a.order - b.order);
}

/** The trail for a document being issued now, oldest first. */
export function buildPendingVersionHistory(options: {
	amending: boolean;
	issued: StoredVersion[];
	pendingDescription: string;
	savedAt: number;
	savedBy: string;
	version: number;
}): QuotationPdfVersion[] {
	const pending: QuotationPdfVersion = {
		description: options.pendingDescription,
		updatedAtLabel: formatIssueDate(new Date(options.savedAt)),
		updatedBy: options.savedBy,
		version: options.version,
	};
	const issued = options.issued
		.filter((row) => row.changeType === 'Revision')
		.sort((a, b) => a.version - b.version || a.updatedAt - b.updatedAt)
		.map((row) =>
			// An amendment rewrites a version in place, so it replaces that row
			// rather than adding one — the trail stays one row per version.
			options.amending && row.version === options.version
				? pending
				: {
						description: row.description,
						updatedAtLabel: formatIssueDate(new Date(row.updatedAt)),
						updatedBy: row.updatedBy,
						version: row.version,
					}
		);
	return options.amending ? issued : [...issued, pending];
}
