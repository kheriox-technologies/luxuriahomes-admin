'use node';

import { ConvexError } from 'convex/values';
import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	fetchTrackingCategories,
	getXeroAccessToken,
	getXeroConfig,
	getXeroTenantId,
} from './shared';

/**
 * Lists the active tracking options of the configured Xero "Project" tracking
 * category as `{ id, name }` pairs, for the project-form mapping picker. Admin
 * only; fetched live from Xero (non-reactive — call via `useAction`).
 */
export const listTrackingOptions = action({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);

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
		const categories = await fetchTrackingCategories(accessToken, tenantId);
		const category = categories.find(
			(c) => c.TrackingCategoryID === config.trackingCategoryId
		);

		const options = (category?.Options ?? [])
			.filter((option) => (option.Status ?? 'ACTIVE') === 'ACTIVE')
			.map((option) => ({
				id: option.TrackingOptionID,
				name: option.Name,
			}))
			.sort((a, b) =>
				a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
			);

		return { options };
	},
});
