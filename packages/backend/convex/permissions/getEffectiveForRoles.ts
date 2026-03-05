import { v } from 'convex/values';
import { query } from '../_generated/server';

/**
 * Returns effective custom-role names, paths and actions for a set of roles.
 * Admin is intentionally excluded from role expansion and should be handled by callers.
 */
export const getEffectiveForRoles = query({
	args: {
		roles: v.array(v.string()),
	},
	handler: async (ctx, args) => {
		const roleSet = new Set(
			args.roles.map((r) => r.trim().toLowerCase()).filter(Boolean)
		);
		roleSet.delete('admin');
		roleSet.delete('member');

		const rows = await Promise.all(
			[...roleSet].map((roleName) =>
				ctx.db
					.query('permissions')
					.withIndex('by_role_name', (q) => q.eq('roleName', roleName))
					.first()
			)
		);

		const customRoleNames: string[] = [];
		const paths = new Set<string>();
		const actions = new Set<string>();

		for (const row of rows) {
			if (!row) {
				continue;
			}
			customRoleNames.push(row.roleName);
			for (const path of row.paths) {
				paths.add(path);
			}
			for (const action of row.actions) {
				actions.add(action);
			}
		}

		return {
			customRoleNames: customRoleNames.sort(),
			allowedPaths: [...paths].sort(),
			allowedActions: [...actions].sort(),
		};
	},
});
