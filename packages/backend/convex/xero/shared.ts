'use node';

import { ConvexError } from 'convex/values';

// Custom Connection (machine-to-machine) auth: client_credentials grant against
// the Xero identity server, then the Accounting API scoped to a single org.
const XERO_TOKEN_ENDPOINT = 'https://identity.xero.com/connect/token';
const XERO_CONNECTIONS_ENDPOINT = 'https://api.xero.com/connections';
const XERO_API_BASE = 'https://api.xero.com/api.xro/2.0';
// Custom Connections created from 29 Apr 2026 use Xero's granular scopes:
// `accounting.reports.read` is split per-report (P&L below); settings is unchanged.
const XERO_SCOPES =
	'accounting.reports.profitandloss.read accounting.settings.read';

// Far-past start so the P&L spans cumulative figures-to-date for every project.
export const SYNC_FROM_DATE = '2000-01-01';

/** Today's date as a `YYYY-MM-DD` string in UTC (used as the P&L `toDate`). */
export function todayUtcDate(): string {
	const now = new Date();
	const year = now.getUTCFullYear();
	const month = `${now.getUTCMonth() + 1}`.padStart(2, '0');
	const day = `${now.getUTCDate()}`.padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export interface XeroConfig {
	clientId: string;
	clientSecret: string;
	/** GUID of the tracking category that maps options to projects (optional). */
	trackingCategoryId?: string;
}

export interface XeroTrackingOption {
	Name: string;
	Status?: string;
	TrackingOptionID: string;
}

export interface XeroTrackingCategory {
	Name: string;
	Options?: XeroTrackingOption[];
	Status?: string;
	TrackingCategoryID: string;
}

/**
 * Reads and validates the Xero Custom Connection configuration from the Convex
 * environment. The two secrets come from the Custom Connection app in the Xero
 * developer portal; the tracking category id is the "Project"/"Job" category
 * GUID and is only required by the expense sync, not the connection test.
 */
export function getXeroConfig(): XeroConfig {
	const clientId = process.env.XERO_CLIENT_ID;
	const clientSecret = process.env.XERO_CLIENT_SECRET;
	const trackingCategoryId = process.env.XERO_TRACKING_CATEGORY_ID;
	if (!(clientId && clientSecret)) {
		throw new ConvexError({
			code: 'CONFIG_ERROR',
			message:
				'Xero is not configured (missing XERO_CLIENT_ID / XERO_CLIENT_SECRET).',
		});
	}
	return { clientId, clientSecret, trackingCategoryId };
}

/**
 * Mints a short-lived (30 min) access token via the client_credentials grant.
 * Custom Connections need no refresh token — a fresh token is requested per run
 * using only the client id/secret (sent as HTTP Basic auth).
 */
export async function getXeroAccessToken(config: XeroConfig): Promise<string> {
	const basic = Buffer.from(
		`${config.clientId}:${config.clientSecret}`
	).toString('base64');
	const resp = await fetch(XERO_TOKEN_ENDPOINT, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${basic}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			grant_type: 'client_credentials',
			scope: XERO_SCOPES,
		}),
	});
	if (!resp.ok) {
		const detail = await resp.text();
		throw new Error(`Xero token request failed (${resp.status}): ${detail}`);
	}
	const data = (await resp.json()) as { access_token?: string };
	if (!data.access_token) {
		throw new Error('Xero token response did not include an access_token');
	}
	return data.access_token;
}

/**
 * Resolves the Xero tenant (organisation) id for the connection. A Custom
 * Connection is bound to exactly one org, so the first connection is used.
 */
export async function getXeroTenantId(accessToken: string): Promise<string> {
	const resp = await fetch(XERO_CONNECTIONS_ENDPOINT, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
		},
	});
	if (!resp.ok) {
		const detail = await resp.text();
		throw new Error(
			`Xero connections request failed (${resp.status}): ${detail}`
		);
	}
	const connections = (await resp.json()) as Array<{ tenantId?: string }>;
	const tenantId = connections[0]?.tenantId;
	if (!tenantId) {
		throw new ConvexError({
			code: 'CONFIG_ERROR',
			message:
				'No Xero organisation is connected. Authorise the Custom Connection to an organisation.',
		});
	}
	return tenantId;
}

function xeroHeaders(
	accessToken: string,
	tenantId: string
): Record<string, string> {
	return {
		Authorization: `Bearer ${accessToken}`,
		'xero-tenant-id': tenantId,
		Accept: 'application/json',
	};
}

