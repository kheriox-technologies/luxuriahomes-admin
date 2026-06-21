'use node';

import { ConvexError } from 'convex/values';

// Custom Connection (machine-to-machine) auth: client_credentials grant against
// the Xero identity server, then the Accounting API scoped to a single org.
const XERO_TOKEN_ENDPOINT = 'https://identity.xero.com/connect/token';
const XERO_CONNECTIONS_ENDPOINT = 'https://api.xero.com/connections';
const XERO_API_BASE = 'https://api.xero.com/api.xro/2.0';
const XERO_SCOPES = 'accounting.reports.read accounting.settings.read';

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

const TOTAL_EXPENSES_LABELS = ['total expenses', 'total operating expenses'];

/**
 * Extracts each tracking option's total expenses from a Profit & Loss report.
 * Columns are aligned by index to the header row of option names. Returns a map
 * keyed by option name. Expenses are reported as positive numbers by Xero.
 */
export function parseExpensesByOption(report: XeroReport): Map<string, number> {
	const rows = report.Rows ?? [];
	const header = rows.find((row) => row.RowType === 'Header');
	const columnNames = (header?.Cells ?? []).map((cell) => cell.Value ?? '');

	let totalRow: XeroReportRow | undefined;
	for (const section of rows) {
		for (const row of section.Rows ?? []) {
			const label = (row.Cells?.[0]?.Value ?? '').trim().toLowerCase();
			if (TOTAL_EXPENSES_LABELS.includes(label)) {
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
