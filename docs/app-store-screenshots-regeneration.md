# App Store Screenshots — Regeneration Plan

## Context

Apple rejected the mobile app's App Store screenshots (in `assets/mobile/`) because they were
**rendered marketing mockups**, not real captures of the app running on iOS. Apple's concrete
instruction:

> Revise the app's screenshots to remove non-iOS status bar images. Revised screenshots should
> accurately reflect the app in use on the supported devices and highlight the app's main
> features in the majority of the screenshots.

The current 6 images (`ios-phone-1..5.png`, `ipad-1.png`) use an illustrated device frame with a
simplified, non-iOS status bar (time + battery only — no genuine iOS bar).

**Goal:** Reproduce the same polished marketing look, but with the device content being a **real
iOS Simulator screenshot** of the actual running app, showing a **genuine iOS status bar**. No
real customer data — the app runs against the DEV Convex deployment seeded with clearly fictional
sample data (reusing the existing marketing names like "Riverside Residence").

**Decisions (confirmed):**
- Keep the marketing-frame style (headline copy above a device frame), real screenshots inside.
- User drives the simulator (signs in + navigates); the rest (build, seed, status bar, capture,
  compositing) is automated.
- Seed fresh fictional data into DEV Convex (prod untouched).

## Key facts

- App: Expo/React Native at `apps/mobile`. Scheme `LuxuriaHomes`, bundle id `au.com.luxuriahomes`,
  workspace `apps/mobile/ios/LuxuriaHomes.xcworkspace`.
- **No demo mode / mock data** — all screens read live Convex (`@workspace/backend/api`).
- DEV Convex = `https://fast-lion-840.convex.cloud` (Clerk `pk_test...`); `apps/mobile/.env.local`
  already targets DEV, so a sim build connects to DEV by default.
- `expo run:ios` fails signing (applesignin entitlement). Known-good sim build = `xcodebuild
  CODE_SIGNING_ALLOWED=NO` + `simctl install` (see memory `project-mobile-ios-local-sim-build`).
