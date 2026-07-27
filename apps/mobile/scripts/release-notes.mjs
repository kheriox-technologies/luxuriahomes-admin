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

// Marks the start of the auto-generated draft block inside a version section.
const DRAFT_OPEN =
	'<!-- draft: commit subjects since the last build — rewrite the useful ones into bullets above, then delete this block:';
const DRAFT_CLOSE = '-->';

function sectionBounds(lines, headingIdx) {
	let end = lines.length;
	for (let i = headingIdx + 1; i < lines.length; i++) {
		if (lines[i].trim() === '---' || VERSION_HEADING.test(lines[i])) {
			end = i;
			break;
		}
	}
	return end;
}

/**
 * Append commit subjects as a commented-out draft inside the top (current)
 * version section, for the author to rewrite into user-facing bullets. New
 * subjects are added to the existing draft block if one is present; subjects
 * already anywhere in the section are skipped. Returns true if the file changed.
 */
export function appendCommitDraft(subjects) {
	if (!existsSync(releaseNotesPath)) {
		process.stderr.write(
			'RELEASE_NOTES.md not found; skipping commit draft.\n'
		);
		return false;
	}
	if (subjects.length === 0) {
		return false;
	}

	const lines = readLines();
	const headingIdx = firstVersionHeadingIndex(lines);
	if (headingIdx === -1) {
		return false;
	}

	const sectionEnd = sectionBounds(lines, headingIdx);
	const sectionText = lines.slice(headingIdx, sectionEnd).join('\n');
	const fresh = subjects.filter((subject) => !sectionText.includes(subject));
	if (fresh.length === 0) {
		return false;
	}

	const bulletLines = fresh.map((subject) => `  • ${subject}`);
	const openIdx = lines
		.slice(headingIdx, sectionEnd)
		.findIndex((line) => line.startsWith('<!-- draft:'));

	if (openIdx === -1) {
		const needsLeadingBlank = lines[sectionEnd - 1]?.trim() !== '';
		const block = [
			...(needsLeadingBlank ? [''] : []),
			DRAFT_OPEN,
			...bulletLines,
			DRAFT_CLOSE,
			'',
		];
		lines.splice(sectionEnd, 0, ...block);
	} else {
		const absOpen = headingIdx + openIdx;
		let closeIdx = sectionEnd;
		for (let i = absOpen; i < sectionEnd; i++) {
			if (lines[i].trim() === DRAFT_CLOSE) {
				closeIdx = i;
				break;
			}
		}
		lines.splice(closeIdx, 0, ...bulletLines);
	}

	writeFileSync(releaseNotesPath, lines.join('\n'));
	return true;
}
