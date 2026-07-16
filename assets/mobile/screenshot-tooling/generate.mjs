// Generates one self-contained marketing-frame HTML file per App Store
// screenshot. Each HTML page is sized to the EXACT App Store canvas so a
// Playwright viewport screenshot at deviceScaleFactor=1 yields a pixel-perfect
// asset. The device frame wraps the real iOS Simulator capture (which already
// contains a genuine iOS status bar) in a black bezel with rounded screen
// corners — the status bar is deliberately left visible, never cropped.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, 'out');
mkdirSync(OUT_DIR, { recursive: true });

// App Store canvas sizes.
const IPHONE = { w: 1320, h: 2868 }; // 6.9" iPhone (iPhone 17 Pro Max native)
const IPAD = { w: 2064, h: 2752 }; // 13" iPad

// Raw simulator capture pixel dimensions (for the device aspect ratio).
const IPHONE_SHOT = { w: 1320, h: 2868 }; // iPhone 17 Pro Max portrait
const IPAD_SHOT = { w: 2752, h: 2064 }; // iPad Pro 13" landscape

/**
 * @typedef {Object} Screen
 * @property {string} out        output html filename
 * @property {string} shot       screenshot filename (in ./raw)
 * @property {'iphone'|'ipad'} device
 * @property {string} eyebrow
 * @property {string} headline
 * @property {string} subcopy
 */

/** @type {Screen[]} */
const SCREENS = [
	{
		out: 'ios-phone-1.html',
		shot: 'ios-phone-1.png',
		device: 'iphone',
		eyebrow: 'STAY AHEAD',
		headline: 'Every project, one calm overview',
		subcopy:
			"See what's due, overdue and coming up — the moment you open the app.",
	},
	{
		out: 'ios-phone-2.html',
		shot: 'ios-phone-2.png',
		device: 'iphone',
		eyebrow: 'ALL YOUR BUILDS',
		headline: "Every home you're building, in one place",
		subcopy: 'Search, open and manage each project from anywhere on site.',
	},
	{
		out: 'ios-phone-3.html',
		shot: 'ios-phone-3.png',
		device: 'iphone',
		eyebrow: 'BUILD PROGRESS',
		headline: 'Track every stage, right to completion',
		subcopy:
			'Live progress bars and status updates keep the whole build on schedule.',
	},
	{
		out: 'ios-phone-4.html',
		shot: 'ios-phone-4.png',
		device: 'iphone',
		eyebrow: 'SELECTIONS',
		headline: 'Your selections, beautifully organised',
		subcopy:
			'Fixtures, finishes and variations — with photos, notes and approvals.',
	},
	{
		out: 'ios-phone-5.html',
		shot: 'ios-phone-5.png',
		device: 'iphone',
		eyebrow: 'DOCUMENTS',
		headline: 'Plans and paperwork, always to hand',
		subcopy: 'Open, upload and share every document securely, from anywhere.',
	},
	{
		out: 'ipad-1.html',
		shot: 'ipad-1.png',
		device: 'ipad',
		eyebrow: 'ONE COMPANION FOR EVERY BUILD',
		headline: 'Manage the whole project from anywhere',
		subcopy:
			'Projects, schedule, selections and documents — on the big screen.',
	},
];