/**
 * Fetches all tracking categories (with their options) for the organisation.
 */
export async function fetchTrackingCategories(
	accessToken: string,
	tenantId: string
): Promise<XeroTrackingCategory[]> {
	const resp = await fetch(`${XERO_API_BASE}/TrackingCategories`, {
		headers: xeroHeaders(accessToken, tenantId),
	});
	if (!resp.ok) {
		const detail = await resp.text();
		throw new Error(
			`Xero TrackingCategories request failed (${resp.status}): ${detail}`
		);
	}
	const data = (await resp.json()) as {
		TrackingCategories?: XeroTrackingCategory[];
	};
	return data.TrackingCategories ?? [];
}

export interface ProfitAndLossParams {
	fromDate: string;
	toDate: string;
	trackingCategoryId: string;
}

/**
 * Fetches the Profit & Loss report grouped by a tracking category. The report
 * returns one column per tracking option (header = option name) with a
 * "Total Expenses" summary row used to derive each project's expenses.
 */
export async function fetchProfitAndLoss(
	accessToken: string,
	tenantId: string,
	params: ProfitAndLossParams
): Promise<XeroReport> {
	const query = new URLSearchParams({
		trackingCategoryID: params.trackingCategoryId,
		fromDate: params.fromDate,
		toDate: params.toDate,
	});
	const resp = await fetch(
		`${XERO_API_BASE}/Reports/ProfitAndLoss?${query.toString()}`,
		{ headers: xeroHeaders(accessToken, tenantId) }
	);
	if (!resp.ok) {
		const detail = await resp.text();
		throw new Error(
			`Xero ProfitAndLoss request failed (${resp.status}): ${detail}`
		);
	}
	const data = (await resp.json()) as { Reports?: XeroReport[] };
	const report = data.Reports?.[0];
	if (!report) {
		throw new Error('Xero ProfitAndLoss response did not include a report');
	}
	return report;
}

export interface XeroReportCell {
	Value?: string;
}

export interface XeroReportRow {
	Cells?: XeroReportCell[];
	Rows?: XeroReportRow[];
	RowType: string;
	Title?: string;
}

export interface XeroReport {
	ReportName?: string;
	Rows?: XeroReportRow[];
}

// Xero's ProfitAndLoss report rejects any range where fromDate and toDate are
// more than 365 days apart. Use a sub-year window so cumulative expenses can be
// assembled from consecutive windows without tripping that limit.
const PROFIT_AND_LOSS_WINDOW_DAYS = 360;

function formatUtcDate(date: Date): string {
	const year = date.getUTCFullYear();
	const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
	const day = `${date.getUTCDate()}`.padStart(2, '0');
	return `${year}-${month}-${day}`;
}

/**
 * Splits an inclusive `[fromDate, toDate]` range (both `YYYY-MM-DD`, UTC) into
 * consecutive, non-overlapping windows at most `PROFIT_AND_LOSS_WINDOW_DAYS`
 * long. Each window starts the day after the previous one ends, so summing a
 * per-period figure (e.g. expenses) across windows equals the full-range total.
 */
export function profitAndLossDateWindows(
	fromDate: string,
	toDate: string
): Array<{ fromDate: string; toDate: string }> {
	const end = new Date(`${toDate}T00:00:00Z`);
	const windows: Array<{ fromDate: string; toDate: string }> = [];
	let cursor = new Date(`${fromDate}T00:00:00Z`);
	while (cursor <= end) {
		const windowEnd = new Date(cursor);
		windowEnd.setUTCDate(windowEnd.getUTCDate() + PROFIT_AND_LOSS_WINDOW_DAYS);
		const clampedEnd = windowEnd > end ? end : windowEnd;
		windows.push({
			fromDate: formatUtcDate(cursor),
			toDate: formatUtcDate(clampedEnd),
		});
		cursor = new Date(clampedEnd);
		cursor.setUTCDate(cursor.getUTCDate() + 1);
	}
	return windows;
}

export interface CumulativeExpensesResult {
	/** Summed cost of sales per tracking option across every window. */
	costOfSalesByOption: Map<string, number>;
	/** Summed expenses per tracking option across every window. */
	expensesByOption: Map<string, number>;
	/** Summed income per tracking option across every window. */
	incomeByOption: Map<string, number>;
	/** The final window's raw report, for inspecting report shape. */
	lastReport?: XeroReport;
	/** The windows fetched, for diagnostics. */
	windows: Array<{ fromDate: string; toDate: string }>;
}

