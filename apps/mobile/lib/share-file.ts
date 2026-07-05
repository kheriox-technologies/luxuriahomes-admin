import { File, Paths } from 'expo-file-system';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
import { Alert } from 'react-native';

interface ShareableDocument {
	kebabName: string;
	mimeType?: string;
	name: string;
	s3Key: string;
}
type SignUrl = (args: { s3Key: string }) => Promise<string>;

/**
 * Signs the document's S3 key, downloads it to the app cache, and opens the
 * native share sheet so the user can send it via email, WhatsApp, etc. Sharing
 * requires a local `file://` URI, so the remote file must be downloaded first.
 */
export async function shareDocument(
	signUrl: SignUrl,
	document: ShareableDocument
): Promise<void> {
	try {
		if (!(await isAvailableAsync())) {
			Alert.alert(
				'Sharing unavailable',
				'Sharing is not supported on this device.'
			);
			return;
		}

		const url = await signUrl({ s3Key: document.s3Key });
		const target = new File(Paths.cache, document.kebabName);
		if (target.exists) {
			target.delete();
		}
		const file = await File.downloadFileAsync(url, target);

		await shareAsync(file.uri, {
			dialogTitle: document.name,
			mimeType: document.mimeType,
		});
	} catch {
		Alert.alert('Unable to share document', 'Please try again.');
	}
}

/**
 * Downloads a signed PDF URL to the app cache and opens the native share sheet.
 * Used for generated documents (e.g. order PDFs) where we already hold a signed
 * URL rather than a stored `projectDocuments` record.
 */
export async function shareRemotePdf(
	url: string,
	filename: string
): Promise<void> {
	try {
		if (!(await isAvailableAsync())) {
			Alert.alert(
				'Sharing unavailable',
				'Sharing is not supported on this device.'
			);
			return;
		}

		const target = new File(Paths.cache, filename);
		if (target.exists) {
			target.delete();
		}
		const file = await File.downloadFileAsync(url, target);

		await shareAsync(file.uri, {
			dialogTitle: filename,
			mimeType: 'application/pdf',
		});
	} catch {
		Alert.alert('Unable to share PDF', 'Please try again.');
	}
}
