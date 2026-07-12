'use node';

import { v } from 'convex/values';
import { internalAction } from '../_generated/server';
import { presignDocumentUpload } from '../projectDocuments/generateUploadUrl';

export const generateUploadUrl = internalAction({
	args: {
		projectId: v.id('projects'),
		folderPath: v.string(),
		fileName: v.string(),
		contentType: v.string(),
	},
	returns: v.object({
		uploadUrl: v.string(),
		s3Key: v.string(),
		kebabName: v.string(),
	}),
	handler: async (ctx, args) => await presignDocumentUpload(ctx, args),
});
