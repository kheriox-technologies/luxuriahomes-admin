const HEIC_MIME = /^image\/hei[cf]/i;
const HEIC_EXTENSION = /\.hei[cf]$/i;
const JPEG_QUALITY = 0.85;

/**
 * iPhones hand over HEIC by default, and Chrome reports no MIME type at all for
 * it — so the extension is the only signal in the common case.
 */
function looksHeic(file: File): boolean {
	return HEIC_MIME.test(file.type) || HEIC_EXTENSION.test(file.name);
}

/** Files the picker should accept: real images, plus HEIC's typeless variant. */
export function isImageFile(file: File): boolean {
	return file.type.startsWith('image/') || looksHeic(file);
}

/**
 * Only Safari can decode HEIC in an `<img>`, so an untouched iPhone photo would
 * upload fine and then render as a broken image everywhere else. Transcode to
 * JPEG in the browser before upload; every other format passes straight
 * through. The decoder is a multi-megabyte wasm bundle, so it is imported only
 * when a HEIC actually turns up.
 */
export async function toWebSafeImage(file: File): Promise<File> {
	if (!looksHeic(file)) {
		return file;
	}
	const { heicTo } = await import('heic-to');
	const jpeg = await heicTo({
		blob: file,
		quality: JPEG_QUALITY,
		type: 'image/jpeg',
	});
	const name = `${file.name.replace(HEIC_EXTENSION, '')}.jpg`;
	return new File([jpeg], name, { type: 'image/jpeg' });
}
