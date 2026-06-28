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

interface UnitResolutionCaches {
	// Unit id -> its abbreviation.
	unitAbbr: Map<Id<'units'>, string>;
	// Variant code -> the inclusion's measurementUnit id (or null if none).
	variantUnitId: Map<string, Id<'units'> | null>;
}

export function createUnitResolutionCaches(): UnitResolutionCaches {
	return {
		variantUnitId: new Map(),
		unitAbbr: new Map(),
	};
}

/**
 * Resolves the catalogue unit abbreviation for a project inclusion from its
 * variant `code`. Project inclusions don't store a variant/inclusion id, but
 * the variant `code` is unique (`by_code` index), so we walk
 * variant -> inclusion.measurementUnit -> units.abbr. Returns undefined when
 * any link is missing (e.g. the source variant was deleted or has no unit set).
 *
 * Pass shared caches when resolving many rows to avoid repeated reads.
 */
export async function resolveUnitAbbrByCode(
	ctx: ReadCtx,
	code: string,
	caches: UnitResolutionCaches
): Promise<string | undefined> {
	let unitId = caches.variantUnitId.get(code);
	if (unitId === undefined) {
		const variant = await ctx.db
			.query('inclusionVariants')
			.withIndex('by_code', (q) => q.eq('code', code))
			.first();
		const inclusion = variant ? await ctx.db.get(variant.inclusionId) : null;
		unitId = inclusion?.measurementUnit ?? null;
		caches.variantUnitId.set(code, unitId);
	}
	if (!unitId) {
		return undefined;
	}
	let abbr = caches.unitAbbr.get(unitId);
	if (abbr === undefined) {
		const unit = await ctx.db.get(unitId);
		abbr = unit?.abbr ?? '';
		caches.unitAbbr.set(unitId, abbr);
	}
	return abbr || undefined;
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
