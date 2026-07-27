import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { current } from './version-utils.mjs';

const platform = process.argv[2];

try {
	const { version, build } = current(platform);
	const ext = platform === 'ios' ? 'ipa' : 'aab';
	const artifact = `build/luxuria-${platform}.${ext}`;

	if (!existsSync(artifact)) {
		throw new Error(
			`No artifact at ${artifact} — run \`pnpm build:${platform}\` first`
		);
	}

	process.stdout.write(
		`Submitting ${artifact} for ${platform} v${version} (${build})\n`
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
			artifact,
		],
		{ stdio: 'inherit' }
	);

	process.exit(result.status ?? 1);
} catch (error) {
	process.stderr.write(`${error.message}\n`);
	process.exit(1);
}
