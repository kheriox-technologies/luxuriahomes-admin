/**
 * Shared browser `pdfmake` setup. `pdfMake` is a module-level singleton with one
 * internal virtual file system and one font map, so every PDF builder in the app
 * has to go through here — registering fonts from two places would have the last
 * writer silently drop the other's typefaces.
 */

import { SIGNATURE_STYLES } from '../client/pdf/signature-styles';

const ROBOTO_VFS_FILES = {
	normal: 'Roboto-Regular.ttf',
	bold: 'Roboto-Medium.ttf',
	italics: 'Roboto-Italic.ttf',
	bolditalics: 'Roboto-MediumItalic.ttf',
} as const;

const INTER_VFS_FILES = {
	normal: 'Inter-Regular.ttf',
	bold: 'Inter-SemiBold.ttf',
} as const;

const INTER_URLS: Record<string, string> = {
	[INTER_VFS_FILES.normal]: '/fonts/Inter-Regular.ttf',
	[INTER_VFS_FILES.bold]: '/fonts/Inter-SemiBold.ttf',
};

export interface PdfMakeBrowser {
	addVirtualFileSystem: (
		vfs: Record<string, string | { data: string; encoding?: string }>
	) => void;
	createPdf: (docDefinition: unknown) => CreatedPdf;
	setFonts: (fonts: Record<string, Record<string, string>>) => void;
}

export interface CreatedPdf {
	getBase64: () => Promise<string>;
	getBlob: () => Promise<Blob>;
}

/**
 * pdfmake ships `vfs_fonts` as CJS `module.exports = { "Roboto-….ttf": "<base64>" }`.
 * Bundlers may expose that map on `import().default`, on the module namespace, or
 * split across both — taking the first object with any `.ttf` can yield a partial
 * vfs. Merge every `.ttf` entry we can find.
 */
export function mergeVirtualFontFilesFromModule(
	vfsModule: unknown
): Record<string, string> {
	const merged: Record<string, string> = {};

	function mergeFromObject(obj: unknown) {
		if (!obj || typeof obj !== 'object') {
			return;
		}
		for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
			if (
				!key.endsWith('.ttf') ||
				typeof val !== 'string' ||
				val.length === 0
			) {
				continue;
			}
			merged[key] = val;
		}
	}

	const mod = vfsModule as Record<string, unknown>;
	mergeFromObject(mod);
	mergeFromObject(mod.default);

	const defaultNested = mod.default as
		| { pdfMake?: { vfs?: unknown } }
		| undefined;
	mergeFromObject(defaultNested?.pdfMake?.vfs);

	const modNested = (mod as { pdfMake?: { vfs?: unknown } }).pdfMake?.vfs;
	mergeFromObject(modNested);

	return merged;
}

function robotoFontMap(vfs: Record<string, string>): Record<string, string> {
	const pick = (file: string, fallback: string) =>
		vfs[file] !== undefined && vfs[file] !== '' ? file : fallback;

	return {
		normal: pick(ROBOTO_VFS_FILES.normal, ROBOTO_VFS_FILES.normal),
		bold: pick(ROBOTO_VFS_FILES.bold, ROBOTO_VFS_FILES.normal),
		italics: pick(ROBOTO_VFS_FILES.italics, ROBOTO_VFS_FILES.normal),
		bolditalics: pick(
			ROBOTO_VFS_FILES.bolditalics,
			pick(ROBOTO_VFS_FILES.italics, ROBOTO_VFS_FILES.normal)
		),
	};
}

// The live font map. `setFonts` replaces it wholesale rather than merging, so
// every registration has to go through `registerFont` — writing it directly from
// two places would have the last writer silently drop the other's typefaces.
const fontMap: Record<string, Record<string, string>> = {
	Roboto: robotoFontMap({}),
};

/**
 * Registers one typeface's files and re-publishes the whole map.
 *
 * Browser `pdfMake` loads fonts from an internal virtual FS. Assigning
 * `pdfMake.vfs = …` does not register files — you must call
 * `addVirtualFileSystem` so `Roboto-Medium.ttf` etc. exist for the font map.
 */
function registerFont(
	pdfMake: PdfMakeBrowser,
	family: string,
	vfs: Record<string, string>,
	variants: Record<string, string>
) {
	pdfMake.addVirtualFileSystem(vfs);
	fontMap[family] = variants;
	pdfMake.setFonts({ ...fontMap });
}

let pdfMakePromise: Promise<PdfMakeBrowser> | null = null;

