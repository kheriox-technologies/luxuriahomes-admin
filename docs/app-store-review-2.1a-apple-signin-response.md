# App Store review response — Guideline 2.1(a) (Sign in with Apple "error")

Context for the Apple rejection of build 18 (Submission ID `b9f6e05d-2204-48b4-8672-b5a39c4b9f85`).
The app is invite-only (Clerk Restricted sign-up mode), so a reviewer's own, unprovisioned
Apple ID is correctly refused — it is access control, not a bug. Build 19 makes that refusal
render as a clean, non-technical message instead of Clerk's raw error.

Copy the blocks below into App Store Connect.

---

## 1. Reviewer notes → App Review Information → Notes

> Luxuria Homes is a **private, invite-only** app for a home builder's staff and clients.
> Accounts are provisioned by an administrator; the app does not offer public sign-up.
>
> **To review the full app, sign in with the demo account using the Email + Password fields:**
> Email: `<demo-email>`
> Password: `<demo-password>`
>
> Please note: *Sign in with Apple* and *Continue with Google* are intentionally restricted
> to members who have already been provisioned by an administrator. Signing in with a new
> Apple ID or Google account correctly shows the message **"You do not have access to this
> app. Please contact your administrator."** This is by-design access control, not a bug —
> the app stays stable and no crash occurs. Sign in with Apple is offered (per Guideline 4.8)
> and functions normally for provisioned members.

---

## 2. Reply to Apple → Resolution Center

> Thank you for the review. The behavior observed is intended access control, not a bug: the
> app is invite-only, and social sign-in is limited to members already provisioned by an
> administrator, so an unrecognized Apple ID is shown an informational "you do not have
> access — please contact your administrator" message rather than being signed up.
>
> We have (a) submitted build 19, which presents this as a clear, non-technical message, and
> (b) provided demo Email/Password credentials in App Review Information. To review the full
> app, please sign in using the **Email and Password fields** (not Sign in with Apple). Steps
> and credentials are in the reviewer notes.
>
> Thank you.

---

## 3. Checklist before resubmitting

- [ ] Replace `<demo-email>` / `<demo-password>` above with real credentials.
- [ ] Confirm the demo account is active in the **`pk_live`** Clerk instance and lands in a
      populated screen. Ideally provide two accounts (one admin, one client) so both app
      modes are reviewable.
- [ ] Confirm credentials work on a clean install (single-session Clerk).
- [ ] Build & submit **build 19**: `eas build -p ios --profile production` then
      `eas submit -p ios --profile production` (see `docs/mobile-eas-cloud-build.md`).
- [ ] Attach build 19 to the version, paste the notes above, and submit for review.
