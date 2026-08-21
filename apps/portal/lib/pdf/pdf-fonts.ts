/**
 * Shared browser `pdfmake` setup for the builders that still render in the
 * browser — the inclusions and letter PDFs. `pdfMake` is a module-level
 * singleton with one internal virtual file system and one font map, so every
 * such builder has to go through here: registering fonts from two places would
 * have the last writer silently drop the other's typefaces.
 *
 * The client quotation used to be built here too, in Inter and the three
 * signature script faces. It now renders server-side
 * (`packages/backend/convex/clientQuotations/pdf/`) so mobile can issue one as
 * well, which is why only Roboto is registered here.
 */

const ROBOTO_VFS_FILES = {
	normal: 'Roboto-Regular.ttf',
	bold: 'Roboto-Medium.ttf',
	italics: 'Roboto-Italic.ttf',
	bolditalics: 'Roboto-MediumItalic.ttf',
} as const;

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
