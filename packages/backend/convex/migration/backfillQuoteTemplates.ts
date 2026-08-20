import { internalMutation } from '../_generated/server';
import { buildQuoteTemplateSearchText } from '../lib/buildSearchText';

const STANDARD_TEMPLATE_NAME = 'Standard';

/** Every catalogue table that hangs directly off a template. */
const SCOPED_TABLES = [
	'quoteStages',
	'quoteTermSections',
	'quoteTermsSettings',
	'quoteExclusions',
	'quoteNotes',
] as const;

/**
 * Moves the single global quote catalogue into a template named "Standard".
 *
 * Idempotent: an existing template called "Standard" is reused, and only rows
 * whose `templateId` is still unset are patched, so a second run reports
 * `patched: 0` everywhere.
 *
 *   npx convex run migration/backfillQuoteTemplates
 */
export const backfillQuoteTemplates = internalMutation({
	args: {},
	handler: async (ctx) => {
		const templates = await ctx.db.query('quoteTemplates').collect();
		const existing = templates.find(
			(template) =>
				template.name.trim().toLowerCase() ===
				STANDARD_TEMPLATE_NAME.toLowerCase()
		);
		const templateId =
			existing?._id ??
			(await ctx.db.insert('quoteTemplates', {
				createdAt: Date.now(),
				description:
					'The original quotation catalogue, migrated into its own template.',
				name: STANDARD_TEMPLATE_NAME,
				order: templates.length,
				searchText: buildQuoteTemplateSearchText(STANDARD_TEMPLATE_NAME),
			}));

		const results: Record<string, { patched: number; skipped: number }> = {};

		for (const table of SCOPED_TABLES) {
			const rows = await ctx.db.query(table).collect();
			let patched = 0;
			let skipped = 0;
			for (const row of rows) {
				if (row.templateId === undefined) {
					await ctx.db.patch(row._id, { templateId });
					patched++;
				} else {
					skipped++;
				}
			}
			results[table] = { patched, skipped };
		}

		return { createdTemplate: existing === undefined, results, templateId };
	},
});
