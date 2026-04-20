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

export interface ProjectSearchDoc {
	address: string;
	client: {
		firstName: string;
		lastName: string;
		email: string;
		phone: string;
		company?: string | undefined;
	};
	name: string;
	status: string;
}

export function buildProjectSearchText(doc: ProjectSearchDoc): string {
	return buildSearchText([
		doc.name,
		doc.address,
		doc.status,
		doc.client.firstName,
		doc.client.lastName,
		doc.client.email,
		doc.client.phone,
		doc.client.company,
	]);
}
