import { ConvexError, v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { internalMutation, internalQuery } from '../_generated/server';

// Project-root folder that holds PDFs added to take-offs (mirrors the
// "Client Uploads" special folder pattern). The path is the kebab slug used in
// S3 keys and folder records.
export const TAKE_OFFS_FOLDER_NAME = 'Take Offs';
export const TAKE_OFFS_FOLDER_PATH = 'take-offs';

// Default measurement method seeded on a new take-off: most plans are A3 at
// 1:100, so tools work immediately without manual calibration.
const DEFAULT_TAKEOFF_WASTAGE = 10;
const DEFAULT_TAKEOFF_METHOD = {
	kind: 'scale' as const,
	scale: { ratio: 100, paper: 'A3' as const },
};

export const getTakeoffById = internalQuery({
	args: { takeoffId: v.id('takeoffs') },
	handler: async (ctx, args) => {
		const takeoff = await ctx.db.get(args.takeoffId);
		if (!takeoff) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Takeoff not found',
			});
		}
		return takeoff;
	},
});

export const deleteTakeoffRecord = internalMutation({
	args: { takeoffId: v.id('takeoffs') },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.takeoffId);
	},
});

// Ensures the project's "Take Offs" folder exists, records the copied PDF as a
// projectDocument inside it, and creates the linked takeoff row. Called from the
// addToTakeoffs node action (which cannot touch the db directly).
export const createCopyAndTakeoff = internalMutation({
	args: {
		projectId: v.id('projects'),
		name: v.string(),
		kebabName: v.string(),
		s3Key: v.string(),
		size: v.optional(v.number()),
		mimeType: v.optional(v.string()),
		uploadedBy: v.string(),
	},
	handler: async (
		ctx,
		args
	): Promise<{
		takeoffId: Id<'takeoffs'>;
		documentId: Id<'projectDocuments'>;
	}> => {
		const existingFolder = await ctx.db
			.query('projectDocumentFolders')
			.withIndex('by_project_and_path', (q) =>
				q.eq('projectId', args.projectId).eq('path', TAKE_OFFS_FOLDER_PATH)
			)
			.first();
		if (!existingFolder) {
			await ctx.db.insert('projectDocumentFolders', {
				projectId: args.projectId,
				name: TAKE_OFFS_FOLDER_NAME,
				path: TAKE_OFFS_FOLDER_PATH,
				parentPath: '',
			});
		}

		const documentId = await ctx.db.insert('projectDocuments', {
			projectId: args.projectId,
			name: args.name,
			kebabName: args.kebabName,
			s3Key: args.s3Key,
			folderPath: TAKE_OFFS_FOLDER_PATH,
			size: args.size,
			mimeType: args.mimeType,
			uploadedBy: args.uploadedBy,
			uploadedAt: Date.now(),
		});

		const takeoffId = await ctx.db.insert('takeoffs', {
			projectId: args.projectId,
			documentId,
			s3Key: args.s3Key,
			name: args.name,
			measurements: [],
			legends: [],
			texts: [],
			pageTitles: [],
			documentMethod: DEFAULT_TAKEOFF_METHOD,
			pageMethods: [],
			globalWastage: DEFAULT_TAKEOFF_WASTAGE,
			updatedAt: Date.now(),
		});

		return { takeoffId, documentId };
	},
});
