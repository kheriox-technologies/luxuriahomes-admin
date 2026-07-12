'use client';

import { useCallback, useRef, useState } from 'react';

export interface XeroMappingEntry {
	tradeId: string;
	xeroAccountIds: string[];
}

/** True when two GUID lists differ as sets (order/duplicates ignored). */
function accountIdsDiffer(a: string[], b: string[]): boolean {
	const setA = new Set(a);
	const setB = new Set(b);
	if (setA.size !== setB.size) {
		return true;
	}
	for (const id of setA) {
		if (!setB.has(id)) {
			return true;
		}
	}
	return false;
}

/**
 * Shared edit-mode + draft state for the trades list' inline Xero-mapping
 * editor, keyed by trade id. Clicking "Edit" seeds a draft account-id list for
 * every row; each row's column becomes a combobox; "Done" saves only the rows
 * whose draft differs (as a set) from the original via `getChanges()`.
 */
export function useXeroMappingEditing() {
	const [isEditing, setIsEditing] = useState(false);
	const [drafts, setDrafts] = useState<Record<string, string[]>>({});
	const originalsRef = useRef<Record<string, string[]>>({});

	const begin = useCallback((entries: XeroMappingEntry[]) => {
		const nextDrafts: Record<string, string[]> = {};
		const nextOriginals: Record<string, string[]> = {};
		for (const entry of entries) {
			nextDrafts[entry.tradeId] = entry.xeroAccountIds;
			nextOriginals[entry.tradeId] = entry.xeroAccountIds;
		}
		setDrafts(nextDrafts);
		originalsRef.current = nextOriginals;
		setIsEditing(true);
	}, []);

	const setDraft = useCallback((tradeId: string, next: string[]) => {
		setDrafts((prev) => ({ ...prev, [tradeId]: next }));
	}, []);

	const cancel = useCallback(() => {
		setIsEditing(false);
		setDrafts({});
		originalsRef.current = {};
	}, []);

	const getChanges = useCallback((): XeroMappingEntry[] => {
		const changes: XeroMappingEntry[] = [];
		for (const [tradeId, xeroAccountIds] of Object.entries(drafts)) {
			const original = originalsRef.current[tradeId] ?? [];
			if (accountIdsDiffer(xeroAccountIds, original)) {
				changes.push({ tradeId, xeroAccountIds });
			}
		}
		return changes;
	}, [drafts]);

	return { isEditing, drafts, begin, setDraft, cancel, getChanges };
}