function accumulateInto(
	target: Map<string, number>,
	source: Map<string, number>
) {
	for (const [option, value] of source) {
		target.set(option, (target.get(option) ?? 0) + value);
	}
}

/**
 * Fetches cumulative expenses- and cost-of-sales-per-tracking-option across a
 * range of any length by chunking it into ≤365-day windows, fetching a P&L per
 * window, and summing the parsed per-option totals. Both totals come from the
 * same per-window report, so no extra requests are made. This is the report
 * path the expense sync uses.
 */
export async function fetchCumulativeExpensesByOption(
	accessToken: string,
	tenantId: string,
	params: ProfitAndLossParams
): Promise<CumulativeExpensesResult> {
	const windows = profitAndLossDateWindows(params.fromDate, params.toDate);
	const expensesByOption = new Map<string, number>();
	const costOfSalesByOption = new Map<string, number>();
	const incomeByOption = new Map<string, number>();
	let lastReport: XeroReport | undefined;
	for (const window of windows) {
		const report = await fetchProfitAndLoss(accessToken, tenantId, {
			trackingCategoryId: params.trackingCategoryId,
			fromDate: window.fromDate,
			toDate: window.toDate,
		});
		lastReport = report;
		accumulateInto(expensesByOption, parseExpensesByOption(report));
		accumulateInto(costOfSalesByOption, parseCostOfSalesByOption(report));
		accumulateInto(incomeByOption, parseIncomeByOption(report));
	}
	return {
		expensesByOption,
		costOfSalesByOption,
		incomeByOption,
		windows,
		lastReport,
	};
}

const TOTAL_EXPENSES_LABELS = ['total expenses', 'total operating expenses'];
const TOTAL_COST_OF_SALES_LABELS = [
	'total cost of sales',
	'total cost of goods sold',
];
// Xero's default P&L names the income section "Income" with a "Total Income"
// summary row; "total trading income" is kept as a fallback for orgs using the
// alternative layout.
const TOTAL_INCOME_LABELS = ['total income', 'total trading income'];

/**
 * Extracts each tracking option's figure from a Profit & Loss report's section
 * summary row whose first cell matches one of `labels`. Columns are aligned by
 * index to the header row of option names. Returns a map keyed by option name.
 * Xero reports these totals as positive numbers.
 */
function parseTotalRowByOption(
	report: XeroReport,
	labels: string[]
): Map<string, number> {
	const rows = report.Rows ?? [];
	const header = rows.find((row) => row.RowType === 'Header');
	const columnNames = (header?.Cells ?? []).map((cell) => cell.Value ?? '');

	let totalRow: XeroReportRow | undefined;
	for (const section of rows) {
		for (const row of section.Rows ?? []) {
			const label = (row.Cells?.[0]?.Value ?? '').trim().toLowerCase();
			if (labels.includes(label)) {
				totalRow = row;
				break;
			}
		}
		if (totalRow) {
			break;
		}
	}

	const result = new Map<string, number>();
	if (!totalRow) {
		return result;
	}
	const cells = totalRow.Cells ?? [];
	for (let i = 1; i < columnNames.length; i++) {
		const name = columnNames[i]?.trim();
		if (!name) {
			continue;
		}
		const raw = cells[i]?.Value ?? '';
		const value = Number(raw);
		result.set(name, Number.isFinite(value) ? value : 0);
	}
	return result;
}

/**
 * Extracts each tracking option's total expenses from a Profit & Loss report.
 */
export function parseExpensesByOption(report: XeroReport): Map<string, number> {
	return parseTotalRowByOption(report, TOTAL_EXPENSES_LABELS);
}

/**
 * Extracts each tracking option's total cost of sales from a Profit & Loss
 * report.
 */
export function parseCostOfSalesByOption(
	report: XeroReport
): Map<string, number> {
	return parseTotalRowByOption(report, TOTAL_COST_OF_SALES_LABELS);
}

/**
 * Extracts each tracking option's total income from a Profit & Loss report.
 */
export function parseIncomeByOption(report: XeroReport): Map<string, number> {
	return parseTotalRowByOption(report, TOTAL_INCOME_LABELS);
}