function escapeHtml(value) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function pageFor(screen) {
	const isIpad = screen.device === 'ipad';
	const canvas = isIpad ? IPAD : IPHONE;
	const shot = isIpad ? IPAD_SHOT : IPHONE_SHOT;
	const aspect = `${shot.w} / ${shot.h}`;

	// Type-scale tuned to each canvas width.
	const scale = canvas.w / 1290;
	const padTop = Math.round((isIpad ? 140 : 148) * scale);
	const eyebrowSize = Math.round(30 * scale);
	const eyebrowSpacing = (8 * scale).toFixed(1);
	const headlineSize = Math.round((isIpad ? 96 : 92) * scale);
	const subSize = Math.round(38 * scale);
	const copyMax = Math.round((isIpad ? 1500 : 980) * scale);

	// Device sizing: iPhone fills available height; iPad (landscape device)
	// fills width so the tablet reads as a wide screen in a portrait canvas.
	const bezel = Math.round((isIpad ? 26 : 16) * scale);
	const outerRadius = Math.round((isIpad ? 42 : 96) * scale);
	const innerRadius = Math.max(0, outerRadius - bezel);
	const deviceSizing = isIpad
		? `width: min(92%, ${Math.round(2360 * scale)}px);`
		: 'height: 100%;';
	const deviceMax = isIpad ? 'max-height: 100%;' : 'max-width: 100%;';
	const areaPadBottom = Math.round((isIpad ? 140 : 60) * scale);
	const areaPadTop = Math.round((isIpad ? 56 : 36) * scale);

	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${canvas.w}px; height: ${canvas.h}px; }
  .frame {
    width: ${canvas.w}px;
    height: ${canvas.h}px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background:
      radial-gradient(120% 80% at 50% 0%, #F3ECE1 0%, rgba(243,236,225,0) 55%),
      linear-gradient(180deg, #ECE3D5 0%, #EFE7DB 45%, #F2ECE1 100%);
    font-family: 'Inter', -apple-system, system-ui, sans-serif;
    overflow: hidden;
  }
  .copy {
    padding: ${padTop}px 80px 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 0 0 auto;
  }
  .eyebrow {
    font-size: ${eyebrowSize}px;
    font-weight: 600;
    letter-spacing: ${eyebrowSpacing}px;
    text-transform: uppercase;
    color: #A79C8B;
  }
  .headline {
    margin-top: ${Math.round(26 * scale)}px;
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 600;
    font-size: ${headlineSize}px;
    line-height: 1.08;
    letter-spacing: -0.5px;
    color: #262320;
    max-width: ${copyMax}px;
  }
  .subcopy {
    margin-top: ${Math.round(28 * scale)}px;
    font-size: ${subSize}px;
    line-height: 1.36;
    font-weight: 400;
    color: #6E6557;
    max-width: ${copyMax}px;
  }
  .device-area {
    flex: 1 1 auto;
    min-height: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${areaPadTop}px 80px ${areaPadBottom}px;
  }
  .device {
    ${deviceSizing}
    ${deviceMax}
    aspect-ratio: ${aspect};
    background: #0B0B0C;
    border-radius: ${outerRadius}px;
    padding: ${bezel}px;
    box-shadow:
      0 ${Math.round(60 * scale)}px ${Math.round(120 * scale)}px rgba(43, 34, 22, 0.28),
      0 ${Math.round(12 * scale)}px ${Math.round(28 * scale)}px rgba(43, 34, 22, 0.16);
  }
  .screen {
    width: 100%;
    height: 100%;
    border-radius: ${innerRadius}px;
    overflow: hidden;
    background: linear-gradient(180deg, #f4f4f6 0%, #e9e9ee 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .screen img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .placeholder {
    font-family: 'Inter', sans-serif;
    font-size: ${Math.round(40 * scale)}px;
    letter-spacing: 4px;
    color: #b4b4bd;
  }
</style>
</head>
<body>
  <div class="frame">
    <div class="copy">
      <div class="eyebrow">${escapeHtml(screen.eyebrow)}</div>
      <h1 class="headline">${escapeHtml(screen.headline)}</h1>
      <p class="subcopy">${escapeHtml(screen.subcopy)}</p>
    </div>
    <div class="device-area">
      <div class="device">
        <div class="screen">
          <img src="../raw/${screen.shot}" alt="" onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<div class=\\'placeholder\\'>SCREENSHOT</div>')" />
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

for (const screen of SCREENS) {
	writeFileSync(join(OUT_DIR, screen.out), pageFor(screen), 'utf8');
	// eslint-disable-next-line no-console
	console.log(`wrote out/${screen.out}`);
}
