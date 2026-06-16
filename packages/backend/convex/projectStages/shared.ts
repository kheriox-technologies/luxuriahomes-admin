import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';

export function parseProjectStageName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Stage name is required',
		});
	}
	return trimmed;
}

export async function getProjectStageOrThrow(
	ctx: MutationCtx | QueryCtx,
	stageId: Id<'projectStages'>
) {
	const stage = await ctx.db.get(stageId);
	if (!stage) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Stage not found',
		});
	}
	return stage;
}

export async function nextProjectStageOrder(
	ctx: MutationCtx,
	projectId: Id<'projects'>
): Promise<number> {
	const existing = await ctx.db
		.query('projectStages')
		.withIndex('by_project', (q) => q.eq('projectId', projectId))
		.collect();
	return existing.length === 0
		? 0
		: Math.max(...existing.map((s) => s.order)) + 1;
}
