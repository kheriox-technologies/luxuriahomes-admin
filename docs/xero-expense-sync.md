# Xero Expense Sync — Setup & Custom Connection

The admin app links each project to a **Xero tracking option** and pulls that
project's total expenses from Xero, replacing the manually entered `expenses`
value on the projects table.

Authentication uses a **Xero Custom Connection** — a machine-to-machine
integration (`client_credentials` grant) bound to a single Xero organisation. It
needs no "Connect to Xero" login flow and no refresh token: a short-lived
access token is requested per run from only the client id and secret. This
mirrors the machine-to-machine pattern already used for Gmail and Clerk.

Relevant code:
`packages/backend/convex/xero/shared.ts` (auth + Xero API helpers) and
`packages/backend/convex/xero/testConnection.ts` (the connection test action).

> **Status:** the first step ships the auth helpers and a connection test only.
> The scheduled expense sync, schema fields, and UI come in a later step.

## Required Convex environment variables

Set these in the Convex backend (`packages/backend`) and mirror them in the
Convex dashboard for production:

```bash
npx convex env set XERO_CLIENT_ID            "xxxxxxxx"
npx convex env set XERO_CLIENT_SECRET        "xxxxxxxx"
npx convex env set XERO_TRACKING_CATEGORY_ID "00000000-0000-0000-0000-000000000000"
```

- `XERO_CLIENT_ID` / `XERO_CLIENT_SECRET` come from the Custom Connection app
  (below). The **secret expires** — when Xero rotates it, regenerate the secret
  and re-run `npx convex env set XERO_CLIENT_SECRET …`. The client id stays the same.
- `XERO_TRACKING_CATEGORY_ID` is the GUID of the tracking category whose options
  map to projects (e.g. a "Project" or "Job" category). It is **optional for the
  connection test** but required by the eventual sync. If unset, the test action
  still verifies auth and lists tracking categories (including their GUIDs).

## One-time Xero Developer portal setup

A Custom Connection requires a **paid Xero plan**.

1. Go to the [Xero Developer portal](https://developer.xero.com/app/manage) →
   **New app** → choose **Custom Connection**.
2. Give it a name and select the integrating user.
3. Add the scopes:
   - `accounting.reports.profitandloss.read` (Profit & Loss report)
   - `accounting.settings.read` (tracking categories)

   > Custom Connections created from **29 April 2026** use Xero's new granular
   > scopes: `accounting.reports.read` no longer exists and is split per-report,
   > so the P&L report uses `accounting.reports.profitandloss.read`. The
   > `accounting.settings.read` scope is unchanged. The scope string requested in
   > `shared.ts` (`XERO_SCOPES`) must exactly match the scopes selected here — a
   > mismatch yields a `400 invalid_scope` ("Client credentials scope validation
   > failed") on the token request.
4. **Authorise** the connection to the target Xero **organisation** (an org admin
   must approve it; a Custom Connection binds to exactly one organisation).
5. Copy the generated **Client ID** and **Client Secret** into the Convex env
   vars above.

## Finding the tracking category GUID

In Xero, make sure a tracking **category** exists (e.g. "Project") with one
**option per project**. Tag bills/spend-money transactions with the matching
option so expenses roll up per project.

To get the category's GUID, either read it from the `GET /TrackingCategories`
response, or simply run the connection test below — it lists every tracking
category with its `id`, name, and option count. Copy the right `id` into
`XERO_TRACKING_CATEGORY_ID`.

## Verifying the connection

After setting the env vars:

1. Run `npx convex dev` so the `internal.xero.testConnection` function is
   generated.
2. Open the **Convex dashboard → Functions**, find `xero/testConnection`, and run
   it with empty args `{}`.
3. A successful run returns:
   - `tenantId` — confirms auth and org access,
   - `categories` — each tracking category with its `id`, `name`, and a few
     sample options (use this to find `XERO_TRACKING_CATEGORY_ID`),
   - `profitAndLoss` — present only when `XERO_TRACKING_CATEGORY_ID` is set;
     shows the expenses parsed per tracking option, proving the report path.

The test writes nothing to the database. Errors are thrown with the Xero HTTP
status and response body to make misconfiguration easy to diagnose (e.g. a
missing scope or an unauthorised organisation).

## Inspecting the Profit & Loss report

Once you have the tracking category GUID, run `xero/testProfitAndLoss` from the
Convex dashboard to verify the report path in detail. Unlike `testConnection`, it
takes the category id as an **argument** (so you don't need to set the env var
first) and returns the raw report rows alongside the parsed figures:

```json
{ "trackingCategoryId": "00000000-0000-0000-0000-000000000000" }
```

Optional args: `fromDate` / `toDate` (`YYYY-MM-DD`, UTC). They default to
`2000-01-01` → today, i.e. cumulative expenses-to-date. The result includes:

- `expensesByOption` — the parsed `{ option, expenses }` per tracking option
  (this is exactly what the eventual sync writes to each project),
- `rows` — the report's top-level header + section summary rows, for debugging
  when an option doesn't match or the "Total Expenses" row can't be found.

This also writes nothing to the database.
