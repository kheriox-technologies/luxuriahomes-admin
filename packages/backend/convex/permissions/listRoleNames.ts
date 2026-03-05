import { query } from '../_generated/server';

/**
 * Returns custom role names present in permissions.
 */
export const listRoleNames = query({
	args: {},
	handler: async (ctx) => {
		const rows = await ctx.db.query('permissions').collect();
		return rows.map((row) => row.roleName).sort();
	},
});
