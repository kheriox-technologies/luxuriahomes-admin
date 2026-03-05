import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { isAdmin } from '../lib/checkIdentity';

const RESERVED_NAMES = ['admin', 'member'];

/**
 * Deletes one custom role from permissions.
 * Requires admin role.
 */
export const removeRole = mutation({
	args: {
		roleName: v.string(),
	},
	handler: async (ctx, args) => {
		if (!(await isAdmin(ctx))) {
			throw new Error('Forbidden: admin role required');
		}
		const roleName = args.roleName.trim().toLowerCase();
		if (!roleName) {
			throw new Error('Role name cannot be empty');
		}
		if (RESERVED_NAMES.includes(roleName)) {
			throw new Error(`Role name "${roleName}" is reserved`);
		}

		const existing = await ctx.db
			.query('permissions')
			.withIndex('by_role_name', (q) => q.eq('roleName', roleName))
			.first();

		if (!existing) {
			return null;
		}

		await ctx.db.delete(existing._id);
		return existing._id;
	},
});
