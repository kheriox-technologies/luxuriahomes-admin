import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureVersionSection } from './release-notes.mjs';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const appJsonPath = resolve(rootDir, 'app.json');

const SEMVER = /^\d+\.\d+\.\d+$/;

const version = process.argv[2];

if (!version) {
	process.stderr.write(
		'Usage: node scripts/version-bump.mjs <version>   (e.g. 1.0.2)\n'
	);
	process.exit(1);
}

if (!SEMVER.test(version)) {
	process.stderr.write(`Expected a semver like 1.0.2, got "${version}"\n`);
	process.exit(1);
}

const config = JSON.parse(readFileSync(appJsonPath, 'utf8'));
const { expo } = config;
const previous = expo.version;

if (previous === version) {
	process.stdout.write(`app.json is already at v${version}\n`);
} else {
	expo.version = version;
	writeFileSync(appJsonPath, `${JSON.stringify(config, null, 2)}\n`);
	process.stdout.write(`Bumped app.json version ${previous} → ${version}\n`);
}

const inserted = ensureVersionSection(version, expo);
if (inserted) {
	process.stdout.write(
		`Added "## ${version} — In development" section to RELEASE_NOTES.md — fill in the bullets.\n`
	);
} else {
	process.stdout.write(
		`RELEASE_NOTES.md already has a ${version} section at the top (or the file is missing); left as-is.\n`
	);
}
