import { ConvexError, v } from 'convex/values';
import { mutation } from '../../_generated/server';
import {
	clientDisplayName,
	requireProjectClient,
} from '../../lib/clientAccess';
import { createNotification, inclusionsLink } from '../../notifications/shared';
import { getProjectInclusionOrThrow } from '../../projectInclusions/shared';

export const appendNote = mutation({
	args: {
		projectInclusionId: v.id('projectInclusions'),
		note: v.string(),
		images: v.optional(v.array(v.string())),
	},
	handler: async (ctx, args) => {
		const inclusion = await getProjectInclusionOrThrow(
			ctx,
			args.projectInclusionId
		);
		const { identity, project } = await requireProjectClient(
			ctx,
			inclusion.projectId
		);
		const trimmed = args.note.trim();
		if (trimmed === '') {
			throw new ConvexError({
				code: 'INVALID_NOTE',
				message: 'Note cannot be empty',
			});
		}
		const images = args.images?.filter((key) => key.trim() !== '');
		const name = clientDisplayName(identity);
		await ctx.db.insert('projectInclusionNotes', {
			projectInclusionId: args.projectInclusionId,
			timestamp: Date.now(),
			addedBy: name,
			note: trimmed,
			images: images && images.length > 0 ? images : undefined,
		});

		await createNotification(ctx, {
			type: 'inclusion_note',
			message: `${project.name} - Note added on inclusion "${inclusion.title}"`,
			fromName: name,
			fromEmail: identity.email,
			link: inclusionsLink(inclusion.projectId),
			projectId: inclusion.projectId,
		});

		return args.projectInclusionId;
	},
});
