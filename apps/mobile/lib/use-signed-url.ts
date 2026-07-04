import { api } from '@workspace/backend/api';
import { useAction } from 'convex/react';
import { useEffect, useState } from 'react';

/**
 * Resolves an S3 key to a signed CDN URL (1h TTL). Returns `uri: null` while
 * signing or when no key is given, and `failed: true` if signing errors.
 */
export function useSignedUrl(s3Key: string | undefined | null) {
	const signUrl = useAction(api.cdn.signUrl.signUrl);
	const [uri, setUri] = useState<string | null>(null);
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		if (!s3Key) {
			setUri(null);
			setFailed(false);
			return;
		}
		let active = true;
		setFailed(false);
		setUri(null);
		signUrl({ s3Key })
			.then((url) => {
				if (active) {
					setUri(url);
				}
			})
			.catch(() => {
				if (active) {
					setFailed(true);
				}
			});
		return () => {
			active = false;
		};
	}, [s3Key, signUrl]);

	return { uri, failed };
}
