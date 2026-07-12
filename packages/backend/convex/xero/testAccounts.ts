'use node';

import { internalAction } from '../_generated/server';
import {
	fetchAccounts,
	getXeroAccessToken,
	getXeroConfig,
	getXeroTenantId,
} from './shared';

/**
 * Diagnostic for the Chart of Accounts path. Fetches every account and returns
 * the raw count plus the filtered expense-class list used by the account picker
 * (`Class === 'EXPENSE'` and active). Run from the Convex dashboard to verify
 * the `accounting.settings.read` scope reaches `/Accounts` and the Class filter
 * matches the real org. Writes nothing.
 */
export const testAccounts = internalAction({
	args: {},
	handler: async () => {
		const config = getXeroConfig();
		const accessToken = await getXeroAccessToken(config);
		const tenantId = await getXeroTenantId(accessToken);
		const accounts = await fetchAccounts(accessToken, tenantId);

		const expenseAccounts = accounts
			.filter(
				(account) =>
					account.Class === 'EXPENSE' &&
					(account.Status ?? 'ACTIVE') === 'ACTIVE'
			)
			.map((account) => ({
				id: account.AccountID,
				code: account.Code,
				name: account.Name,
				type: account.Type,
				class: account.Class,
				status: account.Status,
			}));

		return {
			totalAccounts: accounts.length,
			expenseAccountCount: expenseAccounts.length,
			expenseAccounts,
		};
	},
});
