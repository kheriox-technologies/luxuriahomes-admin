'use node';

import { v } from 'convex/values';
import { internalAction } from '../_generated/server';
import { presignDocumentUpload } from '../projectDocuments/generateUploadUrl';
import { presignQuotationUpload } from '../projectQuotations/generateUploadUrl';

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

export const generateQuotationUploadUrl = internalAction({
	args: {
		projectId: v.id('projects'),
		contentType: v.string(),
		ext: v.string(),
	},
	returns: v.object({ uploadUrl: v.string(), s3Key: v.string() }),
	handler: async (_ctx, args) => await presignQuotationUpload(args),
});
