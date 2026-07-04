# Mobile Device Push Notifications

## Context

The mobile app (`apps/mobile`) now has an in-app notifications inbox backed by the Convex `notifications` table (a **global admin inbox** — no per-recipient field). We want each new notification to also fire an OS-level push notification to admins' phones, so they're alerted without opening the app.

**Decisions (confirmed):**
- **Broadcast to all admins** — every notification pushes to every registered admin device. No change to the `notifications` schema.
- Delivery via the **Expo Push service** (`https://exp.host/--/api/v2/push/send`) — Expo fans out to APNs/FCM, so no native credential code in the repo.

**Foundation already in place:**
- `expo-dev-client` is installed → real dev/standalone builds (remote push does not work in Expo Go).
- `createNotification` (`packages/backend/convex/notifications/shared.ts:24`) is the single choke point every notification flows through — the one place to trigger a push.
- Its three callers already hold the full `ctx`: `clientPortal/inclusions/appendNote.ts`, `clientPortal/inclusions/setStatus.ts`, `clientPortal/documents/create.ts`.

**Not yet present:** `expo-notifications` / `expo-device` deps, an EAS `projectId` in `app.json`, and a table for device push tokens.

---

## Backend (Convex) — `packages/backend/convex/`

### 1. Schema — add `pushTokens` table (`schema.ts`)
```ts
pushTokens: defineTable({
  userId: v.string(),          // Clerk subject (identity.subject)
  token: v.string(),           // Expo push token: ExponentPushToken[...]
  platform: v.optional(v.union(v.literal('ios'), v.literal('android'))),
  updatedAt: v.number(),
})
  .index('by_token', ['token'])
  .index('by_user', ['userId']),
```
No change to the `notifications` table (broadcast model).

### 2. `notifications/registerPushToken.ts` — mutation
- Args: `{ token: v.string(), platform?: ... }`.
- `requireAdmin(ctx)` (mobile is admin-only) and read `identity.subject` for `userId`.
- Upsert **by token** (dedupe reinstalls): look up via `by_token`; patch `userId`/`platform`/`updatedAt` if found, else insert.
- Reuse the existing `requireAdmin` helper the other `notifications/*` functions use.

### 3. `notifications/unregisterPushToken.ts` — mutation (optional but recommended)
- Args `{ token }`. Delete the matching `by_token` row. Called on sign-out so a shared device stops receiving pushes.

