'use node';

import { internalAction } from '../_generated/server';
import {
	fetchProfitAndLoss,
	fetchTrackingCategories,
	getXeroAccessToken,
	getXeroConfig,
	getXeroTenantId,
	parseExpensesByOption,
} from './shared';

const SAMPLE_OPTION_LIMIT = 5;
// Far-past start so the P&L spans cumulative expenses-to-date for every project.
const PROFIT_AND_LOSS_FROM_DATE = '2000-01-01';

function todayUtcDate(): string {
	const now = new Date();
	const year = now.getUTCFullYear();
	const month = `${now.getUTCMonth() + 1}`.padStart(2, '0');
	const day = `${now.getUTCDate()}`.padStart(2, '0');
	return `${year}-${month}-${day}`;
}

/**
 * Diagnostic for the Xero Custom Connection. Authenticates, resolves the tenant,
 * and fetches real data (tracking categories, and the P&L report if a tracking
 * category id is configured). Writes nothing — run it from the Convex dashboard
 * to confirm credentials and API access before wiring up the expense sync.
 */
export const testConnection = internalAction({
	args: {},
	handler: async () => {
		const config = getXeroConfig();
		const accessToken = await getXeroAccessToken(config);
		const tenantId = await getXeroTenantId(accessToken);

		const categories = await fetchTrackingCategories(accessToken, tenantId);
		const categorySummaries = categories.map((category) => ({
			id: category.TrackingCategoryID,
			name: category.Name,
			status: category.Status,
			optionCount: category.Options?.length ?? 0,
			sampleOptions: (category.Options ?? [])
				.slice(0, SAMPLE_OPTION_LIMIT)
				.map((option) => ({
					id: option.TrackingOptionID,
					name: option.Name,
				})),
		}));

		let profitAndLoss:
			| {
					trackingCategoryId: string;
					fromDate: string;
					toDate: string;
					expensesByOption: Array<{ option: string; expenses: number }>;
			  }
			| undefined;

		if (config.trackingCategoryId) {
			const toDate = todayUtcDate();
			const report = await fetchProfitAndLoss(accessToken, tenantId, {
				trackingCategoryId: config.trackingCategoryId,
				fromDate: PROFIT_AND_LOSS_FROM_DATE,
				toDate,
			});
			const expensesByOption = parseExpensesByOption(report);
			profitAndLoss = {
				trackingCategoryId: config.trackingCategoryId,
				fromDate: PROFIT_AND_LOSS_FROM_DATE,
				toDate,
				expensesByOption: Array.from(expensesByOption.entries()).map(
					([option, expenses]) => ({ option, expenses })
				),
			};
		}

		return {
			tenantId,
			categoryCount: categorySummaries.length,
			categories: categorySummaries,
			profitAndLoss,
		};
	},
});
