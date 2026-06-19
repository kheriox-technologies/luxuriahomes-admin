import { ConvexError, v } from 'convex/values';
import { mutation } from '../../_generated/server';
import {
	clientDisplayName,
	requireProjectClient,
} from '../../lib/clientAccess';
import { getProjectInclusionOrThrow } from '../../projectInclusions/shared';

export const appendNote = mutation({
	args: {
		projectInclusionId: v.id('projectInclusions'),
		note: v.string(),
	},
	handler: async (ctx, args) => {
		const inclusion = await getProjectInclusionOrThrow(
			ctx,
			args.projectInclusionId
		);
		const { identity } = await requireProjectClient(ctx, inclusion.projectId);
		const trimmed = args.note.trim();
		if (trimmed === '') {
			throw new ConvexError({
				code: 'INVALID_NOTE',
				message: 'Note cannot be empty',
			});
		}
		await ctx.db.insert('projectInclusionNotes', {
			projectInclusionId: args.projectInclusionId,
			timestamp: Date.now(),
			addedBy: clientDisplayName(identity),
			note: trimmed,
		});
		return args.projectInclusionId;
	},
});
