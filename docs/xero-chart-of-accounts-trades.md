# Xero Chart of Accounts → Trades Integration (Implementation Plan)

> Status: **implemented** (backend + frontend). Companion to `xero-expense-sync.md` (project-level Expenses/Received sync).
>
> Deviation from this plan: `projectBudgets/tradeSummary` was found to be shared
> by the Quotations tab, Orders tab, and three mobile screens (a per-trade
> "budget remaining" helper), not only the Budgets tab. Slimming it to the shape
> below therefore also removed the quotation/order-driven "Remaining" badge from
> those five consumers (each now shows only the "Budget" figure, which
> `tradeSummary` still returns). The mobile Budgets screen was likewise
> re-pointed at `xeroActual` and lost its Payments column.
>
> Two-step `payments` removal (§5b) is partially done: step 1 is in place
> (`clearPayments` migration added, `payments` still in schema). Step 2 — run
> `internal.projectBudgets.clearPayments.clearPayments` from the Convex
> dashboard, then delete that file and drop `payments` from `schema.ts` — is
> still pending.

## Context

The portal already syncs project-level Expenses/Received from Xero P&L reports (projects map to Xero tracking options via `projects.xeroTrackingOptionId`). This change extends the integration to trades: each trade maps to one or more Xero Chart of Accounts entries (one-time setup in the Edit/Add Trade dialogs), and the **Actual** column on the project Budgets tab is then driven by Xero — the sum of the trade's mapped accounts' P&L amounts for that project — replacing the current quotations + orders + payments calculation.

**Xero scopes: no change needed.** `XERO_SCOPES` in `packages/backend/convex/xero/shared.ts:12` already includes `accounting.settings.read`, which is the scope `GET /Accounts` requires (same scope already powering `GET /TrackingCategories`). P&L data continues to use `accounting.reports.profitandloss.read`.

Decisions (fixed):
- Actual is **Xero-only** — unmapped trades / no data show "—". The old quotations + orders + payments pipeline is **fully removed**: the `projectBudgets.payments` field, the Payments column, the quotation/order aggregation in `tradeSummary`, and the quotation/order count badges in the Actual cell all go away. (The Quotations and Orders tabs themselves are untouched — only their roll-up into budget actuals is removed.)
- Apply the existing **10% uplift** (`XERO_UPLIFT = 1.1`) to per-trade actuals.
- Account picker shows **expense-type accounts only** (Class = `EXPENSE`, covering Types EXPENSE / DIRECTCOSTS / OVERHEADS).
- Sync = **extend the nightly cron sync + manual refresh button** on the Budgets tab (same pattern as Expenses/Received).

## Design decisions

- **Mapping** stored on the trade: `trades.xeroAccountIds?: string[]` (Account GUIDs) — mirrors `projects.xeroTrackingOptionId`.
- **Synced actuals** stored in a new `xeroTradeActuals` table (`projectId`, `tradeId`, `amount`), NOT as a field on `projectBudgets`. Reasons: sync must write actuals for trades with no budget row (would force skeleton `projectBudgets` inserts); deleting a budget row would destroy synced data; stale-clearing is trivial with sync-owned rows (reconcile per project).
- **One combined P&L pass**: extend the existing `syncProjectFinancials` internal action — the per-window reports it already fetches contain every account row, so per-trade actuals cost zero extra Xero API calls.
- Zero/absent amounts are not stored → UI shows "—" naturally.

## Backend changes

### 1. Schema — `packages/backend/convex/schema.ts`
- `trades` table (~line 365): add `xeroAccountIds: v.optional(v.array(v.string()))`.
- New table:
  ```ts
  xeroTradeActuals: defineTable({
      projectId: v.id('projects'),
      tradeId: v.id('trades'),
      amount: v.number(), // uplifted (×1.1), cents-rounded; zero rows not stored
  })
      .index('by_project', ['projectId'])
      .index('by_trade', ['tradeId']),
  ```

