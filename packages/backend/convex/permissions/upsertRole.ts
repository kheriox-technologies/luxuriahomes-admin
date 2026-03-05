import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { isAdmin } from '../lib/checkIdentity';

const RESERVED_NAMES = ['admin', 'member'];
const ROLE_NAME_REGEX = /^[a-z0-9_-]+$/;

function normalizeRoleName(name: string): string {
	return name.trim().toLowerCase();
}

function validateRoleName(name: string): string {
	const normalized = normalizeRoleName(name);
	if (!normalized) {
		throw new Error('Role name cannot be empty');
	}
	if (RESERVED_NAMES.includes(normalized)) {
		throw new Error(`Role name "${name}" is reserved`);
	}
	if (!ROLE_NAME_REGEX.test(normalized)) {
		throw new Error(
			'Role name must contain only lowercase letters, numbers, hyphens, and underscores'
		);
	}
	return normalized;
}

function normalizePaths(paths: string[]): string[] {
	return [...new Set(paths.map((p) => p.trim()).filter(Boolean))].sort();
}

function normalizeActions(actions: string[]): string[] {
	return [
		...new Set(actions.map((a) => a.trim().toLowerCase()).filter(Boolean)),
	].sort();
}

/**
 * Upserts a custom role permission document.
 * Requires admin role.
 */
export const upsertRole = mutation({
	args: {
		roleName: v.string(),
		paths: v.array(v.string()),
		actions: v.array(v.string()),
	},
	handler: async (ctx, args) => {
		if (!(await isAdmin(ctx))) {
			throw new Error('Forbidden: admin role required');
		}

		const roleName = validateRoleName(args.roleName);
		const paths = normalizePaths(args.paths);
		const actions = normalizeActions(args.actions);

		const existing = await ctx.db
			.query('permissions')
			.withIndex('by_role_name', (q) => q.eq('roleName', roleName))
			.first();

		if (existing) {
			await ctx.db.patch(existing._id, { paths, actions });
			return existing._id;
		}

		return await ctx.db.insert('permissions', {
			roleName,
			paths,
			actions,
		});
	},
});
