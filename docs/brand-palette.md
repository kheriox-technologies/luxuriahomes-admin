# Brand Palette — Linen

The active brand palette across the web site, admin portal, and mobile app is **Linen** — a warm,
light palette anchored on a single input color (`#f5ebe0`). It is a **light** palette: primary
surfaces are light linen, and text / marks on them use the dark **ink** tone.

Use these exact values when designing app icons, splash screens, or marketing assets.

## Core palette

| Role | Hex | RGB | Notes |
| --- | --- | --- | --- |
| Primary (linen) | `#f5ebe0` | `245, 235, 224` | Main brand fill / background |
| Primary-foreground (ink) | `#2b2927` | `43, 41, 39` | Text / marks on linen |
| Primary-soft | `#bcb4ac` | `188, 180, 172` | Subtle press / hover darken of linen |
| Accent (dark) | `#514e4a` | `81, 78, 74` | Emphasis on light surfaces |
| Surface | `#fefcfa` | `254, 252, 250` | Lightest tint (cards / raised areas) |

## Semantic colors (shared, unchanged across apps)

| Role | Hex | RGB |
| --- | --- | --- |
| Success | `#10b981` | `16, 185, 129` |
| Warning | `#f59e0b` | `245, 158, 11` |
| Info | `#3b82f6` | `59, 130, 246` |
| Destructive (light) | `#df2225` | `223, 34, 37` |
| Destructive (dark) | `#ff6467` | `255, 100, 103` |

## App icon guidance

- **Light icon:** linen `#f5ebe0` background/fill with the mark in ink `#2b2927`.
- **Dark icon:** invert — ink `#2b2927` background with the mark in linen `#f5ebe0`.
- Keep the mark to the two core tones (linen + ink); reserve `#514e4a` accent only for small details.

## Provenance

Linen is derived from the anchor color `#f5ebe0` via CSS `color-mix()` in
`apps/web/lib/palettes.ts` (the dev-only palette system). The hex values above are those mixes
pre-computed, and are baked into:

- Portal / shared UI: `packages/ui/src/styles/globals.css` (`--app-primary`, `--sidebar-*`)
- Mobile: `apps/mobile/global.css`, `apps/mobile/tailwind.config.js`, `apps/mobile/lib/theme.ts`
- Auth + email: `NEXT_PUBLIC_APP_PRIMARY_COLOR` / `..._FOREGROUND_COLOR` env vars and
  `packages/backend/convex/email/template.ts` defaults
