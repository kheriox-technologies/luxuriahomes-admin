# App Store screenshot tooling

Reproducible pipeline for the App Store screenshots in `assets/mobile/`
(`ios-phone-1..5.png`, `ipad-1.png`).

These are **real iOS Simulator captures** of the running app wrapped in a marketing
frame — not rendered mockups. This is the fix for Apple's rejection ("Revise the
app's screenshots to remove non-iOS status bar images … accurately reflect the app
in use on the supported devices"). See `docs/app-store-screenshots-regeneration.md`.

## Contents

- `generate.mjs` — builds one self-contained marketing-frame HTML per screenshot
  into `out/` (created automatically). Headlines/eyebrows/subcopy live at the top
  of this file. Canvas + capture sizes are constants near the top.
- `overlay-inclusions.html` — composites material swatches (procedural SVG
  textures: oak / Carrara marble / wool carpet) onto the Inclusions thumbnails,
  which are empty because the seed has no uploaded images. Reads
  `raw/ios-phone-4-blank.png`, outputs the composited `raw/ios-phone-4.png`.
- `placeholder.html` / `placeholder-ipad.html` — layout test fixtures only (used to
  tune the frame before real captures existed). Not part of the final output.
- `raw/` — the real simulator captures fed into the frames. `ios-phone-4-blank.png`
  is the pre-swatch Inclusions capture.

## Canvas sizes (App Store)

- iPhone 6.9" (iPhone 17 Pro Max): **1320 × 2868**
- iPad 13" (iPad Pro 13"): **2064 × 2752** (device captured landscape at 2752 × 2064)

## How to regenerate

Prereqs: the app running on an **iPhone 17 Pro Max** and **iPad Pro 13"** simulator
against the DEV Convex deployment, seeded with `packages/backend/convex/devSeed.ts`
(`npx convex run devSeed:run` from `packages/backend`, DEV deployment selected).

1. **Seed DEV** (fictional data only): `npx convex run devSeed:run`.
2. **Clean iOS status bar** on each simulator UDID:
   ```
   xcrun simctl status_bar <UDID> override --time "9:41" \
     --wifiBars 3 --cellularBars 4 --batteryState charged --batteryLevel 100
   ```
   Also hide the Expo dev-client floating menu button (dev menu → hide button).
3. **Capture** each screen (user signs in + navigates):
   ```
   xcrun simctl io <UDID> screenshot raw/ios-phone-1.png   # Dashboard
   # ...projects / schedule / inclusions / documents / ipad
   ```
4. **Swatch overlay** for Inclusions: back up the raw as `raw/ios-phone-4-blank.png`,
   serve this folder (`python3 -m http.server 8099`), open `overlay-inclusions.html`
   in a 1320×2868 viewport, screenshot it back over `raw/ios-phone-4.png`. Nudge the
   `--tx/--ty1..3/--ts` CSS vars if card positions shift.
5. **Build frames**: `node generate.mjs`.
6. **Render finals** with a browser at each canvas size and `scale: css` (so output
   pixels equal CSS pixels), then write over `assets/mobile/*.png`. Playwright's
   `file://` is blocked — serve over HTTP.
7. **Cleanup**: `npx convex run devSeed:teardown` and
   `xcrun simctl status_bar <UDID> clear`.

## Notes

- All dates in `devSeed.ts` are relative to run time, so the Dashboard's rolling
  window always shows the intended overdue + upcoming tasks whenever re-seeded.
- The real app UI (KPI bars, richer cards, single-pane iPad) differs from the older
  rendered mockups — that is expected and is the point of the Apple fix.
