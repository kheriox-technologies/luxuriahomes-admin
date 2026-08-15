# Luxuria Homes — Release Notes

App Store "What's New" copy, newest first. When submitting a version on
App Store Connect, paste the bullet list from that version's section into the
**"What's New in This Version"** box.

**How to use this file:**

- **One section per App Store version** (`1.0.1`, `1.0.2`, …), _not_ per build. Multiple
  EAS builds can go under one version — keep adding bullets to the current version's
  section as you make new builds toward it.
- **Status** moves `In development` → `In review` → `Published` as the version progresses
  through App Store Connect. Update it by hand.
- Keep bullets **user-facing** (what a customer sees in the store), not commit messages.
  Short and plain. These are the only part you write by hand each build.

**What's automated (scripts in `scripts/`):**

- `pnpm version:set 1.0.2` bumps `expo.version` in `app.json` **and** inserts a fresh
  `## 1.0.2 — In development` stub at the top of this file for you to fill in.
- `pnpm build:ios` / `pnpm build:android` auto-bump the build number in `app.json` and
  rewrite the `_iOS build N · Android versionCode M_` line of the top section to match —
  so the build line always reflects the latest build.
- Each build also drops the commit subjects since the previous build into the current
  section as a commented-out `<!-- draft: … -->` block (chore/version/lint/merge commits
  filtered out). **Rewrite the useful ones into the bullets above and delete the block** —
  the comment never renders and can't be pasted to App Store by accident.
- After a successful build, the script formats and **commits** the bump (only `app.json`
  and this file) so the repo is clean before you `pnpm submit:*`.

---

## 1.0.1 — In review

_iOS build 26 · Android versionCode 7_

- Add a location picker when composing letters
- Bug fixes and performance improvements

<!-- draft: commit subjects since the last build — rewrite the useful ones into bullets above, then delete this block:
  • Fix keyboard covering text fields on mobile
  • Draft release notes from commit messages on each mobile build
  • Add root aliases for mobile build and submit scripts
  • Move mobile private filter to an icon toggle beside add
  • Add private tasks visible only to their owner
  • Add a default contingency percentage per budget template
  • Add per-trade contingency percentage to budgets
  • Add contact-bold, facade and signboard sponsor banners
  • Add sponsor marketing banners in 16:9 and 9:16
  • Truncate long date-field labels instead of overflowing the pill
  • Keep select chevron inside the pill on narrow rows
-->

---

## 1.0.0 — Published

_Initial release_

- Initial release of Luxuria Homes
