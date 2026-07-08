import { spawnSync } from 'node:child_process';
import { artifactPath, current } from './version-utils.mjs';

const platform = process.argv[2];

try {
	const { version, build } = current(platform);
	const path = artifactPath(platform, version, build);

	process.stdout.write(
		`Submitting ${platform} v${version} (${build}) <- ${path}\n`
	);

	const result = spawnSync(
		'eas',
		[
			'submit',
			'--profile',
			'production',
			'--platform',
			platform,
			'--path',
			path,
		],
		{ stdio: 'inherit' }
	);

	process.exit(result.status ?? 1);
} catch (error) {
	process.stderr.write(`${error.message}\n`);
	process.exit(1);
}
