import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useAction } from 'convex/react';
import { useEffect, useState } from 'react';

/**
 * Client-portal variant of `useSignedUrl`. The admin `cdn.signUrl` is
 * admin-gated, so client screens sign via `clientPortal.cdn.signUrl`, which
 * authorizes the caller against `projectId`. Returns `uri: null` while signing
 * or when no key is given, and `failed: true` if signing errors.
 */
export function useClientSignedUrl(
	projectId: Id<'projects'>,
	s3Key: string | undefined | null
) {
	const signUrl = useAction(api.clientPortal.cdn.signUrl.signUrl);
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
		signUrl({ projectId, s3Key })
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
	}, [projectId, s3Key, signUrl]);

	return { uri, failed };
}
