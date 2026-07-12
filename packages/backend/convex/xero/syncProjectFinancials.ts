'use node';

import { ConvexError } from 'convex/values';
import { internal } from '../_generated/api';
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

// Xero figures are grossed up by 10% before being written to a project. Cost of
// sales feeds "Spent" (expenses); trading income feeds "Received".
const XERO_UPLIFT = 1.1;

function roundToCents(value: number): number {
	return Math.round(value * 100) / 100;
}

/**
 * Syncs each mapped project's "Spent" (expenses) and "Received" values from
 * Xero. Fetches the cumulative Cost of Sales and Total Trading Income per
 * tracking option from a single Profit & Loss pass, then for every project that
 * has a `xeroTrackingOptionId` set, resolves its current option name, applies a
 * 10% uplift to each figure, and writes both. Projects whose mapped option no
 * longer exists are left untouched. Runs nightly (crons.ts) and on demand
 * (syncProjectFinancialsNow).
 */
export const syncProjectFinancials = internalAction({
	args: {},
	handler: async (ctx) => {
		const config = getXeroConfig();
		if (!config.trackingCategoryId) {
			throw new ConvexError({
				code: 'CONFIG_ERROR',
				message:
					'Xero tracking category is not configured (missing XERO_TRACKING_CATEGORY_ID).',
			});
		}

		const accessToken = await getXeroAccessToken(config);
		const tenantId = await getXeroTenantId(accessToken);

		// Map each option GUID to its current name so we can look up the report,
		// which is keyed by option name.
		const categories = await fetchTrackingCategories(accessToken, tenantId);
		const category = categories.find(
			(c) => c.TrackingCategoryID === config.trackingCategoryId
		);
		const optionIdToName = new Map<string, string>();
		for (const option of category?.Options ?? []) {
			optionIdToName.set(option.TrackingOptionID, option.Name);
		}

		const { costOfSalesByOption, incomeByOption } =
			await fetchCumulativeExpensesByOption(accessToken, tenantId, {
				trackingCategoryId: config.trackingCategoryId,
				fromDate: SYNC_FROM_DATE,
				toDate: todayUtcDate(),
			});

		const mapped = await ctx.runQuery(
			internal.projects.listXeroMapped.listXeroMapped,
			{}
		);

		const updates: Array<{
			projectId: (typeof mapped)[number]['_id'];
			expenses: number;
			received: number;
		}> = [];
		let skipped = 0;
		for (const project of mapped) {
			const optionName = optionIdToName.get(project.xeroTrackingOptionId);
			if (!optionName) {
				// Mapped option was renamed away / deleted in Xero — leave the manual
				// value untouched rather than zeroing it.
				skipped++;
				continue;
			}
			const costOfSales = costOfSalesByOption.get(optionName) ?? 0;
			const income = incomeByOption.get(optionName) ?? 0;
			updates.push({
				projectId: project._id,
				expenses: roundToCents(costOfSales * XERO_UPLIFT),
				received: roundToCents(income * XERO_UPLIFT),
			});
		}

		await ctx.runMutation(
			internal.projects.applyXeroFinancials.applyXeroFinancials,
			{ updates }
		);

		return { updated: updates.length, skipped };
	},
});
