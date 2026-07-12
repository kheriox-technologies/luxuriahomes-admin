'use node';

import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	fetchAccounts,
	getXeroAccessToken,
	getXeroConfig,
	getXeroTenantId,
} from './shared';

/**
 * Lists the org's active expense-class accounts (Class `EXPENSE`, covering the
 * EXPENSE / DIRECTCOSTS / OVERHEADS types) as `{ id, code, name, type }`, for
 * the trade → Chart of Accounts mapping picker. Admin only; fetched live from
 * Xero (non-reactive — call via `useAction`). Sorted by code then name.
 */
export const listAccounts = action({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);

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
				code: account.Code ?? '',
				name: account.Name,
				type: account.Type ?? '',
			}))
			.sort((a, b) => {
				const byCode = a.code.localeCompare(b.code, undefined, {
					numeric: true,
					sensitivity: 'base',
				});
				if (byCode !== 0) {
					return byCode;
				}
				return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
			});

		return { accounts: expenseAccounts };
	},
});
