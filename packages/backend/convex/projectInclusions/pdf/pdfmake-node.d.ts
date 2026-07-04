// Minimal type declarations for pdfmake's node subpath modules. The published
// `pdfmake` types describe the browser entry, not these internal server-side
// modules (js/Printer, js/URLResolver, js/virtual-fs), which are what the node
// PdfPrinter path actually uses.

declare module 'pdfmake/js/Printer' {
	interface PdfKitDocument {
		end(): void;
		on(event: 'data', cb: (chunk: Buffer) => void): void;
		on(event: 'end', cb: () => void): void;
		on(event: 'error', cb: (error: Error) => void): void;
	}
	export default class PdfPrinter {
		constructor(
			fontDescriptors: unknown,
			virtualfs?: unknown,
			urlResolver?: unknown
		);
		createPdfKitDocument(
			docDefinition: unknown,
			options?: unknown
		): Promise<PdfKitDocument>;
	}
}

declare module 'pdfmake/js/URLResolver' {
	export default class URLResolver {
		constructor(fs: unknown);
	}
}

declare module 'pdfmake/js/virtual-fs' {
	const virtualfs: {
		writeFileSync(filename: string, content: string, options?: string): void;
		readFileSync(filename: string, options?: string): Buffer | string;
		existsSync(filename: string): boolean;
	};
	export default virtualfs;
}

declare module 'pdfmake/build/vfs_fonts' {
	const vfs: Record<string, string>;
	export default vfs;
}
