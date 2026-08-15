import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildEmailSignatureSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import {
	clearOtherDefaultSignatures,
	parseSignatureFields,
	parseSignatureName,
	renderSignatureContent,
	signatureFieldsValidator,
} from './shared';

export const add = mutation({
	args: {
		name: v.string(),
		fields: signatureFieldsValidator,
		isDefault: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const name = parseSignatureName(args.name);
		const fields = parseSignatureFields(args.fields);
		const isDefault = args.isDefault ?? false;
		if (isDefault) {
			await clearOtherDefaultSignatures(ctx);
		}
		return await ctx.db.insert('emailSignatures', {
			name,
			content: renderSignatureContent(fields),
			fields,
			isDefault,
			searchText: buildEmailSignatureSearchText(
				name,
				fields.fullName,
				fields.email
			),
		});
	},
});
