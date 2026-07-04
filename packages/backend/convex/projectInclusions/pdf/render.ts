/// <reference path="./pdfmake-node.d.ts" />
'use node';

// Node pdfmake rendering for the inclusions PDF. Imported only by the
// `'use node'` action (uses pdfmake's server-side PdfPrinter, not the browser
// build the portal uses). Renders a docDefinition to a Buffer.
//
// pdfmake's node PdfPrinter resolves fonts by filename through a virtual file
// system object (it cannot take raw Buffers as font descriptors — it would try
// to treat them as URLs). Rather than depend on pdfmake's own `virtual-fs`
// singleton — which the Convex/esbuild bundler mis-resolves via pdfmake's
// `browser` field — we pass our own tiny in-memory FS holding the Roboto TTFs.

// biome-ignore lint/performance/noNamespaceImport: interop-safe pdfmake default unwrap
import * as vfsFontsModule from 'pdfmake/build/vfs_fonts';
// biome-ignore lint/performance/noNamespaceImport: interop-safe pdfmake default unwrap
import * as PrinterModule from 'pdfmake/js/Printer';
// biome-ignore lint/performance/noNamespaceImport: interop-safe pdfmake default unwrap
import * as URLResolverModule from 'pdfmake/js/URLResolver';

interface PdfKitDocument {
	end(): void;
	on(event: 'data', cb: (chunk: Buffer) => void): void;
	on(event: 'end', cb: () => void): void;
	on(event: 'error', cb: (error: Error) => void): void;
}
type PrinterConstructor = new (
	fontDescriptors: unknown,
	virtualfs: unknown,
	urlResolver: unknown
) => { createPdfKitDocument(docDefinition: unknown): Promise<PdfKitDocument> };
type ResolverConstructor = new (fs: unknown) => unknown;

interface FontFileSystem {
	existsSync(filename: string): boolean;
	readFileSync(filename: string): Buffer;
	writeFileSync(filename: string, content: Buffer): void;
}

const MAX_INTEROP_DEPTH = 5;

// esbuild's CJS→ESM interop may wrap a class export under one or more layers of
// `.default` (or none at all), depending on the module's `__esModule` marker.
// Unwrap `.default` until we reach the actual constructor function.
function resolveConstructor(mod: unknown): new (...args: unknown[]) => unknown {
	let current = mod;
	for (let depth = 0; depth < MAX_INTEROP_DEPTH; depth++) {
		if (typeof current === 'function') {
			return current as new (
				...args: unknown[]
			) => unknown;
		}
		if (current && typeof current === 'object' && 'default' in current) {
			current = (current as { default: unknown }).default;
		} else {
			break;
		}
	}
	throw new Error('pdfmake export could not be resolved to a constructor');
}

const ROBOTO_VFS_FILES = {
	normal: 'Roboto-Regular.ttf',
	bold: 'Roboto-Medium.ttf',
	italics: 'Roboto-Italic.ttf',
	bolditalics: 'Roboto-MediumItalic.ttf',
} as const;

/**
 * pdfmake ships `vfs_fonts` as a base64 `{ "Roboto-….ttf": "<base64>" }` map.
 * Bundlers may expose it on the module namespace, on `.default`, or nested under
 * `pdfMake.vfs`. Merge every `.ttf` entry we can find so no font is missing.
 */
function mergeVirtualFontFilesFromModule(mod: unknown): Record<string, string> {
	const merged: Record<string, string> = {};

	const mergeFromObject = (obj: unknown) => {
		if (!obj || typeof obj !== 'object') {
			return;
		}
		for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
			if (key.endsWith('.ttf') && typeof val === 'string' && val.length > 0) {
				merged[key] = val;
			}
		}
	};

	const record = mod as Record<string, unknown>;
	mergeFromObject(record);
	mergeFromObject(record.default);
	const nestedDefault = record.default as
		| { pdfMake?: { vfs?: unknown } }
		| undefined;
	mergeFromObject(nestedDefault?.pdfMake?.vfs);
	mergeFromObject((record as { pdfMake?: { vfs?: unknown } }).pdfMake?.vfs);

	return merged;
}

let fontFileSystem: FontFileSystem | null = null;

function getFontFileSystem(): FontFileSystem {
	if (fontFileSystem) {
		return fontFileSystem;
	}
	const vfs = mergeVirtualFontFilesFromModule(vfsFontsModule);
	const regular = vfs[ROBOTO_VFS_FILES.normal];
	if (typeof regular !== 'string' || regular === '') {
		throw new Error('Could not initialize PDF fonts.');
	}
	const regularBuffer = Buffer.from(regular, 'base64');
	const files: Record<string, Buffer> = {};
	for (const file of Object.values(ROBOTO_VFS_FILES)) {
		files[file] = Buffer.from(vfs[file] ?? regular, 'base64');
	}
	const fs: FontFileSystem = {
		existsSync: (filename) => filename in files,
		readFileSync: (filename) => files[filename] ?? regularBuffer,
		writeFileSync: () => undefined,
	};
	fontFileSystem = fs;
	return fs;
}

/**
 * Renders a pdfmake document definition to a PDF Buffer using the node printer.
 */
export function renderPdfToBuffer(
	docDefinition: Record<string, unknown>
): Promise<Buffer> {
	const vfs = getFontFileSystem();
	const PdfPrinter = resolveConstructor(PrinterModule) as PrinterConstructor;
	const URLResolver = resolveConstructor(
		URLResolverModule
	) as ResolverConstructor;

	const printer = new PdfPrinter(
		{ Roboto: { ...ROBOTO_VFS_FILES } },
		vfs,
		new URLResolver(vfs)
	);

	return new Promise<Buffer>((resolve, reject) => {
		printer
			.createPdfKitDocument(docDefinition)
			.then((doc) => {
				const chunks: Buffer[] = [];
				doc.on('data', (chunk: Buffer) => chunks.push(chunk));
				doc.on('end', () => resolve(Buffer.concat(chunks)));
				doc.on('error', reject);
				doc.end();
			})
			.catch(reject);
	});
}
