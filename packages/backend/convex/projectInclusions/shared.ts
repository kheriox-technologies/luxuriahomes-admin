import { ConvexError } from 'convex/values';
import type { Doc, Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import { buildSearchText } from '../lib/buildSearchText';

type ReadCtx = MutationCtx | QueryCtx;

export function roundMoney(value: number): number {
	return Math.round(value * 100) / 100;
}

export function buildProjectInclusionSearchText(
	title: string,
	fields: Pick<
		Doc<'projectInclusions'>,
		'code' | 'vendor' | 'models' | 'color' | 'locations' | 'status'
	>
): string {
	const locationNames = fields.locations?.map((l) => l.name) ?? [];
	return buildSearchText([
		title,
		fields.code,
		fields.vendor,
		fields.color,
		...fields.models,
		...locationNames,
		fields.status,
	]);
}

export async function getProjectOrThrow(
	ctx: ReadCtx,
	projectId: Id<'projects'>
) {
	const project = await ctx.db.get(projectId);
	if (!project) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Project not found',
		});
	}
	return project;
}

export async function getProjectInclusionOrThrow(
	ctx: ReadCtx,
	projectInclusionId: Id<'projectInclusions'>
) {
	const row = await ctx.db.get(projectInclusionId);
	if (!row) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Project inclusion not found',
		});
	}
	return row;
}

export async function deleteNotesForProjectInclusion(
	ctx: MutationCtx,
	projectInclusionId: Id<'projectInclusions'>
) {
	const rows = await ctx.db
		.query('projectInclusionNotes')
		.withIndex('by_project_inclusion', (q) =>
			q.eq('projectInclusionId', projectInclusionId)
		)
		.collect();
	for (const row of rows) {
		await ctx.db.delete(row._id);
	}
}

export function buildVariationFromBase(
	className: Doc<'projectInclusions'>['class'],
	salePrice: number,
	basePrice: number | undefined,
	labourPrice?: number | undefined,
	baseLabourPrice?: number | undefined
) {
	if (className === 'Standard' || basePrice === undefined) {
		return { variationPrice: undefined };
	}
	const baseVariation = salePrice - basePrice;
	const labourVariation = (labourPrice ?? 0) - (baseLabourPrice ?? 0);
	return { variationPrice: roundMoney(baseVariation + labourVariation) };
}

export function validateVariationFields(
	className: Doc<'projectInclusions'>['class'],
	variationPrice: number | undefined
) {
	if (className === 'Standard' && variationPrice !== undefined) {
		throw new ConvexError({
			code: 'INVALID_VARIATION',
			message: 'Standard class cannot have a variation price',
		});
	}
}