### 2. Xero helpers — `packages/backend/convex/xero/shared.ts`
- Extend `XeroReportCell` with `Attributes?: Array<{ Id?: string; Value?: string }>` (account GUIDs ride on cell attributes).
- Add `XeroAccount` interface (`AccountID`, `Code?`, `Name`, `Type?`, `Class?`, `Status?`) and `fetchAccounts(accessToken, tenantId)` — `GET ${XERO_API_BASE}/Accounts`, mirroring `fetchTrackingCategories` (same `xeroHeaders`, error style). Filter in callers, not via `where=` param.
- Add `parseAccountAmountsByOption(report): Map<accountId, Map<optionName, number>>` — follows `parseTotalRowByOption` (shared.ts:329) style: column names from the `Header` row; walk each section's `Rows`, take `RowType === 'Row'` only (skip SummaryRow); account GUID = first cell attribute with `Id === 'account'` (scan all cells for robustness); accumulate `Number(cells[i].Value)` guarded by `Number.isFinite` for columns i ≥ 1. Parse all account rows regardless of section (only mapped expense accounts are ever looked up).
- Extend `CumulativeExpensesResult` with `accountAmountsByOption` and accumulate it per window inside `fetchCumulativeExpensesByOption` (nested-map variant of the existing `accumulateInto`).

### 3. List accounts action — new `packages/backend/convex/xero/listAccounts.ts`
Public action, clone of `listTrackingOptions.ts`: `requireAdmin` → token → tenant → `fetchAccounts` → filter `Class === 'EXPENSE' && (Status ?? 'ACTIVE') === 'ACTIVE'` → return `{ accounts: [{ id, code, name, type }] }` sorted by code then name.

### 4. Sync extension
- New `packages/backend/convex/trades/listXeroMapped.ts` (internalQuery): trades with non-empty `xeroAccountIds` → `{ _id, xeroAccountIds }[]` (mirror of `projects/listXeroMapped.ts`).
- New `packages/backend/convex/xeroTradeActuals/apply.ts` (internalMutation, plain runtime — NOT under 'use node' xero/, mirroring how `applyXeroFinancials` lives under `projects/`). Args: `{ projectIds: Id<'projects'>[], entries: { projectId, tradeId, amount }[] }`. Diff-upsert per project: load existing rows via `by_project`, patch changed / insert missing / delete rows whose trade is absent from this run's entries (this is how stale values clear).
- Modify `packages/backend/convex/xero/syncProjectFinancials.ts`: destructure `accountAmountsByOption` from the existing `fetchCumulativeExpensesByOption` call; fetch mapped trades; inside the existing `for (const project of mapped)` loop (line 77), for each mapped trade sum `accountAmountsByOption.get(accountId)?.get(optionName) ?? 0` over its accounts, push `{ projectId, tradeId, amount: roundToCents(sum * XERO_UPLIFT) }` when sum ≠ 0, and collect `syncedProjectIds` (projects with unresolvable options stay skipped and untouched). Call `internal.xeroTradeActuals.apply.apply`. Return `{ updated, skipped, tradeActualsWritten }`.
- `syncProjectFinancialsNow.ts`: extend return type annotation. `crons.ts`: no change (same action).

### 5. Trade mutations + summary
- `trades/update.ts`: add optional `xeroAccountIds: v.optional(v.array(v.string()))`. `undefined` = unchanged (critical — inline rename on the Budgets tab sends name-only); provided = normalize (trim/dedupe; empty array → store `undefined`). When the set changes, delete the trade's `xeroTradeActuals` rows via `by_trade` so stale actuals blank immediately (next sync repopulates).
- `trades/add.ts` + `trades/shared.ts` `createTrade`: accept optional `xeroAccountIds` pass-through. `addMany` untouched.
- `trades/remove.ts`: also delete the trade's `xeroTradeActuals` rows (`by_trade`).
- `projectBudgets/tradeSummary.ts`: **rewrite** — drop the `projectQuotations` and `projectOrders` fetches and all quotation/order/payment aggregation. New parallel fetches: trades, `projectBudgets` (`by_project`), `xeroTradeActuals` (`by_project`). Row shape becomes `{ tradeId, tradeName, tradeDescription, stageId, tradeOrder, projectBudgetId, budgetPrice, xeroActual }`.
- `projectBudgets/setPrices.ts`: remove the `payments` item field and its upsert logic (price-only).

