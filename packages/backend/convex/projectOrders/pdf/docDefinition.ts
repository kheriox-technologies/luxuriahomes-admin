// Node pdfmake document definition for the project order PDF. This mirrors the
// portal's browser-side layout in apps/portal/lib/pdf/project-order-pdf.ts, but
// lives on the backend so the mobile app (which cannot run the browser pdfmake
// build) can generate the same PDF via the `generatePdf` action.

export interface OrderPdfItem {
	description?: string;
	link?: string;
	name: string;
	quantity: number;
	sku?: string;
	unit: string;
}

export interface OrderPdfAddress {
	postcode: string;
	state: string;
	street: string;
	suburb: string;
}

export interface OrderPdfOptions {
	items: OrderPdfItem[];
	orderId: string;
	projectAddress: OrderPdfAddress;
	vendor: string;
}

export interface OrderPdfContact {
	email: string;
	phone: string;
}

const DASH = '—';

function formatAddressLine(address: OrderPdfAddress): string {
	return `${address.street}, ${address.suburb}, ${address.state} ${address.postcode}`;
}

export function buildOrderDocDefinition(
	logoDataUrl: string,
	contact: OrderPdfContact,
	options: OrderPdfOptions
): Record<string, unknown> {
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
			item.description ?? DASH,
			item.sku ?? DASH,
			item.link ? { text: item.link, link: item.link } : DASH,
			`${item.quantity} ${item.unit}`,
		]),
	];

	return {
		pageSize: 'A4',
		pageOrientation: 'portrait',
		pageMargins: [36, 90, 36, 44],
		defaultStyle: { font: 'Roboto' },
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
							margin: [0, 2, 0, 0],
						},
					],
					alignment: 'right',
					margin: [0, 8, 0, 0],
				},
			],
		}),
		footer: () => ({
			margin: [36, 0, 36, 14],
			columns: [
				{ text: contact.email, fontSize: 9 },
				{ text: contact.phone, fontSize: 9, alignment: 'right' },
			],
		}),
		content: [
			{
				text: options.vendor,
				fontSize: 16,
				bold: true,
				margin: [0, 0, 0, 16],
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
