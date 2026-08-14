/**
 * Downloads the project photography the banners are built from.
 *
 * Source of truth is the Convex deployment configured in packages/backend/.env.local.
 * Images live in the public static bucket and are served unsigned from
 * NEXT_PUBLIC_STATIC_URL, so a plain fetch is enough.
 *
 *   node fetch-assets.mjs          # download anything missing
 *   node fetch-assets.mjs --force  # re-download everything
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PHOTOS } from './brand.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const BACKEND = path.join(REPO, 'packages', 'backend');
const OUT = path.join(HERE, 'assets', 'photos');
const FORCE = process.argv.includes('--force');

const STATIC_URL_LINE = /^NEXT_PUBLIC_STATIC_URL=["']?([^"'\s]+)/m;
const TRAILING_SLASHES = /\/+$/;

function staticBaseUrl() {
	const envFile = path.join(REPO, 'apps', 'web', '.env.local');
	const match = fs.readFileSync(envFile, 'utf8').match(STATIC_URL_LINE);
	if (!match) {
		throw new Error(`NEXT_PUBLIC_STATIC_URL not found in ${envFile}`);
	}
	return match[1].replace(TRAILING_SLASHES, '');
}

function convex(fnPath) {
	const raw = execFileSync('npx', ['convex', 'run', fnPath, '{}'], {
		cwd: BACKEND,
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'ignore'],
	});
	return JSON.parse(raw);
}

async function download(url, dest) {
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`${res.status} ${res.statusText} — ${url}`);
	}
	fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

const base = staticBaseUrl();
console.log(`Static CDN: ${base}`);

const projects = convex('web/projects:listCompleted');
const banners = convex('web/banners:list');
console.log(
	`Convex: ${projects.length} completed project(s), ${banners.length} banner image(s)`
);
for (const p of projects) {
	const images = (p.media ?? []).filter((m) => m.type === 'image').length;
	console.log(`  · ${p.name} (${p.completedYear}) — ${images} images`);
}

// Numbered so the pinned filenames in brand.mjs stay stable across runs.
const keys = [
	...banners.map((b) => b.key),
	...projects.flatMap((p) =>
		(p.media ?? []).filter((m) => m.type === 'image').map((m) => m.key)
	),
];

fs.mkdirSync(OUT, { recursive: true });
let fetched = 0;
let skipped = 0;
for (const [i, key] of keys.entries()) {
	const file = `${String(i + 1).padStart(2, '0')}_${path.basename(key)}`;
	const dest = path.join(OUT, file);
	if (!FORCE && fs.existsSync(dest)) {
		skipped++;
		continue;
	}
	await download(`${base}/${key}`, dest);
	fetched++;
}
console.log(
	`Photos: ${fetched} downloaded, ${skipped} already present → assets/photos/`
);

const missing = Object.entries(PHOTOS).filter(
	([, file]) => !fs.existsSync(path.join(OUT, file))
);
if (missing.length > 0) {
	console.error(
		'\nPhotos pinned in brand.mjs are missing from the deployment:'
	);
	for (const [name, file] of missing) {
		console.error(`  ${name} → ${file}`);
	}
	process.exit(1);
}
console.log('All photos pinned in brand.mjs are present.');
