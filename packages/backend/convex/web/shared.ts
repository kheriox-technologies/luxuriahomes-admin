import { v } from 'convex/values';
import type { Doc } from '../_generated/dataModel';
import { websiteProjectMediaValidator } from '../websiteProjects/shared';

/**
 * Public-facing shape of a website project returned to the marketing site.
 * Deliberately omits internal fields (`searchText`, `include`) so they never
 * leak to unauthenticated callers.
 */
export const webProjectValidator = v.object({
	_id: v.id('websiteProjects'),
	_creationTime: v.number(),
	name: v.string(),
	description: v.optional(v.string()),
	status: v.union(v.literal('completed'), v.literal('in_progress')),
	completedYear: v.optional(v.number()),
	beds: v.optional(v.number()),
	baths: v.optional(v.number()),
	powder: v.optional(v.number()),
	cars: v.optional(v.number()),
	living: v.optional(v.number()),
	study: v.optional(v.number()),
	landArea: v.optional(v.number()),
	buildingArea: v.optional(v.number()),
	hasPool: v.optional(v.boolean()),
	hasMediaRoom: v.optional(v.boolean()),
	mainImageKey: v.optional(v.string()),
	media: v.optional(v.array(websiteProjectMediaValidator)),
});

/** Maps a raw project doc to the public shape, stripping internal fields. */
export function toPublicProject(doc: Doc<'websiteProjects'>) {
	return {
		_id: doc._id,
		_creationTime: doc._creationTime,
		name: doc.name,
		description: doc.description,
		status: doc.status,
		completedYear: doc.completedYear,
		beds: doc.beds,
		baths: doc.baths,
		powder: doc.powder,
		cars: doc.cars,
		living: doc.living,
		study: doc.study,
		landArea: doc.landArea,
		buildingArea: doc.buildingArea,
		hasPool: doc.hasPool,
		hasMediaRoom: doc.hasMediaRoom,
		mainImageKey: doc.mainImageKey,
		media: doc.media,
	};
}

export function sortByName<T extends { name: string }>(rows: T[]): T[] {
	return rows.sort((a, b) =>
		a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
	);
}
