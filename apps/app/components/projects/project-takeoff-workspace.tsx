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

// Project-root documents folder that holds take-off PDFs (mirrors the backend
// constant in convex/takeoffs/shared.ts; the folder is created when a takeoff is
// added, so saved PDFs land in the same place).
const TAKE_OFFS_FOLDER_PATH = 'take-offs';

// Build a sortable `yyyyMMdd-HHmm` stamp for saved file names. The backend
// kebab-caser keeps the digits and hyphen, so the result stays readable.
function formatTimestamp(): string {
	const now = new Date();
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
}

export default function ProjectTakeoffWorkspace({
	takeoffId,
	contentRef,
}: {
	takeoffId: Id<'takeoffs'>;
	contentRef?: Ref<TakeoffsHandle>;
}) {
	const takeoff = useQuery(api.takeoffs.get.get, { takeoffId });
	const save = useMutation(api.takeoffs.save.save);
	const generateUploadUrl = useAction(
		api.projectDocuments.generateUploadUrl.generateUploadUrl
	);
	const createDocument = useMutation(api.projectDocuments.create.create);

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

	const projectId = takeoff?.projectId;
	const takeoffName = takeoff?.name;

	// Save an annotated PDF (overlays burned in) into the project's "Take Offs"
	// documents folder. The file name is the takeoff name, the saved scope's
	// descriptor (category/group/page, when present), and a timestamp; the backend
	// kebab-cases and de-duplicates it. Mirrors the file-manager upload flow.
	const saveToDocuments = useCallback(
		async ({
			bytes,
			descriptor,
		}: {
			bytes: Uint8Array;
			descriptor: string;
		}) => {
			if (!(projectId && takeoffName)) {
				throw new Error('Takeoff not ready');
			}
			const fileName = `${takeoffName}${descriptor ? ` ${descriptor}` : ''} ${formatTimestamp()}.pdf`;
			const { uploadUrl, s3Key, kebabName } = await generateUploadUrl({
				projectId,
				folderPath: TAKE_OFFS_FOLDER_PATH,
				fileName,
				contentType: 'application/pdf',
			});
			const res = await fetch(uploadUrl, {
				method: 'PUT',
				body: new Blob([bytes as BlobPart], { type: 'application/pdf' }),
				headers: { 'Content-Type': 'application/pdf' },
			});
			if (!res.ok) {
				throw new Error(`Upload failed (${res.status})`);
			}
			await createDocument({
				projectId,
				name: fileName,
				kebabName,
				s3Key,
				folderPath: TAKE_OFFS_FOLDER_PATH,
				size: bytes.byteLength,
				mimeType: 'application/pdf',
			});
		},
		[createDocument, generateUploadUrl, projectId, takeoffName]
	);

	if (!(pdfUrl && initialRef.current)) {
		return <p className="p-4 text-muted-foreground text-sm">Loading…</p>;
	}

	return (
		<TakeoffsContent
			initial={initialRef.current}
			onPersist={onPersist}
			onSaveToDocuments={saveToDocuments}
			pdfUrl={pdfUrl}
			ref={contentRef}
		/>
	);
}
