import {
	fetchUrlAsDataUrl,
	getProjectInclusionsPdfLogoDataUrl,
	PDF_PLACEHOLDERS,
} from '@/lib/pdf/pdf-assets';

const audFormatter = new Intl.NumberFormat('en-AU', {
	style: 'currency',
	currency: 'AUD',
});

function formatAud(amount: number): string {
	return audFormatter.format(amount);
}

function formatSignedAud(amount: number): string {
	if (amount === 0) {
		return '$0.00';
	}
	return `${amount > 0 ? '+' : '-'} ${formatAud(Math.abs(amount))}`;
}

interface PdfProjectAddress {
	postcode: string;
	state: string;
	street: string;
	suburb: string;
}

export interface ProjectPdfClient {
	email: string;
	firstName: string;
	lastName: string;
	phone: string;
}

export interface ProjectPdfInclusion {
	_id: string;
	class: 'Standard' | 'Gold' | 'Platinum';
	code: string;
	details?: string;
	image?: string;
	models: string[];
	status?: 'Under Review' | 'Approved';
	title: string;
	variationSalePrice?: number;
	vendor: string;
}

export interface ProjectPdfSection {
	categoryId: string;
	categoryName: string;
	inclusions: ProjectPdfInclusion[];
	totalVariationSalePrice: number;
}

export interface OpenProjectInclusionsPdfOptions {
	clients: ProjectPdfClient[];
	projectAddress: PdfProjectAddress;
	projectName: string;
	sections: ProjectPdfSection[];
}

function formatAddressLine(address: PdfProjectAddress): string {
	return `${address.street}, ${address.suburb}, ${address.state} ${address.postcode}`;
}

function formatClientName(client: ProjectPdfClient): string {
	return `${client.firstName} ${client.lastName}`.trim();
}

async function resolveInclusionImageDataUrls(
	sections: ProjectPdfSection[]
): Promise<Map<string, string>> {
	const out = new Map<string, string>();
	await Promise.all(
		sections.flatMap((section) =>
			section.inclusions.map(async (inclusion) => {
				const url = inclusion.image?.trim();
				if (!url) {
					return;
				}
				const dataUrl = await fetchUrlAsDataUrl(url);
				if (dataUrl) {
					out.set(inclusion._id, dataUrl);
				}
			})
		)
	);
	return out;
}

function inclusionImageTableCell(
	imageDataUrl: string | undefined
): Record<string, unknown> | string {
	if (!imageDataUrl) {
		return '—';
	}
	return {
		stack: [
			{
				image: imageDataUrl,
				width: 52,
				alignment: 'center',
			},
		],
		alignment: 'center',
		margin: [2, 4, 2, 4] as [number, number, number, number],
	};
}

