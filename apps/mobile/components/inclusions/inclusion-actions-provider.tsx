import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useAction } from 'convex/react';
import { openBrowserAsync } from 'expo-web-browser';
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useRef,
} from 'react';
import { Alert } from 'react-native';
import {
	InclusionEmailSheet,
	type InclusionEmailSheetHandle,
} from './inclusion-email-sheet';
import {
	InclusionNotesSheet,
	type InclusionNotesSheetHandle,
} from './inclusion-notes-sheet';
import type { ClassFilter, GroupBy, ProjectInclusion } from './types';

interface PdfTrigger {
	sectionKey?: string;
	title?: string;
}

interface InclusionActionsContextValue {
	downloadPdf: (trigger?: PdfTrigger) => Promise<void>;
	emailPdf: (trigger?: PdfTrigger) => Promise<void>;
	openNotes: (inclusion: ProjectInclusion) => void;
}

const InclusionActionsContext =
	createContext<InclusionActionsContextValue | null>(null);

export function useInclusionActions(): InclusionActionsContextValue {
	const value = useContext(InclusionActionsContext);
	if (!value) {
		throw new Error(
			'useInclusionActions must be used within an InclusionActionsProvider'
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

export function InclusionActionsProvider({
	projectId,
	groupBy,
	classFilter,
	search,
	children,
}: {
	projectId: Id<'projects'>;
	groupBy: GroupBy;
	classFilter: ClassFilter;
	search: string;
	children: ReactNode;
}) {
	const generatePdf = useAction(api.projectInclusions.generatePdf.generatePdf);
	const emailSheetRef = useRef<InclusionEmailSheetHandle>(null);
	const notesSheetRef = useRef<InclusionNotesSheetHandle>(null);

	// Hold the latest filter state so the callbacks can stay referentially stable
	// while still generating a PDF that reflects the current on-screen selection.
	const paramsRef = useRef({ groupBy, classFilter, search });
	paramsRef.current = { groupBy, classFilter, search };

	const generate = useCallback(
		(trigger?: PdfTrigger) => {
			const { groupBy: gb, classFilter: cf, search: s } = paramsRef.current;
			return generatePdf({
				projectId,
				groupBy: gb,
				class: cf,
				search: s.trim() === '' ? undefined : s.trim(),
				sectionKey: trigger?.sectionKey,
			});
		},
		[generatePdf, projectId]
	);

	const downloadPdf = useCallback(
		async (trigger?: PdfTrigger) => {
			try {
				const { url } = await generate(trigger);
				await openBrowserAsync(url);
			} catch {
				Alert.alert(
					'Unable to generate PDF',
					'The inclusions PDF could not be generated. Try again.'
				);
			}
		},
		[generate]
	);

	const emailPdf = useCallback(
		async (trigger?: PdfTrigger) => {
			try {
				const title = trigger?.title ?? DEFAULT_TITLE;
				const { s3Key } = await generate(trigger);
				emailSheetRef.current?.present({
					s3Key,
					filename: toFilename(title),
					subject: title,
				});
			} catch {
				Alert.alert(
					'Unable to generate PDF',
					'The inclusions PDF could not be generated. Try again.'
				);
			}
		},
		[generate]
	);

	const openNotes = useCallback((inclusion: ProjectInclusion) => {
		notesSheetRef.current?.present(inclusion);
	}, []);

	const value = useMemo(
		() => ({ downloadPdf, emailPdf, openNotes }),
		[downloadPdf, emailPdf, openNotes]
	);

	return (
		<InclusionActionsContext.Provider value={value}>
			{children}
			<InclusionEmailSheet projectId={projectId} ref={emailSheetRef} />
			<InclusionNotesSheet ref={notesSheetRef} />
		</InclusionActionsContext.Provider>
	);
}
