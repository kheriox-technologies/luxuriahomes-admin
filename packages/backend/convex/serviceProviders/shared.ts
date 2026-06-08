import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

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
