import { v } from 'convex/values';
import { mutation } from '../../_generated/server';
import {
	clientDisplayName,
	requireProjectClient,
} from '../../lib/clientAccess';
import { createNotification, documentsLink } from '../../notifications/shared';
import {
	CLIENT_UPLOADS_FOLDER_NAME,
	CLIENT_UPLOADS_FOLDER_PATH,
} from './shared';

export const create = mutation({
	args: {
		projectId: v.id('projects'),
		name: v.string(),
		kebabName: v.string(),
		s3Key: v.string(),
		size: v.optional(v.number()),
		mimeType: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { identity } = await requireProjectClient(ctx, args.projectId);

		// Ensure the "Client Uploads" folder exists so admins see uploads grouped.
		const existingFolder = await ctx.db
			.query('projectDocumentFolders')
			.withIndex('by_project_and_path', (q) =>
				q.eq('projectId', args.projectId).eq('path', CLIENT_UPLOADS_FOLDER_PATH)
			)
			.first();
		if (!existingFolder) {
			await ctx.db.insert('projectDocumentFolders', {
				projectId: args.projectId,
				name: CLIENT_UPLOADS_FOLDER_NAME,
				path: CLIENT_UPLOADS_FOLDER_PATH,
				parentPath: '',
			});
		}

		const name = clientDisplayName(identity);
		const documentId = await ctx.db.insert('projectDocuments', {
			projectId: args.projectId,
			name: args.name,
			kebabName: args.kebabName,
			s3Key: args.s3Key,
			folderPath: CLIENT_UPLOADS_FOLDER_PATH,
			size: args.size,
			mimeType: args.mimeType,
			uploadedBy: name,
			uploadedAt: Date.now(),
			clientPortalVisible: true,
			uploadedByClient: true,
		});

		await createNotification(ctx, {
			type: 'document_upload',
			message: `${name} uploaded the document "${args.name}"`,
			fromName: name,
			fromEmail: identity.email,
			link: documentsLink(args.projectId),
			projectId: args.projectId,
		});

		return documentId;
	},
});
