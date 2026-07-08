import { spawnSync } from 'node:child_process';
import { patchEasKeychain } from './patch-eas-keychain.mjs';
import { artifactPath, bump } from './version-utils.mjs';

const platform = process.argv[2];

function runEasBuild(output) {
	return spawnSync(
		'eas',
		[
			'build',
			'--local',
			'--profile',
			'production',
			'--platform',
			platform,
			'--output',
			output,
		],
		{ stdio: 'inherit' }
	);
}

try {
	const { version, build } = bump(platform);
	const output = artifactPath(platform, version, build);

	process.stdout.write(
		`Building ${platform} v${version} (${build}) -> ${output}\n`
	);

	// Patch the cached EAS build plugin (macOS Tahoe keychain workaround) before
	// building. On a cold npx cache the plugin isn't downloaded yet, so if the
	// first build fails we patch the now-present copy and retry once.
	patchEasKeychain();
	let result = runEasBuild(output);

	if (result.status !== 0 && patchEasKeychain() > 0) {
		process.stdout.write('Retrying build after patching EAS keychain check\n');
		result = runEasBuild(output);
	}

	process.exit(result.status ?? 1);
} catch (error) {
	process.stderr.write(`${error.message}\n`);
	process.exit(1);
}
