import { ConvexError } from 'convex/values';
import type { Doc } from '../_generated/dataModel';
import { internalMutation } from '../_generated/server';
import { buildSearchText } from '../lib/buildSearchText';

/**
 * Seeds the Camp Hill investment from `docs/Holding Costs - Holding Costs.pdf`,
 * the spreadsheet these figures were tracked in before the portal.
 *
 *   npx convex run investments/seedCampHill:populate
 *   npx convex run investments/seedCampHill:teardown
 *
 * `populate` is a no-op when the investment already exists, so it will never
 * duplicate rows or clobber transactions added through the UI. Use `teardown`
 * first if you want a clean re-seed.
 */
const CAMP_HILL_SLUG = 'camp-hill';

/** Ledger dates are dateless calendar days; anchor them at UTC midnight. */
function day(isoDate: string): number {
	return new Date(`${isoDate}T00:00:00.000Z`).getTime();
}

interface SeedRow {
	amount: number;
	category: Doc<'investmentTransactions'>['category'];
	date: string;
	description: string;
	notes?: string;
}

/** Money put into the property. Totals $527,880.00. */
const CAPITAL_ROWS: SeedRow[] = [
	{
		date: '2024-07-19',
		description: 'Land Deposit',
		category: 'Deposit',
		amount: 5000.0,
		notes: 'Julia - Initial land deposit',
	},
	{
		date: '2024-07-30',
		description: 'Valuation',
		category: 'Other',
		amount: 748.0,
		notes: 'Milind - Land valuation',
	},
	{
		date: '2024-08-16',
		description: 'Unconditional Deposit',
		category: 'Deposit',
		amount: 20_000.0,
		notes: 'Julia - Unconditional deposit',
	},
	{
		date: '2024-08-26',
		description: 'Settlement',
		category: 'Settlement',
		amount: 502_132.0,
		notes: 'Jennie - Solicitor trust account',
	},
];

/** Cost of holding the property, 20/09/2024 - 28/08/2026. Totals $252,062.45. */
const HOLDING_ROWS: SeedRow[] = [
	{
		date: '2024-09-20',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 6317.8,
	},
	{
		date: '2024-10-19',
		description: 'Council Rates',
		category: 'Council Rates',
		amount: 791.15,
	},
	{
		date: '2024-10-20',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 5929.94,
	},
	{
		date: '2024-11-20',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 6638.0,
	},
	{
		date: '2024-12-20',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 6351.0,
	},
	{
		date: '2025-01-20',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 6351.0,
	},
	{
		date: '2025-02-20',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 6351.0,
	},
	{
		date: '2025-03-20',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 6351.0,
	},
	{
		date: '2025-04-09',
		description: 'Urban Utilities',
		category: 'Utilities',
		amount: 262.0,
	},
	{
		date: '2025-04-22',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 7865.6,
	},
	{
		date: '2025-05-20',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 8893.22,
	},
	{
		date: '2025-05-26',
		description: 'Council Rates',
		category: 'Council Rates',
		amount: 952.55,
	},
	{
		date: '2025-06-20',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 8576.22,
	},
	{
		date: '2025-07-05',
		description: 'Urban Utilities',
		category: 'Utilities',
		amount: 230.0,
	},
	{
		date: '2025-07-21',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 10_763.0,
	},
	{
		date: '2025-08-20',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 9996.0,
	},
	{
		date: '2025-08-21',
		description: 'Council Rates',
		category: 'Council Rates',
		amount: 534.0,
	},
	{
		date: '2025-09-22',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 9822.11,
	},
	{
		date: '2025-10-03',
		description: 'Urban Utilities',
		category: 'Utilities',
		amount: 245.95,
	},
	{
		date: '2025-10-20',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 11_431.13,
	},
	{
		date: '2025-11-05',
		description: 'Urban Utilities',
		category: 'Utilities',
		amount: 202.0,
	},
	{
		date: '2025-11-20',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 11_129.0,
	},
	{
		date: '2025-12-22',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 11_129.0,
	},
	{
		date: '2026-01-09',
		description: 'Origin Electricity',
		category: 'Electricity',
		amount: 360.0,
	},
	{
		date: '2026-01-09',
		description: 'Council Rates',
		category: 'Council Rates',
		amount: 513.45,
	},
	{
		date: '2026-01-20',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 11_129.0,
	},
	{
		date: '2026-02-18',
		description: 'Urban Utilities',
		category: 'Utilities',
		amount: 301.5,
	},
	{
		date: '2026-02-20',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 11_129.0,
	},
	{
		date: '2026-03-03',
		description: 'NBN',
		category: 'Utilities',
		amount: 373.0,
	},
	{
		date: '2026-03-18',
		description: 'Electricity',
		category: 'Electricity',
		amount: 48.35,
	},
	{
		date: '2026-03-20',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 11_466.0,
	},
	{
		date: '2026-04-20',
		description: 'Electricity',
		category: 'Electricity',
		amount: 68.28,
	},
	{
		date: '2026-04-20',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 11_798.0,
	},
	{
		date: '2026-05-12',
		description: 'BLOK Design Styling',
		category: 'Styling',
		amount: 9065.0,
	},
	{
		date: '2026-05-20',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 11_798.0,
	},
	{
		date: '2026-05-27',
		description: 'Asset Legal Form2',
		category: 'Legal',
		amount: 995.0,
	},
	{
		date: '2026-06-09',
		description: 'Origin Electricity',
		category: 'Electricity',
		amount: 404.47,
	},
	{
		date: '2026-06-18',
		description: 'Origin Electricity',
		category: 'Electricity',
		amount: 118.76,
	},
	{
		date: '2026-06-18',
		description: 'Council Rates',
		category: 'Council Rates',
		amount: 538.67,
	},
	{
		date: '2026-06-20',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 12_271.0,
	},
	{
		date: '2026-07-01',
		description: 'Blok Design Styling',
		category: 'Styling',
		amount: 1600.62,
	},
	{
		date: '2026-07-15',
		description: 'Urban Utilities',
		category: 'Utilities',
		amount: 253.65,
	},
	{
		date: '2026-07-20',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 11_322.77,
	},
	{
		date: '2026-07-22',
		description: 'Origin Electricity',
		category: 'Electricity',
		amount: 82.12,
	},
	{
		date: '2026-08-14',
		description: 'Blok Design Styling',
		category: 'Styling',
		amount: 4036.0,
	},
	{
		date: '2026-08-18',
		description: 'Council Rates',
		category: 'Council Rates',
		amount: 994.5,
	},
	{
		date: '2026-08-18',
		description: 'Lawn Mowing',
		category: 'Other',
		amount: 125.0,
	},
	{
		date: '2026-08-18',
		description: 'NBM Bills (5 Months)',
		category: 'Utilities',
		amount: 391.64,
	},
	{
		date: '2026-08-20',
		description: 'Loan Repayment',
		category: 'Loan Repayment',
		amount: 12_196.0,
	},
	{
		date: '2026-08-28',
		description: 'Blok Design Styling',
		category: 'Styling',
		amount: 1570.0,
	},
];

