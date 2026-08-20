import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { internalMutation } from '../_generated/server';
import {
	buildQuoteItemSearchText,
	buildQuoteSectionSearchText,
} from '../lib/buildSearchText';
import { createQuoteStage, QUOTE_STAGE_DEFAULTS } from '../quoteStages/shared';
import {
	sectionItems,
	stageSections,
	templateStages,
} from '../quoteTemplates/shared';

interface SeedItem {
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
 * the QBCC progress-payment stage the work mostly falls in; the item `name` is
 * the verbatim quotation line.
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
						name: 'Fixed Price HIA QLD New Home QC1 Contract.',
					},
					{
						name: 'Complete Plan drafting (all plans remain copyright of Luxuria Homes) and Engineering (concrete slab designed and inspected by a Structural Engineer).',
					},
					{
						name: 'Standard Council fees, plumbing approval fees (excluding HSTP) and Insurance fees (QBCC Insurance, Qleave Insurance and Public Liability Insurance).',
					},
					{
						name: 'All Standard Building approval fees (see Exclusion Items 6 and 7 for exceptions).',
					},
					{
						name: 'Independent Soil Test with Wind Rating and Contour Survey.',
					},
					{
						name: 'Underground three phase power connection (not including provider connection fee), connection to existing sewer house point, existing stormwater connection to street outlet and connection to existing water meter up to Up to 6 Lineal Meters.',
					},
					{
						name: 'Colour selection at the Luxuria Homes Design Studio with our Resident Interior Designer.',
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
						name: 'Complete termite protection: Termiseal™ to slab penetrations and chemically impregnated termite Term Seal Ura-fen sheet barrier to the perimeter of the building in accordance with Aus Standard 3660.1.',
					},
					{
						name: 'Standard cut and fill house pad (maximum crossfall 400mm) excluding piers.',
					},
					{
						name: 'Erosion control silt fence as per council requirements, up to 20lm.',
					},
					{
						name: 'Driveway crossover during construction to comply with council regulations.',
					},
					{
						name: 'H1 Soil Allowance and N3 (W41) Wind Classification.',
					},
					{
						name: "Waffle pod, Steel reinforced concrete slab as per Engineer's specifications. (no piering allowance to slab U.N.O.).",
					},
					{
						name: 'TRUECORE™ Steel Frame and Trusses.',
					},
					{
						name: "50 Year Warranty on TRUECORE™ Steel (T's and C's apply).",
					},
					{
						name: 'Third party Frame quality control.',
					},
					{
						name: 'Site skip bins and regular site clean ups.',
					},
					{
						name: "25 Year Structural Warranty (T's and C's apply) and 12 Month Maintenance Warranty.",
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
						name: '2440mm high ceiling to upper level.',
					},
					{
						name: 'R2 insulation batts to all external walls.',
					},
					{
						name: 'Closed House Victorian Ash (TIMBER) staircase with staingrade treads, risers and stringer and 1 stained timber handrail fixed to the plasterboard wall.',
					},
					{
						name: 'Axon Fibre cement cladding to upper level (where applicable timber battening).',
					},
					{
						name: 'Termicide Treated Red Tongue Particle Board Flooring to Upper Floor.',
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
						name: 'R3.0 ceiling batt insulation.',
					},
					{
						name: 'R2.0 thermal wall insulation batts to Garage internal walls.',
					},
					{
						name: 'Wall sarking to all external walls.',
					},
					{
						name: '7 STAR ENERGY EFFICIENCY COMPLIANCY - As of May 1st 2024, all new homes must be built to achieve a 7 Star Energy Efficiency rating in accordance with the National Construction Code and Queensland Development Code 4.1 – Sustainable Buildings. Luxuria Homes will arrange for your home to be assessed by a licensed Energy Assessor after your colour selections have been signed off. Should any changes be required to meet the 7 star energy rating, Luxuria Homes will discuss this with you and provide costings for any additional requirements. Any additional costs will be your responsibility and will be passed on to you by way variation or addition to your contract. Additional requirements may include but are not limited to - ceiling fans, roof insulation, internal and external wall thermal insulation, solar power, window and door glazing. Luxuria Homes recommends an allowance of $10,000 for double storey homes, $4,000 for acreage homes and $1,000 for single storey homes for 7 Star Energy Efficiency Allowance.',
					},
				],
			},
			{
				name: 'External Features',
				items: [
					{
						name: 'Autoclaved aerated concrete (AAC) cladding to External Walls.',
					},
					{
						name: 'Acrylic Render to External Walls (excluding cladded areas).',
					},
					{
						name: 'Paint finished fibre cement eave lining (Timber Battening).',
					},
					{
						name: 'Colorbond roof, fascia and gutter (up to 25 degree pitch).',
					},
					{
						name: '60mm (R1.3)Anticon lightweight blanket to roof area.',
					},
					{
						name: 'Colorbond slimline garage door with motor and 3 remotes (2100Hx2400W/4800W U.N.O. Mediterranean). Includes side weather seals.',
					},
					{
						name: '2 external garden taps (front and back).',
					},
					{
						name: 'Hot water system - Wulfe 250L heat pump.',
					},
					{
						name: '90mm PVC painted downpipes.',
					},
					{
						name: 'Exposed Aggregate Driveway (Colour: Salt and Pepper, Unsealed).',
					},
					{
						name: 'Note: Single garage - 25sqm Driveway allowance, Double garage - 40sqm Driveway allowance.',
					},
					{
						name: 'Kerb cut-out.',
					},
					{
						name: 'Round yard gullies as per plan. (total of 4 allowed)',
					},
					{
						name: 'Powder coated, Wall Mounted Fold Down Clothesline (2.49m x 1.5m).',
					},
					{
						name: 'Rendered look Letterbox.',
					},
				],
			},
			{
				name: 'Windows and Doors',
				items: [
					{
						name: 'Bradnams Essential Aluminium powdercoat sliding windows and sliding doors with key locks (bathrooms to have obscure glass for privacy). All windows to be standard sizing. Please note double storey upper windows must be either restricted or have security screens.',
					},
					{
						name: 'Flyscreens to all windows and sliding doors (excluding cornerless doors and hinged doors).',
					},
					{
						name: '820mm Wide Aluminium Entry Door and Frame. Note: Includes Lever Handle and Lock, from the Luxuria Homes standard range.',
					},
					{
						name: 'Hume™ Redicote flush internal doors (2040mm high) with chrome hinges and plastic door stops.',
					},
					{
						name: 'Zanda Epic Brushed Nickel or Matte Black door furniture sets (privacy set to bathrooms and master bedroom).',
					},
					{
						name: 'Choice of premium PVC white venetian blinds or block our roller blinds to all windows (excluding sliding doors, wet areas, Kitchen and cornerless windows).',
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
						name: '2590mm high ceilings throughout (single storey homes only and ground floor of double storey).',
					},
					{
						name: '10mm plasterboard to all internal walls and ceilings.',
					},
					{
						name: 'Water Resistant Plasterboard to wet area walls.',
					},
					{
						name: '90mm cove cornice (excluding porch and patios).',
					},
					{
						name: '66mm x 11mm skirting (primed FJ pine).',
					},
					{
						name: '42mm x 11mm architrave (primed FJ pine).',
					},
					{
						name: 'Mirrored or 1 Mirror/1 White Vinyl sliding doors to bedroom robes (2100H approx., white or bright silver frame).',
					},
					{
						name: 'White Vinyl sliding doors to linen (2100H approx., white frame).',
					},
					{
						name: '4 x whiteboard shelves to linen and pantry (450mm deep approx. where applicable).',
					},
					{
						name: '1 x whiteboard shelf to all bedroom robes (450mm deep approx. where applicable) with 1 x chrome hanging rail.',
					},
				],
			},
			{
				name: 'Painting',
				items: [
					{
						name: '3 coats of Acrylic low sheen paint to all internal walls and matt to ceilings. Note: 1 light paint colour throughout.',
					},
					{
						name: 'Gloss finish to doors, architraves and skirtings (colour matched to walls, water based).',
					},
					{
						name: '3 coats of Acrylic low sheen paint to eaves and patio ceiling (and render if applicable).',
					},
				],
			},
			{
				name: 'Floor Coverings',
				items: [
					{
						name: '600mm x 600mm Tiles to main living from Builders Range.',
					},
					{
						name: '600mm x 600mm Tiles to wet area floors from Builders Range.',
					},
					{
						name: '600mm x 300mm or 600mm x 600mm Wall tiles from Builders Range (2100mm high approximately, shower area only, bath surround to approximately 900mm high).',
					},
					{
						name: '600mm x 600mm tiles to porch and alfresco (non-slip) from Builders Range.',
					},
					{
						name: '600mm x 300mm or 600mm x 600mm Tiles to kitchen splashback (600mm high approx.).',
					},
					{
						name: '600mm x 300mm Tiles to laundry splashback (300mmm high approx.).',
					},
					{
						name: 'Grout and Silicone colours at Builders discretion U.N.O. Grout lines approx. 3mm.',
					},
					{
						name: 'Quality carpet from Builders Range with premium 10mm underlay to bedrooms and media/living room - where applicable.',
					},
					{
						name: 'Plain concrete to garage floor.',
					},
				],
			},
			{
				name: 'Kitchen Appliances - For homes up to 170sqm',
				items: [
					{
						name: 'Westinghouse 60cm under bench electric oven (WVE613S).',
					},
					{
						name: 'Westinghouse 60cm 4 zone Induction cooktop (WHI645BD).',
					},
					{
						name: 'Chef slide out rangehood (CRR612SB) - externally ducted as per plan.',
					},
					{
						name: 'Westinghouse Stainless Steel dishwasher (WSF6606XA).',
					},
				],
			},
			{
				name: 'Kitchen Appliances - For homes above 170sqm',
				items: [
					{
						name: 'Westinghouse 90cm underbench electric oven (WVE9915SDA).',
					},
					{
						name: 'Westinghouse 4 zone 90cm Induction cooktop (WHI955BD).',
					},
					{
						name: 'Chef 90cm canopy rangehood (CRC914SB) - externally ducted as per plan.',
					},
					{
						name: 'Westinghouse stainless steel dishwasher (WSF6606XB).',
					},
				],
			},
			{
				name: 'Kitchen',
				items: [
					{
						name: 'Lithostone™ 20mm stone benchtops (8 colours to choose from). 1 stone colour throughout.',
					},
					{
						name: 'Polytec™ melamine doors (60 colours to choose from). 1 cabinetry colour throughout, Matt or Sheen finish.',
					},
					{
						name: 'Matching kickboard colour.',
					},
					{
						name: 'Breakfast bar to island benchtop 900mm Deep UNO.',
					},
					{
						name: '1 set of drawers with cutlery tray to top drawer (450mm wide, UNO).',
					},
					{
						name: 'Overhead cabinets (Inc. fridge space).',
					},
					{
						name: 'Microwave space including single GPO.',
					},
					{
						name: 'Slimline brushed nickel/matte black kitchen handles (165mm) or knobs.',
					},
					{
						name: 'Kitchen plaster bulkhead included above overhead cabinets.',
					},
					{
						name: 'Soft close doors and drawers.',
					},
					{
						name: 'Cold water tap to the fridge space.',
					},
					{
						name: 'Seima Leto Double bowl undermount sink with Nero Dolce gooseneck chrome or black sink mixer (no pull out spray).',
					},
					{
						name: "Seima Leto Single bowl undermount sink with Nero Dolce gooseneck chrome or black sink mixer to butler's pantry (design specific).",
					},
				],
			},
			{
				name: 'Wet Areas',
				items: [
					{
						name: 'Seima Syros 105 Freestanding bath (Colour: White, Size: 1500 x 740 x 570H mm).',
					},
					{
						name: 'Lithostone™ 20mm stone benchtops with white Builders Range Basin.',
					},
					{
						name: 'Frameless mirrors (matching vanity width, 900mm high).',
					},
					{
						name: 'Seima Syros (Liara) wall faced, clean flush toilet with soft close lid.',
					},
					{
						name: 'Nero Dolce Pin Mixers in Chrome or Black.',
					},
					{
						name: 'Nero single shower rail in Chrome or Black (NR315).',
					},
					{
						name: 'Semi Frameless shower screen with clear glass and pivot door. Black or Bright Silver',
					},
					{
						name: 'Chrome or Black accessories (double towel rails, hand towel (powder room only) and toilet paper holders).',
					},
					{
						name: 'Lithostone™ 20mm stone to laundry with 45L Stainless Steel laundry tub and Nero Gooseneck Sink Mixer in Chrome or Black.',
					},
					{
						name: 'Smart tile wastes to all showers in Black or Chrome.',
					},
					{
						name: 'Recessed shower floors with 5mm Waterbar.',
					},
					{
						name: 'Waterproofing to Australian Standards.',
					},
				],
			},
			{
				name: 'Electrical',
				items: [
					{
						name: 'Daikin™ 5kW Cooling / 6KW Heating Reverse Cycle split system to one living area (back to back installation).',
					},
					{
						name: 'LED Downlights (2 downlights per bedroom plus 1 downlight for every 10sqm of home).',
					},
					{
						name: 'White 4 Blade ceiling fans to all bedrooms.',
					},
					{
						name: 'Externally ducted exhaust fan to Bathroom and Ensuite.',
					},
					{
						name: 'White external ceiling fan to the Alfresco.',
					},
					{
						name: '1 x Digital TV Antenna (roof mounted).',
					},
					{
						name: 'Hardwired smoke alarms.',
					},
					{
						name: '1 x Data point to Media or Kitchen and 1 x Data point to Garage (Garage for NBN requirements).',
					},
					{
						name: '2 x TV Points.',
					},
					{
						name: '2 x Double power points to Kitchen and Living area.',
					},
					{
						name: '1 x Double power points to all other rooms (Excluding robes, linen and storage).',
					},
					{
						name: 'Quality white switches and power points.',
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
						name: 'Professionally cleaned.',
					},
					{
						name: 'Approx. 70mm stepdown to Porch and Alfresco.',
					},
					{
						name: 'Up to 6 Lineal Meters NBN Provision conduit (where applicable), any connection fees are to be paid by the Owners.',
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
 * Run with `npx convex run quoteCatalogue/seed:populate '{"templateId":"..."}'`.
 */
export const populate = internalMutation({
	args: { templateId: v.id('quoteTemplates') },
	handler: async (ctx, args) => {
		const existingStages = await templateStages(ctx, args.templateId);
		let deletedSections = 0;
		let deletedItems = 0;
		for (const stage of existingStages) {
			for (const section of await stageSections(ctx, stage._id)) {
				for (const item of await sectionItems(ctx, section._id)) {
					await ctx.db.delete(item._id);
					deletedItems++;
				}
				await ctx.db.delete(section._id);
				deletedSections++;
			}
		}

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
					args.templateId,
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
						sectionId,
						isDefault: true,
						order: itemIndex,
						searchText: buildQuoteItemSearchText(
							item.name,
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
			deletedSections,
			deletedItems,
		};
	},
});
