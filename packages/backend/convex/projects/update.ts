import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildProjectSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import {
	assertAustralianAddress,
	australianAddressValidator,
	projectClientValidator,
	projectStatusValidator,
} from './shared';

export const update = mutation({
	args: {
		projectId: v.id('projects'),
		name: v.optional(v.string()),
		address: v.optional(australianAddressValidator),
		status: v.optional(projectStatusValidator),
		clients: v.optional(v.array(projectClientValidator)),
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

		if (args.address) {
			assertAustralianAddress(args.address);
		}

		const name = args.name ?? existing.name;
		const address = args.address ?? existing.address;
		const status = args.status ?? existing.status;

		let clients = existing.clients;
		if (args.clients !== undefined) {
			if (args.clients.length < 1) {
				throw new ConvexError({
					code: 'CLIENTS_REQUIRED',
					message: 'At least one client is required',
				});
			}
			for (const client of args.clients) {
				if (client.address) {
					assertAustralianAddress(client.address);
				}
			}
			clients = args.clients;
		}

		const searchText = buildProjectSearchText({
			name,
			address,
			status,
			clients,
		});

		await ctx.db.patch(args.projectId, {
			name,
			address,
			status,
			clients,
			searchText,
		});
		return args.projectId;
	},
});
