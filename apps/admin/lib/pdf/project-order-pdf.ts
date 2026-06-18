'use client';

import { env } from '@workspace/env/admin';
import { getProjectInclusionsPdfLogoDataUrl } from '@/lib/pdf/pdf-assets';

export interface OrderPdfItem {
	description?: string;
	link?: string;
	name: string;
	quantity: number;
	sku?: string;
	unit: string;
}

export interface OpenProjectOrderPdfOptions {
	items: OrderPdfItem[];
	orderId: string;
	projectAddress: {
		street: string;
		suburb: string;
		state: string;
		postcode: string;
	};
	vendor: string;
}

function formatAddressLine(
	address: OpenProjectOrderPdfOptions['projectAddress']
): string {
	return `${address.street}, ${address.suburb}, ${address.state} ${address.postcode}`;
}

const ROBOTO_VFS_FILES = {
	normal: 'Roboto-Regular.ttf',
	bold: 'Roboto-Medium.ttf',
	italics: 'Roboto-Italic.ttf',
	bolditalics: 'Roboto-MediumItalic.ttf',
} as const;

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

interface CreatedPdf {
	getBase64: () => Promise<string>;
	open: () => void;
}

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

function buildOrderDocDefinition(
	logoDataUrl: string,
	options: OpenProjectOrderPdfOptions
): unknown {
	const addressLine = formatAddressLine(options.projectAddress);

	const tableBody: unknown[][] = [
		[
			{ text: 'Name', bold: true, fillColor: '#f3f4f6' },
			{ text: 'Description', bold: true, fillColor: '#f3f4f6' },
			{ text: 'SKU', bold: true, fillColor: '#f3f4f6' },
			{ text: 'Link', bold: true, fillColor: '#f3f4f6' },
			{ text: 'Quantity', bold: true, fillColor: '#f3f4f6' },
		],
		...options.items.map((item) => [
			item.name,
			item.description ?? '—',
			item.sku ?? '—',
			item.link ? { text: item.link, link: item.link } : '—',
			`${item.quantity} ${item.unit}`,
		]),
	];

	return {
		pageSize: 'A4',
		pageOrientation: 'portrait',
		pageMargins: [36, 90, 36, 44],
		header: () => ({
			margin: [36, 24, 36, 12],
			columns: [
				{ image: logoDataUrl, width: 90 },
				{
					stack: [
						{ text: options.orderId, bold: true, fontSize: 10 },
						{
							text: addressLine,
							fontSize: 9,
							color: '#6b7280',
							margin: [0, 2, 0, 0] as [number, number, number, number],
						},
					],
					alignment: 'right',
					margin: [0, 8, 0, 0] as [number, number, number, number],
				},
			],
		}),
		footer: () => ({
			margin: [36, 0, 36, 14],
			columns: [
				{ text: env.NEXT_PUBLIC_CONTACT_EMAIL, fontSize: 9 },
				{
					text: env.NEXT_PUBLIC_CONTACT_PHONE,
					fontSize: 9,
					alignment: 'right',
				},
			],
		}),
		content: [
			{
				text: options.vendor,
				fontSize: 16,
				bold: true,
				margin: [0, 0, 0, 16] as [number, number, number, number],
			},
			{
				table: {
					headerRows: 1,
					widths: ['*', '20%', '12%', '20%', '13%'],
					body: tableBody,
				},
				layout: 'lightHorizontalLines',
				fontSize: 9,
			},
		],
	};
}

async function createProjectOrderPdf(options: OpenProjectOrderPdfOptions) {
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

	const docDefinition = buildOrderDocDefinition(logoDataUrl, options);
	return pdfMake.createPdf(docDefinition as never) as unknown as CreatedPdf;
}

export async function openProjectOrderPdfInNewTab(
	options: OpenProjectOrderPdfOptions
): Promise<void> {
	const pdf = await createProjectOrderPdf(options);
	pdf.open();
}

/**
 * Generates the order PDF and resolves with its base64 contents (without a
 * data-URL prefix) — suitable for sending as an email attachment.
 */
export async function generateProjectOrderPdfBase64(
	options: OpenProjectOrderPdfOptions
): Promise<string> {
	const pdf = await createProjectOrderPdf(options);
	return await pdf.getBase64();
}
