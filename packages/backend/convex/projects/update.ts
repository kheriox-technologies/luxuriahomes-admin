import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildProjectSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { projectClientPatchValidator, projectStatusValidator } from './shared';

export const update = mutation({
	args: {
		projectId: v.id('projects'),
		name: v.optional(v.string()),
		address: v.optional(v.string()),
		status: v.optional(projectStatusValidator),
		client: v.optional(projectClientPatchValidator),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await ctx.db.get(args.projectId);
		if (!existing) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Project not found',
			});
		}

		const patch = args.client ?? {};
		const client = {
			firstName: patch.firstName ?? existing.client.firstName,
			lastName: patch.lastName ?? existing.client.lastName,
			email: patch.email ?? existing.client.email,
			phone: patch.phone ?? existing.client.phone,
			company:
				patch.company !== undefined ? patch.company : existing.client.company,
		};

		const name = args.name ?? existing.name;
		const address = args.address ?? existing.address;
		const status = args.status ?? existing.status;

		const searchText = buildProjectSearchText({
			name,
			address,
			status,
			client,
		});

		await ctx.db.patch(args.projectId, {
			name,
			address,
			status,
			client,
			searchText,
		});
		return args.projectId;
	},
});
