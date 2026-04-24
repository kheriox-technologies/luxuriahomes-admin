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
	models: string[];
	vendor: string;
}

export function buildInclusionVariantSearchText(
	title: string,
	fields: InclusionVariantSearchFields
): string {
	return buildSearchText([title, fields.code, fields.vendor, ...fields.models]);
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
		parts.push(variant.code, variant.vendor, ...variant.models);
	}
	return buildSearchText(parts);
}
