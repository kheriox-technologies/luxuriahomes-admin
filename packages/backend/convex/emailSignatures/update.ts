import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildEmailSignatureSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import {
	clearOtherDefaultSignatures,
	getSignatureOrThrow,
	parseSignatureFields,
	parseSignatureName,
	renderSignatureContent,
	signatureFieldsValidator,
} from './shared';

export const update = mutation({
	args: {
		signatureId: v.id('emailSignatures'),
		name: v.string(),
		fields: signatureFieldsValidator,
		isDefault: v.boolean(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getSignatureOrThrow(ctx, args.signatureId);
		const name = parseSignatureName(args.name);
		const fields = parseSignatureFields(args.fields);
		if (args.isDefault) {
			await clearOtherDefaultSignatures(ctx, args.signatureId);
		}
		await ctx.db.patch(args.signatureId, {
			name,
			content: renderSignatureContent(fields),
			fields,
			isDefault: args.isDefault,
			searchText: buildEmailSignatureSearchText(
				name,
				fields.fullName,
				fields.email
			),
		});
		return args.signatureId;
	},
});
