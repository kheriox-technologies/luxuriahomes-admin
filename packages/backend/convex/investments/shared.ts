import { ConvexError, v } from 'convex/values';

/**
 * `capital` rows are money put into the property (land deposit, valuation,
 * settlement). `holding` rows are the ongoing cost of owning it while it is on
 * the market (mortgage repayments, staging, rates, utilities). Both are
 * subtracted from the sale proceeds, but they are shown as separate ledgers
 * because only holding costs keep accruing while we wait for a better price.
 */
export const investmentTransactionKindValidator = v.union(
	v.literal('capital'),
	v.literal('holding')
);

export const investmentCategoryValidator = v.union(
	v.literal('Deposit'),
	v.literal('Settlement'),
	v.literal('Loan Repayment'),
	v.literal('Styling'),
	v.literal('Council Rates'),
	v.literal('Utilities'),
	v.literal('Electricity'),
	v.literal('Legal'),
	v.literal('Other')
);

export const investmentStatusValidator = v.union(
	v.literal('building'),
	v.literal('holding'),
	v.literal('sold')
);

/**
 * Every lever behind the profit forecast. Stored as a singleton row per
 * investment so the numbers survive a page reload and stay shared between
 * super-admins. Money values are whole dollars (matching `projects.quotePrice`),
 * percentages are stored as percents (7.19 means 7.19%), not fractions.
 */
export const investmentAssumptionsFields = {
	salePrice: v.number(),
	realEstateFeePercent: v.number(),
	miscCosts: v.number(),
	remainingLoan: v.number(),
	monthlyRepayment: v.number(),
	interestRatePercent: v.number(),
	stagingPerWeek: v.number(),
	otherHoldingPerMonth: v.number(),
	projectManagementPercent: v.number(),
	projectManagementPaid: v.number(),
	annualPriceGrowthPercent: v.number(),
	/** Sale prices plotted as separate lines on the forecast chart. */
	scenarioPrices: v.array(v.number()),
};

/** Ledger amounts are stored as positive dollars; `kind` carries the direction. */
export function assertPositiveAmount(amount: number): void {
	if (!Number.isFinite(amount) || amount <= 0) {
		throw new ConvexError({
			code: 'INVALID_AMOUNT',
			message: 'Amount must be greater than zero',
		});
	}
}
