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

/**
 * Fetches a remote image and converts it to a JPEG data URL via Canvas.
 * pdfmake (pdfkit) only supports JPEG and PNG — this normalises any browser-supported
 * format (WEBP, AVIF, etc.) to JPEG so PDF generation doesn't silently fail.
 * Returns null on fetch or conversion failure.
 */
export async function fetchUrlAsJpegDataUrl(
	url: string
): Promise<string | null> {
	const dataUrl = await fetchUrlAsDataUrl(url);
	if (!dataUrl) {
		return null;
	}
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			try {
				const canvas = document.createElement('canvas');
				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;
				const ctx = canvas.getContext('2d');
				if (!ctx) {
					resolve(null);
					return;
				}
				ctx.drawImage(img, 0, 0);
				resolve(canvas.toDataURL('image/jpeg', 0.85));
			} catch {
				resolve(null);
			}
		};
		img.onerror = () => resolve(null);
		img.src = dataUrl;
	});
}
