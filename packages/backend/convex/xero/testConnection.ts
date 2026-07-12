'use node';

import { internalAction } from '../_generated/server';
import {
	fetchCumulativeExpensesByOption,
	fetchTrackingCategories,
	getXeroAccessToken,
	getXeroConfig,
	getXeroTenantId,
	SYNC_FROM_DATE,
	todayUtcDate,
} from './shared';

const SAMPLE_OPTION_LIMIT = 5;

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
			const { expensesByOption } = await fetchCumulativeExpensesByOption(
				accessToken,
				tenantId,
				{
					trackingCategoryId: config.trackingCategoryId,
					fromDate: SYNC_FROM_DATE,
					toDate,
				}
			);
			profitAndLoss = {
				trackingCategoryId: config.trackingCategoryId,
				fromDate: SYNC_FROM_DATE,
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
