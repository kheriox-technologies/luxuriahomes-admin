# Luxuria Documents — Gmail Add-on

A Google Workspace Add-on that appears in Gmail's right sidebar when a message
is open. It lists the message's attachments, lets you pick a project and one
of its document folders (or create a new subfolder), and files the selected
attachments into the portal's project documents — identical to uploading via
the portal.

## How it works

- The add-on runs on Google's Apps Script platform (`src/` is the script
  source, pushed with [clasp](https://github.com/google/clasp)).
- It talks to four Convex HTTP endpoints (see
  `packages/backend/convex/gmailAddon/`), authenticated with a static bearer
  key:
  - `GET /gmail-addon/projects`
  - `GET /gmail-addon/folders?projectId=...`
  - `POST /gmail-addon/prepare-upload` → presigned S3 PUT URL
  - `POST /gmail-addon/complete-upload` → creates the document record
- Attachment bytes are PUT directly from Apps Script to S3 via the presigned
  URL, so the full Gmail attachment size range (~25MB) works.

## One-time setup

### 1. Backend

```bash
# In packages/backend — generate and set the API key on the Convex deployment
openssl rand -hex 32
npx convex env set GMAIL_ADDON_API_KEY <key>            # dev
npx convex env set --prod GMAIL_ADDON_API_KEY <key>     # prod
```

The HTTP endpoints are served at `https://<deployment>.convex.site` (note:
`.convex.site`, not `.convex.cloud`). Find the deployment name in the Convex
dashboard.

### 2. Apps Script project

1. Enable the Apps Script API: https://script.google.com/home/usersettings
2. From `apps/gmail-addon/` (clasp v3 is run via `pnpm dlx` — do not install
   v2 locally, it cannot read v3-format `~/.clasprc.json` credentials):

```bash
pnpm dlx @google/clasp@3 login
pnpm dlx @google/clasp@3 create-script --type standalone --title "Luxuria Documents" --rootDir src
# clasp writes .clasp.json (git-ignored scriptId lives there)
pnpm push
```

3. **Paste the manifest manually.** clasp v3 has a bug: `clasp push` never
   uploads `src/appsscript.json` — worse, it OVERWRITES the local file with
   the remote manifest (check `git status` after pushing and restore if
   needed). Without the manifest the editor shows "To test deployment as
   Add-on, update the manifest file" and no Install button. Fix: in the
   script editor, **Project Settings → check "Show 'appsscript.json' manifest
   file in editor"**, then open `appsscript.json` in the Editor, replace its
   contents with `src/appsscript.json` from this repo, and save. Repeat this
   whenever the manifest changes (rare); `.js` files push fine with
   `pnpm push`.

   The manifest's `urlFetchWhitelist` (required for versioned/Marketplace
   deployments; test deployments ignore it) must list every URL prefix the
   add-on fetches: both Convex `.convex.site` hosts and both S3 bucket hosts
   (dev + prod). If the Convex deployment or bucket ever changes, update the
   whitelist or every call fails with "An explicit urlFetchWhitelist is
   required".

4. Open the script (`pnpm open`), then **Project Settings → Script
   Properties** and add:

| Property  | Value                                  |
| --------- | -------------------------------------- |
| `API_URL` | `https://<deployment>.convex.site`     |
| `API_KEY` | the same key set on Convex             |

`API_URL` must be the `.convex.site` host with **no trailing slash**, and the
deployment must have the gmail-addon code deployed (dev has it via
`convex dev`; prod requires `npx convex deploy`).

### 3. Install in Gmail

In the script editor: **Deploy → Test deployments → Install**. Each user who
needs the add-on installs from the same test-deployment link (sufficient for
internal use). Refresh Gmail; the add-on icon appears in the right sidebar
when a message is open.

Note: a test-deployment install applies only to the Google account that
clicks Install, and the add-on card only appears when a message is open
(contextual trigger). To install for another account, share the script with
that account first, then install from Deploy → Test deployments while logged
in as it.

For a permanent domain-wide install: create a versioned deployment (Deploy →
New deployment → Add-on), attach a standard GCP project with an **Internal**
OAuth consent screen (Project Settings → Change project), enable the
Workspace Marketplace SDK in that GCP project, configure the app with the
deployment ID and **Private** visibility, then admin-install it from the
Admin console. Private listings are only installable by accounts in the same
Workspace domain as the GCP project.

## Development

```bash
pnpm push   # push src/ to Apps Script
pnpm pull   # pull remote changes back
pnpm open   # open the script editor
```

After pushing, reopen the message in Gmail (or use the test deployment's
reinstall) to pick up changes.

## Notes

- `logoUrl` in `src/appsscript.json` uses a generic document icon; replace
  with a hosted 128px Luxuria logo when available.
- Filenames are kebab-cased and de-duplicated (`file-1.pdf`) by the backend,
  matching portal uploads.
- `uploadedBy` records the Gmail user's email address.
