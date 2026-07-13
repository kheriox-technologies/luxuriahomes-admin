import { spawnSync } from 'node:child_process';
import { current } from './version-utils.mjs';

const platform = process.argv[2];

try {
	const { version, build } = current(platform);

	process.stdout.write(
		`Submitting latest EAS build for ${platform} v${version} (${build})\n`
	);

	const result = spawnSync(
		'eas',
		['submit', '--profile', 'production', '--platform', platform, '--latest'],
		{ stdio: 'inherit' }
	);

	process.exit(result.status ?? 1);
} catch (error) {
	process.stderr.write(`${error.message}\n`);
	process.exit(1);
}
