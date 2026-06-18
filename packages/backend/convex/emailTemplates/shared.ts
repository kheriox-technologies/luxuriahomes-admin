import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

export function parseTemplateName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Template name is required',
		});
	}
	return trimmed;
}

export async function getTemplateOrThrow(
	ctx: MutationCtx,
	templateId: Id<'emailTemplates'>
) {
	const template = await ctx.db.get(templateId);
	if (!template) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Template not found',
		});
	}
	return template;
}
