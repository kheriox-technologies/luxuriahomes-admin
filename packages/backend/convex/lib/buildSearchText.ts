/**
 * Joins trimmed string/number parts into a single space-separated search blob.
 * Reusable for any table that stores a denormalized `searchText` field.
 */
export function buildSearchText(
	parts: Array<string | number | undefined | null>
): string {
	const tokens: string[] = [];
	for (const part of parts) {
		if (part === undefined || part === null) {
			continue;
		}
		if (typeof part === 'number') {
			if (Number.isFinite(part)) {
				tokens.push(String(part));
			}
			continue;
		}
		const trimmed = part.trim();
		if (trimmed.length > 0) {
			tokens.push(trimmed);
		}
	}
	return tokens.join(' ').replace(/\s+/g, ' ').trim();
}

export interface AustralianAddressSearchFields {
	postcode: string;
	state: string;
	street: string;
	suburb: string;
}

export interface ProjectClientSearchFields {
	address?: AustralianAddressSearchFields | undefined;
	company?: string | undefined;
	email: string;
	firstName: string;
	lastName: string;
	phone: string;
}

export interface ProjectSearchDoc {
	address: AustralianAddressSearchFields;
	clients: ProjectClientSearchFields[];
	name: string;
	status: string;
}

function addressSearchParts(
	address: AustralianAddressSearchFields
): Array<string | undefined> {
	return [address.street, address.suburb, address.state, address.postcode];
}

export function buildProjectSearchText(doc: ProjectSearchDoc): string {
	const clientParts: Array<string | undefined> = [];
	for (const c of doc.clients) {
		clientParts.push(
			c.firstName,
			c.lastName,
			c.email,
			c.phone,
			c.company,
			...(c.address ? addressSearchParts(c.address) : [])
		);
	}
	return buildSearchText([
		doc.name,
		...addressSearchParts(doc.address),
		doc.status,
		...clientParts,
	]);
}

export function buildInclusionCategorySearchText(
	name: string,
	code: string
): string {
	return buildSearchText([name, code]);
}

export interface InclusionVariantSearchFields {
	code: string;
	color?: string | undefined;
	models: string[];
	vendor: string;
}

export function buildInclusionVariantSearchText(
	title: string,
	fields: InclusionVariantSearchFields
): string {
	return buildSearchText([
		title,
		fields.code,
		fields.vendor,
		fields.color,
		...fields.models,
	]);
}

export function buildStageSearchText(
	name: string,
	description?: string
): string {
	return buildSearchText([name, description]);
}

export function buildTaskSearchText(
	name: string,
	description?: string
): string {
	return buildSearchText([name, description]);
}

export function buildLocationSearchText(
	name: string,
	description?: string
): string {
	return buildSearchText([name, description]);
}

export function buildTradeSearchText(
	name: string,
	description?: string
): string {
	return buildSearchText([name, description]);
}

export function buildVendorSearchText(
	name: string,
	description?: string,
	link?: string
): string {
	return buildSearchText([name, description, link]);
}

export function buildMaterialColorSearchText(
	name: string,
	description?: string
): string {
	return buildSearchText([name, description]);
}

export function buildDocumentFolderSearchText(name: string): string {
	return buildSearchText([name]);
}

export function buildMaterialSearchText(
	name: string,
	description?: string,
	unitAbbr?: string
): string {
	return buildSearchText([name, description, unitAbbr]);
}

export function buildMaterialVariantSearchText(
	materialName: string,
	variantName: string,
	vendor: string,
	description?: string
): string {
	return buildSearchText([materialName, variantName, vendor, description]);
}

export function buildMaterialItemSearchText(
	variantName: string,
	itemName: string,
	vendor: string,
	description?: string
): string {
	return buildSearchText([variantName, itemName, vendor, description]);
}

// Strips the domain from an email and replaces dots in the local part with spaces,
// preventing TLD tokens like "com" or "au" from polluting full-text search results.
function normalizeEmailForSearch(email?: string): string | undefined {
	if (!email) {
		return undefined;
	}
	const local = email.split('@')[0];
	return local ? local.replace(/\./g, ' ') : undefined;
}

interface ServiceProviderContact {
	email?: string;
	landline?: string;
	name: string;
	phone?: string;
	position?: string;
}

export function buildServiceProviderSearchText(
	company: string,
	name: string,
	email?: string,
	phone?: string,
	landline?: string,
	position?: string,
	qbccLicense?: string,
	website?: string,
	address?: string,
	contacts?: ServiceProviderContact[],
	tradeNames?: string[]
): string {
	const parts: Array<string | undefined> = [
		company,
		name,
		normalizeEmailForSearch(email),
		phone,
		landline,
		position,
		qbccLicense,
		website,
		address,
		...(tradeNames ?? []),
	];
	for (const contact of contacts ?? []) {
		parts.push(
			contact.name,
			normalizeEmailForSearch(contact.email),
			contact.phone,
			contact.landline,
			contact.position
		);
	}
	return buildSearchText(parts);
}

export function buildProjectOrderSearchText(
	name: string,
	vendor: string,
	description?: string
): string {
	return buildSearchText([name, vendor, description]);
}

export function buildInclusionAggregateSearchText(
	title: string,
	variants: InclusionVariantSearchFields[],
	category?: { code: string; name: string }
): string {
	const parts: Array<string | undefined> = [
		title,
		category?.name,
		category?.code,
	];
	for (const variant of variants) {
		parts.push(variant.code, variant.vendor, variant.color, ...variant.models);
	}
	return buildSearchText(parts);
}
