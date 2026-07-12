'use node';

import { v } from 'convex/values';
import { internalAction } from '../_generated/server';
import {
	fetchCumulativeExpensesByOption,
	getXeroAccessToken,
	getXeroConfig,
	getXeroTenantId,
	SYNC_FROM_DATE,
	todayUtcDate,
	type XeroReportRow,
} from './shared';

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

		const fromDate = args.fromDate ?? SYNC_FROM_DATE;
		const toDate = args.toDate ?? todayUtcDate();

		const { expensesByOption, costOfSalesByOption, windows, lastReport } =
			await fetchCumulativeExpensesByOption(accessToken, tenantId, {
				trackingCategoryId,
				fromDate,
				toDate,
			});

		return {
			trackingCategoryId,
			fromDate,
			toDate,
			// The ≤365-day windows the range was split into (Xero caps P&L ranges
			// at 365 days); totals are summed across all of them.
			windows,
			reportName: lastReport?.ReportName,
			// Total Cost of Sales per project (tracking option).
			costOfSalesByOption: Array.from(costOfSalesByOption.entries()).map(
				([option, costOfSales]) => ({ option, costOfSales })
			),
			expensesByOption: Array.from(expensesByOption.entries()).map(
				([option, expenses]) => ({ option, expenses })
			),
			// Raw top-level rows of the final window (header + section summaries)
			// for debugging report shape when an option doesn't match a total.
			rows: (lastReport?.Rows ?? []).map(summarizeRow),
		};
	},
});
