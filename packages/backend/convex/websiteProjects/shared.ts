import { ConvexError, v } from 'convex/values';
import type { Doc, Id } from '../_generated/dataModel';
import type { QueryCtx } from '../_generated/server';
import { buildSearchText } from '../lib/buildSearchText';

export const websiteProjectStatusValidator = v.union(
	v.literal('completed'),
	v.literal('in_progress')
);

export const websiteProjectMediaTypeValidator = v.union(
	v.literal('image'),
	v.literal('video')
);

export const websiteProjectMediaValidator = v.object({
	key: v.string(),
	type: websiteProjectMediaTypeValidator,
});

export const WEBSITE_PROJECT_STATUS_LABELS: Record<
	'completed' | 'in_progress',
	string
> = {
	completed: 'Completed',
	in_progress: 'In progress',
};

export function buildWebsiteProjectSearchText(doc: {
	name: string;
	description?: string;
	status: string;
	completedYear?: number;
}): string {
	return buildSearchText([
		doc.name,
		doc.description,
		doc.status,
		doc.completedYear,
	]);
}

/**
 * Loads a website project by id or throws a NOT_FOUND ConvexError.
 */
export async function getWebsiteProjectOrThrow(
	ctx: QueryCtx,
	websiteProjectId: Id<'websiteProjects'>
): Promise<Doc<'websiteProjects'>> {
	const project = await ctx.db.get(websiteProjectId);
	if (!project) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Website project not found',
		});
	}
	return project;
}
