import { v } from 'convex/values';
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
		client: projectClientValidator,
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		assertAustralianAddress(args.address);
		if (args.client.address) {
			assertAustralianAddress(args.client.address);
		}
		const searchText = buildProjectSearchText({
			name: args.name,
			address: args.address,
			status: args.status,
			client: args.client,
		});
		return await ctx.db.insert('projects', {
			name: args.name,
			address: args.address,
			status: args.status,
			client: args.client,
			searchText,
		});
	},
});
