# Sponsor banners

Marketing banners to hand to sponsors for display on their screens. Sixteen
export-ready PNGs in `out/`, generated from editable HTML templates so the copy
can be revised and the set re-rendered at any time.

## What's in the set

Four designs × two brand palettes × two ratios:

| Design | What it says |
| --- | --- |
| `hero` | The dusk facade, the wordmark and *Designing dreams, building lifestyles* |
| `services` | The four offerings — house & land, knock-down rebuild, duplex, town houses |
| `portfolio` | Recently completed homes — a Camp Hill photo mosaic with the specs |
| `contact` | *Start building with us* — the full contact block, set large |

| Palette | Use it when |
| --- | --- |
| `navy` | Deep navy `#15283A` with pale gold — the luxuriahomes.com.au marketing world. Best on screens in dim or mixed light. |
| `linen` | Linen `#f5ebe0` with ink — the app/product world (`docs/brand-palette.md`). Best in bright showrooms. |

Ratios are `16x9` (1920×1080) and `9x16` (1080×1920). Files are named
`luxuria-<design>-<palette>-<ratio>.png`.

Every banner carries the phone numbers, email, website, QBCC licence and street
address.

## Re-rendering

```bash
cd marketing/banners

node fetch-assets.mjs     # download the project photography (first run only)
node render.mjs           # render all 16 → out/
```

Filters, for when you only want to re-check one thing:

```bash
node render.mjs --design=hero
node render.mjs --palette=navy --ratio=9x16
node render.mjs --design=contact --keep-html   # leaves .tmp/*.html to inspect
```

Rendering uses headless Google Chrome at 2× device scale, then downsamples with
sharp to the exact pixel size — that is what keeps the Cinzel serif and the 1px
rules crisp. Both are already available; nothing needs installing.

## Editing

- **Copy, colours, contact details, project specs, photo choices** — all live in
  [`brand.mjs`](brand.mjs). This is the only file to touch for a wording or
  detail change.
- **Layout** — one file per design in `templates/`, plus `templates/layout.mjs`
  for the shared shell (fonts, wordmark, contact strip, photo scrim).
- Fonts (Cinzel + Inter) are pulled from Google Fonts at render time, matching
  `apps/web/app/layout.tsx`, so rendering needs a network connection.

## Where the content comes from

Everything is transcribed from the live app so the banners cannot drift:

| | Source |
| --- | --- |
| Palettes | `apps/web/app/site.css`, `docs/brand-palette.md` |
| Copy | `apps/web/lib/site.ts`, `apps/web/app/layout.tsx` metadata |
| Contact | `apps/web/.env.prod` |
| Wordmark | `apps/web/public/logo.svg`, recoloured by CSS mask as `packages/ui` does |
| Photography | Convex `websiteProjects` → the public static bucket |

`fetch-assets.mjs` queries Convex for completed website projects and downloads
every image to `assets/photos/` (gitignored — re-run the script to restore them).
It uses the deployment configured in `packages/backend/.env.local` and the CDN in
`apps/web/.env.local`; on the dev deployment that is `static-dev.luxuriahomes.com.au`,
which serves these images unsigned. The specific frames the banners use are
pinned by filename in `brand.mjs` under `PHOTOS`, and the script fails loudly if
any of them go missing.

Only one completed project exists today (Camp Hill, 2026), so the portfolio
banner is a single-project mosaic. When more completed projects are published,
re-run `fetch-assets.mjs`, pick new frames in `PHOTOS`, and re-render.
