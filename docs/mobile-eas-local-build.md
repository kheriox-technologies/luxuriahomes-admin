# Mobile App — Local EAS Build & Store Submission (`apps/mobile`)

How to build the Luxuria Homes mobile app **entirely on your Mac** (no EAS cloud build,
no EAS-hosted credentials) and submit it to both the **App Store** and **Google Play**.

- Build compute: local (`eas build --local`)
- Signing credentials: local (`credentials.json` + `credentialsSource: "local"`)
- Production env: your `apps/mobile/.env.prod` (`EXPO_PUBLIC_*` vars, exported into the shell before each build)
- Sole developer — you own the certs, keystore, and store API keys

> The app uses **CNG** (`ios/` and `android/` are gitignored). `eas build --local` runs
> `expo prebuild` inside a temporary copy, so you never commit native folders.

---

## App identifiers (already set in `app.json`)

| Field | Value |
|---|---|
| App name | `Luxuria Homes` |
| Slug | `luxuria-homes` |
| iOS `bundleIdentifier` | `au.com.luxuriahomes` |
| Android `package` | `au.com.luxuriahomes` |

Use these exact IDs when you register the app in App Store Connect and Google Play Console.

---

## Prerequisites

- **eas-cli** (already installed globally: `eas --version` → 18.11.0). Update with `npm i -g eas-cli` if needed.
- A **free Expo account** (`eas login`). This is only used to link the project + read its config; it does **not** run cloud builds and does **not** store your credentials in this setup.
- **iOS**: Xcode + Command Line Tools, CocoaPods (`brew install cocoapods`), and **fastlane** (`brew install fastlane`) — the local iOS build invokes fastlane.
- **Android**: Android Studio SDK + **JDK 17** (`brew install openjdk@17`), with `ANDROID_HOME`/`JAVA_HOME` on your `PATH`.
- Paid **Apple Developer Program** membership (organization) and a **Google Play Console** account (see `docs/` app-store notes / prior setup).

---

## 1. One-time: link the project (no cloud build)

```bash
cd apps/mobile
eas login
eas init            # adds extra.eas.projectId to app.json — registration only, not a build
```

`eas init` writes an `extra.eas.projectId` into `app.json`. Commit that change.

---

## 2. One-time: create `eas.json`

Create `apps/mobile/eas.json`. The key line is `"credentialsSource": "local"` — it forces
EAS to sign with your local `credentials.json` instead of pulling from the EAS servers.

```json
{
  "cli": {
    "version": ">= 18.11.0",
    "appVersionSource": "local"
  },
  "build": {
    "production": {
      "distribution": "store",
      "credentialsSource": "local",
      "ios": {
        "buildConfiguration": "Release"
      },
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "prasad.domala@kheriox.tech",
        "ascAppId": "<App Store Connect app ID — numeric, fill after step 5a>",
        "appleTeamId": "<your 10-char Apple Team ID>"
      },
      "android": {
        "serviceAccountKeyPath": "./credentials/play-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

- `appVersionSource: "local"` → version/build numbers come from `app.json` (you bump them manually — see step 6). No reliance on EAS-hosted version tracking.
- Android `buildType: "app-bundle"` → produces a Play-ready `.aab`. Use `"apk"` only for sideloading test builds.

---

## 3. One-time: local signing credentials (`credentials.json`)

Create `apps/mobile/credentials.json`. **Do not commit it** (add to `.gitignore` — see step 8).

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

### 3a. Android keystore (fully local, one command)

```bash
cd apps/mobile
mkdir -p credentials
keytool -genkeypair -v \
  -keystore credentials/luxuria-upload.keystore \
  -alias luxuria-upload \
  -keyalg RSA -keysize 2048 -validity 10000
```

Answer the prompts and remember the passwords → put them in `credentials.json`.
**Back this keystore up somewhere safe** — losing it means you can't ship updates
(unless you enrol in Play App Signing, which is recommended; see step 7b).

### 3b. iOS certificate + provisioning profile

You need an **Apple Distribution certificate** (`.p12`) and an **App Store provisioning profile**
for `au.com.luxuriahomes`. Two ways:

- **Easiest** — let EAS generate them once, then export to local files:
  ```bash
  eas credentials -p ios        # choose: Build Credentials → set up / download
  ```
  Save the certificate as `credentials/dist-cert.p12` and the profile as
  `credentials/luxuria_appstore.mobileprovision`.

- **Fully manual** (Apple Developer portal → Certificates, Identifiers & Profiles):
  1. Create/download an **Apple Distribution** certificate; export it from Keychain as `.p12`.
  2. Register the App ID `au.com.luxuriahomes` if not already.
  3. Create an **App Store** provisioning profile bound to that App ID + certificate; download the `.mobileprovision`.

Drop both files into `apps/mobile/credentials/` matching the paths in `credentials.json`.

---

## 4. Production env vars from `.env.prod`

`.env.prod` holds the production values:

```
EXPO_PUBLIC_CONVEX_URL=https://aromatic-eel-830.convex.cloud
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
```

> Expo only auto-loads `.env.production` (matched to `NODE_ENV`), **not** `.env.prod`.
> Because these are `EXPO_PUBLIC_*` vars, the reliable way to use *your* `.env.prod` is to
> **export it into the shell** before the build — Metro then inlines them from `process.env`.

The build commands in step 5 do exactly this via `set -a; . ./.env.prod; set +a`.

---

## 5. Build locally

Run from `apps/mobile`. Each command loads `.env.prod`, then builds on your machine and
writes the artifact to `./build/`.

### iOS (`.ipa`)

```bash
cd apps/mobile
set -a; . ./.env.prod; set +a
eas build --local --profile production --platform ios \
  --output ./build/luxuria-ios.ipa
