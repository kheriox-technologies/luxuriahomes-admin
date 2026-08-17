import type { Id } from '../_generated/dataModel';
import { internalMutation } from '../_generated/server';
import {
	buildQuoteItemSearchText,
	buildQuoteSectionSearchText,
} from '../lib/buildSearchText';
import { createQuoteStage, QUOTE_STAGE_DEFAULTS } from '../quoteStages/shared';

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
 * The full standard inclusions list transcribed from
 * `docs/CMA-Quotation-Sample.pdf` — 118 lines under the 15 headings the estimate
 * prints them beneath. Each heading becomes one section, assigned wholesale to
 * the QBCC progress-payment stage the work mostly falls in; the item `name` is a
 * short label for the tree row and `description` is the verbatim quotation line.
 *
 * Builder-branded copy is rewritten from "HOMES by CMA" to "Luxuria Homes";
 * third-party product names are left exactly as the source has them.
 *
 * Every seeded item is a default so a new quotation starts from the full list.
 */
const QUOTE_CATALOGUE_DATA: SeedStage[] = [
	{
		name: 'Deposit',
		sections: [
			{
				name: 'Pre-Construction',
				items: [
					{
						name: 'Fixed price contract',
						description: 'Fixed Price HIA QLD New Home QC1 Contract.',
					},
					{
						name: 'Plan drafting & engineering',
						description:
							'Complete Plan drafting (all plans remain copyright of Luxuria Homes) and Engineering (concrete slab designed and inspected by a Structural Engineer).',
					},
					{
						name: 'Council, plumbing & insurance fees',
						description:
							'Standard Council fees, plumbing approval fees (excluding HSTP) and Insurance fees (QBCC Insurance, Qleave Insurance and Public Liability Insurance).',
					},
					{
						name: 'Building approval fees',
						description:
							'All Standard Building approval fees (see Exclusion Items 6 and 7 for exceptions).',
					},
					{
						name: 'Soil test & contour survey',
						description:
							'Independent Soil Test with Wind Rating and Contour Survey.',
					},
					{
						name: 'Service connections',
						description:
							'Underground three phase power connection (not including provider connection fee), connection to existing sewer house point, existing stormwater connection to street outlet and connection to existing water meter up to Up to 6 Lineal Meters.',
					},
					{
						name: 'Colour selection appointment',
						description:
							'Colour selection at the Luxuria Homes Design Studio with our Resident Interior Designer.',
					},
				],
			},
		],
	},
	{
		name: 'Base',
		sections: [
			{
				name: 'General and Structural',
				items: [
					{
						name: 'Termite protection',
						description:
							'Complete termite protection: Termiseal™ to slab penetrations and chemically impregnated termite Term Seal Ura-fen sheet barrier to the perimeter of the building in accordance with Aus Standard 3660.1.',
					},
					{
						name: 'Cut and fill house pad',
						description:
							'Standard cut and fill house pad (maximum crossfall 400mm) excluding piers.',
					},
					{
						name: 'Erosion control silt fence',
						description:
							'Erosion control silt fence as per council requirements, up to 20lm.',
					},
					{
						name: 'Construction driveway crossover',
						description:
							'Driveway crossover during construction to comply with council regulations.',
					},
					{
						name: 'Soil & wind classification allowance',
						description: 'H1 Soil Allowance and N3 (W41) Wind Classification.',
					},
					{
						name: 'Waffle pod concrete slab',
						description:
							"Waffle pod, Steel reinforced concrete slab as per Engineer's specifications. (no piering allowance to slab U.N.O.).",
					},
					{
						name: 'Steel frame and trusses',
						description: 'TRUECORE™ Steel Frame and Trusses.',
					},
					{
						name: 'Steel warranty',
						description:
							"50 Year Warranty on TRUECORE™ Steel (T's and C's apply).",
					},
					{
						name: 'Frame quality control',
						description: 'Third party Frame quality control.',
					},
					{
						name: 'Site bins & clean ups',
						description: 'Site skip bins and regular site clean ups.',
					},
					{
						name: 'Structural & maintenance warranty',
						description:
							"25 Year Structural Warranty (T's and C's apply) and 12 Month Maintenance Warranty.",
					},
				],
			},
		],
	},
	{
		name: 'Frame',
		sections: [
			{
				name: 'Two Storey Homes ONLY',
				items: [
					{
						name: 'Upper level ceiling height',
						description: '2440mm high ceiling to upper level.',
					},
					{
						name: 'External wall insulation',
						description: 'R2 insulation batts to all external walls.',
					},
					{
						name: 'Timber staircase',
						description:
							'Closed House Victorian Ash (TIMBER) staircase with staingrade treads, risers and stringer and 1 stained timber handrail fixed to the plasterboard wall.',
					},
					{
						name: 'Upper level cladding',
						description:
							'Axon Fibre cement cladding to upper level (where applicable timber battening).',
					},
					{
						name: 'Upper floor flooring',
						description:
							'Termicide Treated Red Tongue Particle Board Flooring to Upper Floor.',
					},
				],
			},
		],
	},
	{
		name: 'Enclosed',
		sections: [
			{
				name: 'Energy Efficiency',
				items: [
					{
						name: 'Ceiling insulation',
						description: 'R3.0 ceiling batt insulation.',
					},
					{
						name: 'Garage wall insulation',
						description:
							'R2.0 thermal wall insulation batts to Garage internal walls.',
					},
					{
						name: 'Wall sarking',
						description: 'Wall sarking to all external walls.',
					},
					{
						name: '7 Star energy efficiency compliance',
						description:
							'7 STAR ENERGY EFFICIENCY COMPLIANCY - As of May 1st 2024, all new homes must be built to achieve a 7 Star Energy Efficiency rating in accordance with the National Construction Code and Queensland Development Code 4.1 – Sustainable Buildings. Luxuria Homes will arrange for your home to be assessed by a licensed Energy Assessor after your colour selections have been signed off. Should any changes be required to meet the 7 star energy rating, Luxuria Homes will discuss this with you and provide costings for any additional requirements. Any additional costs will be your responsibility and will be passed on to you by way variation or addition to your contract. Additional requirements may include but are not limited to - ceiling fans, roof insulation, internal and external wall thermal insulation, solar power, window and door glazing. Luxuria Homes recommends an allowance of $10,000 for double storey homes, $4,000 for acreage homes and $1,000 for single storey homes for 7 Star Energy Efficiency Allowance.',
					},
				],
			},
			{
				name: 'External Features',
				items: [
					{
						name: 'AAC cladding',
						description:
							'Autoclaved aerated concrete (AAC) cladding to External Walls.',
					},
					{
						name: 'Acrylic render',
						description:
							'Acrylic Render to External Walls (excluding cladded areas).',
					},
					{
						name: 'Eave lining',
						description:
							'Paint finished fibre cement eave lining (Timber Battening).',
					},
					{
						name: 'Colorbond roof, fascia & gutter',
						description:
							'Colorbond roof, fascia and gutter (up to 25 degree pitch).',
					},
					{
						name: 'Roof blanket insulation',
						description: '60mm (R1.3)Anticon lightweight blanket to roof area.',
					},
					{
						name: 'Garage door with motor',
						description:
							'Colorbond slimline garage door with motor and 3 remotes (2100Hx2400W/4800W U.N.O. Mediterranean). Includes side weather seals.',
					},
					{
						name: 'External garden taps',
						description: '2 external garden taps (front and back).',
					},
					{
						name: 'Hot water system',
						description: 'Hot water system - Wulfe 250L heat pump.',
					},
					{
						name: 'Downpipes',
						description: '90mm PVC painted downpipes.',
					},
					{
						name: 'Exposed aggregate driveway',
						description:
							'Exposed Aggregate Driveway (Colour: Salt and Pepper, Unsealed).',
					},
					{
						name: 'Driveway allowance',
						description:
							'Note: Single garage - 25sqm Driveway allowance, Double garage - 40sqm Driveway allowance.',
					},
					{
						name: 'Kerb cut-out',
						description: 'Kerb cut-out.',
					},
					{
						name: 'Yard gullies',
						description: 'Round yard gullies as per plan. (total of 4 allowed)',
					},
					{
						name: 'Clothesline',
						description:
							'Powder coated, Wall Mounted Fold Down Clothesline (2.49m x 1.5m).',
					},
					{
						name: 'Letterbox',
						description: 'Rendered look Letterbox.',
					},
				],
			},
			{
				name: 'Windows and Doors',
				items: [
					{
						name: 'Aluminium windows & sliding doors',
						description:
							'Bradnams Essential Aluminium powdercoat sliding windows and sliding doors with key locks (bathrooms to have obscure glass for privacy). All windows to be standard sizing. Please note double storey upper windows must be either restricted or have security screens.',
					},
					{
						name: 'Flyscreens',
						description:
							'Flyscreens to all windows and sliding doors (excluding cornerless doors and hinged doors).',
					},
					{
						name: 'Entry door',
						description:
							'820mm Wide Aluminium Entry Door and Frame. Note: Includes Lever Handle and Lock, from the Luxuria Homes standard range.',
					},
					{
						name: 'Internal doors',
						description:
							'Hume™ Redicote flush internal doors (2040mm high) with chrome hinges and plastic door stops.',
					},
					{
						name: 'Door furniture',
						description:
							'Zanda Epic Brushed Nickel or Matte Black door furniture sets (privacy set to bathrooms and master bedroom).',
					},
					{
						name: 'Window blinds',
						description:
							'Choice of premium PVC white venetian blinds or block our roller blinds to all windows (excluding sliding doors, wet areas, Kitchen and cornerless windows).',
					},
				],
			},
		],
	},
	{
		name: 'Fixing',
		sections: [
			{
				name: 'Internal Features',
				items: [
					{
						name: 'Ceiling height',
						description:
							'2590mm high ceilings throughout (single storey homes only and ground floor of double storey).',
					},
					{
						name: 'Plasterboard',
						description:
							'10mm plasterboard to all internal walls and ceilings.',
					},
					{
						name: 'Wet area plasterboard',
						description: 'Water Resistant Plasterboard to wet area walls.',
					},
					{
						name: 'Cove cornice',
						description: '90mm cove cornice (excluding porch and patios).',
					},
					{
						name: 'Skirting',
						description: '66mm x 11mm skirting (primed FJ pine).',
					},
					{
						name: 'Architrave',
						description: '42mm x 11mm architrave (primed FJ pine).',
					},
					{
						name: 'Bedroom robe doors',
						description:
							'Mirrored or 1 Mirror/1 White Vinyl sliding doors to bedroom robes (2100H approx., white or bright silver frame).',
					},
					{
						name: 'Linen doors',
						description:
							'White Vinyl sliding doors to linen (2100H approx., white frame).',
					},
					{
						name: 'Linen & pantry shelving',
						description:
							'4 x whiteboard shelves to linen and pantry (450mm deep approx. where applicable).',
					},
					{
						name: 'Robe shelving & hanging rail',
						description:
							'1 x whiteboard shelf to all bedroom robes (450mm deep approx. where applicable) with 1 x chrome hanging rail.',
					},
				],
			},
			{
				name: 'Painting',
				items: [
					{
						name: 'Internal walls & ceilings',
						description:
							'3 coats of Acrylic low sheen paint to all internal walls and matt to ceilings. Note: 1 light paint colour throughout.',
					},
					{
						name: 'Doors, architraves & skirtings',
						description:
							'Gloss finish to doors, architraves and skirtings (colour matched to walls, water based).',
					},
					{
						name: 'Eaves & patio ceiling',
						description:
							'3 coats of Acrylic low sheen paint to eaves and patio ceiling (and render if applicable).',
					},
				],
			},
			{
				name: 'Floor Coverings',
				items: [
					{
						name: 'Main living tiles',
						description:
							'600mm x 600mm Tiles to main living from Builders Range.',
					},
					{
						name: 'Wet area floor tiles',
						description:
							'600mm x 600mm Tiles to wet area floors from Builders Range.',
					},
					{
						name: 'Wall tiles',
						description:
							'600mm x 300mm or 600mm x 600mm Wall tiles from Builders Range (2100mm high approximately, shower area only, bath surround to approximately 900mm high).',
					},
					{
						name: 'Porch & alfresco tiles',
						description:
							'600mm x 600mm tiles to porch and alfresco (non-slip) from Builders Range.',
					},
					{
						name: 'Kitchen splashback tiles',
						description:
							'600mm x 300mm or 600mm x 600mm Tiles to kitchen splashback (600mm high approx.).',
					},
					{
						name: 'Laundry splashback tiles',
						description:
							'600mm x 300mm Tiles to laundry splashback (300mmm high approx.).',
					},
					{
						name: 'Grout & silicone',
						description:
							'Grout and Silicone colours at Builders discretion U.N.O. Grout lines approx. 3mm.',
					},
					{
						name: 'Carpet & underlay',
						description:
							'Quality carpet from Builders Range with premium 10mm underlay to bedrooms and media/living room - where applicable.',
					},
					{
						name: 'Garage floor',
						description: 'Plain concrete to garage floor.',
					},
				],
			},
			{
				name: 'Kitchen Appliances - For homes up to 170sqm',
				items: [
					{
						name: '60cm electric oven',
						description:
							'Westinghouse 60cm under bench electric oven (WVE613S).',
					},
					{
						name: '60cm induction cooktop',
						description:
							'Westinghouse 60cm 4 zone Induction cooktop (WHI645BD).',
					},
					{
						name: 'Slide out rangehood',
						description:
							'Chef slide out rangehood (CRR612SB) - externally ducted as per plan.',
					},
					{
						name: 'Dishwasher',
						description: 'Westinghouse Stainless Steel dishwasher (WSF6606XA).',
					},
				],
			},
			{
				name: 'Kitchen Appliances - For homes above 170sqm',
				items: [
					{
						name: '90cm electric oven',
						description:
							'Westinghouse 90cm underbench electric oven (WVE9915SDA).',
					},
					{
						name: '90cm induction cooktop',
						description:
							'Westinghouse 4 zone 90cm Induction cooktop (WHI955BD).',
					},
					{
						name: '90cm canopy rangehood',
						description:
							'Chef 90cm canopy rangehood (CRC914SB) - externally ducted as per plan.',
					},
					{
						name: 'Dishwasher',
						description: 'Westinghouse stainless steel dishwasher (WSF6606XB).',
					},
				],
			},
			{
				name: 'Kitchen',
				items: [
					{
						name: 'Stone benchtops',
						description:
							'Lithostone™ 20mm stone benchtops (8 colours to choose from). 1 stone colour throughout.',
					},
					{
						name: 'Cabinetry doors',
						description:
							'Polytec™ melamine doors (60 colours to choose from). 1 cabinetry colour throughout, Matt or Sheen finish.',
					},
					{
						name: 'Kickboard',
						description: 'Matching kickboard colour.',
					},
					{
						name: 'Breakfast bar',
						description: 'Breakfast bar to island benchtop 900mm Deep UNO.',
					},
					{
						name: 'Drawers with cutlery tray',
						description:
							'1 set of drawers with cutlery tray to top drawer (450mm wide, UNO).',
					},
					{
						name: 'Overhead cabinets',
						description: 'Overhead cabinets (Inc. fridge space).',
					},
					{
						name: 'Microwave space',
						description: 'Microwave space including single GPO.',
					},
					{
						name: 'Cabinetry handles',
						description:
							'Slimline brushed nickel/matte black kitchen handles (165mm) or knobs.',
					},
					{
						name: 'Plaster bulkhead',
						description:
							'Kitchen plaster bulkhead included above overhead cabinets.',
					},
					{
						name: 'Soft close doors and drawers',
						description: 'Soft close doors and drawers.',
					},
					{
						name: 'Fridge cold water tap',
						description: 'Cold water tap to the fridge space.',
					},
					{
						name: 'Double bowl sink & mixer',
						description:
							'Seima Leto Double bowl undermount sink with Nero Dolce gooseneck chrome or black sink mixer (no pull out spray).',
					},
					{
						name: "Butler's pantry sink & mixer",
						description:
							"Seima Leto Single bowl undermount sink with Nero Dolce gooseneck chrome or black sink mixer to butler's pantry (design specific).",
					},
				],
			},
			{
				name: 'Wet Areas',
				items: [
					{
						name: 'Freestanding bath',
						description:
							'Seima Syros 105 Freestanding bath (Colour: White, Size: 1500 x 740 x 570H mm).',
					},
					{
						name: 'Vanity benchtops & basins',
						description:
							'Lithostone™ 20mm stone benchtops with white Builders Range Basin.',
					},
					{
						name: 'Frameless mirrors',
						description:
							'Frameless mirrors (matching vanity width, 900mm high).',
					},
					{
						name: 'Toilet suites',
						description:
							'Seima Syros (Liara) wall faced, clean flush toilet with soft close lid.',
					},
					{
						name: 'Pin mixers',
						description: 'Nero Dolce Pin Mixers in Chrome or Black.',
					},
					{
						name: 'Shower rail',
						description: 'Nero single shower rail in Chrome or Black (NR315).',
					},
					{
						name: 'Shower screen',
						description:
							'Semi Frameless shower screen with clear glass and pivot door. Black or Bright Silver',
					},
					{
						name: 'Bathroom accessories',
						description:
							'Chrome or Black accessories (double towel rails, hand towel (powder room only) and toilet paper holders).',
					},
					{
						name: 'Laundry benchtop, tub & mixer',
						description:
							'Lithostone™ 20mm stone to laundry with 45L Stainless Steel laundry tub and Nero Gooseneck Sink Mixer in Chrome or Black.',
					},
					{
						name: 'Shower tile wastes',
						description: 'Smart tile wastes to all showers in Black or Chrome.',
					},
					{
						name: 'Recessed shower floors',
						description: 'Recessed shower floors with 5mm Waterbar.',
					},
					{
						name: 'Waterproofing',
						description: 'Waterproofing to Australian Standards.',
					},
				],
			},
			{
				name: 'Electrical',
				items: [
					{
						name: 'Split system air conditioning',
						description:
							'Daikin™ 5kW Cooling / 6KW Heating Reverse Cycle split system to one living area (back to back installation).',
					},
					{
						name: 'LED downlights',
						description:
							'LED Downlights (2 downlights per bedroom plus 1 downlight for every 10sqm of home).',
					},
					{
						name: 'Bedroom ceiling fans',
						description: 'White 4 Blade ceiling fans to all bedrooms.',
					},
					{
						name: 'Exhaust fans',
						description:
							'Externally ducted exhaust fan to Bathroom and Ensuite.',
					},
					{
						name: 'Alfresco ceiling fan',
						description: 'White external ceiling fan to the Alfresco.',
					},
					{
						name: 'TV antenna',
						description: '1 x Digital TV Antenna (roof mounted).',
					},
					{
						name: 'Smoke alarms',
						description: 'Hardwired smoke alarms.',
					},
					{
						name: 'Data points',
						description:
							'1 x Data point to Media or Kitchen and 1 x Data point to Garage (Garage for NBN requirements).',
					},
					{
						name: 'TV points',
						description: '2 x TV Points.',
					},
					{
						name: 'Kitchen & living power points',
						description: '2 x Double power points to Kitchen and Living area.',
					},
					{
						name: 'Power points to other rooms',
						description:
							'1 x Double power points to all other rooms (Excluding robes, linen and storage).',
					},
					{
						name: 'Switches and power points',
						description: 'Quality white switches and power points.',
					},
				],
			},
		],
	},
	{
		name: 'Practical Completion',
		sections: [
			{
				name: 'Plus',
				items: [
					{
						name: 'Professional clean',
						description: 'Professionally cleaned.',
					},
					{
						name: 'Porch & alfresco stepdown',
						description: 'Approx. 70mm stepdown to Porch and Alfresco.',
					},
					{
						name: 'NBN provision conduit',
						description:
							'Up to 6 Lineal Meters NBN Provision conduit (where applicable), any connection fees are to be paid by the Owners.',
					},
				],
			},
		],
	},
];

