# Mobile App Setup (`apps/mobile`)

React Native builder app for the Luxuria Homes portal. Expo SDK 57 / React Native 0.86 / expo-router / NativeWind 4 / Clerk (`@clerk/clerk-expo`) / Convex (shared `@workspace/backend`).

Admin-only v1: users must have `admin` or `super-admin` in Clerk `publicMetadata.roles` (same RBAC as the web portal). Screens: Dashboard, Projects, Tasks kanban, Settings, and per-project Schedule, Take Offs (measurements viewer), Inclusions, Documents, Clients, Orders.

## Prerequisites

- Node ≥ 22, pnpm 10.x
- **iOS**: Xcode (latest) + iOS Simulator, CocoaPods (`brew install cocoapods`)
- **Android**: Android Studio with an emulator (AVD) + JDK 17
- Recommended: `brew install watchman`

## 1. Environment variables

```bash
cp apps/mobile/.env.example apps/mobile/.env.local
```

| Variable | Value |
|---|---|
| `EXPO_PUBLIC_CONVEX_URL` | Same as portal's `NEXT_PUBLIC_CONVEX_URL` |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Same as portal's `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` |

Expo auto-loads `.env.local` and inlines `EXPO_PUBLIC_*` at build time. Restart Metro after changing values.

## 2. Clerk dashboard (one-time)

1. **Enable the Native API**: Clerk Dashboard → Configure → Native applications → enable. `@clerk/clerk-expo` will not work without this.
2. **Allow the redirect URL**: on the same Native applications page, add `luxuriahomes://sso-callback` to the allowed redirect URLs (used by Google sign-in).
3. **Google SSO**: Configure → SSO connections → Google. Clerk's shared dev credentials work out of the box in development; add custom Google OAuth credentials before production.
4. The `convex` JWT template already exists (shared with the portal) — nothing to do.
5. Users need `{ "roles": ["admin"] }` (or `super-admin`) in their **public metadata** to get past the app's access guard.

## 3. Convex env vars (one-time, for the Documents tab)

Document viewing signs CloudFront URLs via the `api.cdn.signUrl` action, which needs these on the **Convex deployment** (values are the same ones the portal uses in `apps/portal/.env.local`; see `docs/cdn-signed-urls.md`):

```bash
cd packages/backend
npx convex env set CDN_BASE_URL "<NEXT_PUBLIC_CDN_URL value>"
npx convex env set CDN_KEY_PAIR_ID "<CDN_KEY_PAIR_ID value>"
npx convex env set CDN_PRIVATE_KEY "<CDN_PRIVATE_KEY value>"
```

Repeat with `--prod` for the production deployment when shipping.

## 4. Install, prebuild, run

```bash
pnpm install

cd apps/mobile
npx expo prebuild          # generates ios/ + android/ (gitignored; safe to delete)

# iOS simulator
npx expo run:ios           # or: pnpm mobile:ios (from repo root)

# Android emulator (start an AVD first, or let expo pick one)
npx expo run:android       # or: pnpm mobile:android
```

The first `run:ios` / `run:android` compiles a **dev client** and installs it on the simulator. After that, day-to-day development only needs Metro:

```bash
pnpm dev:mobile            # from repo root (= expo start --dev-client)
# press i for iOS, a for Android
```

Rebuild the dev client (`expo run:ios` / `run:android`) only when native things change: new native dependencies, app.json plugin changes, icon/splash changes.

## 5. Useful commands

| Command (repo root) | What it does |
|---|---|
| `pnpm dev:mobile` | Start Metro for the dev client |
| `pnpm mobile:prebuild` | Regenerate native projects |
| `pnpm mobile:ios` / `pnpm mobile:android` | Build + run on simulator/emulator |
| `pnpm --filter mobile check-types` | TypeScript check |

## 6. Troubleshooting

- **Changed app.json / added a native package** → `npx expo prebuild --clean`, then `npx expo run:ios`.
- **Stale bundler cache / weird resolution errors** → `npx expo start -c`.
- **Pod install failures** → `cd apps/mobile/ios && pod install`; if CocoaPods repo issues, `pod repo update`.
- **Reanimated "worklets version mismatch"** → the JS and native versions drifted; rebuild the dev client.
- **"Missing environment variable" red screen** → `.env.local` missing or Metro started before it existed; restart Metro.
- **Sign-in works but every screen errors "Unauthorized"** → the user lacks `admin` in `publicMetadata.roles`, or the Clerk `convex` JWT template is missing `public_metadata` in its claims.
- **Documents fail to open** → the Convex deployment is missing the `CDN_*` env vars from step 3.
- **Monorepo note**: `.npmrc` sets `node-linker=hoisted` (required for Metro + pnpm). `apps/mobile/metro.config.js` watches the workspace root so edits in `packages/backend` hot-reload. `apps/mobile/package.json` must **not** set `"type": "module"` (the CJS metro/babel/tailwind configs depend on it).

## Architecture notes

- **Auth**: `ClerkProvider` + `ConvexProviderWithClerk` in `app/_layout.tsx` (mirrors `apps/portal/components/providers.tsx`). Route gating in `app/(app)/_layout.tsx` uses Convex `<Authenticated>` (waits for the JWT handshake) plus `components/auth/admin-guard.tsx` (UX-level role check; the backend's `requireAdmin` is the real enforcement).
- **Google sign-in**: `useSSO()` in `app/(auth)/sign-in.tsx` with redirect `luxuriahomes://sso-callback`.
- **Theme**: brand navy/gold converted from `packages/ui/src/styles/globals.css` oklch tokens into `apps/mobile/global.css` CSS variables (light + dark) consumed by `tailwind.config.js`. Theme preference (light/dark/system) persists via AsyncStorage (`components/theme.tsx`).
- **Takeoff math**: `apps/mobile/lib/takeoffs/math.ts` is a port of the value math in `apps/portal/lib/takeoffs/geometry.ts` + `computeGroupTotals` from the portal measurements panel — keep them in sync.
- **Documents**: `packages/backend/convex/cdn/signUrl.ts` (node action) signs CloudFront URLs; files open in the system in-app browser (`expo-web-browser`), which renders PDFs/images natively on both platforms.
