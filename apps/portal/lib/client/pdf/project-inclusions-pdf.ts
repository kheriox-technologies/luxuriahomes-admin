import { env } from '@workspace/env/portal';
import { getProjectInclusionsPdfLogoDataUrl } from '@/lib/pdf/pdf-assets';
import { type CreatedPdf, getPdfMake } from '@/lib/pdf/pdf-fonts';

export interface PdfProjectAddress {
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
	color?: string;
	details?: string;
	image?: string;
	link?: string;
	locations?: { name: string; quantity?: number; unit?: string }[];
	models: string[];
	status?: 'Under Review' | 'Approved';
	title: string;
	variationPrice?: number;
	vendor: string;
}

export interface ProjectPdfSection {
	inclusions: ProjectPdfInclusion[];
	sectionId: string;
	sectionName: string;
	totalVariationSalePrice: number;
}

export interface OpenProjectInclusionsPdfOptions {
	clients: ProjectPdfClient[];
	groupedByVendor?: boolean;
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

function resolveInclusionImageDataUrls(
	sections: ProjectPdfSection[]
): Map<string, string> {
	const out = new Map<string, string>();
	for (const section of sections) {
		for (const inclusion of section.inclusions) {
			const dataUrl = inclusion.image?.trim();
			if (dataUrl) {
				out.set(inclusion._id, dataUrl);
			}
		}
	}
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
				width: 104,
				alignment: 'center',
			},
		],
		alignment: 'center',
		margin: [2, 4, 2, 4] as [number, number, number, number],
	};
}

function inclusionQuantityCell(inclusion: ProjectPdfInclusion): string {
	const locations = inclusion.locations ?? [];
	if (locations.length === 0) {
		return '—';
	}
	const totalQty = locations.reduce((sum, l) => sum + (l.quantity ?? 0), 0);
	if (totalQty === 0) {
		return '—';
	}
	const unit = locations.find((l) => l.unit?.trim())?.unit?.trim();
	return unit ? `${totalQty} ${unit}` : String(totalQty);
}

function inclusionLinkTableCell(
	link: string | undefined
): Record<string, unknown> | string {
	const trimmed = link?.trim();
	if (!trimmed) {
		return '-';
	}
	return {
		text: 'View Online',
		link: trimmed,
		color: '#2563eb',
		decoration: 'underline',
	};
}

interface GroupPdfOptions {
	hideClientSection: boolean;
	hideSectionHeadings: boolean;
	titleOverride: string;
}

function buildDocDefinition(
	logoDataUrl: string,
	options: OpenProjectInclusionsPdfOptions,
	inclusionImageDataUrls: Map<string, string>,
	groupOptions?: GroupPdfOptions
) {
	const projectAddressLine = formatAddressLine(options.projectAddress);
	const groupedByVendor = options.groupedByVendor === true;
	const sectionsContent: unknown[] = [];

	for (const section of options.sections) {
		const body: unknown[][] = [
			[
				{ text: 'Title', bold: true, fillColor: '#f3f4f6' },
				{ text: 'Vendor & details', bold: true, fillColor: '#f3f4f6' },
				{ text: 'Color', bold: true, fillColor: '#f3f4f6' },
				{
					text: groupedByVendor ? 'Quantity' : 'Location',
					bold: true,
					fillColor: '#f3f4f6',
				},
				{ text: 'Status', bold: true, fillColor: '#f3f4f6' },
				{ text: 'Web link', bold: true, fillColor: '#f3f4f6' },
				{ text: 'Image', bold: true, fillColor: '#f3f4f6' },
			],
		];

		for (const inclusion of section.inclusions) {
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
				inclusion.color ?? '—',
				groupedByVendor
					? inclusionQuantityCell(inclusion)
					: inclusion.locations?.map((l) => l.name).join(', ') || '—',
				inclusion.status ?? 'Under Review',
				inclusionLinkTableCell(inclusion.link),
				inclusionImageTableCell(inclusionImageDataUrls.get(inclusion._id)),
			]);
		}

		if (!groupOptions?.hideSectionHeadings) {
			sectionsContent.push({
				text: section.sectionName,
				fontSize: 14,
				bold: true,
				margin: [0, 0, 0, 8],
			});
		}
		sectionsContent.push({
			table: {
				headerRows: 1,
				dontBreakRows: true,
				widths: ['18%', '22%', '8%', '12%', '10%', '9%', '21%'],
				body,
			},
			fontSize: 9,
			layout: 'lightHorizontalLines',
			margin: [0, 0, 0, 16],
		});
	}

	if (!groupOptions?.hideClientSection) {
		sectionsContent.push({
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
		});
	}

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
					{ text: env.NEXT_PUBLIC_CONTACT_EMAIL, fontSize: 9 },
					{
						text: env.NEXT_PUBLIC_CONTACT_PHONE,
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
						text: groupOptions?.titleOverride ?? 'Schedule Of Finishes',
						fontSize: 24,
						bold: true,
						margin: [0, 0, 0, 12],
					},
					{
						text: projectAddressLine,
						fontSize: 11,
						margin: [0, 0, 0, groupOptions?.hideClientSection ? 0 : 28],
					},
					...(groupOptions?.hideClientSection
						? []
						: [
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
														margin: [0, 4, 0, 0] as [
															number,
															number,
															number,
															number,
														],
													},
													{
														text: client.phone || 'Phone: -',
														fontSize: 10,
														margin: [0, 2, 0, 0] as [
															number,
															number,
															number,
															number,
														],
													},
												],
											})),
											columnGap: 24,
										},
							]),
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
						text: env.NEXT_PUBLIC_CONTACT_ADDRESS.replace(/\\n/g, '\n'),
						fontSize: 14,
						margin: [0, 0, 0, 18],
					},
					{ text: env.NEXT_PUBLIC_CONTACT_EMAIL, fontSize: 12 },
					{
						text: env.NEXT_PUBLIC_CONTACT_PHONE,
						fontSize: 12,
						margin: [0, 8, 0, 0],
					},
				],
			},
		],
	};
}

