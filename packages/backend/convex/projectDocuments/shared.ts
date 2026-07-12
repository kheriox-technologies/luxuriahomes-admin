import { ConvexError, v } from 'convex/values';
import { internal } from '../_generated/api';
import type { Id } from '../_generated/dataModel';
import {
	internalMutation,
	internalQuery,
	type MutationCtx,
} from '../_generated/server';

// Documents added to this folder (by slug) are candidates for Xero bill
// forwarding. Matches the "Bills" template slug from `documentFolders`.
const BILLS_FOLDER_PATH = 'bills';
const PDF_NAME_REGEX = /\.pdf$/i;

/** True when the document is a PDF, by MIME type or filename extension. */
function isPdf(name: string, mimeType?: string): boolean {
	return mimeType?.includes('pdf') === true || PDF_NAME_REGEX.test(name);
}

// Shared insert used by the admin `create` mutation and the Gmail add-on
// ingestion path, which resolves `uploadedBy` outside of Clerk identity.
export async function insertProjectDocument(
	ctx: MutationCtx,
	args: {
		projectId: Id<'projects'>;
		name: string;
		kebabName: string;
		s3Key: string;
		folderPath: string;
		size?: number;
		mimeType?: string;
		uploadedBy: string;
	}
): Promise<Id<'projectDocuments'>> {
	// PDFs dropped into the Bills folder (via the portal or the Gmail add-on,
	// both of which route through here) get emailed to Xero for bill drafting.
	const forwardToXero =
		args.folderPath === BILLS_FOLDER_PATH && isPdf(args.name, args.mimeType);

	const documentId = await ctx.db.insert('projectDocuments', {
		projectId: args.projectId,
		name: args.name,
		kebabName: args.kebabName,
		s3Key: args.s3Key,
		folderPath: args.folderPath,
		size: args.size,
		mimeType: args.mimeType,
		uploadedBy: args.uploadedBy,
		uploadedAt: Date.now(),
		xeroBillStatus: forwardToXero ? 'queued' : undefined,
	});

	if (forwardToXero) {
		await ctx.scheduler.runAfter(
			0,
			internal.xero.emailBillToXero.emailBillToXero,
			{ documentId }
		);
	}

	return documentId;
}

/**
 * Records the outcome of forwarding a bill PDF to Xero. Called by the
 * `emailBillToXero` action after the send attempt.
 */
export const setXeroBillStatus = internalMutation({
	args: {
		documentId: v.id('projectDocuments'),
		status: v.union(
			v.literal('queued'),
			v.literal('sent'),
			v.literal('failed')
		),
		sentAt: v.optional(v.number()),
		messageId: v.optional(v.string()),
		error: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.documentId, {
			xeroBillStatus: args.status,
			xeroBillSentAt: args.sentAt,
			xeroBillMessageId: args.messageId,
			xeroBillError: args.error,
		});
	},
});

export const getDocumentById = internalQuery({
	args: { documentId: v.id('projectDocuments') },
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
	args: { folderId: v.id('projectDocumentFolders') },
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
		projectId: v.id('projects'),
		folderPath: v.string(),
		kebabName: v.string(),
		excludeDocumentId: v.optional(v.id('projectDocuments')),
	},
	handler: async (ctx, args) => {
		const doc = await ctx.db
			.query('projectDocuments')
			.withIndex('by_project_and_folder', (q) =>
				q.eq('projectId', args.projectId).eq('folderPath', args.folderPath)
			)
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

export const getAllDocumentsForProject = internalQuery({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		return await ctx.db
			.query('projectDocuments')
			.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
			.collect();
	},
});

export const getAllFoldersForProject = internalQuery({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		return await ctx.db
			.query('projectDocumentFolders')
			.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
			.collect();
	},
});

export const updateDocumentRecord = internalMutation({
	args: {
		documentId: v.id('projectDocuments'),
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
	args: { documentId: v.id('projectDocuments') },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.documentId);
	},
});

export const updateFolderRecord = internalMutation({
	args: {
		folderId: v.id('projectDocumentFolders'),
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
	args: { folderId: v.id('projectDocumentFolders') },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.folderId);
	},
});

export const batchUpdateDocumentFolderPath = internalMutation({
	args: {
		updates: v.array(
			v.object({
				documentId: v.id('projectDocuments'),
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
