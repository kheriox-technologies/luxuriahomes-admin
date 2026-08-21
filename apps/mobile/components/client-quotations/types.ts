import type { Doc } from '@workspace/backend/dataModel';

/**
 * A quotation row as both list queries return it — the stored document plus the
 * note count the server attaches so the list can flag commentary without a query
 * per row.
 */
export type ClientQuotationRow = Doc<'clientQuotations'> & {
	noteCount: number;
};

/** The PDF a row should open: the signed copy once there is one. */
export function latestPdfKey(row: ClientQuotationRow): string | undefined {
	return row.signedS3Key ?? row.s3Key;
}

/** What a row is called on disk when shared out of the app. */
export function quotationFileName(row: ClientQuotationRow): string {
	return row.fileName ?? `${row.reference}.pdf`;
}
