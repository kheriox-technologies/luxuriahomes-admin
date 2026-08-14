import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONTACT, ICONS, RATIOS } from '../brand.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(HERE, '..', 'assets');

/** Absolute file:// URL so headless Chrome resolves assets regardless of cwd. */
export const asset = (...parts) => `file://${path.join(ASSETS, ...parts)}`;
export const photo = (file) => asset('photos', file);

/**
 * Per-ratio design tokens. The two canvases are composed separately rather than
 * scaled from one another — a 9:16 screen is read closer and taller.
 */
export const TOKENS = {
	'16x9': {
		margin: 88,
		logo: 86,
		display: 74,
		displayLead: 1.1,
		title: 52,
		lead: 22,
		body: 19,
		label: 15,
		meta: 17,
		rowTitle: 31,
		rowBody: 17,
	},
	'9x16': {
		margin: 76,
		logo: 92,
		display: 82,
		displayLead: 1.12,
		title: 56,
		lead: 25,
		body: 21,
		label: 16,
		meta: 19,
		rowTitle: 36,
		rowBody: 19,
	},
};

/** The wordmark, recoloured via CSS mask exactly as packages/ui BrandLogo does. */
export function wordmark(height, color) {
	const width = (height * 7627) / 3029;
	return `<span class="wordmark" style="
		width:${width}px; height:${height}px; background:${color};
		-webkit-mask-image:url('${asset('logo.svg')}');
		-webkit-mask-size:contain; -webkit-mask-repeat:no-repeat; -webkit-mask-position:left center;
	"></span>`;
}

/** Small uppercase label sitting on a short rule — the site's `.eyebrow` device. */
export function label(text, p, t) {
	return `<div class="label" style="font-size:${t.label}px;color:${p.accent}">
		<span class="label-rule" style="background:${p.accent}"></span>${text}
	</div>`;
}

function icon(name, color, size) {
	return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none"
		stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
		class="ico">${ICONS[name]}</svg>`;
}

/**
 * The contact block that closes every banner.
 *
 * `columns` is chosen from the width of the panel it sits in, not the canvas
 * ratio — a 16:9 banner with a narrow side panel needs the same single column a
 * tall canvas does. Nothing is ever truncated: every detail has to be readable.
 */
export function contactStrip(p, t, columns) {
	const size = Math.round(t.meta * 1.15);
	const items = [
		['phone', CONTACT.phones.join('  ·  ')],
		['mail', CONTACT.email],
		['globe', CONTACT.website],
		['badge', CONTACT.qbcc],
		['pin', CONTACT.address],
	];
	const cells = items
		.map(
			([ico, text], i) =>
				`<div class="c-item${i === 4 ? ' c-wide' : ''}">${icon(ico, p.accent, size)}<span>${text}</span></div>`
		)
		.join('');
	return `<div class="contact" style="border-top:1px solid ${p.rule};color:${p.inkMuted};
		font-size:${t.meta}px;grid-template-columns:repeat(${columns},auto);
		justify-content:${columns > 1 ? 'space-between' : 'start'}">${cells}</div>`;
}

/** Full-bleed photograph with the palette's scrim laid over it. */
export function photoLayer(file, p, extra = '') {
	return `<div class="photo" style="background-image:url('${photo(file)}');${extra}">
		<div class="scrim" style="background:${p.photoScrim}"></div>
	</div>`;
}

const BASE_CSS = `
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;overflow:hidden}
body{-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;
	font-family:Inter,system-ui,sans-serif;font-weight:300}
.canvas{position:relative;width:100%;height:100%;overflow:hidden;display:flex}
.serif{font-family:Cinzel,Georgia,serif}
.wordmark{display:block;flex:none}
.photo{position:absolute;inset:0;background-size:cover;background-position:center}
.scrim{position:absolute;inset:0}
.panel{position:relative;display:flex;flex-direction:column;justify-content:space-between}
.label{display:flex;align-items:center;gap:14px;font-weight:600;
	text-transform:uppercase;letter-spacing:0.22em;white-space:nowrap}
.label-rule{display:block;width:34px;height:1px;flex:none;opacity:0.85}
.display{font-weight:400;letter-spacing:0.012em}
.contact{display:grid;width:100%;font-weight:400;letter-spacing:0.012em;
	column-gap:44px;row-gap:17px;padding-top:26px}
.c-item{display:flex;align-items:center;gap:11px}
.c-item span{white-space:nowrap}
.c-wide{grid-column:1 / -1}
.ico{flex:none;opacity:0.95}
`;

/** Wraps a composed banner body in the page shell Chrome screenshots. */
export function page({ ratio, palette, css = '', body }) {
	const { width, height } = RATIOS[ratio];
	return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
${BASE_CSS}
html,body{width:${width}px;height:${height}px;background:${palette.ground};color:${palette.ink}}
${css}
</style></head><body><div class="canvas">${body}</div></body></html>`;
}