### 5b. Remove `projectBudgets.payments` (old actuals pipeline)
Payments are referenced only in: `schema.ts`, `projectBudgets/setPrices.ts`, `projectBudgets/tradeSummary.ts`, `apps/portal/components/budgets/use-price-editing.ts`, `apps/portal/components/projects/project-budgets-tab-content.tsx` (verified by grep).
- Convex validates existing documents against the schema, so removal is two-step:
  1. First deploy: keep `payments: v.optional(v.number())` in schema; add a one-off `internalMutation` `projectBudgets/clearPayments.ts` that patches `payments: undefined` on every `projectBudgets` doc; run it once from the Convex dashboard.
  2. Second deploy: remove the `payments` field from `schema.ts` (line ~396) and delete `clearPayments.ts`.
- `use-price-editing.ts`: remove `payments` from `PriceEntry`, the `PaymentChange` type, `paymentDrafts`/`setPaymentDraft`/`getPaymentChanges` and their originals ref (only the budgets tab uses them).

## Frontend changes

### 6. New `apps/portal/components/xero/xero-accounts-combobox.tsx`
Multi-select chips picker — hybrid of `XeroOptionCombobox` (`apps/portal/components/projects/project-form-shared.tsx:546-630`: `useAction` fetch-on-mount with `active` cancellation, GUID fallback label) and `TradeSelect` multi mode (`apps/portal/components/trades/trade-select.tsx:172-199`: `Combobox<string, true>` + `ComboboxChips`/`ComboboxChip`/`ComboboxChipsInput`/`ComboboxPopup`/`ComboboxEmpty`).
- Props: `{ id?, disabled?, value: string[], onChange: (next: string[]) => void }`.
- Fetches `api.xero.listAccounts.listAccounts`; labels `` `${code} — ${name}` ``; chips fall back to raw GUID for deleted/archived accounts; "Loading Xero accounts…" placeholder.
- Field description notes: "An account mapped to multiple trades is counted in each."

### 7. `apps/portal/components/trades/edit-trade.tsx`
- Self-fetch mapping: `useQuery(api.trades.get.get, open ? { tradeId } : 'skip')` (query already exists) + `const [xeroAccountIds, setXeroAccountIds] = useState<string[]>([])`, initialized in the existing open-reset effect / when the query resolves. Avoids threading a new prop through all three call sites.
- Render `XeroAccountsCombobox` in a `Field` labeled "Xero accounts (optional)" below `TradeStageInlineSelect`; always send `xeroAccountIds` in the `updateTrade` call (empty clears — same comment style as the description field).
- `trade-form-shared.ts` unchanged (mapping is component state like `stageId`).

### 8. `apps/portal/components/trades/add-trade.tsx`
Same state + combobox, rendered only when not in multi-add mode (same conditional as description); pass to `addTrade` when non-empty.