export const populate = internalMutation({
	args: {},
	handler: async (ctx) => {
		const existing = await ctx.db
			.query('investments')
			.withIndex('by_slug', (q) => q.eq('slug', CAMP_HILL_SLUG))
			.unique();
		if (existing) {
			return {
				skipped: true,
				message: 'Camp Hill already seeded. Run teardown first to re-seed.',
			};
		}

		const address = {
			street: '9 Ridge St',
			suburb: 'Camp Hill',
			state: 'QLD' as const,
			postcode: '4152',
		};
		const investmentId = await ctx.db.insert('investments', {
			slug: CAMP_HILL_SLUG,
			name: 'Camp Hill',
			address,
			status: 'holding',
			searchText: buildSearchText([
				'Camp Hill',
				address.street,
				address.suburb,
				address.state,
				address.postcode,
			]),
		});

		await ctx.db.insert('investmentAssumptions', {
			investmentId,
			salePrice: 3_000_000,
			realEstateFeePercent: 2.2,
			miscCosts: 30_000,
			remainingLoan: 1_760_000,
			monthlyRepayment: 12_196,
			interestRatePercent: 7.19,
			stagingPerWeek: 1780,
			otherHoldingPerMonth: 400,
			projectManagementPercent: 30,
			projectManagementPaid: 100_000,
			annualPriceGrowthPercent: 0,
			scenarioPrices: [2_900_000, 3_000_000, 3_100_000, 3_200_000],
		});

		for (const row of CAPITAL_ROWS) {
			await ctx.db.insert('investmentTransactions', {
				investmentId,
				kind: 'capital',
				date: day(row.date),
				description: row.description,
				category: row.category,
				amount: row.amount,
				notes: row.notes,
			});
		}
		for (const row of HOLDING_ROWS) {
			await ctx.db.insert('investmentTransactions', {
				investmentId,
				kind: 'holding',
				date: day(row.date),
				description: row.description,
				category: row.category,
				amount: row.amount,
				notes: row.notes,
			});
		}

		return {
			skipped: false,
			investmentId,
			capitalRows: CAPITAL_ROWS.length,
			holdingRows: HOLDING_ROWS.length,
		};
	},
});

export const teardown = internalMutation({
	args: {},
	handler: async (ctx) => {
		const investment = await ctx.db
			.query('investments')
			.withIndex('by_slug', (q) => q.eq('slug', CAMP_HILL_SLUG))
			.unique();
		if (!investment) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Camp Hill is not seeded',
			});
		}
		const transactions = await ctx.db
			.query('investmentTransactions')
			.withIndex('by_investment_date', (q) =>
				q.eq('investmentId', investment._id)
			)
			.collect();
		for (const transaction of transactions) {
			await ctx.db.delete(transaction._id);
		}
		const assumptions = await ctx.db
			.query('investmentAssumptions')
			.withIndex('by_investment', (q) => q.eq('investmentId', investment._id))
			.unique();
		if (assumptions) {
			await ctx.db.delete(assumptions._id);
		}
		await ctx.db.delete(investment._id);
		return { deletedTransactions: transactions.length };
	},
});
