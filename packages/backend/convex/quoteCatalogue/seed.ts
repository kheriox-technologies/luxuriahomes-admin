import { internalMutation } from '../_generated/server';
import {
	buildQuoteItemSearchText,
	buildQuoteSectionSearchText,
	buildQuoteStageSearchText,
} from '../lib/buildSearchText';
import { QUOTE_STAGE_DEFAULTS } from '../quoteStages/shared';

interface SeedItem {
	description: string;
	name: string;
}

interface SeedSection {
	items: SeedItem[];
	name: string;
}

interface SeedStage {
	name: string;
	sections: SeedSection[];
}

/**
 * The catalogue as it appears in the client quotation template
 * (`docs/client-quotation-template.pdf`): six QBCC progress-payment stages, each
 * with the sections and inclusion lines the template prints under it. Every
 * seeded item is a default so a new quotation starts from the full template.
 */
const QUOTE_CATALOGUE_DATA: SeedStage[] = [
	{
		name: 'Deposit',
		sections: [
			{
				name: 'Design & Documentation',
				items: [
					{
						name: 'Working drawings & engineering',
						description:
							'Full working drawings, engineering and energy efficiency report',
					},
					{
						name: 'Soil test & contour survey',
						description:
							'Soil test and contour survey by a registered surveyor',
					},
					{
						name: 'Building approval lodgement',
						description: 'Building approval lodgement with a private certifier',
					},
				],
			},
			{
				name: 'Approvals & Insurances',
				items: [
					{
						name: 'QBCC Home Warranty Insurance',
						description:
							'QBCC Home Warranty Insurance and contract works cover',
					},
					{
						name: 'Council & plumbing fees',
						description:
							'Council infrastructure charges and plumbing application fees',
					},
					{
						name: 'Site establishment',
						description:
							'Site establishment: temporary fencing, amenities and site power',
					},
				],
			},
		],
	},
	{
		name: 'Base',
		sections: [
			{
				name: 'Foundations',
				items: [
					{
						name: 'Waffle raft slab',
						description:
							'Engineer-designed waffle raft slab to AS 2870, class M soil classification',
					},
					{
						name: 'Bored concrete piers',
						description:
							'Bored concrete piers to basement retaining walls, depths per geotechnical report',
					},
					{
						name: 'Termite management system',
						description:
							'Termite management system to AS 3660 with 50-year product warranty',
					},
				],
			},
			{
				name: 'Earthworks & Drainage',
				items: [
					{
						name: 'Site cut & benching',
						description:
							"Site cut and benching to engineer's levels, spoil removed from site",
					},
					{
						name: 'Stormwater drainage',
						description:
							'Stormwater drainage to legal point of discharge with silt control',
					},
					{
						name: 'Under-slab rough-in',
						description: 'Under-slab plumbing rough-in and service conduits',
					},
				],
			},
		],
	},
	{
		name: 'Frame',
		sections: [
			{
				name: 'Structural Frame',
				items: [
					{
						name: 'Structural steel',
						description:
							'Structural steel beams and columns, hot-dip galvanised, primed and certified',
					},
					{
						name: 'Wall frames',
						description:
							'MGP10 seasoned pine wall frames at 450mm centres, 2740mm ceiling height',
					},
					{
						name: 'Roof trusses',
						description:
							'Engineered roof trusses, wind rated to N3 with cyclone tie-down straps',
					},
				],
			},
			{
				name: 'Services Rough-in',
				items: [
					{
						name: 'Electrical rough-in',
						description:
							'Electrical rough-in including Cat6 data cabling to eight locations',
					},
					{
						name: 'Air conditioning rough-in',
						description:
							'Ducted air conditioning rough-in, four zones with dedicated returns',
					},
					{
						name: 'Hydronic & gas rough-in',
						description:
							'Hydronic and gas rough-in to kitchen, laundry and outdoor kitchen',
					},
				],
			},
		],
	},
	{
		name: 'Enclosed',
		sections: [
			{
				name: 'Roof & External Cladding',
				items: [
					{
						name: 'Colorbond standing seam roof',
						description:
							'Colorbond Ultra standing seam roof with concealed box gutters',
					},
					{
						name: 'Rendered blockwork',
						description:
							'Rendered blockwork to ground floor, acrylic texture coat in three-colour scheme',
					},
					{
						name: 'Sarking & wall insulation',
						description:
							'Sarking, wall wrap and R2.5 external wall insulation throughout',
					},
				],
			},
			{
				name: 'Glazing & External Doors',
				items: [
					{
						name: 'Aluminium glazing',
						description:
							'Commercial-grade thermally broken aluminium glazing, double glazed throughout',
					},
					{
						name: 'Pivot entry door',
						description:
							'Pivot entry door in solid American oak, 1200 x 2700mm with concealed hardware',
					},
					{
						name: 'Stacking sliding doors',
						description:
							'Stacking sliding doors to alfresco with flush sill detail',
					},
				],
			},
		],
	},
	{
		name: 'Fixing',
		sections: [
			{
				name: 'Skirting & Internal Detailing',
				items: [
					{
						name: 'Square-set skirting',
						description:
							'185mm square-set MDF skirting, glued and set flush with two-pack finish',
					},
					{
						name: 'Shadowline ceiling detail',
						description:
							'Shadowline ceiling detail to living, dining and primary suite',
					},
					{
						name: 'Concealed door jambs',
						description:
							'Concealed door jambs to all internal doors, 2340mm height',
					},
				],
			},
			{
				name: 'Kitchen & Wet Areas',
				items: [
					{
						name: 'Custom two-pack joinery',
						description:
							'Custom two-pack joinery with 20mm engineered stone tops and waterfall ends',
					},
					{
						name: 'Appliance allowance',
						description:
							'Appliance allowance of $28,000 including integrated refrigeration',
					},
					{
						name: 'Bathroom tiling',
						description:
							'Full-height tiling to all bathrooms, tile allowance $95/m² supply',
					},
				],
			},
			{
				name: 'Electrical & Sustainable Energy',
				items: [
					{
						name: 'Solar & battery storage',
						description:
							'10kW solar array with 13.5kWh battery storage and hybrid inverter',
					},
					{
						name: 'LED downlights',
						description:
							'Recessed LED downlights on dimmable circuits, allowance of 64 fittings',
					},
					{
						name: 'EV charger rough-in',
						description:
							'EV charger rough-in to basement garage, 32A single phase',
					},
				],
			},
		],
	},
	{
		name: 'Practical completion',
		sections: [
			{
				name: 'Pool & Outdoor Living',
				items: [
					{
						name: 'Concrete lap pool',
						description:
							'10m concrete lap pool, fully tiled with glass mosaic waterline and gas heating',
					},
					{
						name: 'Outdoor kitchen',
						description:
							'Outdoor kitchen with teppanyaki plate, sink and integrated bar refrigeration',
					},
					{
						name: 'Pool fencing & paving',
						description: 'Pool fencing, paving and turf to rear yard',
					},
				],
			},
			{
				name: 'Landscaping & Driveway',
				items: [
					{
						name: 'Exposed aggregate driveway',
						description:
							'Exposed aggregate driveway with automated sliding gate and intercom',
					},
					{
						name: 'Landscape package',
						description:
							'Landscape package to approved plan including irrigation to garden beds',
					},
				],
			},
			{
				name: 'Handover',
				items: [
					{
						name: 'Final clean & pest treatment',
						description:
							"Final builder's clean, window clean and pest treatment",
					},
					{
						name: 'Handover walkthrough',
						description:
							'Handover walkthrough, keys, warranty folder and maintenance schedule',
					},
				],
			},
		],
	},
];

