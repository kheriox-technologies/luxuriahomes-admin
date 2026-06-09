import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildServiceProviderSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { parseServiceProviderCompany } from './shared';

export const add = mutation({
	args: {
		company: v.string(),
		name: v.string(),
		email: v.optional(v.string()),
		phone: v.optional(v.string()),
		landline: v.optional(v.string()),
		position: v.optional(v.string()),
		qbccLicense: v.optional(v.string()),
		website: v.optional(v.string()),
		address: v.optional(v.string()),
		tradeIds: v.array(v.id('trades')),
		contacts: v.array(
			v.object({
				name: v.string(),
				email: v.optional(v.string()),
				phone: v.optional(v.string()),
				landline: v.optional(v.string()),
				position: v.optional(v.string()),
			})
		),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const company = parseServiceProviderCompany(args.company);
		const name = args.name.trim();
		const email = args.email?.trim() || undefined;
		const phone = args.phone?.trim() || undefined;
		const landline = args.landline?.trim() || undefined;
		const position = args.position?.trim() || undefined;
		const qbccLicense = args.qbccLicense?.trim() || undefined;
		const website = args.website?.trim() || undefined;
		const address = args.address?.trim() || undefined;
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
			landline,
			position,
			qbccLicense,
			website,
			address,
			tradeIds: args.tradeIds,
			contacts: args.contacts,
			searchText,
		});
	},
});
