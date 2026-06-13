import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

export function parseScheduleTemplateName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Schedule template name is required',
		});
	}
	return trimmed;
}

export async function getScheduleTemplateOrThrow(
	ctx: MutationCtx,
	scheduleTemplateId: Id<'scheduleTemplates'>
) {
	const scheduleTemplate = await ctx.db.get(scheduleTemplateId);
	if (!scheduleTemplate) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Schedule template not found',
		});
	}
	return scheduleTemplate;
}
