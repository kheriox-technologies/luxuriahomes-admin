import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildEmailSignatureSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { clearOtherDefaultSignatures, parseSignatureName } from './shared';

export const add = mutation({
	args: {
		name: v.string(),
		content: v.string(),
		isDefault: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const name = parseSignatureName(args.name);
		const isDefault = args.isDefault ?? false;
		if (isDefault) {
			await clearOtherDefaultSignatures(ctx);
		}
		return await ctx.db.insert('emailSignatures', {
			name,
			content: args.content,
			isDefault,
			searchText: buildEmailSignatureSearchText(name),
		});
	},
});
