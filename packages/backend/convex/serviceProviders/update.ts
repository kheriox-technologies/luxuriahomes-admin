import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	getServiceProviderOrThrow,
	parseServiceProviderCompany,
	syncServiceProviderSearchText,
} from './shared';

export const update = mutation({
	args: {
		serviceProviderId: v.id('serviceProviders'),
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
		await getServiceProviderOrThrow(ctx, args.serviceProviderId);
		const company = parseServiceProviderCompany(args.company);
		const name = args.name.trim();
		const email = args.email?.trim() || undefined;
		const phone = args.phone?.trim() || undefined;
		const landline = args.landline?.trim() || undefined;
		const position = args.position?.trim() || undefined;
		const qbccLicense = args.qbccLicense?.trim() || undefined;
		const website = args.website?.trim() || undefined;
		const address = args.address?.trim() || undefined;
		const contacts = args.contacts.map((c) => ({
			name: c.name.trim(),
			email: c.email?.trim() || undefined,
			phone: c.phone?.trim() || undefined,
			landline: c.landline?.trim() || undefined,
			position: c.position?.trim() || undefined,
		}));
		await ctx.db.patch(args.serviceProviderId, {
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
			contacts,
		});
		await syncServiceProviderSearchText(ctx, args.serviceProviderId);
		return args.serviceProviderId;
	},
});
