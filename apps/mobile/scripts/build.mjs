import { spawnSync } from 'node:child_process';
import { bump } from './version-utils.mjs';

const platform = process.argv[2];

try {
	const { version, build } = bump(platform);

	process.stdout.write(`Building ${platform} v${version} (${build}) on EAS\n`);

	const result = spawnSync(
		'eas',
		['build', '--profile', 'production', '--platform', platform],
		{ stdio: 'inherit' }
	);

	process.exit(result.status ?? 1);
} catch (error) {
	process.stderr.write(`${error.message}\n`);
	process.exit(1);
}
