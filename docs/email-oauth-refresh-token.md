# Google Workspace Email — OAuth2 Setup & Refresh Token

The admin app sends email through Google Workspace using the Gmail API so that
sent messages appear in the sender mailbox's **Sent** folder, with support for
multiple attachments, CC/BCC, templates, and signatures.

Authentication uses an **OAuth2 refresh token** issued for a single shared
mailbox (e.g. `orders@yourdomain`). This avoids service-account keys, which are
blocked by the org policy `iam.disableServiceAccountKeyCreation`.

Relevant code: `packages/backend/convex/email/shared.ts` (auth + send) and
`packages/backend/convex/email/send.ts` (the Convex action).

## Required Convex environment variables

Set these in the Convex backend (`packages/backend`) and mirror them in the
Convex dashboard for production:

```bash
npx convex env set GOOGLE_CLIENT_ID      "xxxxxx.apps.googleusercontent.com"
npx convex env set GOOGLE_CLIENT_SECRET  "GOCSPX-xxxxxxxx"
npx convex env set GMAIL_REFRESH_TOKEN   "1//xxxxxxxx"
npx convex env set GMAIL_SENDER          "orders@yourdomain"
```

- `GMAIL_SENDER` is the shared mailbox that consents and is used as the From
  address. Its Sent folder receives the copies.
- Only `GMAIL_REFRESH_TOKEN` needs to be regenerated if the token is revoked or
  expires — the client ID/secret stay the same.

---

## One-time Google Cloud setup

You only do steps 1–2 once. They produce the `GOOGLE_CLIENT_ID` and
`GOOGLE_CLIENT_SECRET`.

### 1. OAuth consent screen

1. Google Cloud Console → **APIs & Services → OAuth consent screen**.
2. **User type = Internal** (only your Workspace org — no Google verification
   needed).
3. Fill in app name + support email → Save.
4. Ensure the **Gmail API** is enabled: APIs & Services → Library → Gmail API →
   Enable.

### 2. OAuth Client ID

1. **APIs & Services → Credentials → Create credentials → OAuth client ID**.
2. **Application type = Web application**.
3. Under **Authorized redirect URIs**, add:
   `https://developers.google.com/oauthplayground`
4. Create, then copy the **Client ID** and **Client secret** → set
   `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

---

## Getting (or regenerating) the refresh token

Do this whenever `GMAIL_REFRESH_TOKEN` needs to be (re)created — e.g. after a
revoke, after ~6 months of disuse, or when first setting up.

1. Open the **OAuth 2.0 Playground**:
   <https://developers.google.com/oauthplayground>
2. Click the **⚙ gear icon** (top-right) →
   check **"Use your own OAuth credentials"** →
   paste your **Client ID** and **Client secret** → Close.
3. In the left panel, find **"Input your own scopes"** and enter:
   `https://www.googleapis.com/auth/gmail.send`
4. Click **Authorize APIs**.
5. **Sign in as the shared mailbox** (`orders@yourdomain`) and approve access.
   > This is important — whichever account you authorize as is the account
   > whose Sent folder receives the messages.
6. Back in the Playground, click **"Exchange authorization code for tokens"**.
7. Copy the **Refresh token** value (starts with `1//`).
8. Update the Convex env var:
   ```bash
   npx convex env set GMAIL_REFRESH_TOKEN "1//<new-token>"
   ```
   (Also update it in the Convex dashboard for production.)

### If no refresh token is returned

Google only returns a refresh token on the first consent unless you force a new
one. To force it:

1. Go to <https://myaccount.google.com/permissions> **while signed in as the
   shared mailbox**, find the OAuth app, and **Remove access**.
2. Repeat the Playground steps above — a refresh token will be issued on the
   fresh consent.

The Playground requests offline access (`access_type=offline`) and re-consent
(`prompt=consent`) automatically, so revoking + re-authorizing reliably yields a
new refresh token.

---

## Verifying it works

In the admin app, open a project order and use **Email Order** (or select files
on the Documents page and click **Email**) to send a message via the
`email.send` Convex action. Confirm it arrives at the recipient and shows up in
the `GMAIL_SENDER` mailbox's **Sent** folder.

If sending fails:

- `Missing Google Workspace email configuration` → one of the four env vars is
  unset.
- Gmail `400/401/403` with `invalid_grant` → the refresh token was revoked or
  expired; regenerate it using the steps above.

---

## Notes

- The refresh token is a credential. It lives only in Convex server-side env
  vars and is never exposed to the browser.
- Internal OAuth apps skip Google's app verification, so org users won't see an
  "unverified app" warning.
- To change the sending address, point `GMAIL_SENDER` at a different mailbox and
  generate a refresh token by authorizing as that mailbox.