/**
 * Seeds the quote catalogue from the client quotation template. Skips entirely
 * if any stage already exists so it never duplicates a hand-curated catalogue.
 */
export const populate = internalMutation({
	args: {},
	handler: async (ctx) => {
		const existing = await ctx.db.query('quoteStages').first();
		if (existing) {
			return { skipped: true, message: 'Quote catalogue already populated' };
		}

		let sectionCount = 0;
		let itemCount = 0;

		for (const [stageIndex, stage] of QUOTE_CATALOGUE_DATA.entries()) {
			const defaults = QUOTE_STAGE_DEFAULTS[stage.name.toLowerCase()];
			const stageId = await ctx.db.insert('quoteStages', {
				name: stage.name,
				order: stageIndex,
				defaultPercent: defaults?.defaultPercent,
				scopeSummary: defaults?.scopeSummary,
				searchText: buildQuoteStageSearchText(stage.name),
			});

			for (const [sectionIndex, section] of stage.sections.entries()) {
				const sectionId = await ctx.db.insert('quoteSections', {
					name: section.name,
					stageId,
					order: sectionIndex,
					searchText: buildQuoteSectionSearchText(section.name, stage.name),
				});
				sectionCount++;

				for (const [itemIndex, item] of section.items.entries()) {
					await ctx.db.insert('quoteItems', {
						name: item.name,
						description: item.description,
						sectionId,
						isDefault: true,
						order: itemIndex,
						searchText: buildQuoteItemSearchText(
							item.name,
							item.description,
							section.name,
							stage.name
						),
					});
					itemCount++;
				}
			}
		}

		return {
			stages: QUOTE_CATALOGUE_DATA.length,
			sections: sectionCount,
			items: itemCount,
		};
	},
});
