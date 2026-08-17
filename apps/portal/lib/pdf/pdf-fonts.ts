/**
 * Shared browser `pdfmake` setup. `pdfMake` is a module-level singleton with one
 * internal virtual file system and one font map, so every PDF builder in the app
 * has to go through here — registering fonts from two places would have the last
 * writer silently drop the other's typefaces.
 */

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

// Kept so Inter can be added later without dropping Roboto — `setFonts` replaces
// the whole map rather than merging into it.
let robotoMap: Record<string, string> = robotoFontMap({});

/**
 * Browser `pdfMake` loads fonts from an internal virtual FS. Assigning
 * `pdfMake.vfs = …` does not register files — you must call
 * `addVirtualFileSystem` so `Roboto-Medium.ttf` etc. exist for the font map.
 */
function configurePdfMakeFonts(
	pdfMake: PdfMakeBrowser,
	vfs: Record<string, string>
) {
	pdfMake.addVirtualFileSystem(vfs);
	robotoMap = robotoFontMap(vfs);
	pdfMake.setFonts({ Roboto: robotoMap });
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
		configurePdfMakeFonts(pdfMake as PdfMakeBrowser, vfs);
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

let interPromise: Promise<Record<string, string>> | null = null;

function loadInterVfs(): Promise<Record<string, string>> {
	if (interPromise) {
		return interPromise;
	}
	interPromise = (async () => {
		const entries = await Promise.all(
			Object.entries(INTER_URLS).map(async ([file, url]) => {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`Could not load ${file}`);
				}
				return [file, toBase64(await response.arrayBuffer())] as const;
			})
		);
		return Object.fromEntries(entries);
	})();
	return interPromise;
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
		const files = await loadInterVfs();
		pdfMake.addVirtualFileSystem(files);
		pdfMake.setFonts({
			Roboto: robotoMap,
			Inter: {
				normal: INTER_VFS_FILES.normal,
				bold: INTER_VFS_FILES.bold,
				// Inter has no italic static instance vendored, and the quotation
				// never uses one — map both to the upright faces.
				italics: INTER_VFS_FILES.normal,
				bolditalics: INTER_VFS_FILES.bold,
			},
		});
		return { font: 'Inter', pdfMake };
	} catch {
		return { font: 'Roboto', pdfMake };
	}
}
