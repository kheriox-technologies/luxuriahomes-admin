import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildServiceProviderSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { parseServiceProviderCompany } from './shared';

export const add = mutation({
	args: {
		company: v.string(),
		name: v.string(),
		email: v.string(),
		phone: v.string(),
		position: v.optional(v.string()),
		qbccLicense: v.optional(v.string()),
		website: v.optional(v.string()),
		tradeIds: v.array(v.id('trades')),
		contacts: v.array(
			v.object({
				name: v.string(),
				email: v.string(),
				phone: v.string(),
				position: v.optional(v.string()),
			})
		),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const company = parseServiceProviderCompany(args.company);
		const name = args.name.trim();
		const email = args.email.trim();
		const phone = args.phone.trim();
		const position = args.position?.trim() || undefined;
		const qbccLicense = args.qbccLicense?.trim() || undefined;
		const website = args.website?.trim() || undefined;
		const searchText = buildServiceProviderSearchText(
			company,
			name,
			email,
			phone
		);
		return await ctx.db.insert('serviceProviders', {
			company,
			name,
			email,
			phone,
			position,
			qbccLicense,
			website,
			tradeIds: args.tradeIds,
			contacts: args.contacts,
			searchText,
		});
	},
});
