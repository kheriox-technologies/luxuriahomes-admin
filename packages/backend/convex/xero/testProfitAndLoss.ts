'use node';

import { v } from 'convex/values';
import { internalAction } from '../_generated/server';
import {
	fetchProfitAndLoss,
	getXeroAccessToken,
	getXeroConfig,
	getXeroTenantId,
	parseExpensesByOption,
	type XeroReportRow,
} from './shared';

// Far-past start so the P&L spans cumulative expenses-to-date for every project.
const DEFAULT_FROM_DATE = '2000-01-01';

function todayUtcDate(): string {
	const now = new Date();
	const year = now.getUTCFullYear();
	const month = `${now.getUTCMonth() + 1}`.padStart(2, '0');
	const day = `${now.getUTCDate()}`.padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function summarizeRow(row: XeroReportRow): {
	rowType: string;
	title?: string;
	cells: string[];
} {
	return {
		rowType: row.RowType,
		title: row.Title,
		cells: (row.Cells ?? []).map((cell) => cell.Value ?? ''),
	};
}

/**
 * Diagnostic for the Profit & Loss report path. Pass a `trackingCategoryId`
 * (falls back to XERO_TRACKING_CATEGORY_ID) and an optional date range to fetch
 * the report for that category and inspect both the parsed expenses-per-option
 * and the raw report rows. Writes nothing — run from the Convex dashboard once
 * you have the tracking category GUID (e.g. from xero/testConnection).
 */
export const testProfitAndLoss = internalAction({
	args: {
		trackingCategoryId: v.optional(v.string()),
		fromDate: v.optional(v.string()),
		toDate: v.optional(v.string()),
	},
	handler: async (_ctx, args) => {
		const config = getXeroConfig();
		const trackingCategoryId =
			args.trackingCategoryId ?? config.trackingCategoryId;
		if (!trackingCategoryId) {
			throw new Error(
				'Provide a trackingCategoryId argument or set XERO_TRACKING_CATEGORY_ID.'
			);
		}

		const accessToken = await getXeroAccessToken(config);
		const tenantId = await getXeroTenantId(accessToken);

		const fromDate = args.fromDate ?? DEFAULT_FROM_DATE;
		const toDate = args.toDate ?? todayUtcDate();

		const report = await fetchProfitAndLoss(accessToken, tenantId, {
			trackingCategoryId,
			fromDate,
			toDate,
		});

		const expensesByOption = Array.from(
			parseExpensesByOption(report).entries()
		).map(([option, expenses]) => ({ option, expenses }));

		return {
			trackingCategoryId,
			fromDate,
			toDate,
			reportName: report.ReportName,
			expensesByOption,
			// Raw top-level rows (header + section summaries) for debugging the
			// report shape when an option doesn't match or a total is missing.
			rows: (report.Rows ?? []).map(summarizeRow),
		};
	},
});
