import { query } from '../_generated/server';

/**
 * Returns all permissions keyed by role name.
 */
export const list = query({
	args: {},
	handler: async (ctx) => {
		const rows = await ctx.db.query('permissions').collect();
		const permissions: Record<string, { paths: string[]; actions: string[] }> =
			{};
		for (const row of rows) {
			permissions[row.roleName] = {
				paths: [...row.paths].sort(),
				actions: [...row.actions].sort(),
			};
		}
		return permissions;
	},
});
