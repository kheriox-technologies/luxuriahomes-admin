import type { Doc } from '@workspace/backend/dataModel';
import { File, Paths } from 'expo-file-system';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
import { Alert } from 'react-native';

type ProjectDocument = Doc<'projectDocuments'>;
type SignUrl = (args: { s3Key: string }) => Promise<string>;

/**
 * Signs the document's S3 key, downloads it to the app cache, and opens the
 * native share sheet so the user can send it via email, WhatsApp, etc. Sharing
 * requires a local `file://` URI, so the remote file must be downloaded first.
 */
export async function shareDocument(
	signUrl: SignUrl,
	document: ProjectDocument
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
