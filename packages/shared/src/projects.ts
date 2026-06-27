import type { Project } from './types';

/**
 * Client-side fuzzy match for the Projects list, shared across platforms.
 * Matches against project name, address, and assigned client names/emails.
 * Mirrors the matcher used by the web client portal Projects page.
 */
export function matchesSearch(project: Project, search: string): boolean {
	if (search === '') {
		return true;
	}
	const haystack = [
		project.name,
		project.address.street,
		project.address.suburb,
		project.address.state,
		project.address.postcode,
		...project.clients.flatMap((client) => [
			client.firstName,
			client.lastName,
			client.email,
		]),
	]
		.join(' ')
		.toLowerCase();
	return haystack.includes(search.toLowerCase());
}
