import { useCallback, useRef, useState } from 'react';
import { isValidMoneyString, parseMoneyString } from './budget-form-shared';

export interface BudgetEditEntry {
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
 * Edit-mode + draft state for the mobile budgets tab, keyed by trade id. Mirrors
 * the portal `usePriceEditing` hook: `begin()` seeds a name + price draft for
 * every visible row, the inline inputs update drafts, and on Done the screen
 * saves changed prices via `getPriceChanges()` and changed names via
 * `getNameChanges()`.
 */
export function useBudgetEditing() {
	const [isEditing, setIsEditing] = useState(false);
	const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
	const [nameDrafts, setNameDrafts] = useState<Record<string, string>>({});
	const priceOriginalsRef = useRef<Record<string, number | null>>({});
	const nameOriginalsRef = useRef<Record<string, string>>({});

	const begin = useCallback((entries: BudgetEditEntry[]) => {
		const nextPrices: Record<string, string> = {};
		const nextNames: Record<string, string> = {};
		const nextPriceOriginals: Record<string, number | null> = {};
		const nextNameOriginals: Record<string, string> = {};
		for (const entry of entries) {
			nextPrices[entry.tradeId] =
				entry.price === null ? '' : String(entry.price);
			nextPriceOriginals[entry.tradeId] = entry.price;
			nextNames[entry.tradeId] = entry.name;
			nextNameOriginals[entry.tradeId] = entry.name;
		}
		setPriceDrafts(nextPrices);
		setNameDrafts(nextNames);
		priceOriginalsRef.current = nextPriceOriginals;
		nameOriginalsRef.current = nextNameOriginals;
		setIsEditing(true);
	}, []);

	const setPriceDraft = useCallback((tradeId: string, value: string) => {
		setPriceDrafts((prev) => ({ ...prev, [tradeId]: value }));
	}, []);

	const setNameDraft = useCallback((tradeId: string, value: string) => {
		setNameDrafts((prev) => ({ ...prev, [tradeId]: value }));
	}, []);

	const cancel = useCallback(() => {
		setIsEditing(false);
		setPriceDrafts({});
		setNameDrafts({});
		priceOriginalsRef.current = {};
		nameOriginalsRef.current = {};
	}, []);

	const getPriceChanges = useCallback((): PriceChange[] => {
		const changes: PriceChange[] = [];
		for (const [tradeId, raw] of Object.entries(priceDrafts)) {
			const trimmed = raw.trim();
			const original = priceOriginalsRef.current[tradeId] ?? null;
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
	}, [priceDrafts]);

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
		priceDrafts,
		nameDrafts,
		begin,
		setPriceDraft,
		setNameDraft,
		cancel,
		getPriceChanges,
		getNameChanges,
	};
}
