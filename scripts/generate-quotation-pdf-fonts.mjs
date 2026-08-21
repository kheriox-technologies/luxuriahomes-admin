#!/usr/bin/env node
/**
 * Vendors the quotation PDF's binary assets into the Convex backend as base64
 * TypeScript modules.
 *
 * A `'use node'` Convex action has no filesystem and no origin to fetch from,
 * so the typefaces and the cover logo have to be bundled with the code — the
 * same approach `projectInclusions/pdf/logo.ts` already takes. The portal keeps
 * serving the originals from `public/` for its own on-screen previews; this
 * script is how the two stay in step.
 *
 * Run from the repo root after changing any source asset:
 *
 *   node scripts/generate-quotation-pdf-fonts.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const FONT_SRC = 'apps/portal/public/fonts';
const OUT = 'packages/backend/convex/clientQuotations/pdf';

// Convex module paths allow only alphanumerics, underscores and periods, so
// these are camelCase rather than the kebab-case the rest of the repo uses.
const FONTS = [
	['Inter-Regular.ttf', 'interRegular.ts', 'INTER_REGULAR_BASE64'],
	['Inter-SemiBold.ttf', 'interSemiBold.ts', 'INTER_SEMIBOLD_BASE64'],
	[
		'GreatVibes-Regular.ttf',
		'greatVibesRegular.ts',
		'GREAT_VIBES_REGULAR_BASE64',
	],
	[
		'DancingScript-Regular.ttf',
		'dancingScriptRegular.ts',
		'DANCING_SCRIPT_REGULAR_BASE64',
	],
	['Caveat-Regular.ttf', 'caveatRegular.ts', 'CAVEAT_REGULAR_BASE64'],
];

for (const [ttf, tsName, constName] of FONTS) {
	const base64 = fs.readFileSync(path.join(FONT_SRC, ttf)).toString('base64');
	const header = [
		`// Auto-generated from ${FONT_SRC}/${ttf} (SIL Open Font License; the licence`,
		'// text ships alongside the source file). Embedded as base64 so the sandboxed',
		'// Convex node action can register the face without a filesystem or network',
		'// fetch. Regenerate with scripts/generate-quotation-pdf-fonts.mjs.',
		`export const ${constName} =`,
	].join('\n');
	fs.writeFileSync(
		path.join(OUT, 'fonts', tsName),
		`${header}\n\t'${base64}';\n`
	);
	console.log(`fonts/${tsName}`, `${(base64.length / 1024).toFixed(0)}KB`);
}

const LOGO_SRC = 'apps/portal/public/lh-quotation-logo-linen.png';
const logoBase64 = fs.readFileSync(LOGO_SRC).toString('base64');
const logoHeader = [
	`// Auto-generated from ${LOGO_SRC}.`,
	'// The portal wordmark recoloured to brand linen (#f5ebe0) for the quotation ink',
	'// cover and header band. Embedded as a data URL so the sandboxed Convex node',
	'// action needs no filesystem or CDN fetch. pdfkit takes PNG/JPEG only, which is',
	'// why this is not the SVG. Regenerate with',
	'// scripts/generate-quotation-pdf-fonts.mjs.',
	'export const QUOTATION_LOGO_DATA_URL =',
].join('\n');
fs.writeFileSync(
	path.join(OUT, 'logo.ts'),
	`${logoHeader}\n\t'data:image/png;base64,${logoBase64}';\n`
);
console.log('logo.ts', `${(logoBase64.length / 1024).toFixed(0)}KB`);
