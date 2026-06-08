import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildServiceProviderSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import {
	getServiceProviderOrThrow,
	parseServiceProviderCompany,
} from './shared';

export const update = mutation({
	args: {
		serviceProviderId: v.id('serviceProviders'),
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
		await getServiceProviderOrThrow(ctx, args.serviceProviderId);
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
		await ctx.db.patch(args.serviceProviderId, {
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
		return args.serviceProviderId;
	},
});