/**
 * Replaces the quote catalogue with the standard inclusions from
 * `docs/CMA-Quotation-Sample.pdf`.
 *
 * DESTRUCTIVE: every section and item is deleted before reseeding, so any
 * hand-curated catalogue content is lost. Stages are deliberately preserved —
 * their `defaultPercent` and `scopeSummary` are edited in the portal and must
 * survive a reseed. Stages the data references but that do not exist yet are
 * created from `QUOTE_STAGE_DEFAULTS`.
 *
 * Run with `npx convex run quoteCatalogue/seed:populate`.
 */
export const populate = internalMutation({
	args: {},
	handler: async (ctx) => {
		const existingItems = await ctx.db.query('quoteItems').collect();
		for (const item of existingItems) {
			await ctx.db.delete(item._id);
		}
		const existingSections = await ctx.db.query('quoteSections').collect();
		for (const section of existingSections) {
			await ctx.db.delete(section._id);
		}

		const existingStages = await ctx.db.query('quoteStages').collect();
		// Matched case-insensitively, but the kept stage's own name is what the
		// denormalized search texts embed — a preserved stage may be cased
		// differently to the seed data.
		const stagesByName = new Map(
			existingStages.map((stage) => [
				stage.name.toLowerCase(),
				{ id: stage._id, name: stage.name },
			])
		);

		let sectionCount = 0;
		let itemCount = 0;

		for (const stage of QUOTE_CATALOGUE_DATA) {
			const stageKey = stage.name.toLowerCase();
			let existing = stagesByName.get(stageKey);
			if (!existing) {
				const stageId: Id<'quoteStages'> = await createQuoteStage(
					ctx,
					stage.name,
					QUOTE_STAGE_DEFAULTS[stageKey]
				);
				existing = { id: stageId, name: stage.name };
				stagesByName.set(stageKey, existing);
			}
			const stageId = existing.id;
			const stageName = existing.name;

			for (const [sectionIndex, section] of stage.sections.entries()) {
				const sectionId = await ctx.db.insert('quoteSections', {
					name: section.name,
					stageId,
					order: sectionIndex,
					searchText: buildQuoteSectionSearchText(section.name, stageName),
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
							stageName
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
			deletedSections: existingSections.length,
			deletedItems: existingItems.length,
		};
	},
});
