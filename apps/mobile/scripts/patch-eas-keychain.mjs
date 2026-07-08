import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

// Works around a macOS Tahoe (26 / Darwin 27) bug in EAS local builds where
// `security find-identity -v` returns "0 valid identities" against the
// ephemeral build keychain (which lacks the Apple trust chain), causing
// "Distribution certificate ... hasn't been imported successfully" even though
// the .p12 imported fine. Removing the `-v` flag makes the presence check pass.
// See https://github.com/expo/eas-cli/issues/3678
const NEEDLE = "['find-identity', '-v', '-s',";
const FIXED = "['find-identity', '-s',";
const KEYCHAIN_SUBPATH = join(
	'node_modules',
	'@expo',
	'build-tools',
	'dist',
	'ios',
	'credentials',
	'keychain.js'
);

// eas build --local runs the build plugin via `npx`, which unpacks it into a
// hash-named dir under ~/.npm/_npx. Scan every cached copy and patch each one.
export function patchEasKeychain() {
	const npxRoot = join(homedir(), '.npm', '_npx');
	let patched = 0;

	let entries = [];
	try {
		entries = readdirSync(npxRoot, { withFileTypes: true });
	} catch {
		return 0; // npx cache not created yet — nothing to patch
	}

	for (const entry of entries) {
		if (!entry.isDirectory()) {
			continue;
		}
		const file = join(npxRoot, entry.name, KEYCHAIN_SUBPATH);
		let contents;
		try {
			contents = readFileSync(file, 'utf8');
		} catch {
			continue; // this cache dir doesn't contain @expo/build-tools
		}
		if (contents.includes(NEEDLE)) {
			writeFileSync(file, contents.replace(NEEDLE, FIXED));
			patched += 1;
			process.stdout.write(
				`Patched EAS keychain check (dropped -v): ${file}\n`
			);
		}
	}

	return patched;
}
