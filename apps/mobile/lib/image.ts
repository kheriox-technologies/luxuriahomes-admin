import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

const JPEG_COMPRESS = 0.7;

/**
 * Re-encodes a picked image to JPEG and returns the new local file URI.
 *
 * The iOS photo library hands back HEIC files, which browsers (and therefore
 * the web portal) cannot decode — they show a broken image. Converting to JPEG
 * on upload keeps note and document images viewable everywhere.
 */
export async function toJpegUri(uri: string): Promise<string> {
	const image = await ImageManipulator.manipulate(uri).renderAsync();
	const result = await image.saveAsync({
		format: SaveFormat.JPEG,
		compress: JPEG_COMPRESS,
	});
	return result.uri;
}