async function createInclusionsPdf(
	options: OpenProjectInclusionsPdfOptions,
	groupOptions?: GroupPdfOptions
): Promise<CreatedPdf> {
	const [pdfMake, logoDataUrl] = await Promise.all([
		getPdfMake(),
		getProjectInclusionsPdfLogoDataUrl(),
	]);

	const inclusionImageDataUrls = resolveInclusionImageDataUrls(
		options.sections
	);
	const docDefinition = buildDocDefinition(
		logoDataUrl,
		options,
		inclusionImageDataUrls,
		groupOptions
	);

	return pdfMake.createPdf(docDefinition as never) as unknown as CreatedPdf;
}

async function openPdfInNewTab(pdf: CreatedPdf): Promise<void> {
	// Use getBlob() instead of open() so errors thrown during PDF generation
	// propagate to the caller rather than silently leaving a blank tab open.
	const blob = await pdf.getBlob();
	const blobUrl = URL.createObjectURL(blob);
	const win = window.open(blobUrl, '_blank');
	// Revoke after 60 s — enough time for the browser to load the PDF.
	setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
	if (!win) {
		throw new Error('Could not open PDF — please allow popups for this site.');
	}
}

export async function openProjectInclusionsPdfInNewTab(
	options: OpenProjectInclusionsPdfOptions
): Promise<void> {
	const pdf = await createInclusionsPdf(options);
	await openPdfInNewTab(pdf);
}

/**
 * Generates the full project inclusions PDF and resolves with its base64
 * contents (without a data-URL prefix) — suitable for an email attachment.
 */
export async function generateProjectInclusionsPdfBase64(
	options: OpenProjectInclusionsPdfOptions
): Promise<string> {
	const pdf = await createInclusionsPdf(options);
	return await pdf.getBase64();
}

export interface OpenGroupInclusionsPdfOptions {
	groupedByVendor?: boolean;
	groupName: string;
	inclusions: ProjectPdfInclusion[];
	projectAddress: PdfProjectAddress;
}

function buildGroupPdfArgs(
	options: OpenGroupInclusionsPdfOptions
): [OpenProjectInclusionsPdfOptions, GroupPdfOptions] {
	const section = {
		sectionId: options.groupName,
		sectionName: options.groupName,
		inclusions: options.inclusions,
		totalVariationSalePrice: 0,
	};
	return [
		{
			clients: [],
			groupedByVendor: options.groupedByVendor,
			projectAddress: options.projectAddress,
			projectName: options.groupName,
			sections: [section],
		},
		{
			titleOverride: options.groupName,
			hideClientSection: true,
			hideSectionHeadings: true,
		},
	];
}

export async function openGroupInclusionsPdfInNewTab(
	options: OpenGroupInclusionsPdfOptions
): Promise<void> {
	const pdf = await createInclusionsPdf(...buildGroupPdfArgs(options));
	await openPdfInNewTab(pdf);
}

/**
 * Generates a single group's inclusions PDF and resolves with its base64
 * contents (without a data-URL prefix) — suitable for an email attachment.
 */
export async function generateGroupInclusionsPdfBase64(
	options: OpenGroupInclusionsPdfOptions
): Promise<string> {
	const pdf = await createInclusionsPdf(...buildGroupPdfArgs(options));
	return await pdf.getBase64();
}
