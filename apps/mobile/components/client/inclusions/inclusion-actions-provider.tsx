import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useAction } from 'convex/react';
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useRef,
} from 'react';
import { Alert } from 'react-native';
import { shareRemotePdf } from '@/lib/share-file';
import {
	ClientInclusionNotesSheet,
	type ClientInclusionNotesSheetHandle,
} from './inclusion-notes-sheet';
import type { ClientInclusion } from './types';

interface PdfTrigger {
	sectionKey?: string;
	title?: string;
}

interface ClientInclusionActionsContextValue {
	downloadPdf: (trigger?: PdfTrigger) => Promise<void>;
	openNotes: (inclusion: ClientInclusion) => void;
}

const ClientInclusionActionsContext =
	createContext<ClientInclusionActionsContextValue | null>(null);

export function useClientInclusionActions(): ClientInclusionActionsContextValue {
	const value = useContext(ClientInclusionActionsContext);
	if (!value) {
		throw new Error(
			'useClientInclusionActions must be used within a ClientInclusionActionsProvider'
		);
	}
	return value;
}

const DEFAULT_TITLE = 'Schedule of Finishes';
const filenameUnsafe = /[^a-z0-9]+/gi;

function toFilename(title: string): string {
	const slug = title.replace(filenameUnsafe, '-').replace(/^-+|-+$/g, '');
	return `${slug || 'inclusions'}.pdf`;
}

export function ClientInclusionActionsProvider({
	projectId,
	search,
	children,
}: {
	projectId: Id<'projects'>;
	search: string;
	children: ReactNode;
}) {
	const generatePdf = useAction(
		api.clientPortal.inclusions.generatePdf.generatePdf
	);
	const notesSheetRef = useRef<ClientInclusionNotesSheetHandle>(null);

	// Hold the latest search so callbacks stay stable while still reflecting the
	// current on-screen filter.
	const searchRef = useRef(search);
	searchRef.current = search;

	const downloadPdf = useCallback(
		async (trigger?: PdfTrigger) => {
			try {
				const s = searchRef.current.trim();
				const { url } = await generatePdf({
					projectId,
					search: s === '' ? undefined : s,
					sectionKey: trigger?.sectionKey,
				});
				await shareRemotePdf(url, toFilename(trigger?.title ?? DEFAULT_TITLE));
			} catch {
				Alert.alert(
					'Unable to generate PDF',
					'The inclusions PDF could not be generated. Try again.'
				);
			}
		},
		[generatePdf, projectId]
	);

	const openNotes = useCallback((inclusion: ClientInclusion) => {
		notesSheetRef.current?.present(inclusion);
	}, []);

	const value = useMemo(
		() => ({ downloadPdf, openNotes }),
		[downloadPdf, openNotes]
	);

	return (
		<ClientInclusionActionsContext.Provider value={value}>
			{children}
			<ClientInclusionNotesSheet projectId={projectId} ref={notesSheetRef} />
		</ClientInclusionActionsContext.Provider>
	);
}
