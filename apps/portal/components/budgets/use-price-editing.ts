'use client';

import { useCallback, useRef, useState } from 'react';
import { isValidMoneyString, parseMoneyString } from './budget-form-shared';

export interface PriceEntry {
	name: string;
	price: number | null;
	tradeId: string;
}

export interface PriceChange {
	price: number;
	tradeId: string;
}

export interface NameChange {
	name: string;
	tradeId: string;
}

/**
 * Shared edit-mode + draft state for budget price tables. Keyed by trade id so
 * both the budget template page and the project budgets tab behave identically:
 * clicking "Edit" seeds drafts for every row, the price and trade-name columns
 * become editable, and "Done" saves changed prices via `getChanges()` and
 * changed trade names via `getNameChanges()`.
 */
export function usePriceEditing() {
	const [isEditing, setIsEditing] = useState(false);
	const [drafts, setDrafts] = useState<Record<string, string>>({});
	const [nameDrafts, setNameDrafts] = useState<Record<string, string>>({});
	const originalsRef = useRef<Record<string, number | null>>({});
	const nameOriginalsRef = useRef<Record<string, string>>({});

	const begin = useCallback((entries: PriceEntry[]) => {
		const nextDrafts: Record<string, string> = {};
		const nextNameDrafts: Record<string, string> = {};
		const nextOriginals: Record<string, number | null> = {};
		const nextNameOriginals: Record<string, string> = {};
		for (const entry of entries) {
			nextDrafts[entry.tradeId] =
				entry.price === null ? '' : String(entry.price);
			nextOriginals[entry.tradeId] = entry.price;
			nextNameDrafts[entry.tradeId] = entry.name;
			nextNameOriginals[entry.tradeId] = entry.name;
		}
		setDrafts(nextDrafts);
		setNameDrafts(nextNameDrafts);
		originalsRef.current = nextOriginals;
		nameOriginalsRef.current = nextNameOriginals;
		setIsEditing(true);
	}, []);

	const setDraft = useCallback((tradeId: string, value: string) => {
		setDrafts((prev) => ({ ...prev, [tradeId]: value }));
	}, []);

	const setNameDraft = useCallback((tradeId: string, value: string) => {
		setNameDrafts((prev) => ({ ...prev, [tradeId]: value }));
	}, []);

	const cancel = useCallback(() => {
		setIsEditing(false);
		setDrafts({});
		setNameDrafts({});
		originalsRef.current = {};
		nameOriginalsRef.current = {};
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

	const getNameChanges = useCallback((): NameChange[] => {
		const changes: NameChange[] = [];
		for (const [tradeId, raw] of Object.entries(nameDrafts)) {
			const trimmed = raw.trim();
			const original = (nameOriginalsRef.current[tradeId] ?? '').trim();
			// Skip blanks: a trade name is required, so clearing it is a no-op.
			if (trimmed.length === 0 || trimmed === original) {
				continue;
			}
			changes.push({ tradeId, name: trimmed });
		}
		return changes;
	}, [nameDrafts]);

	return {
		isEditing,
		drafts,
		nameDrafts,
		begin,
		setDraft,
		setNameDraft,
		cancel,
		getChanges,
		getNameChanges,
	};
}