function buildDocDefinition(
	logoDataUrl: string,
	options: OpenProjectInclusionsPdfOptions,
	inclusionImageDataUrls: Map<string, string>
) {
	const projectAddressLine = formatAddressLine(options.projectAddress);
	const sectionsContent: unknown[] = [];
	let totalInclusions = 0;
	let totalVariationAmount = 0;

	for (const section of options.sections) {
		totalInclusions += section.inclusions.length;
		totalVariationAmount += section.totalVariationSalePrice;

		const body: unknown[][] = [
			[
				{ text: 'Title', bold: true, fillColor: '#f3f4f6' },
				{ text: 'Vendor & details', bold: true, fillColor: '#f3f4f6' },
				{ text: 'Status', bold: true, fillColor: '#f3f4f6' },
				{
					text: 'Variation',
					bold: true,
					fillColor: '#f3f4f6',
					alignment: 'right',
				},
				{ text: 'Image', bold: true, fillColor: '#f3f4f6' },
			],
		];

		for (const inclusion of section.inclusions) {
			const variation =
				inclusion.class === 'Standard'
					? '—'
					: formatSignedAud(inclusion.variationSalePrice ?? 0);

			const vendorDetails = [
				inclusion.vendor,
				inclusion.models.join(', '),
				inclusion.details ?? '',
			]
				.filter((part) => part.trim() !== '')
				.join('\n');

			body.push([
				`${inclusion.title}\n${inclusion.code}`,
				vendorDetails || '—',
				inclusion.status ?? 'Under Review',
				{ text: variation, alignment: 'right' },
				inclusionImageTableCell(inclusionImageDataUrls.get(inclusion._id)),
			]);
		}

		body.push([
			{
				text: `Total variation (${section.categoryName})`,
				bold: true,
				colSpan: 3,
				alignment: 'right',
			},
			{},
			{},
			{
				text: formatSignedAud(section.totalVariationSalePrice),
				bold: true,
				alignment: 'right',
			},
			'',
		]);

		sectionsContent.push(
			{
				text: section.categoryName,
				fontSize: 14,
				bold: true,
				margin: [0, 0, 0, 8],
			},
			{
				table: {
					headerRows: 1,
					widths: ['24%', '32%', '12%', '12%', '20%'],
					body,
				},
				fontSize: 9,
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16],
			}
		);
	}

	sectionsContent.push(
		{
			text: 'Summary',
			fontSize: 14,
			bold: true,
			margin: [0, 6, 0, 8],
		},
		{
			stack: [
				{ text: `Total inclusions: ${totalInclusions}`, fontSize: 11 },
				{
					text: `Total variation amount: ${formatSignedAud(totalVariationAmount)}`,
					fontSize: 11,
					margin: [0, 4, 0, 0] as [number, number, number, number],
				},
			],
			margin: [0, 0, 0, 16],
		},
		{
			unbreakable: true,
			stack: [
				{
					text: 'Client signatures',
					fontSize: 13,
					bold: true,
					margin: [0, 2, 0, 12],
				},
				options.clients.length === 0
					? {
							text: 'No clients',
							color: '#6b7280',
							italics: true,
						}
					: {
							columnGap: 28,
							columns: options.clients.map((client) => ({
								width: '*' as const,
								unbreakable: true,
								stack: [
									{
										text: formatClientName(client) || 'Client',
										bold: true,
										margin: [0, 0, 0, 22],
									},
									{
										canvas: [
											{
												type: 'line',
												x1: 0,
												y1: 0,
												x2: 220,
												y2: 0,
												lineWidth: 1,
											},
										],
									},
									{
										text: 'Signature',
										fontSize: 9,
										color: '#6b7280',
										margin: [0, 6, 0, 0],
									},
								],
							})),
						},
			],
		}
	);

	// pdfmake header height equals `pageMargins.top`; keep it large enough for logo + address.
	const pageMarginTop = 100;

	return {
		pageSize: 'A4',
		pageOrientation: 'landscape',
		pageMargins: [36, pageMarginTop, 36, 44],
		header: (currentPage: number, pageCount: number) => {
			if (currentPage === 1 || currentPage === pageCount) {
				return null;
			}
			return {
				margin: [36, 10, 36, 12],
				columns: [
					{ image: logoDataUrl, width: 90 },
					{
						text: projectAddressLine,
						alignment: 'right',
						fontSize: 10,
						margin: [0, 10, 0, 0],
					},
				],
			};
		},
		footer: (currentPage: number, pageCount: number) => {
			if (currentPage === 1 || currentPage === pageCount) {
				return null;
			}
			return {
				margin: [36, 0, 36, 14],
				columns: [
					{ text: PDF_PLACEHOLDERS.builderEmail, fontSize: 9 },
					{
						text: PDF_PLACEHOLDERS.builderPhone,
						fontSize: 9,
						alignment: 'right',
					},
				],
			};
		},
		content: [
			{
				alignment: 'center',
				// Keep vertical position similar to before (was 48 + 110); larger `pageMarginTop` reduces this.
				margin: [0, 58, 0, 0],
				stack: [
					{ image: logoDataUrl, width: 180, margin: [0, 0, 0, 28] },
					{
						text: 'Schedule Of Finishes',
						fontSize: 24,
						bold: true,
						margin: [0, 0, 0, 12],
					},
					{
						text: projectAddressLine,
						fontSize: 11,
						margin: [0, 0, 0, 28],
					},
					options.clients.length === 0
						? {
								text: 'No client details available',
								italics: true,
								color: '#6b7280',
								fontSize: 11,
							}
						: {
								columns: options.clients.map((client) => ({
									width: '*' as const,
									stack: [
										{
											text: formatClientName(client),
											bold: true,
											fontSize: 12,
										},
										{
											text: client.email || 'Email: -',
											fontSize: 10,
											margin: [0, 4, 0, 0] as [number, number, number, number],
										},
										{
											text: client.phone || 'Phone: -',
											fontSize: 10,
											margin: [0, 2, 0, 0] as [number, number, number, number],
										},
									],
								})),
								columnGap: 24,
							},
				],
			},
			{
				text: '',
				pageBreak: 'after',
			},
			...sectionsContent,
			{
				text: '',
				pageBreak: 'before',
			},
			{
				alignment: 'center',
				margin: [0, 88, 0, 0],
				stack: [
					{ image: logoDataUrl, width: 180, margin: [0, 0, 0, 32] },
					{
						text: PDF_PLACEHOLDERS.companyAddress,
						fontSize: 14,
						margin: [0, 0, 0, 18],
					},
					{ text: PDF_PLACEHOLDERS.companyContactLine1, fontSize: 12 },
					{
						text: PDF_PLACEHOLDERS.companyContactLine2,
						fontSize: 12,
						margin: [0, 8, 0, 0],
					},
				],
			},
		],
	};
}

