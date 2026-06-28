'use client';

import { useCallback, useRef, useState } from 'react';
import { isValidMoneyString, parseMoneyString } from './budget-form-shared';

export interface PriceEntry {
	price: number | null;
	tradeId: string;
}

export interface PriceChange {
	price: number;
	tradeId: string;
}

/**
 * Shared edit-mode + draft state for budget price tables. Keyed by trade id so
 * both the budget template page and the project budgets tab behave identically:
 * clicking "Edit" seeds drafts for every row, the price column becomes editable,
 * and "Done" saves the changed values via `getChanges()`.
 */
export function usePriceEditing() {
	const [isEditing, setIsEditing] = useState(false);
	const [drafts, setDrafts] = useState<Record<string, string>>({});
	const originalsRef = useRef<Record<string, number | null>>({});

	const begin = useCallback((entries: PriceEntry[]) => {
		const nextDrafts: Record<string, string> = {};
		const nextOriginals: Record<string, number | null> = {};
		for (const entry of entries) {
			nextDrafts[entry.tradeId] =
				entry.price === null ? '' : String(entry.price);
			nextOriginals[entry.tradeId] = entry.price;
		}
		setDrafts(nextDrafts);
		originalsRef.current = nextOriginals;
		setIsEditing(true);
	}, []);

	const setDraft = useCallback((tradeId: string, value: string) => {
		setDrafts((prev) => ({ ...prev, [tradeId]: value }));
	}, []);

	const cancel = useCallback(() => {
		setIsEditing(false);
		setDrafts({});
		originalsRef.current = {};
	}, []);

	const getChanges = useCallback((): PriceChange[] => {
		const changes: PriceChange[] = [];
		for (const [tradeId, raw] of Object.entries(drafts)) {
			const trimmed = raw.trim();
			const original = originalsRef.current[tradeId] ?? null;
			// Skip blanks: an empty field on a row that never had a price is a no-op,
			// and clearing a price is handled via delete, not bulk save.
			if (trimmed.length === 0 || !isValidMoneyString(trimmed)) {
				continue;
			}
			const price = parseMoneyString(trimmed);
			if (original === null || price !== original) {
				changes.push({ tradeId, price });
			}
		}
		return changes;
	}, [drafts]);

	return { isEditing, drafts, begin, setDraft, cancel, getChanges };
}
