import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { seedProjectDocumentFolders } from '../documentFolders/lib/seedFolders';
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
		startDate: v.optional(v.number()),
		quotePrice: v.optional(v.number()),
		expenses: v.optional(v.number()),
		received: v.optional(v.number()),
		xeroTrackingOptionId: v.optional(v.string()),
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
		const projectId = await ctx.db.insert('projects', {
			name: args.name,
			address: args.address,
			status: args.status,
			clients: args.clients,
			startDate: args.startDate,
			quotePrice: args.quotePrice,
			expenses: args.expenses,
			received: args.received,
			xeroTrackingOptionId: args.xeroTrackingOptionId,
			searchText,
		});
		await seedProjectDocumentFolders(ctx, projectId);
		return projectId;
	},
});
