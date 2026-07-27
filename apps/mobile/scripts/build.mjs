import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appendCommitDraft } from './release-notes.mjs';
import { bump } from './version-utils.mjs';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(rootDir, '..', '..');

// The only files the build number bump touches. Committing just these avoids
// sweeping unrelated working-tree changes into the release commit.
const VERSION_FILES = ['apps/mobile/app.json', 'apps/mobile/RELEASE_NOTES.md'];

// Commit subjects that are never user-facing and should be kept out of the draft.
const CHORE_PATTERNS = [
	/^Bump (ios|android) build to v/i,
	/^Merge /,
	/^(chore|ci|build|test|refactor|style|docs)[(:]/i,
	/\b(lint\w*|format\w*|prettier|ultracite|biome)\b/i,
	/\b(version|bundle id|build number|versioncode)\b/i,
	/^wip\b/i,
];

const MAX_FALLBACK_COMMITS = 20;

function run(command, args) {
	return spawnSync(command, args, { stdio: 'inherit', cwd: repoRoot });
}

function git(args) {
	return (
		spawnSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).stdout ?? ''
	).trim();
}

function isUserFacing(subject) {
	return !CHORE_PATTERNS.some((pattern) => pattern.test(subject));
}

/**
 * Collect user-facing commit subjects since the previous build. The anchor is
 * the last "Bump … build to v…" commit; on the first build (no such commit) it
 * falls back to when the current version's section was added, then to a capped
 * recent window.
 */
function commitsSinceLastBuild(version) {
	let anchor = git(['log', '-1', '--format=%H', '--grep=^Bump .* build to v']);
	if (!anchor) {
		anchor = git([
			'log',
			'-1',
			'--format=%H',
			`-S## ${version} `,
			'--',
			'apps/mobile/RELEASE_NOTES.md',
		]);
	}

	const logArgs = ['log', '--no-merges', '--format=%s'];
	if (anchor) {
		logArgs.push(`${anchor}..HEAD`);
	} else {
		logArgs.push(`-${MAX_FALLBACK_COMMITS}`);
	}

	return git(logArgs)
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean)
		.filter(isUserFacing);
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

	// Drop new commit subjects into the notes as an editable draft. Best-effort:
	// never let a notes/git hiccup block the build.
	try {
		const added = appendCommitDraft(commitsSinceLastBuild(version));
		if (added) {
			process.stdout.write(
				'Added a commit draft to RELEASE_NOTES.md — rewrite it into user-facing bullets.\n'
			);
		}
	} catch (error) {
		process.stderr.write(
			`Warning: could not add commit draft to RELEASE_NOTES.md: ${error.message}\n`
		);
	}

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
