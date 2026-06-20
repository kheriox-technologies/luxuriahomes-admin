import { v } from 'convex/values';
import { mutation } from '../../_generated/server';
import {
	clientDisplayName,
	requireProjectClient,
} from '../../lib/clientAccess';
import { createNotification, inclusionsLink } from '../../notifications/shared';
import {
	buildProjectInclusionSearchText,
	getProjectInclusionOrThrow,
} from '../../projectInclusions/shared';
import { projectInclusionStatusValidator } from '../../schema';

export const setStatus = mutation({
	args: {
		projectInclusionId: v.id('projectInclusions'),
		status: projectInclusionStatusValidator,
	},
	handler: async (ctx, args) => {
		const existing = await getProjectInclusionOrThrow(
			ctx,
			args.projectInclusionId
		);
		const { identity } = await requireProjectClient(ctx, existing.projectId);

		const searchText = buildProjectInclusionSearchText(existing.title, {
			code: existing.code,
			vendor: existing.vendor,
			models: existing.models,
			color: existing.color,
			locations: existing.locations,
			status: args.status,
		});

		await ctx.db.patch(args.projectInclusionId, {
			status: args.status,
			searchText,
		});

		const name = clientDisplayName(identity);
		const isApproved = args.status === 'Approved';
		await createNotification(ctx, {
			type: isApproved ? 'inclusion_approved' : 'inclusion_unapproved',
			message: isApproved
				? `${name} approved the inclusion "${existing.title}"`
				: `${name} marked the inclusion "${existing.title}" as under review`,
			fromName: name,
			fromEmail: identity.email,
			link: inclusionsLink(existing.projectId),
			projectId: existing.projectId,
		});

		return args.projectInclusionId;
	},
});
