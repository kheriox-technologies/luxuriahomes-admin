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

export const add = mutation({
	args: {
		name: v.string(),
		address: australianAddressValidator,
		status: projectStatusValidator,
		clients: v.array(projectClientValidator),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		if (args.clients.length < 1) {
			throw new ConvexError({
				code: 'CLIENTS_REQUIRED',
				message: 'At least one client is required',
			});
		}
		assertAustralianAddress(args.address);
		for (const client of args.clients) {
			if (client.address) {
				assertAustralianAddress(client.address);
			}
		}
		const searchText = buildProjectSearchText({
			name: args.name,
			address: args.address,
			status: args.status,
			clients: args.clients,
		});
		return await ctx.db.insert('projects', {
			name: args.name,
			address: args.address,
			status: args.status,
			clients: args.clients,
			searchText,
		});
	},
});
