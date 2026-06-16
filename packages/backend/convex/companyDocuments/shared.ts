import { ConvexError, v } from 'convex/values';
import { internalMutation, internalQuery } from '../_generated/server';

export const getDocumentById = internalQuery({
	args: { documentId: v.id('companyDocuments') },
	handler: async (ctx, args) => {
		const doc = await ctx.db.get(args.documentId);
		if (!doc) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Document not found',
			});
		}
		return doc;
	},
});

export const getFolderById = internalQuery({
	args: { folderId: v.id('companyDocumentFolders') },
	handler: async (ctx, args) => {
		const folder = await ctx.db.get(args.folderId);
		if (!folder) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Folder not found',
			});
		}
		return folder;
	},
});

export const checkDocumentKebabNameExists = internalQuery({
	args: {
		folderPath: v.string(),
		kebabName: v.string(),
		excludeDocumentId: v.optional(v.id('companyDocuments')),
	},
	handler: async (ctx, args) => {
		const doc = await ctx.db
			.query('companyDocuments')
			.withIndex('by_folder', (q) => q.eq('folderPath', args.folderPath))
			.filter((q) => q.eq(q.field('kebabName'), args.kebabName))
			.first();
		if (!doc) {
			return false;
		}
		if (args.excludeDocumentId && doc._id === args.excludeDocumentId) {
			return false;
		}
		return true;
	},
});

export const getAllDocuments = internalQuery({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query('companyDocuments').collect();
	},
});

export const getAllFolders = internalQuery({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query('companyDocumentFolders').collect();
	},
});

export const updateDocumentRecord = internalMutation({
	args: {
		documentId: v.id('companyDocuments'),
		name: v.string(),
		kebabName: v.string(),
		s3Key: v.string(),
		folderPath: v.string(),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.documentId, {
			name: args.name,
			kebabName: args.kebabName,
			s3Key: args.s3Key,
			folderPath: args.folderPath,
		});
	},
});

export const deleteDocumentRecord = internalMutation({
	args: { documentId: v.id('companyDocuments') },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.documentId);
	},
});

export const updateFolderRecord = internalMutation({
	args: {
		folderId: v.id('companyDocumentFolders'),
		name: v.string(),
		path: v.string(),
		parentPath: v.string(),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.folderId, {
			name: args.name,
			path: args.path,
			parentPath: args.parentPath,
		});
	},
});

export const deleteFolderRecord = internalMutation({
	args: { folderId: v.id('companyDocumentFolders') },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.folderId);
	},
});

export const batchUpdateDocumentFolderPath = internalMutation({
	args: {
		updates: v.array(
			v.object({
				documentId: v.id('companyDocuments'),
				folderPath: v.string(),
				s3Key: v.string(),
			})
		),
	},
	handler: async (ctx, args) => {
		for (const update of args.updates) {
			await ctx.db.patch(update.documentId, {
				folderPath: update.folderPath,
				s3Key: update.s3Key,
			});
		}
	},
});
