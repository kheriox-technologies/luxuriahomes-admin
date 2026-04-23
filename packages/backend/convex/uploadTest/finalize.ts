import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const finalize = mutation({
	args: {
		storageId: v.id('_storage'),
		fileName: v.string(),
		contentType: v.string(),
		byteLength: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const documentId = await ctx.db.insert('uploadTestImages', {
			storageId: args.storageId,
			fileName: args.fileName,
			contentType: args.contentType,
			byteLength: args.byteLength,
		});
		const url = await ctx.storage.getUrl(args.storageId);
		return {
			documentId,
			storageId: args.storageId,
			url,
			fileName: args.fileName,
			contentType: args.contentType,
			byteLength: args.byteLength,
		};
	},
});
