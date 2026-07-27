import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const releaseNotesPath = resolve(rootDir, 'RELEASE_NOTES.md');

// Matches a version section heading, e.g. "## 1.0.2 — In development".
const VERSION_HEADING = /^## (\d+\.\d+\.\d+)/;
// Matches an italic metadata line, e.g. "_iOS build 23 · Android versionCode 6_".
const META_LINE = /^_.*_$/;

function buildMetaLine(expo) {
	return `_iOS build ${expo.ios.buildNumber} · Android versionCode ${expo.android.versionCode}_`;
}

function readLines() {
	return readFileSync(releaseNotesPath, 'utf8').split('\n');
}

function firstVersionHeadingIndex(lines) {
	return lines.findIndex((line) => VERSION_HEADING.test(line));
}

/**
 * Insert a fresh "## <version> — In development" stub at the top of the notes
 * (above the newest existing version section) unless that version is already
 * the top section. Returns true if a section was inserted.
 */
export function ensureVersionSection(version, expo) {
	if (!existsSync(releaseNotesPath)) {
		process.stderr.write(
			'RELEASE_NOTES.md not found; skipping section insert.\n'
		);
		return false;
	}

	const lines = readLines();
	const headingIdx = firstVersionHeadingIndex(lines);

	if (headingIdx !== -1) {
		const [, topVersion] = lines[headingIdx].match(VERSION_HEADING) ?? [];
		if (topVersion === version) {
			return false;
		}
	}

	const stub = [
		`## ${version} — In development`,
		'',
		buildMetaLine(expo),
		'',
		'- _Describe user-facing changes here_',
		'',
		'---',
		'',
	];

	const insertAt = headingIdx === -1 ? lines.length : headingIdx;
	lines.splice(insertAt, 0, ...stub);
	writeFileSync(releaseNotesPath, lines.join('\n'));
	return true;
}

/**
 * Rewrite the metadata line of the top (current) version section to reflect the
 * build numbers now in app.json. Returns true if the file was changed.
 */
export function syncBuildLine(expo) {
	if (!existsSync(releaseNotesPath)) {
		process.stderr.write(
			'RELEASE_NOTES.md not found; skipping build-line sync.\n'
		);
		return false;
	}

	const lines = readLines();
	const headingIdx = firstVersionHeadingIndex(lines);
	if (headingIdx === -1) {
		return false;
	}

	const nextLine = buildMetaLine(expo);
	for (let i = headingIdx + 1; i < lines.length; i++) {
		if (VERSION_HEADING.test(lines[i])) {
			break;
		}
		if (META_LINE.test(lines[i].trim())) {
			if (lines[i] === nextLine) {
				return false;
			}
			lines[i] = nextLine;
			writeFileSync(releaseNotesPath, lines.join('\n'));
			return true;
		}
	}

	return false;
}