const ROBOTO_VFS_FILES = {
	normal: 'Roboto-Regular.ttf',
	bold: 'Roboto-Medium.ttf',
	italics: 'Roboto-Italic.ttf',
	bolditalics: 'Roboto-MediumItalic.ttf',
} as const;

/**
 * pdfmake ships `vfs_fonts` as CJS `module.exports = { "Roboto-….ttf": "<base64>" }`.
 * Bundlers may expose that map on `import().default`, on the module namespace, or split
 * across both — taking the first object with any `.ttf` can yield a partial vfs and then
 * `Roboto-Medium.ttf` is missing at runtime. Merge every `.ttf` entry we can find.
 */
function mergeVirtualFontFilesFromModule(
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

interface PdfMakeBrowser {
	addVirtualFileSystem: (
		vfs: Record<string, string | { data: string; encoding?: string }>
	) => void;
	setFonts: (fonts: Record<string, Record<string, string>>) => void;
}

/**
 * Browser `pdfmake` is a singleton that loads fonts from an internal virtual FS.
 * Assigning `pdfMake.vfs = …` does not register files — you must call
 * `addVirtualFileSystem` so `Roboto-Medium.ttf` etc. exist for the default font map.
 */
function configurePdfMakeFonts(
	pdfMake: PdfMakeBrowser,
	vfs: Record<string, string>
) {
	pdfMake.addVirtualFileSystem(vfs);

	const pick = (file: string, fallback: string) =>
		vfs[file] !== undefined && vfs[file] !== '' ? file : fallback;

	pdfMake.setFonts({
		Roboto: {
			normal: pick(ROBOTO_VFS_FILES.normal, ROBOTO_VFS_FILES.normal),
			bold: pick(ROBOTO_VFS_FILES.bold, ROBOTO_VFS_FILES.normal),
			italics: pick(ROBOTO_VFS_FILES.italics, ROBOTO_VFS_FILES.normal),
			bolditalics: pick(
				ROBOTO_VFS_FILES.bolditalics,
				pick(ROBOTO_VFS_FILES.italics, ROBOTO_VFS_FILES.normal)
			),
		},
	});
}

export async function openProjectInclusionsPdfInNewTab(
	options: OpenProjectInclusionsPdfOptions
): Promise<void> {
	const [{ default: pdfMake }, vfsModule, logoDataUrl] = await Promise.all([
		import('pdfmake/build/pdfmake'),
		import('pdfmake/build/vfs_fonts'),
		getProjectInclusionsPdfLogoDataUrl(),
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

	const inclusionImageDataUrls = await resolveInclusionImageDataUrls(
		options.sections
	);
	const docDefinition = buildDocDefinition(
		logoDataUrl,
		options,
		inclusionImageDataUrls
	);
	pdfMake.createPdf(docDefinition as never).open();
}
