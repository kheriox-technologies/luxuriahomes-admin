import { spawnSync } from 'node:child_process';
import { bump } from './version-utils.mjs';

const platform = process.argv[2];

try {
	const { version, build } = bump(platform);
	const ext = platform === 'ios' ? 'ipa' : 'aab';
	const output = `build/luxuria-${platform}.${ext}`;

	process.stdout.write(
		`Building ${platform} v${version} (${build}) locally → ${output}\n`
	);

	const result = spawnSync(
		'eas',
		[
			'build',
			'--profile',
			'production',
			'--platform',
			platform,
			'--local',
			'--output',
			output,
		],
		{ stdio: 'inherit' }
	);

	if (result.status === 0) {
		process.stdout.write(`Build ready: ${output}\n`);
	}

	process.exit(result.status ?? 1);
} catch (error) {
	process.stderr.write(`${error.message}\n`);
	process.exit(1);
}
