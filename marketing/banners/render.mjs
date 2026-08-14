/**
 * Renders every banner to PNG.
 *
 * Each template is written to a temp HTML file, captured by headless Chrome at
 * 2x device scale, then downsampled by sharp to the exact target size — that
 * two-step is what keeps the Cinzel serif and the 1px rules crisp.
 *
 *   node render.mjs                                   # all 16
 *   node render.mjs --design=hero --palette=navy      # filter
 *   node render.mjs --ratio=9x16 --keep-html          # keep temp HTML to debug
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { PALETTES, RATIOS } from './brand.mjs';
import { contact } from './templates/contact.mjs';
import { contactBold, contactBoldFacade } from './templates/contact-bold.mjs';
import { hero } from './templates/hero.mjs';
import { portfolio } from './templates/portfolio.mjs';
import { services } from './templates/services.mjs';
import { signboard } from './templates/signboard.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TMP = path.join(HERE, '.tmp');
const OUT = path.join(HERE, 'out');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SCALE = 2;
/** Chrome needs time to fetch and apply the webfonts before it captures. */
const VIRTUAL_TIME_BUDGET_MS = 12_000;

const DESIGNS = {
	hero,
	services,
	portfolio,
	contact,
	'contact-bold': contactBold,
	'contact-bold-facade': contactBoldFacade,
	signboard,
};

const flag = (name) => {
	const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
	return hit ? hit.split('=')[1] : null;
};
const only = {
	design: flag('design'),
	palette: flag('palette'),
	ratio: flag('ratio'),
};
const keepHtml = process.argv.includes('--keep-html');

for (const dir of [TMP, OUT]) {
	fs.mkdirSync(dir, { recursive: true });
}

function capture(htmlPath, pngPath, width, height) {
	execFileSync(
		CHROME,
		[
			'--headless',
			'--disable-gpu',
			'--hide-scrollbars',
			'--no-first-run',
			'--no-default-browser-check',
			'--allow-file-access-from-files',
			`--force-device-scale-factor=${SCALE}`,
			`--window-size=${width},${height}`,
			`--virtual-time-budget=${VIRTUAL_TIME_BUDGET_MS}`,
			`--screenshot=${pngPath}`,
			`file://${htmlPath}`,
		],
		{ stdio: ['ignore', 'ignore', 'pipe'] }
	);
}

const jobs = [];
for (const design of Object.keys(DESIGNS)) {
	for (const palette of Object.keys(PALETTES)) {
		for (const ratio of Object.keys(RATIOS)) {
			if (only.design && only.design !== design) {
				continue;
			}
			if (only.palette && only.palette !== palette) {
				continue;
			}
			if (only.ratio && only.ratio !== ratio) {
				continue;
			}
			jobs.push({ design, palette, ratio });
		}
	}
}

if (jobs.length === 0) {
	console.error('No banners matched those filters.');
	process.exit(1);
}

for (const { design, palette, ratio } of jobs) {
	const { width, height } = RATIOS[ratio];
	const name = `luxuria-${design}-${palette}-${ratio}`;
	const htmlPath = path.join(TMP, `${name}.html`);
	const rawPath = path.join(TMP, `${name}.raw.png`);
	const pngPath = path.join(OUT, `${name}.png`);

	fs.writeFileSync(htmlPath, DESIGNS[design](ratio, PALETTES[palette]));
	capture(htmlPath, rawPath, width, height);

	await sharp(rawPath)
		.resize(width, height, { kernel: sharp.kernel.lanczos3 })
		.png({ compressionLevel: 9 })
		.toFile(pngPath);

	fs.rmSync(rawPath, { force: true });
	if (!keepHtml) {
		fs.rmSync(htmlPath, { force: true });
	}

	const kb = Math.round(fs.statSync(pngPath).size / 1024);
	console.log(`${name}.png  ${width}x${height}  ${kb} KB`);
}

console.log(`\n${jobs.length} banner(s) → marketing/banners/out/`);
