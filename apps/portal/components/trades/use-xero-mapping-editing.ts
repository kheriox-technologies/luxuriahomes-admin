'use client';

import { useCallback, useRef, useState } from 'react';

export interface XeroMappingEntry {
	tradeId: string;
	xeroAccountId: string | null;
}

/**
 * Shared edit-mode + draft state for the trades list' inline Xero-mapping
 * editor, keyed by trade id. Clicking "Edit" seeds a draft account id for every
 * row; each row's column becomes a single-select combobox; "Done" saves only the
 * rows whose draft differs from the original via `getChanges()`.
 */
export function useXeroMappingEditing() {
	const [isEditing, setIsEditing] = useState(false);
	const [drafts, setDrafts] = useState<Record<string, string | null>>({});
	const originalsRef = useRef<Record<string, string | null>>({});

	const begin = useCallback((entries: XeroMappingEntry[]) => {
		const nextDrafts: Record<string, string | null> = {};
		const nextOriginals: Record<string, string | null> = {};
		for (const entry of entries) {
			nextDrafts[entry.tradeId] = entry.xeroAccountId;
			nextOriginals[entry.tradeId] = entry.xeroAccountId;
		}
		setDrafts(nextDrafts);
		originalsRef.current = nextOriginals;
		setIsEditing(true);
	}, []);

	const setDraft = useCallback((tradeId: string, next: string | null) => {
		setDrafts((prev) => ({ ...prev, [tradeId]: next }));
	}, []);

	const cancel = useCallback(() => {
		setIsEditing(false);
		setDrafts({});
		originalsRef.current = {};
	}, []);

	const getChanges = useCallback((): XeroMappingEntry[] => {
		const changes: XeroMappingEntry[] = [];
		for (const [tradeId, xeroAccountId] of Object.entries(drafts)) {
			const original = originalsRef.current[tradeId] ?? null;
			if ((xeroAccountId ?? null) !== original) {
				changes.push({ tradeId, xeroAccountId: xeroAccountId ?? null });
			}
		}
		return changes;
	}, [drafts]);

	return { isEditing, drafts, begin, setDraft, cancel, getChanges };
}
