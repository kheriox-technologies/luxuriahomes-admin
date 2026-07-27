import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bump } from './version-utils.mjs';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(rootDir, '..', '..');

// The only files the build number bump touches. Committing just these avoids
// sweeping unrelated working-tree changes into the release commit.
const VERSION_FILES = ['apps/mobile/app.json', 'apps/mobile/RELEASE_NOTES.md'];

function run(command, args) {
	return spawnSync(command, args, { stdio: 'inherit', cwd: repoRoot });
}

/**
 * Format and commit the version bump so the repo isn't left dirty before submit.
 * Formatting happens BEFORE the commit so the pre-commit `ultracite fix` hook is
 * a no-op and can't re-dirty the working tree afterwards. Best-effort: a failure
 * here is reported but never fails the build (the artifact is already built).
 */
function commitVersionBump(platform, version, build) {
	const status = spawnSync(
		'git',
		['status', '--porcelain', '--', ...VERSION_FILES],
		{ cwd: repoRoot, encoding: 'utf8' }
	);
	if (!status.stdout?.trim()) {
		process.stdout.write('No version changes to commit.\n');
		return;
	}

	run('pnpm', ['exec', 'ultracite', 'fix', ...VERSION_FILES]);

	const message = `Bump ${platform} build to v${version} (${build})`;
	const result = run('git', ['commit', '-m', message, '--', ...VERSION_FILES]);
	if (result.status === 0) {
		process.stdout.write(`Committed version bump: ${message}\n`);
	} else {
		process.stderr.write(
			'Warning: could not commit the version bump — commit it manually before submitting.\n'
		);
	}
}

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
		commitVersionBump(platform, version, build);
	}

	process.exit(result.status ?? 1);
} catch (error) {
	process.stderr.write(`${error.message}\n`);
	process.exit(1);
}