- `simctl` has **no tap/type** command and `idb` is not installed → user drives navigation.
- Simulators: iPhone 17 Pro Max (6.9" class); iPad Pro 13-inch (M5) available for the iPad shot.
- No repo tooling generated the old frames → framing is rebuilt here (HTML + Playwright render).
- `sips` available for resizing; ImageMagick is not; Playwright MCP is available for compositing.

## Screens to capture (matching the existing 6-image set)

Reuse the existing headlines/subcopy verbatim (read from the current PNGs):

| # | Screen | Route | Headline |
|---|--------|-------|----------|
| 1 | Dashboard | `(app)/(tabs)/dashboard.tsx` | "Every project, one calm overview" |
| 2 | Projects list | `(app)/(tabs)/projects.tsx` | "Every home you're building, in one place" |
| 3 | Project → Schedule | `(app)/projects/[projectId]/schedule.tsx` | "Track every stage, right to completion" |
| 4 | Project → Inclusions | `(app)/projects/[projectId]/inclusions.tsx` | "Your selections, beautifully organised" |
| 5 | Project → Documents | `(app)/projects/[projectId]/documents.tsx` | "Plans and paperwork, always to hand" |
| 6 | iPad (Projects + detail) | iPad layout | "Manage the whole project from anywhere" |

## Steps

### 1. Write a DEV seed mutation (fictional data)
- Inspect `packages/backend/convex/schema.ts` and existing seeds (`convex/*/seed.ts`) for the exact
  field shapes (projects, projectStages, projectTasks, inclusions/projectInclusions,
  projectDocuments/folders).
- Add `packages/backend/convex/devSeed.ts` as an `internalMutation` (idempotent; guarded so it only
  inserts if the marker projects are absent) that creates:
  - **Projects:** Riverside Residence (14 Riverbank Dr, Brookwater), Hillcrest Estate (6 Summit Ct,
    Springfield), Coastal Haven (22 Marine Pde, Redland Bay), Camp Hill Residence (9 Ridge St, Camp
    Hill), Wavell Heights Home (31 Kimberley St, Wavell Hts).
  - **Riverside detail:** stages (Slab & Footings = Complete, Framing = In Progress, Wall frames,
    Roof trusses, Roofing & Cladding = Pending) with tasks (Frame inspection, Brick delivery,
    Waterproofing sign-off) so the Dashboard "coming up" overview and Schedule populate.
  - **Inclusions (Flooring class):** Engineered Oak — Coastal, Porcelain Tile — Carrara, Wool Loop
    Carpet — Dune, with variant/approval badges.
  - **Documents:** Building Contract.pdf, Floor Plans — Rev C.pdf, Site Progress — Framing.jpg,
    Colour Selections.pdf, Engineering Certificate.pdf.
- Also add a `devSeedTeardown` internalMutation to remove the marker projects afterward.
- Run against DEV: `npx convex run devSeed:run` (from `packages/backend`, DEV deploy selected).
  Prod deployment is never touched.

### 2. Build + install the app on the iOS Simulator
Per the memory workaround, for the iPhone 17 Pro Max sim and an iPad Pro 13" sim:
```
xcodebuild -workspace apps/mobile/ios/LuxuriaHomes.xcworkspace -scheme LuxuriaHomes \
  -configuration Debug -sdk iphonesimulator -destination 'id=<SIM_UDID>' \
  -derivedDataPath apps/mobile/ios/build CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO build
xcrun simctl install <SIM_UDID> apps/mobile/ios/build/Build/Products/Debug-iphonesimulator/LuxuriaHomes.app
```
Start Metro (`npx expo start` in `apps/mobile`), launch `au.com.luxuriahomes`, connect the
dev-launcher to `http://localhost:8081`.

### 3. Clean iOS status bar (the actual Apple fix)
Before each capture, force the Apple-recommended marketing status bar so it is unambiguously iOS:
```
xcrun simctl status_bar <SIM_UDID> override \
  --time "9:41" --wifiBars 3 --cellularBars 4 --batteryState charged --batteryLevel 100
```

### 4. User navigates; capture each screen
- **User** signs into the DEV app (a dev admin Clerk account) and taps to each target screen. The
  Dashboard greeting shows the signed-in user's first name — use a test account named e.g. "Priya"
  to match, otherwise it shows your own name (not customer data).
- On cue, capture raw PNGs: `xcrun simctl io <SIM_UDID> screenshot <n>.png`.
- Repeat all 5 phone screens on the iPhone sim and the 1 split view on the iPad sim.

### 5. Composite into marketing frames
- Build an HTML/CSS template (linen/cream background, serif headline + grey eyebrow + subcopy,
  rounded device frame) mirroring the current design; drop each raw screenshot inside the frame
  **with the real iOS status bar left visible** (do not crop it).
- Render each at the required App Store canvas size using the Playwright MCP browser
  (`browser_navigate` to a local `file://` template, `browser_take_screenshot` at fixed viewport):
  - iPhone 6.9": 1290×2796 (portrait)
  - iPad 13": 2064×2752 (portrait) — or match the existing landscape iPad composition.
- Use `sips` for any final exact-dimension resize.
- Write finals over the existing `assets/mobile/ios-phone-1..5.png` and `assets/mobile/ipad-1.png`
  (or `-v2` names to keep the originals for comparison).

### 6. Cleanup
- Run `devSeedTeardown` to remove fictional projects from DEV.
- Clear the status bar override: `xcrun simctl status_bar <SIM_UDID> clear`.

## Verification
- Open each final PNG and confirm: genuine iOS status bar (9:41, wifi/cellular/battery), real app UI
  inside the frame, correct App Store pixel dimensions, no real customer data, headline/subcopy
  match the intended messaging.
- Cross-check dimensions with `sips -g pixelWidth -g pixelHeight <file>` against App Store Connect
  requirements (6.9" iPhone + 13" iPad).
- These replace the rejected uploads; re-submit via App Store Connect (and optionally reply to App
  Review noting the screenshots now show genuine iOS captures of the app in use).

## Notes / risks
- Framing is rebuilt from scratch (no source existed); the recreated template will visually
  approximate — not pixel-match — the originals. Fonts/spacing will be tuned to look consistent.
- Alternative to local xcodebuild: capture on a physical device via a dev build. The simulator path
  is fully local and matches the confirmed decisions.
