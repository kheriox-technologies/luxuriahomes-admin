import type { Doc } from '@workspace/backend/dataModel';

// A service provider linked to a project, as returned by
// api.projectServiceProviders.listByProject.list (a full serviceProviders doc).
export type ServiceProvider = Doc<'serviceProviders'>;

// Providers bucketed by trade. A provider with multiple trades appears in each
// matching group; providers with no trade land in the "Other" group.
export interface ServiceProviderGroup {
	key: string;
	providers: ServiceProvider[];
	tradeName: string;
}

export const OTHER_TRADE_KEY = '__other__';
