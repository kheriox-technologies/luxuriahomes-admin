# Mobile App — Local Build & Store Submission (`apps/mobile`)

How to build the Luxuria Homes mobile app **locally on your Mac** (`eas build --local`)
and submit it to both the **App Store** and **Google Play**.

- Build compute: **your machine** (`eas build --local`) — no EAS cloud subscription, no
  build credits consumed
- Signing credentials: **local** (`credentials.json` + `credentialsSource: "local"`) — the
  cert/keystore files in `credentials/` are used directly during the local build
- Production env: **`eas.json` → `build.production.env`** (the `EXPO_PUBLIC_*` vars) — Metro
  inlines these during the local build
- Sole developer — you own the certs, keystore, and store API keys

> **Why local, not EAS cloud?** EAS cloud builds now require a paid subscription. Local
> builds run for free on your Mac and reuse the exact same `eas.json` profile and
> `credentials.json`, so the produced binaries are identical in configuration. The
> submit step (`eas submit`) is free and still used to upload.

> **Toolchain must be released, not beta.** Apple rejects binaries built with a beta
> Xcode. This machine currently has a **released Xcode 26.6**, so local iOS builds are
> App-Store-acceptable. If you ever move to a beta macOS/Xcode, build on EAS cloud (or a
> machine with a released toolchain) for iOS releases instead.

> The app uses **CNG** (`ios/` and `android/` are gitignored). `eas build --local` runs
> `expo prebuild` before compiling, so native folders are never committed.

---

## App identifiers (already set in `app.json`)

| Field | Value |
|---|---|
| App name | `Luxuria Homes` |
| Slug | `luxuria-homes` |
| iOS `bundleIdentifier` | `au.com.luxuriahomes` |
| Android `package` | `au.com.luxuriahomes` |

Use these exact IDs when you register the app in App Store Connect and Google Play.

---

## Prerequisites

Local builds compile on your machine, so the full native toolchain must be installed:

- **eas-cli** (installed globally: `eas --version`). Update with `npm i -g eas-cli` if needed.
- A **free Expo account** (`eas login`) — the project is linked via `extra.eas.projectId`
  in `app.json` (owner `pdomala-kheriox`). Local builds don't consume cloud credits.
- **iOS** (macOS only):
  - **Released Xcode** + Command Line Tools (`xcodebuild -version`).
  - **CocoaPods** (`pod --version`).
  - **fastlane** — EAS uses it under the hood for local iOS builds
    (`brew install fastlane`, or `gem install fastlane`).
- **Android**:
  - **JDK 17** (`java -version`).
  - **Android SDK** (via Android Studio) with `ANDROID_HOME` / `ANDROID_SDK_ROOT` set.
- Local signing files present in `apps/mobile/credentials/` (see §3).

> iOS builds require macOS. Android builds run on macOS/Linux/Windows.

---

## 1. One-time: link the project

Already done — `app.json` has `extra.eas.projectId`. If starting fresh:

```bash
cd apps/mobile
eas login
eas init            # writes extra.eas.projectId into app.json — commit it
```

---

## 2. `eas.json`

`apps/mobile/eas.json` is already configured. The same `production` profile drives local
builds — `--local` only changes *where* the build runs. Key lines:

- `"credentialsSource": "local"` — sign with the local `credentials.json` files (§3).
- `build.production.env` — the `EXPO_PUBLIC_*` vars, inlined by Metro during the build.
- `appVersionSource: "local"` — version/build numbers come from `app.json` (bumped by the
  build script — see §6).
- Android `buildType: "app-bundle"` → produces a Play-ready `.aab`.

```json
{
  "cli": { "version": ">= 18.11.0", "appVersionSource": "local" },
  "build": {
    "production": {
      "distribution": "store",
      "credentialsSource": "local",
      "env": {
        "EXPO_PUBLIC_CONVEX_URL": "https://aromatic-eel-830.convex.cloud",
        "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY": "pk_live_..."
      },
      "ios": { "buildConfiguration": "Release" },
      "android": { "buildType": "app-bundle" }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "prasad.domala@kheriox.tech",
        "ascAppId": "6788592456",
        "appleTeamId": "L22SNF82T2"
      },
      "android": {
        "serviceAccountKeyPath": "./credentials/play-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

---

## 3. Local signing credentials (`credentials.json`)

`apps/mobile/credentials.json` references the cert/keystore files in `apps/mobile/credentials/`.
**Do not commit** `credentials.json` or `credentials/` (both gitignored — see §9). The local
build reads these directly to sign the binary.

```json
{
  "ios": {
    "provisioningProfilePath": "credentials/luxuria_appstore.mobileprovision",
    "distributionCertificate": {
      "path": "credentials/dist-cert.p12",
      "password": "<p12 password>"
    }
  },
  "android": {
    "keystore": {
      "keystorePath": "credentials/luxuria-upload.keystore",
      "keystorePassword": "<keystore password>",
      "keyAlias": "luxuria-upload",
      "keyPassword": "<key password>"
    }
  }
}
```

### 3a. Android keystore (one command)

```bash
cd apps/mobile
mkdir -p credentials
keytool -genkeypair -v \
  -keystore credentials/luxuria-upload.keystore \
  -alias luxuria-upload \
  -keyalg RSA -keysize 2048 -validity 10000
