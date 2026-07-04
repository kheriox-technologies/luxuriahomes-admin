// Pure pdfmake document-definition builder for the project inclusions PDF.
//
// Ported from apps/portal/lib/pdf/project-inclusions-pdf.ts (buildDocDefinition
// + helpers). Kept dependency-free: contact info and the logo data URL are
// passed in as parameters (the portal version reads them from env / bundled
// assets, neither of which is available inside a Convex node action). The table
// columns match the portal output exactly so both surfaces produce the same PDF.

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

export interface PdfContactInfo {
	address: string;
	email: string;
	phone: string;
}

export interface BuildInclusionsDocOptions {
	clients: ProjectPdfClient[];
	groupedByVendor?: boolean;
	projectAddress: PdfProjectAddress;
	projectName: string;
	sections: ProjectPdfSection[];
}

export interface GroupPdfOptions {
	hideClientSection: boolean;
	hideSectionHeadings: boolean;
	titleOverride: string;
}

const newlineEscape = /\\n/g;

function formatAddressLine(address: PdfProjectAddress): string {
	return `${address.street}, ${address.suburb}, ${address.state} ${address.postcode}`;
}

function formatClientName(client: ProjectPdfClient): string {
	return `${client.firstName} ${client.lastName}`.trim();
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

function buildSectionTable(
	section: ProjectPdfSection,
	groupedByVendor: boolean,
	imageDataUrls: Map<string, string>
): Record<string, unknown> {
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
			inclusionImageTableCell(imageDataUrls.get(inclusion._id)),
		]);
	}

	return {
		table: {
			headerRows: 1,
			dontBreakRows: true,
			widths: ['18%', '22%', '8%', '12%', '10%', '9%', '21%'],
			body,
		},
		fontSize: 9,
		layout: 'lightHorizontalLines',
		margin: [0, 0, 0, 16],
	};
}

function buildClientSignatures(
	clients: ProjectPdfClient[]
): Record<string, unknown> {
	return {
		unbreakable: true,
		stack: [
			{
				text: 'Client signatures',
				fontSize: 13,
				bold: true,
				margin: [0, 2, 0, 12],
			},
			clients.length === 0
				? { text: 'No clients', color: '#6b7280', italics: true }
				: {
						columnGap: 28,
						columns: clients.map((client) => ({
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
	};
}

function buildCoverClients(
	clients: ProjectPdfClient[]
): Record<string, unknown> {
	if (clients.length === 0) {
		return {
			text: 'No client details available',
			italics: true,
			color: '#6b7280',
			fontSize: 11,
		};
	}
	return {
		columns: clients.map((client) => ({
			width: '*' as const,
			stack: [
				{ text: formatClientName(client), bold: true, fontSize: 12 },
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
	};
}

/**
 * Builds the pdfmake document definition. `imageDataUrls` maps inclusion `_id`
 * to a JPEG/PNG data URL (the caller resolves these server-side); inclusions
 * without an entry render a `—` in the image column.
 */
export function buildInclusionsDocDefinition(
	logoDataUrl: string,
	contact: PdfContactInfo,
	options: BuildInclusionsDocOptions,
	imageDataUrls: Map<string, string>,
	groupOptions?: GroupPdfOptions
): Record<string, unknown> {
	const projectAddressLine = formatAddressLine(options.projectAddress);
	const groupedByVendor = options.groupedByVendor === true;
	const sectionsContent: unknown[] = [];

	for (const section of options.sections) {
		if (!groupOptions?.hideSectionHeadings) {
			sectionsContent.push({
				text: section.sectionName,
				fontSize: 14,
				bold: true,
				margin: [0, 0, 0, 8],
			});
		}
		sectionsContent.push(
			buildSectionTable(section, groupedByVendor, imageDataUrls)
		);
	}

	if (!groupOptions?.hideClientSection) {
		sectionsContent.push(buildClientSignatures(options.clients));
	}

	// pdfmake header height equals `pageMargins.top`; keep it large enough for
	// logo + address.
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
					{ text: contact.email, fontSize: 9 },
					{ text: contact.phone, fontSize: 9, alignment: 'right' },
				],
			};
		},
		content: [
			{
				alignment: 'center',
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
						: [buildCoverClients(options.clients)]),
				],
			},
			{ text: '', pageBreak: 'after' },
			...sectionsContent,
			{ text: '', pageBreak: 'before' },
			{
				alignment: 'center',
				margin: [0, 88, 0, 0],
				stack: [
					{ image: logoDataUrl, width: 180, margin: [0, 0, 0, 32] },
					{
						text: contact.address.replace(newlineEscape, '\n'),
						fontSize: 14,
						margin: [0, 0, 0, 18],
					},
					{ text: contact.email, fontSize: 12 },
					{ text: contact.phone, fontSize: 12, margin: [0, 8, 0, 0] },
				],
			},
		],
	};
}