### 9. `apps/portal/components/projects/project-budgets-tab-content.tsx`
- `TradeBudgetRow`: now `{ budgetPrice, projectBudgetId, stageId, tradeDescription, tradeId, tradeName, tradeOrder, xeroActual }` — remove `paymentPrice`, `totalQuotationPrice`, `quotationCount`, `totalOrderPrice`, `orderCount`.
- Remove the Payments column entirely: `ROW_GRID` shrinks to four tracks (Trade, Budget, Actual, actions); delete the payment header/cell/draft-input markup and all `paymentDrafts`/`getPaymentChanges` usage; drop `payments` from the `setPrices` call.
- Remove `QuotationsCountCell`, `OrdersCountCell`, and the `FILTER_PARAMS` badge-navigation constant (defined only for those badges).
- `ActualCell` (line 99): becomes purely Xero-driven — if `row.xeroActual === null` → "—"; else `formatBudgetPrice(row.xeroActual)` with `actualColorClass(row.xeroActual, budget)` (keep the draft-aware `budget` prop for live over/under color; drop the `payment` prop).
- Stage subtotals and project totals: Budget ("B") and Actual ("A") only — remove the payments subtotal; actual sums use `row.xeroActual ?? 0`.
- Manual refresh: new `XeroActualsSyncButton` in the toolbar next to the "A {total}" badge — port of `XeroSyncHeader` (`apps/portal/components/projects/projects-list.tsx:188-231`): `useAction(api.xero.syncProjectFinancialsNow.syncProjectFinancialsNow)`, `RefreshCw` icon, pending state, success toast including `tradeActualsWritten`. Page is reactive so values appear without refetch. (Button style: `variant="outline"`, leading Lucide icon.)

## Diagnostics (test-action pattern)

- New `packages/backend/convex/xero/testAccounts.ts` (internalAction): returns raw account count + filtered expense list `{ id, code, name, type, class, status }` — verifies scope + Class filter against the real org.
- Extend `xero/testProfitAndLoss.ts`: also return a serializable sample of `parseAccountAmountsByOption` output so the parser can be validated from the Convex dashboard before wiring the sync.

## Edge cases

| Case | Behavior |
|---|---|
| Same account on two trades | Allowed; double-counts by design (noted in field description). |
| Account deleted/archived in Xero | Chip shows GUID fallback (removable); contributes 0 on sync. |
| Project without/with-stale `xeroTrackingOptionId` | Skipped like project-level sync; its rows never zeroed by a partial run (not in `projectIds`). |
| Mapping removed / trade deleted | Rows deleted immediately by `trades/update` / `trades/remove` cleanup; sync reconcile is belt-and-braces. |
| Negative amounts (credits) | Stored/displayed as-is, uplifted; only exact 0 = "no data". |

## Implementation order

1. Schema additions (trades field + `xeroTradeActuals`; keep `payments` for now) → 2. `shared.ts` helpers/parser → 3. diagnostics (validate parser against real org via Convex dashboard) → 4. `listAccounts.ts`, `trades/listXeroMapped.ts`, `xeroTradeActuals/apply.ts`, sync extension → 5. trade mutations + `tradeSummary.ts` rewrite + `setPrices.ts` + old-pipeline removal (5b, incl. `clearPayments` migration) → 6. UI (combobox → edit-trade → add-trade → budgets tab rework) → 7. run `clearPayments` from dashboard, then drop `payments` from schema.

## Verification

1. `pnpm check-types` at repo root; `pnpm dlx ultracite fix` (fix anything reported).
2. Convex dashboard: run `internal.xero.testAccounts` (expect only active Class=EXPENSE accounts) and `testProfitAndLoss` with a short recent range; confirm account GUIDs in `accountAmountsByOption` match `testAccounts` ids and a known project's per-account sums reconcile with Xero's P&L UI.
3. Dashboard-run `syncProjectFinancials`; inspect `xeroTradeActuals` rows — amounts = Xero × 1.1 rounded to cents; project `expenses`/`received` behavior unchanged.
4. Portal: edit a trade → map 1–2 Direct Costs accounts → save → reopen and confirm chips persist; Budgets tab shows only Trade / Budget / Actual columns (no Payments, no quotation/order badges), "—" until refresh; click the toolbar refresh button → actuals populate, green/red vs Budget correct, stage subtotals and "A" total reflect Xero only; inline rename does NOT clear mapping; clearing the mapping blanks Actual immediately; budget edit mode still saves prices and names.
5. After running `clearPayments` and removing the field, confirm the Convex deploy succeeds with no schema validation errors.
6. Commit directly to `develop` (per project convention).
