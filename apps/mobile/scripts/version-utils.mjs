import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const appJsonPath = resolve(rootDir, 'app.json');

export function assertPlatform(platform) {
	if (platform !== 'ios' && platform !== 'android') {
		throw new Error(`Expected platform "ios" or "android", got "${platform}"`);
	}
}

export function readAppJson() {
	return JSON.parse(readFileSync(appJsonPath, 'utf8'));
}

/**
 * Bump only the platform build number in app.json.
 * The semver version (expo.version) is managed manually.
 * @returns {{ version: string, build: string | number }}
 */
export function bump(platform) {
	assertPlatform(platform);
	const config = readAppJson();
	const { expo } = config;

	let build;
	if (platform === 'ios') {
		build = String(Number(expo.ios.buildNumber) + 1);
		expo.ios.buildNumber = build;
	} else {
		build = expo.android.versionCode + 1;
		expo.android.versionCode = build;
	}

	writeFileSync(appJsonPath, `${JSON.stringify(config, null, 2)}\n`);
	return { version: expo.version, build };
}

/**
 * Read the current version and platform build number without mutating.
 * @returns {{ version: string, build: string | number }}
 */
export function current(platform) {
	assertPlatform(platform);
	const { expo } = readAppJson();
	const build =
		platform === 'ios' ? expo.ios.buildNumber : expo.android.versionCode;
	return { version: expo.version, build };
}
