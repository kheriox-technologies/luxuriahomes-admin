import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';

export function parseStageName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Stage name is required',
		});
	}
	return trimmed;
}

export function parseDescription(
	description: string | undefined
): string | undefined {
	if (description === undefined) {
		return undefined;
	}
	const trimmed = description.trim();
	return trimmed.length > 0 ? trimmed : undefined;
}

export async function getStageOrThrow(
	ctx: MutationCtx | QueryCtx,
	stageId: Id<'stages'>
) {
	const stage = await ctx.db.get(stageId);
	if (!stage) {
		throw new ConvexError({ code: 'NOT_FOUND', message: 'Stage not found' });
	}
	return stage;
}
