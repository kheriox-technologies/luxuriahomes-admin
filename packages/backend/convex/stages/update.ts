import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildStageSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { stageDependencyTypeValidator } from '../schema';
import { getStageOrThrow, parseDescription, parseStageName } from './shared';

export const update = mutation({
	args: {
		stageId: v.id('stages'),
		name: v.string(),
		description: v.optional(v.string()),
		dependsOn: v.optional(
			v.array(
				v.object({
					stageId: v.id('stages'),
					type: stageDependencyTypeValidator,
				})
			)
		),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getStageOrThrow(ctx, args.stageId);

		const name = parseStageName(args.name);
		const description = parseDescription(args.description);
		const searchText = buildStageSearchText(name, description);

		let dependsOn:
			| Array<{ stageId: typeof args.stageId; type: 'after' | 'alongWith' }>
			| undefined;
		if (args.dependsOn !== undefined) {
			for (const dep of args.dependsOn) {
				if (dep.stageId === args.stageId) {
					throw new ConvexError({
						code: 'SELF_DEPENDENCY',
						message: 'A stage cannot depend on itself',
					});
				}
				const exists = await ctx.db.get(dep.stageId);
				if (!exists) {
					throw new ConvexError({
						code: 'NOT_FOUND',
						message: 'Dependency stage not found',
					});
				}
			}
			dependsOn = args.dependsOn;
		}

		await ctx.db.patch(args.stageId, {
			name,
			description,
			searchText,
			...(dependsOn !== undefined && { dependsOn }),
		});
	},
});
