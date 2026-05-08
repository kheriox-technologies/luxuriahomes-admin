let logoDataUrlPromise: Promise<string> | null = null;

export function blobToDataUrl(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			const result = reader.result;
			if (typeof result === 'string') {
				resolve(result);
				return;
			}
			reject(new Error('Could not convert logo file to data URL.'));
		};
		reader.onerror = () => {
			reject(new Error('Could not read logo file.'));
		};
		reader.readAsDataURL(blob);
	});
}

export function getProjectInclusionsPdfLogoDataUrl(): Promise<string> {
	if (logoDataUrlPromise) {
		return logoDataUrlPromise;
	}
	logoDataUrlPromise = (async () => {
		const response = await fetch('/lh-admin-logo-pdf.png');
		if (!response.ok) {
			throw new Error('Could not load PDF logo from public assets.');
		}
		const blob = await response.blob();
		return blobToDataUrl(blob);
	})();
	return logoDataUrlPromise;
}

/** Fetches a remote image for embedding in pdfmake (browser). Returns null on failure or empty body. */
export async function fetchUrlAsDataUrl(url: string): Promise<string | null> {
	const trimmed = url.trim();
	if (!trimmed) {
		return null;
	}
	try {
		const response = await fetch(trimmed);
		if (!response.ok) {
			return null;
		}
		const blob = await response.blob();
		if (!blob.size) {
			return null;
		}
		return blobToDataUrl(blob);
	} catch {
		return null;
	}
}

export const PDF_PLACEHOLDERS = {
	companyAddress: 'Company Address Placeholder',
	companyContactLine1: 'Contact Name Placeholder',
	companyContactLine2: 'Email Placeholder | Phone Placeholder',
	builderEmail: 'Builder Email Placeholder',
	builderPhone: 'Builder Phone Placeholder',
} as const;
