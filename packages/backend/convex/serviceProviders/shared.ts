import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import { buildServiceProviderSearchText } from '../lib/buildSearchText';

export function parseServiceProviderCompany(company: string): string {
	const trimmed = company.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_COMPANY',
			message: 'Company name is required',
		});
	}
	return trimmed;
}

export async function getServiceProviderOrThrow(
	ctx: MutationCtx,
	serviceProviderId: Id<'serviceProviders'>
) {
	const serviceProvider = await ctx.db.get(serviceProviderId);
	if (!serviceProvider) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Service provider not found',
		});
	}
	return serviceProvider;
}

export async function syncServiceProviderSearchText(
	ctx: MutationCtx,
	serviceProviderId: Id<'serviceProviders'>
) {
	const sp = await ctx.db.get(serviceProviderId);
	if (!sp) {
		return;
	}
	const trades = await Promise.all(sp.tradeIds.map((id) => ctx.db.get(id)));
	const tradeNames = trades.flatMap((t) => (t ? [t.name] : []));
	const searchText = buildServiceProviderSearchText(
		sp.company,
		sp.name,
		sp.email,
		sp.phone,
		sp.landline,
		sp.position,
		sp.qbccLicense,
		sp.website,
		sp.address,
		sp.contacts,
		tradeNames
	);
	await ctx.db.patch(serviceProviderId, { searchText });
}
