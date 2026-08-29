/**
 * Profit forecast for a held investment property.
 *
 * The model mirrors the Camp Hill holding-costs spreadsheet:
 *
 *   profit    = salePrice - agentFees - misc - capitalIn - holdingSpent
 *               - futureHolding - loanBalance
 *   pmFee     = profit * pmPercent - pmAlreadyPaid
 *   investor  = profit - pmFee
 *
 * Every month the property is held, the mortgage, staging and utilities are
 * paid out of pocket while the loan amortises slightly. Holding is only worth
 * it when price growth outruns that net burn.
 *
 * Pure and dependency-free so it can be unit-tested and recomputed on every
 * keystroke in the assumptions panel.
 */

const MONTHS_PER_YEAR = 12;
const WEEKS_PER_YEAR = 52;

export interface ForecastAssumptions {
	annualPriceGrowthPercent: number;
	interestRatePercent: number;
	miscCosts: number;
	monthlyRepayment: number;
	otherHoldingPerMonth: number;
	projectManagementPaid: number;
	projectManagementPercent: number;
	realEstateFeePercent: number;
	remainingLoan: number;
	salePrice: number;
	scenarioPrices: number[];
	stagingPerWeek: number;
}

export interface ScenarioPoint {
	agentFees: number;
	/** The base scenario price this line was built from, used as its series key. */
	basePrice: number;
	investorShare: number;
	profit: number;
	projectManagementFee: number;
	/** Base price grown to this month. Equals `basePrice` at 0% growth. */
	salePrice: number;
}

export interface ForecastPoint {
	date: Date;
	/** Holding costs incurred between today and this month. */
	futureHolding: number;
	/** Interest accrued over this month. */
	interest: number;
	/** Short month label for the x-axis, e.g. `Sep 26`. */
	label: string;
	/** Loan balance after `month` repayments. */
	loanBalance: number;
	/** Months from today. 0 is "sell now". */
	month: number;
	scenarios: ScenarioPoint[];
}

export interface ForecastInput {
	assumptions: ForecastAssumptions;
	/** Sum of `capital` ledger rows. */
	capitalIn: number;
	/** Sum of `holding` ledger rows already paid. */
	holdingSpent: number;
	/** How many months to project. Defaults to a full year. */
	months?: number;
	/** Anchor for month 0. Injected so the forecast is deterministic in tests. */
	today: Date;
}

// Explicit rather than Intl: both en-AU and en-GB abbreviate September to
// "Sept", which makes the x-axis labels uneven.
const MONTH_NAMES = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
] as const;

function formatMonthLabel(date: Date): string {
	const year = String(date.getFullYear()).slice(-2);
	return `${MONTH_NAMES[date.getMonth()]} ${year}`;
}

/**
 * First of the month, `offset` months from `from`. Built from year/month rather
 * than `setMonth`, which overflows when the anchor day does not exist in the
 * target month (30 Aug + 6 months would land on 2 Mar, not Feb).
 */
function addMonths(from: Date, offset: number): Date {
	return new Date(from.getFullYear(), from.getMonth() + offset, 1);
}

/** Monthly cash outflow that does not touch the loan. */
export function monthlyRunningCosts(assumptions: ForecastAssumptions): number {
	return (
		(assumptions.stagingPerWeek * WEEKS_PER_YEAR) / MONTHS_PER_YEAR +
		assumptions.otherHoldingPerMonth
	);
}

/**
 * Net profit erosion per month at a flat sale price: everything paid out, less
 * the principal the repayment knocks off the loan (which comes back at sale).
 */
export function monthlyBurn(assumptions: ForecastAssumptions): number {
	const interest =
		(assumptions.remainingLoan * (assumptions.interestRatePercent / 100)) /
		MONTHS_PER_YEAR;
	const principal = Math.max(0, assumptions.monthlyRepayment - interest);
	return (
		monthlyRunningCosts(assumptions) + assumptions.monthlyRepayment - principal
	);
}

/**
 * The headline `salePrice` is always the first series, followed by the
 * comparison scenarios. Callers rely on `scenarios[0]` being the headline —
 * it is what the summary tiles report.
 */
export function scenarioPricesFor(assumptions: ForecastAssumptions): number[] {
	return [
		assumptions.salePrice,
		...assumptions.scenarioPrices.filter(
			(price) => price !== assumptions.salePrice
		),
	];
}

function buildScenarios(
	assumptions: ForecastAssumptions,
	fixedCosts: number,
	loanBalance: number,
	growthFactor: number
): ScenarioPoint[] {
	return scenarioPricesFor(assumptions).map((basePrice) => {
		const salePrice = basePrice * growthFactor;
		const agentFees = salePrice * (assumptions.realEstateFeePercent / 100);
		const profit = salePrice - agentFees - fixedCosts - loanBalance;
		const projectManagementFee =
			profit * (assumptions.projectManagementPercent / 100) -
			assumptions.projectManagementPaid;
		return {
			basePrice,
			salePrice,
			agentFees,
			profit,
			projectManagementFee,
			investorShare: profit - projectManagementFee,
		};
	});
}

/**
 * Projects profit for each month from today, for every scenario price.
 * Returns `months + 1` points; index 0 is "sell today".
 */
export function buildForecast({
	assumptions,
	capitalIn,
	holdingSpent,
	today,
	months = MONTHS_PER_YEAR,
}: ForecastInput): ForecastPoint[] {
	const points: ForecastPoint[] = [];
	const monthlyRate = assumptions.interestRatePercent / 100 / MONTHS_PER_YEAR;
	const runningCosts = monthlyRunningCosts(assumptions);

	let loanBalance = assumptions.remainingLoan;
	let futureHolding = 0;
	let interest = 0;

	for (let month = 0; month <= months; month++) {
		if (month > 0) {
			interest = loanBalance * monthlyRate;
			const principal = Math.max(0, assumptions.monthlyRepayment - interest);
			loanBalance = Math.max(0, loanBalance - principal);
			futureHolding += assumptions.monthlyRepayment + runningCosts;
		}

		const date = addMonths(today, month);

		// Costs that do not vary with the sale price.
		const fixedCosts =
			assumptions.miscCosts + capitalIn + holdingSpent + futureHolding;
		const growthFactor =
			(1 + assumptions.annualPriceGrowthPercent / 100) **
			(month / MONTHS_PER_YEAR);

		points.push({
			month,
			label: formatMonthLabel(date),
			date,
			loanBalance,
			interest,
			futureHolding,
			scenarios: buildScenarios(
				assumptions,
				fixedCosts,
				loanBalance,
				growthFactor
			),
		});
	}

	return points;
}
