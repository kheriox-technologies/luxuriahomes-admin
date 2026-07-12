import { internalQuery } from '../_generated/server';

/**
 * Returns every project that has a Xero tracking-option mapping set. Used by the
 * Xero spend sync to know which projects' `expenses` should be overwritten.
 * Internal-only.
 */
export const listXeroMapped = internalQuery({
	args: {},
	handler: async (ctx) => {
		const projects = await ctx.db.query('projects').collect();
		return projects
			.filter((p) => p.xeroTrackingOptionId !== undefined)
			.map((p) => ({
				_id: p._id,
				name: p.name,
				xeroTrackingOptionId: p.xeroTrackingOptionId as string,
			}));
	},
});
