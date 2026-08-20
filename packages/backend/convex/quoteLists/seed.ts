import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';
import {
	buildQuoteExclusionSearchText,
	buildQuoteNoteSearchText,
} from '../lib/buildSearchText';
import { templateExclusions, templateNotes } from '../quoteTemplates/shared';

/**
 * The "EXCLUSIONS" table from `docs/CMA-Quotation-Sample.pdf` (rows 1–16),
 * verbatim apart from the builder name.
 */
const EXCLUSIONS: string[] = [
	'Water meter (installation of water meter to be organised by Owner prior to Luxuria Homes starting).',
	'Organisation of any fencing credits from neighbouring lots.',
	'Any demolition, including any removal of existing fences and tree removal.',
	'Privacy screens (if required to comply with council requirement).',
	'Retaining walls and lapped and capped fence (U.N.O.). Please note that in some instances, retaining walls will be required to be built in order for Luxuria Homes to finish the house as per Contract. If that is the case, retaining walls will have to be organised and paid by the Owners. In the event that retaining walls are not constructed, the part of works that cannot be built (e.g.: Landscaping, fencing etc) will be credited to the Owners.',
	'Building relaxations, MCUs and town planning.',
	'Acoustic, Bushfire, Coastal fallout requirements, traffic control, flood height requirements, slope stability reports, erosion reports or any other non-standard requirements.',
	'Water Tank.',
	'Overhead power (including extra cost of Pole hire) and Generator costs if power connection is delayed.',
	'Rock excavation/removal (for example for footings, fencing, retaining walls, etc.).',
	'Feature walls, Feature tiles, Shower niches.',
	'Pendant lights, and pendant lights assembly.',
	'Stepdown to Garage.',
	'HSTP Systems and plumbing application associated with HSTP (if no sewer available).',
	'Identification Survey (usually required in older existing areas). If an identification Survey is required, the construction cannot proceed until the survey is completed so that the house can be accurately positioned.',
	'No Landscaping, Fencing Or Footpath Cut-Out.',
];

/**
 * The "Important Notes" continuation of the same table (rows 17–35), verbatim
 * apart from the builder name. The trailing "IMPORTANT" page of the source
 * document is not seeded — it is sales copy rather than quotation boilerplate.
 */
const NOTES: string[] = [
	'If the client wishes to proceed, a non-refundable deposit of $6,000 is required.',
	'Once the HIA Building Contract is signed, All client requested Variations will incur a Variation Fee. Variations after site commencement are generally not accepted due to scheduling and cost impacts. Exceptions will incur significant fees and delays.',
	'If a product is discontinued and/or unavailable, the Builder reserves the right to provide a replacement product of similar quality and functionality without prior written notification.',
	'When multiple colours are available from the Builders Range, only 1 colour and 1 type can be selected throughout the house.',
	'Before Construction commences, the owner must provide Luxuria Homes with the following: 5% Deposit, Proof of land Ownership, letter of Unconditional Finance Approval, signed colour selection. Failure to provide those items will incur delays.',
	'If not specified, all items are to be selected from the Builders standard range.',
	'Due to workplace Health and Safety Regulations and Contractual Requirements (In Particular Clause 10.3 and 10.4), we request that the Owners only access the site under the guidance of our Luxuria Homes building supervisor.',
	'Termite Control: Annual inspection is mandatory to maintain warranty and is to be carried out by a licensed contractor at the owners expense. The owner acknowledges that they have received a copy of the "QBCC Termite Management Systems"',
	'Natural Gas service or connection fees are the responsibility of the owner.',
	'The owners are responsible to provide a clear house site before construction commences (e.g.: leftovers from Builder next door must be removed).',
	'It is the owners responsibility to water the lawn on a daily basis once the house has reached practical completion. Luxuria Homes will not be held liable for any dried turf.',
	'The owners acknowledges that any complaint or associated issues in relation to the noise of Air-Conditioning units does not fall under the responsibility of the Builder.',
	'Dimensions shown on a floor plan are frame to frame and do not include plasterboard or other wall/floor coverings. Heights dimensions are concrete floor to trusses.',
	'No refund is given for soil classification less than "H" class.',
	"Tiles laid in a brickbond or other decorative pattern will be priced and approved at the builders discretion. The tile setout and final patterns are at the Builder's discretion.",
	"Electricity consumption during construction is to be paid by the owner. Luxuria Homes will arrange the connection in the owner's name. Water is to be paid by the owner during construction.",
	'All items in the upgrade pages will be in lieu of or in addition to the items above.',
	'Please note double storey upper windows will be restricted to have an opening less than 125mm or a security screen will be required if window is to be unrestricted.',
	"Base Price Lock: At 8 months* your build must be 'Site Ready' meaning Luxuria Homes need to have received your finance approval or evidence of capacity to pay received, proof of land ownership, covenant approval (if applicable), building approvals and lenders authority to commence construction (if applicable). If your build is not 'Site Ready' within 8 months*, Luxuria Homes may review your base house price. *This timeframe starts from the date the initial deposit is paid, and is inclusive of the additional 28 calendar days as per the HIA contract.",
];

/**
 * Replaces the quotation exclusions and important notes with the lists from
 * `docs/CMA-Quotation-Sample.pdf`.
 *
 * DESTRUCTIVE: both lists are cleared before reseeding, matching
 * `quoteCatalogue/seed:populate`. Run with
 * `npx convex run quoteLists/seed:populate`.
 */
export const populate = internalMutation({
	args: { templateId: v.id('quoteTemplates') },
	handler: async (ctx, args) => {
		const existingExclusions = await templateExclusions(ctx, args.templateId);
		for (const exclusion of existingExclusions) {
			await ctx.db.delete(exclusion._id);
		}
		const existingNotes = await templateNotes(ctx, args.templateId);
		for (const note of existingNotes) {
			await ctx.db.delete(note._id);
		}

		for (const [index, text] of EXCLUSIONS.entries()) {
			await ctx.db.insert('quoteExclusions', {
				text,
				order: index,
				searchText: buildQuoteExclusionSearchText(text),
				templateId: args.templateId,
			});
		}

		for (const [index, text] of NOTES.entries()) {
			await ctx.db.insert('quoteNotes', {
				text,
				order: index,
				searchText: buildQuoteNoteSearchText(text),
				templateId: args.templateId,
			});
		}

		return {
			exclusions: EXCLUSIONS.length,
			notes: NOTES.length,
			deletedExclusions: existingExclusions.length,
			deletedNotes: existingNotes.length,
		};
	},
});