### 4. `push/sendToAdmins.ts` — **internal action** (network lives in actions, not mutations)
- `internalAction` with args `{ title: v.string(), body: v.string(), data?: v.any() }`.
- Load all tokens: `ctx.runQuery(internal.push.allTokens.allTokens)` (a tiny `internalQuery` that returns every `pushTokens` row's `token`).
- Build Expo messages `{ to, sound: 'default', title, body, data }`, **chunk into batches of 100** (Expo's per-request cap), and `fetch` each batch:
  ```ts
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(batch),
  });
  ```
- Parse the response tickets; when Expo returns a `DeviceNotRegistered` error for a token, schedule/perform a delete of that token (self-healing). Keep this best-effort — never throw in a way that would break the originating flow.
- Also add `push/allTokens.ts` (`internalQuery`) returning `Doc<'pushTokens'>[]` or just the token strings.

### 5. Wire the choke point — `notifications/shared.ts`
- Widen `createNotification`'s ctx param from `Pick<MutationCtx, 'db'>` to `Pick<MutationCtx, 'db' | 'scheduler'>`.
- After the existing `db.insert`, schedule the push:
  ```ts
  await ctx.scheduler.runAfter(0, internal.push.sendToAdmins.sendToAdmins, {
    title: titleForType(args.type),
    body: args.message,
    data: { link: args.link ?? null },
  });
  ```
- Add a small `titleForType(type)` map: e.g. `inclusion_approved → 'Inclusion approved'`, `inclusion_unapproved → 'Inclusion needs changes'`, `inclusion_note → 'New inclusion note'`, `document_upload → 'New document'`.
- The three callers pass the full `ctx` already, so they need **no signature changes** (a `MutationCtx` satisfies the widened `Pick`). Verify each still compiles.

---

## Mobile (Expo) — `apps/mobile/`

### 6. Dependencies & config
- `npx expo install expo-notifications expo-device`
- `app.json`:
  - `expo.plugins`: add `"expo-notifications"` (optionally with an icon/color).
  - `expo.extra.eas.projectId`: set from `eas init` (required — `getExpoPushTokenAsync` needs it).
  - iOS: ensure `expo.ios.bundleIdentifier` set; Android: `expo.android.package` (already needed for builds).
- Because native modules are added, a new dev build is required (`expo prebuild` + `expo run:ios|android`).

### 7. `lib/push.ts` — token registration helper
- `registerForPushNotificationsAsync()`:
  - Guard `Device.isDevice` (no remote push on simulators).
  - On Android, `Notifications.setNotificationChannelAsync('default', { importance: MAX, ... })`.
  - Check/request permission via `getPermissionsAsync` / `requestPermissionsAsync`; bail if not granted.
  - `const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data` where `projectId` comes from `Constants.expoConfig?.extra?.eas?.projectId`.
  - Return the token string.
- Set the foreground handler once at module load: `Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }) })`.

### 8. `components/notifications/use-register-push-token.ts` — hook
- `const register = useMutation(api.notifications.registerPushToken.registerPushToken)`.
- `useEffect` on mount: call `registerForPushNotificationsAsync()`, and if it returns a token, `register({ token, platform: Platform.OS })`.
- Add `Notifications.addNotificationResponseReceivedListener` → on tap, `router.push('/(app)/notifications')` (or, later, parse `response.notification.request.content.data.link` for a deep link). Clean up the subscription on unmount.

### 9. Mount the hook — `app/(app)/_layout.tsx`
- Inside `<Authenticated><AdminGuard>`, render a tiny component that calls `useRegisterPushToken()` (so registration only runs for signed-in admins and has a Clerk identity for the mutation).

### 10. Sign-out cleanup (optional) — `app/(app)/(tabs)/settings.tsx`
- Before `signOut()`, call `unregisterPushToken({ token })` for the current device token so it stops receiving pushes.

---

## External setup (you must do this — not code)
- `eas init` (if not done) to get the `projectId`; put it in `app.json`.
- **iOS:** `eas credentials` → create/upload an APNs key (Expo delivers through it).
- **Android:** EAS provisions FCM v1 credentials during `eas build` (or upload a service-account key via `eas credentials`).
- Test on a **physical device** with a dev/preview build (iOS simulator can't receive remote push).

## Verification
1. `pnpm check-types` (backend + mobile) and `pnpm dlx ultracite fix`.
2. Build a dev client on a physical device, sign in as admin, accept the notification prompt → confirm a `pushTokens` row appears in the Convex dashboard.
3. Trigger a notification (approve an inclusion / add a note / upload a doc from the client portal) → confirm: (a) the in-app inbox row appears, and (b) an OS push arrives on the device.
4. Background the app and repeat → push shows in the system tray; tapping it opens the Notifications screen.
5. Send to a device that reinstalled/revoked → confirm `DeviceNotRegistered` prunes the stale token.

## New/changed files summary
- **New backend:** `notifications/registerPushToken.ts`, `notifications/unregisterPushToken.ts`, `push/sendToAdmins.ts`, `push/allTokens.ts`.
- **Changed backend:** `schema.ts` (+`pushTokens`), `notifications/shared.ts` (widen ctx + schedule + `titleForType`).
- **New mobile:** `lib/push.ts`, `components/notifications/use-register-push-token.ts`.
- **Changed mobile:** `app.json`, `app/(app)/_layout.tsx`, `package.json` (deps), optionally `settings.tsx`.
