import { ConvexError, v } from 'convex/values';
import type { Doc } from '../_generated/dataModel';
import { mutation } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { getProjectInclusionOrThrow } from './shared';

type ProjectInclusionNoteEntry = NonNullable<
	Doc<'projectInclusions'>['notes']
>[number];

function addedByFromIdentity(identity: {
	email?: string;
	name?: string;
}): string {
	const name = identity.name?.trim();
	if (name) {
		return name;
	}
	const email = identity.email?.trim();
	if (email) {
		return email;
	}
	return 'Unknown user';
}

export const appendNote = mutation({
	args: {
		projectInclusionId: v.id('projectInclusions'),
		note: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		const existing = await getProjectInclusionOrThrow(
			ctx,
			args.projectInclusionId
		);
		const trimmed = args.note.trim();
		if (trimmed === '') {
			throw new ConvexError({
				code: 'INVALID_NOTE',
				message: 'Note cannot be empty',
			});
		}
		const entry: ProjectInclusionNoteEntry = {
			timestamp: Date.now(),
			addedBy: addedByFromIdentity(identity),
			note: trimmed,
		};
		const prior = existing.notes ?? [];
		await ctx.db.patch(args.projectInclusionId, {
			notes: [...prior, entry],
		});
		return args.projectInclusionId;
	},
});