```

**Back this keystore up** — losing it means you can't ship updates (unless enrolled in Play
App Signing; see §7b).

### 3b. iOS certificate + provisioning profile

You need an **Apple Distribution** certificate (`.p12`) and an **App Store** provisioning
profile for `au.com.luxuriahomes`:

- **Easiest** — let EAS generate them, then export to local files:
  ```bash
  eas credentials -p ios        # Build Credentials → set up / download
  ```
  Save as `credentials/dist-cert.p12` and `credentials/luxuria_appstore.mobileprovision`.
- **Manual** — create/download an Apple Distribution cert (export `.p12` from Keychain),
  register App ID `au.com.luxuriahomes`, create an App Store provisioning profile, download
  the `.mobileprovision`. Drop both into `apps/mobile/credentials/`.

---

## 4. Production env vars

Local builds read `EXPO_PUBLIC_*` from `eas.json` → `build.production.env` (§2). There is **no**
`.env.prod` step — the `build:*` scripts do not export a shell env file.

> If you add/rotate an `EXPO_PUBLIC_*` var, update it in `eas.json`, not a local dotenv file.

---

## 5. Build locally

Run from `apps/mobile`. Each build first bumps the platform build number in `app.json`
(via `scripts/build.mjs`), then compiles on this machine and writes the artifact to
`apps/mobile/build/luxuria-<platform>.<ext>` (`.ipa` for iOS, `.aab` for Android).

```bash
cd apps/mobile
pnpm build:ios       # → eas build --profile production --platform ios     --local --output build/luxuria-ios.ipa
pnpm build:android   # → eas build --profile production --platform android --local --output build/luxuria-android.aab
```

Equivalent raw commands:

```bash
eas build --profile production --platform ios     --local --output build/luxuria-ios.ipa
eas build --profile production --platform android --local --output build/luxuria-android.aab
```

> The **first** build is slow — it runs `expo prebuild` and downloads CocoaPods (iOS) /
> Gradle dependencies (Android). Later builds are faster. iOS builds require macOS with a
> released Xcode (§Prerequisites).

---

## 6. Version / build number

`appVersionSource: "local"` means version data comes from `app.json`. The `build:*` scripts
**auto-increment the platform build number** before each build:

- `expo.ios.buildNumber` (string) — bumped for every iOS build.
- `expo.android.versionCode` (integer) — bumped for every Android build.

The user-facing `expo.version` (e.g. `1.0.1`) is still edited **manually** in `app.json` when
you cut a new marketing version. Commit the bumped `app.json` after a release build.

---

## 7. First-time store registration

### 7a. App Store Connect (iOS)

1. https://appstoreconnect.apple.com → **My Apps → +** → New App.
2. Platform iOS, bundle ID `au.com.luxuriahomes`, pick a name + primary language.
3. Copy the app's **Apple ID** (numeric) into `eas.json` → `submit.production.ios.ascAppId`.
4. Find your **Team ID** (Apple Developer → Membership) → `submit.production.ios.appleTeamId`.
5. For automated submit, create an **App Store Connect API key** (Users and Access →
   Integrations → App Store Connect API, Admin/App Manager role). Download the `.p8` **once**;
   note the Key ID + Issuer ID.

### 7b. Google Play Console (Android)

1. https://play.google.com/console → **Create app**. The package `au.com.luxuriahomes` is
   registered implicitly from your first `.aab` upload.
2. **Play App Signing** is mandatory and automatic for new apps. Keep the default
   **"Use a Google-generated key"** so `luxuria-upload.keystore` becomes the *upload* key.
3. **Service account for API uploads:**
   1. In **Google Cloud Console** → **IAM & Admin → Service Accounts → Create service account**,
      then **Keys → Add key → JSON**. Save to `apps/mobile/credentials/play-service-account.json`.
   2. In **Play Console** (account level) → **Users and permissions → Invite new users**. Add
      the service account email with release permissions.
4. **Manual first upload:** Google requires the very first `.aab` to be uploaded by hand
   (create an Internal testing release) before `eas submit` works. Do this once, then automate.

---

## 8. Submit to the stores

Submit uploads the **local artifact** produced in §5 (`--path`). Run the build first, then:

```bash
cd apps/mobile
pnpm submit:ios      # → eas submit --profile production --platform ios     --path build/luxuria-ios.ipa
pnpm submit:android  # → eas submit --profile production --platform android --path build/luxuria-android.aab
```

Equivalent raw commands:

```bash
eas submit --profile production --platform ios     --path build/luxuria-ios.ipa
eas submit --profile production --platform android --path build/luxuria-android.aab
```

- If the artifact is missing, the script errors with
  `No artifact at build/luxuria-<platform>.<ext> — run \`pnpm build:<platform>\` first`.
- **EAS Submit is free** (only cloud *builds* require a subscription).
- iOS submit uses the App Store Connect API key (`.p8`, Key ID, Issuer ID); it'll prompt
  unless configured. After upload, the build appears in TestFlight, then submit for review
  from App Store Connect.
- Android submit pushes to the `internal` track. Promote to `production` from the Play Console.

---

## 9. `.gitignore`

`apps/mobile/.gitignore` keeps secrets and build output out of git:

```
credentials.json
credentials/
build/
ios/
android/
```

`eas.json` **should** be committed; `credentials.json`, the `credentials/` folder, and the
local `.ipa`/`.aab` under `build/` **must not**.

---

## Things to keep safe (sole developer)

- `credentials/luxuria-upload.keystore` + its passwords (Android upload key).
- iOS distribution `.p12` + password and the App Store Connect API `.p8` key.
- `play-service-account.json` (Google Play API access).

Store these in a password manager / secure backup. Losing them ranges from annoying
(regenerate iOS certs) to blocking (lost keystore without Play App Signing).
