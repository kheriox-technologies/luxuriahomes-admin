import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildEmailSignatureSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import {
	clearOtherDefaultSignatures,
	getSignatureOrThrow,
	parseSignatureName,
} from './shared';

export const update = mutation({
	args: {
		signatureId: v.id('emailSignatures'),
		name: v.string(),
		content: v.string(),
		isDefault: v.boolean(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getSignatureOrThrow(ctx, args.signatureId);
		const name = parseSignatureName(args.name);
		if (args.isDefault) {
			await clearOtherDefaultSignatures(ctx, args.signatureId);
		}
		await ctx.db.patch(args.signatureId, {
			name,
			content: args.content,
			isDefault: args.isDefault,
			searchText: buildEmailSignatureSearchText(name),
		});
		return args.signatureId;
	},
});
