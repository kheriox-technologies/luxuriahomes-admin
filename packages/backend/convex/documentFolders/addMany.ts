import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { mutation } from '../_generated/server';
import { buildDocumentFolderSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { parseDocumentFolderName } from './shared';

export const addMany = mutation({
	args: {
		names: v.array(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const ids: Id<'documentFolders'>[] = [];
		for (const raw of args.names) {
			const name = parseDocumentFolderName(raw);
			const searchText = buildDocumentFolderSearchText(name);
			ids.push(await ctx.db.insert('documentFolders', { name, searchText }));
		}
		return ids;
	},
});
