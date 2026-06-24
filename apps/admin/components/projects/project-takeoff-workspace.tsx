'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useAction, useMutation, useQuery } from 'convex/react';
import { type Ref, useCallback, useEffect, useRef, useState } from 'react';
import { signCdnUrl } from '@/actions/cdn';
import TakeoffsContent, {
	type TakeoffsHandle,
} from '@/components/takeoffs/takeoffs-content';
import { stateToSaveArgs, takeoffDocToState } from '@/lib/takeoffs/persistence';
import type { TakeoffPersistState } from '@/lib/takeoffs/types';

const SAVE_DEBOUNCE_MS = 800;

export default function ProjectTakeoffWorkspace({
	takeoffId,
	contentRef,
}: {
	takeoffId: Id<'takeoffs'>;
	contentRef?: Ref<TakeoffsHandle>;
}) {
	const takeoff = useQuery(api.takeoffs.get.get, { takeoffId });
	const save = useMutation(api.takeoffs.save.save);
	const generateSaveUrl = useAction(
		api.takeoffs.generateSaveUrl.generateSaveUrl
	);

	const [pdfUrl, setPdfUrl] = useState<string | null>(null);

	// The query is reactive (re-emits after every autosave); capture the initial
	// working set once so TakeoffsContent mounts from a stable snapshot. The
	// parent remounts this component (keyed by takeoffId) when the PDF changes.
	const initialRef = useRef<TakeoffPersistState | null>(null);
	if (takeoff && !initialRef.current) {
		initialRef.current = takeoffDocToState(takeoff);
	}

	const s3Key = takeoff?.s3Key;
	useEffect(() => {
		if (!s3Key) {
			return;
		}
		let cancelled = false;
		signCdnUrl(s3Key)
			.then((url) => {
				if (!cancelled) {
					setPdfUrl(url);
				}
			})
			.catch(() => undefined);
		return () => {
			cancelled = true;
		};
	}, [s3Key]);

	const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const onPersist = useCallback(
		(state: TakeoffPersistState) => {
			if (saveTimer.current) {
				clearTimeout(saveTimer.current);
			}
			saveTimer.current = setTimeout(() => {
				save({ takeoffId, ...stateToSaveArgs(state) }).catch(() => undefined);
			}, SAVE_DEBOUNCE_MS);
		},
		[save, takeoffId]
	);
	useEffect(
		() => () => {
			if (saveTimer.current) {
				clearTimeout(saveTimer.current);
			}
		},
		[]
	);

	const onSavePdf = useCallback(
		async (bytes: Uint8Array) => {
			const { uploadUrl } = await generateSaveUrl({ takeoffId });
			const res = await fetch(uploadUrl, {
				method: 'PUT',
				body: new Blob([bytes as BlobPart], { type: 'application/pdf' }),
				// Cache-Control must match the value signed into the presigned PUT.
				headers: {
					'Content-Type': 'application/pdf',
					'Cache-Control': 'no-cache',
				},
			});
			if (!res.ok) {
				throw new Error(`Upload failed (${res.status})`);
			}
		},
		[generateSaveUrl, takeoffId]
	);

	if (!(pdfUrl && initialRef.current)) {
		return <p className="p-4 text-muted-foreground text-sm">Loading…</p>;
	}

	return (
		<TakeoffsContent
			initial={initialRef.current}
			onPersist={onPersist}
			onSavePdf={onSavePdf}
			pdfUrl={pdfUrl}
			ref={contentRef}
		/>
	);
}