```

### Android (`.aab`)

```bash
cd apps/mobile
set -a; . ./.env.prod; set +a
eas build --local --profile production --platform android \
  --output ./build/luxuria-android.aab
```

First iOS build is slow (CocoaPods + native compile). If it fails on signing, re-check the
`.p12`/profile paths and that the profile targets `au.com.luxuriahomes`.

---

## 6. Bump version / build number before each release

With `appVersionSource: "local"`, edit `app.json` before building:

- `expo.version` — the user-facing version (e.g. `1.0.1`), shared by both stores.
- Add `expo.ios.buildNumber` (string, e.g. `"2"`) — must increase for every App Store upload.
- Add `expo.android.versionCode` (integer, e.g. `2`) — must increase for every Play upload.

```jsonc
"ios":     { "bundleIdentifier": "au.com.luxuriahomes", "buildNumber": "2", "supportsTablet": true },
"android": { "package": "au.com.luxuriahomes", "versionCode": 2, "adaptiveIcon": { ... } }
```

---

## 7. First-time store registration

### 7a. App Store Connect (iOS)

1. https://appstoreconnect.apple.com → **My Apps → +** → New App.
2. Platform iOS, bundle ID `au.com.luxuriahomes`, pick a name + primary language.
3. Copy the app's **Apple ID** (numeric) into `eas.json` → `submit.production.ios.ascAppId`.
4. Find your **Team ID** (Apple Developer → Membership) → `submit.production.ios.appleTeamId`.
5. For automated submit, create an **App Store Connect API key** (Users and Access → Integrations → App Store Connect API, Admin/App Manager role). Download the `.p8` **once**; note the Key ID + Issuer ID.

### 7b. Google Play Console (Android)

> The Play Console UI moved a lot of this. Play App Signing is now automatic (no toggle at
> app-creation time), and the old *Setup → API access* service-account flow has been replaced
> by a Google Cloud Console + *Users and permissions* two-step. Steps below reflect the current UI.

1. https://play.google.com/console → **Create app**. You don't type the package here — `au.com.luxuriahomes` is registered implicitly from your first `.aab` upload.
2. **Play App Signing — nothing to enable.** It's mandatory and automatic for all new apps. The signing key is configured when you create your **first release** (step 4): keep the default **"Use a Google-generated key"** so your `luxuria-upload.keystore` becomes the *upload* key and Google holds the final signing key. This is why the keystore backup matters but is recoverable. To view/manage it later: **Protected with Play → Play Store distribution → Play app signing** (this page replaced the old "App integrity" page).
3. **Service account for API uploads (two steps now):**
   1. In **Google Cloud Console** (the Cloud project linked to your Play account) → **IAM & Admin → Service Accounts → Create service account**. Then open it → **Keys → Add key → Create new key → JSON**. Save the downloaded file to `apps/mobile/credentials/play-service-account.json` (path already referenced in `eas.json`). If no Cloud project is linked yet, link one first from the account-level **Setup → API access** page.
   2. In **Play Console**, at the **account level** (the all-apps view, *not* inside the app) → **Users and permissions → Invite new users**. Enter the service account's email address and grant it release permissions (e.g. *Releases → Release to testing tracks*; add production management if you'll promote via API).
4. **Manual first upload:** Google requires the very first `.aab` to be uploaded by hand in the Console (create an Internal testing release) before `eas submit` will work. This first release is also where the Play App Signing key from step 2 gets locked in. Do this once, then automate.

---

## 8. Submit to the stores

```bash
cd apps/mobile

# iOS → App Store Connect (TestFlight/review)
eas submit --profile production --platform ios \
  --path ./build/luxuria-ios.ipa

# Android → Google Play (internal track by default; change in eas.json)
eas submit --profile production --platform android \
  --path ./build/luxuria-android.aab
```

- iOS submit will prompt for the App Store Connect API key (`.p8`, Key ID, Issuer ID) unless you add them to the submit profile / env. After upload, the build appears in TestFlight, then submit for review from App Store Connect.
- Android submit pushes to the `internal` track. Promote to `production` from the Play Console when ready.

---

## 9. Update `.gitignore`

Never commit secrets or artifacts. Add to `apps/mobile/.gitignore`:

```
# Local EAS credentials & build output
credentials.json
credentials/
build/
```

`eas.json` **should** be committed; `credentials.json`, the `credentials/` folder, and `build/` **must not**.

---

## Quick reference

Convenience scripts are wired into `apps/mobile/package.json` (the build ones already load
`.env.prod` for you):

```bash
# from apps/mobile
pnpm build:ios       # eas build --local ... ios  → ./build/luxuria-ios.ipa
pnpm build:android   # eas build --local ... android → ./build/luxuria-android.aab
pnpm submit:ios      # eas submit ... ios
pnpm submit:android  # eas submit ... android
```

Equivalent raw commands:

```bash
# from apps/mobile
set -a; . ./.env.prod; set +a

# build
eas build --local --profile production --platform ios     --output ./build/luxuria-ios.ipa
eas build --local --profile production --platform android --output ./build/luxuria-android.aab

# submit
eas submit --profile production --platform ios     --path ./build/luxuria-ios.ipa
eas submit --profile production --platform android --path ./build/luxuria-android.aab
```

## Things to keep safe (sole developer)

- `credentials/luxuria-upload.keystore` + its passwords (Android upload key).
- iOS distribution `.p12` + password and the App Store Connect API `.p8` key.
- `play-service-account.json` (Google Play API access).

Store these in a password manager / secure backup. Losing them ranges from annoying
(regenerate iOS certs) to blocking (lost keystore without Play App Signing).