export function getPdfMake(): Promise<PdfMakeBrowser> {
	if (pdfMakePromise) {
		return pdfMakePromise;
	}
	pdfMakePromise = (async () => {
		const [{ default: pdfMake }, vfsModule] = await Promise.all([
			import('pdfmake/build/pdfmake'),
			import('pdfmake/build/vfs_fonts'),
		]);
		const vfs = mergeVirtualFontFilesFromModule(vfsModule);
		if (
			Object.keys(vfs).length === 0 ||
			typeof vfs[ROBOTO_VFS_FILES.normal] !== 'string' ||
			vfs[ROBOTO_VFS_FILES.normal] === ''
		) {
			throw new Error('Could not initialize PDF fonts.');
		}
		registerFont(pdfMake as PdfMakeBrowser, 'Roboto', vfs, robotoFontMap(vfs));
		return pdfMake as PdfMakeBrowser;
	})();
	return pdfMakePromise;
}

function toBase64(bytes: ArrayBuffer): string {
	const view = new Uint8Array(bytes);
	let binary = '';
	// Chunked so a ~340 KB font doesn't blow the argument limit of String.fromCharCode.
	const chunkSize = 0x80_00;
	for (let i = 0; i < view.length; i += chunkSize) {
		binary += String.fromCharCode(...view.subarray(i, i + chunkSize));
	}
	return btoa(binary);
}

// Cached per file rather than per typeface, so a font requested by two callers
// is fetched and base64-encoded once.
const fontFilePromises = new Map<string, Promise<string>>();

function loadFontFile(file: string, url: string): Promise<string> {
	const cached = fontFilePromises.get(file);
	if (cached) {
		return cached;
	}
	const promise = (async () => {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Could not load ${file}`);
		}
		return toBase64(await response.arrayBuffer());
	})();
	fontFilePromises.set(file, promise);
	return promise;
}

/** Fetches a typeface's files and returns them as a pdfmake virtual file system. */
function loadFontVfs(
	urls: Record<string, string>
): Promise<Record<string, string>> {
	return Promise.all(
		Object.entries(urls).map(async ([file, url]) => {
			return [file, await loadFontFile(file, url)] as const;
		})
	).then(Object.fromEntries);
}

/**
 * pdfmake with Inter registered alongside Roboto, matching the portal's UI
 * typeface. Falls back to Roboto if the font files can't be fetched — a preview
 * rendering in the wrong face beats a preview that fails to render at all.
 *
 * Only *static* Inter instances work here: pdfkit ignores variable-font axes and
 * would silently render the default (thin) master from `InterVariable.ttf`.
 */
export async function getPdfMakeWithInter(): Promise<{
	font: 'Inter' | 'Roboto';
	pdfMake: PdfMakeBrowser;
}> {
	const pdfMake = await getPdfMake();
	try {
		const files = await loadFontVfs(INTER_URLS);
		registerFont(pdfMake, 'Inter', files, {
			normal: INTER_VFS_FILES.normal,
			bold: INTER_VFS_FILES.bold,
			// Inter has no italic static instance vendored, and the quotation
			// never uses one — map both to the upright faces.
			italics: INTER_VFS_FILES.normal,
			bolditalics: INTER_VFS_FILES.bold,
		});
		return { font: 'Inter', pdfMake };
	} catch {
		return { font: 'Roboto', pdfMake };
	}
}

/**
 * pdfmake with the three signature script faces registered on top of Inter.
 *
 * A face that fails to load is skipped rather than fatal: a signature rendered
 * in the body typeface is a cosmetic loss, while a document that refuses to
 * build leaves the signer with nothing to sign. Static instances only, for the
 * same reason Inter is — pdfkit ignores variable-font axes.
 */
export async function getPdfMakeWithSignatureFonts(): Promise<{
	font: 'Inter' | 'Roboto';
	pdfMake: PdfMakeBrowser;
}> {
	const result = await getPdfMakeWithInter();
	await Promise.all(
		SIGNATURE_STYLES.map(async (style) => {
			try {
				const files = await loadFontVfs({
					[style.file]: `/fonts/${style.file}`,
				});
				registerFont(result.pdfMake, style.pdfFont, files, {
					// Only a regular instance exists, and a signature never needs a
					// bold or italic one — every variant maps to the same face.
					normal: style.file,
					bold: style.file,
					italics: style.file,
					bolditalics: style.file,
				});
			} catch {
				// Left unregistered; the caller's text falls back to the body font.
			}
		})
	);
	return result;
}

/** Whether a style's face actually made it into the font map. */
export function isSignatureFontRegistered(pdfFont: string): boolean {
	return fontMap[pdfFont] !== undefined;
}
