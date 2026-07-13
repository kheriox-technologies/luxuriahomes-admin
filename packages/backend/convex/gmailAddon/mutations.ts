import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';
import { ensureFolderPath } from '../projectDocuments/ensureFolder';
import { insertProjectDocument } from '../projectDocuments/shared';
import { insertProjectQuotation } from '../projectQuotations/shared';

export const createDocument = internalMutation({
	args: {
		projectId: v.id('projects'),
		name: v.string(),
		kebabName: v.string(),
		s3Key: v.string(),
		folderPath: v.string(),
		size: v.optional(v.number()),
		mimeType: v.optional(v.string()),
		uploadedBy: v.string(),
	},
	handler: async (ctx, args) => await insertProjectDocument(ctx, args),
});

export const ensureFolder = internalMutation({
	args: {
		projectId: v.id('projects'),
		parentPath: v.string(),
		segments: v.array(v.string()),
	},
	handler: async (ctx, args) =>
		await ensureFolderPath(ctx, args.projectId, args.parentPath, args.segments),
});

export const createQuotation = internalMutation({
	args: {
		projectId: v.id('projects'),
		title: v.string(),
		tradeId: v.id('trades'),
		serviceProviderId: v.id('serviceProviders'),
		price: v.number(),
		s3Key: v.optional(v.string()),
	},
	handler: async (ctx, args) =>
		await insertProjectQuotation(ctx, { ...args, status: 'Under Review' }),
});
