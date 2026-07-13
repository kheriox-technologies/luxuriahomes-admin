'use node';

import { ConvexError, v } from 'convex/values';
import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	createXeroAccount,
	fetchAccounts,
	getXeroAccessToken,
	getXeroConfig,
	getXeroTenantId,
	nextAccountCode,
} from './shared';

/**
 * Creates a new expense-class Chart of Accounts entry in Xero named after a
 * trade, so the app can map the trade to it. Admin only; used by the Add Trade
 * dialog's "create a new Xero account" option. The Code is auto-assigned (next
 * free numeric code) and the Type is chosen by the caller. Returns the created
 * account as `{ id, code, name, type }` — the `id` is stored on `trades.xeroAccountId`.
 */
export const createAccount = action({
	args: {
		name: v.string(),
		type: v.union(
			v.literal('DIRECTCOSTS'),
			v.literal('EXPENSE'),
			v.literal('OVERHEADS')
		),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		const name = args.name.trim();
		if (name.length === 0) {
			throw new ConvexError({
				code: 'INVALID_NAME',
				message: 'Account name is required',
			});
		}

		const config = getXeroConfig();
		const accessToken = await getXeroAccessToken(config);
		const tenantId = await getXeroTenantId(accessToken);

		// Fetch the full chart to pick a code that isn't already taken.
		const accounts = await fetchAccounts(accessToken, tenantId);
		const code = nextAccountCode(accounts);

		const created = await createXeroAccount(accessToken, tenantId, {
			code,
			name,
			type: args.type,
		});

		return {
			id: created.AccountID,
			code: created.Code ?? code,
			name: created.Name ?? name,
			type: created.Type ?? args.type,
		};
	},
});
