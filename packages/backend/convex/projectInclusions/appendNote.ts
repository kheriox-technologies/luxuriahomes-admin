import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { getProjectInclusionOrThrow } from './shared';

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
		await getProjectInclusionOrThrow(ctx, args.projectInclusionId);
		const trimmed = args.note.trim();
		if (trimmed === '') {
			throw new ConvexError({
				code: 'INVALID_NOTE',
				message: 'Note cannot be empty',
			});
		}
		const timestamp = Date.now();
		const addedBy = addedByFromIdentity(identity);
		await ctx.db.insert('projectInclusionNotes', {
			projectInclusionId: args.projectInclusionId,
			timestamp,
			addedBy,
			note: trimmed,
		});
		return args.projectInclusionId;
	},
});
