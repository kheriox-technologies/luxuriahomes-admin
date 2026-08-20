import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';
import {
	buildQuoteTermItemSearchText,
	buildQuoteTermSectionSearchText,
} from '../lib/buildSearchText';
import {
	templateTermSections,
	templateTermsSettings,
} from '../quoteTemplates/shared';

interface SeedTermSection {
	items: string[];
	name: string;
}

/**
 * Section 03 of the client quotation template
 * (`docs/client-quotation-template.pdf`). Stored as HTML because the page edits
 * it with the rich text editor and the PDF pipeline renders HTML.
 */
const DISCLAIMER_HTML = [
	'<p>This quotation is an estimate based on the drawings, specifications and site information available at the date of issue. It is not a fixed-price building contract.</p>',
	'<p>Prices are subject to final engineering, soil classification, service connection points and council or private certifier conditions. Any variation to these will be priced as a written variation before works proceed.</p>',
	"<p>Allowances noted throughout are budget figures for supply and install. Where selections exceed an allowance, the difference is charged at cost plus the builder's margin stated in the contract.</p>",
	'<p>Rock excavation, contaminated soil, asbestos removal, retaining to neighbouring boundaries and latent site conditions are excluded unless expressly listed as an inclusion.</p>',
].join('');

/** Section 05 of the same template, the copy printed above the signature block. */
const ACKNOWLEDGEMENT_HTML =
	'<p>By signing below, the client confirms they have read the stages, inclusions, disclaimer and terms set out in this quotation, and that the scope described reflects the home they wish to build.</p>';

/** Section 04 of the same template: six numbered sections of three clauses each. */
const TERM_SECTIONS: SeedTermSection[] = [
	{
		name: 'Validity & acceptance',
		items: [
			'This quotation remains open for acceptance for 30 days from the date of issue.',
			'Acceptance occurs on execution of a QBCC Level 2 Housing Contract, not on signing this document.',
			'Supplier pricing held for 30 days only; beyond that, material rates are reconfirmed before contract.',
		],
	},
	{
		name: 'Payments',
		items: [
			'Progress claims are issued at completion of each stage and are payable within five business days.',
			'Overdue amounts accrue interest at 10% per annum, calculated daily.',
			'The builder may suspend works while a claim remains unpaid; resulting delay costs are borne by the client.',
		],
	},
	{
		name: 'Variations',
		items: [
			'All variations are documented, priced and signed by both parties before the work is carried out.',
			'Variations are invoiced at the next progress claim unless otherwise agreed in writing.',
			'Client-requested changes after a stage has commenced may attract a rework charge at cost.',
		],
	},
	{
		name: 'Program & site access',
		items: [
			'Indicative build program is 62 weeks from slab pour, subject to weather and approvals.',
			"Extensions of time apply for inclement weather, industry shutdowns and supply delays outside the builder's control.",
			'Site visits are by appointment only, accompanied by the site supervisor, for insurance reasons.',
		],
	},
	{
		name: 'Insurance & warranties',
		items: [
			'QBCC Home Warranty Insurance and $20m public liability cover are held for the duration of works.',
			'Contract works insurance covers the structure until handover; client contents are excluded.',
			'Defect liability period of 12 months from practical completion; manufacturer warranties pass to the client.',
		],
	},
	{
		name: 'Selections & allowances',
		items: [
			'Final selections are to be confirmed at the colour appointment within 21 days of contract signing.',
			'Late selections that delay ordering may extend the program and attract holding costs.',
			'Natural stone, timber and handmade tiles vary in colour and grain; variation is not a defect.',
		],
	},
];

/**
 * Loads the quotation boilerplate from the client quotation template. Skips
 * entirely if any terms content already exists so it never overwrites hand-edited
 * copy. Run with `npx convex run quoteTerms/seed:populate`.
 */
export const populate = internalMutation({
	args: { templateId: v.id('quoteTemplates') },
	handler: async (ctx, args) => {
		const existingSettings = await templateTermsSettings(ctx, args.templateId);
		const existingSections = await templateTermSections(ctx, args.templateId);
		if (existingSettings || existingSections.length > 0) {
			return { skipped: true, message: 'Quote terms already populated' };
		}

		await ctx.db.insert('quoteTermsSettings', {
			acknowledgementHtml: ACKNOWLEDGEMENT_HTML,
			disclaimerHtml: DISCLAIMER_HTML,
			templateId: args.templateId,
		});

		let itemCount = 0;
		for (const [sectionIndex, section] of TERM_SECTIONS.entries()) {
			const sectionId = await ctx.db.insert('quoteTermSections', {
				name: section.name,
				order: sectionIndex,
				searchText: buildQuoteTermSectionSearchText(section.name),
				templateId: args.templateId,
			});
			for (const [itemIndex, text] of section.items.entries()) {
				await ctx.db.insert('quoteTermItems', {
					text,
					sectionId,
					order: itemIndex,
					searchText: buildQuoteTermItemSearchText(text, section.name),
				});
				itemCount += 1;
			}
		}

		return { sections: TERM_SECTIONS.length, items: itemCount };
	},
});
