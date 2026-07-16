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

export interface RowChanges {
	name?: string;
	price?: number;
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
	// Trade ids currently in single-row edit mode. Coexists with the bulk
	// `isEditing` flag: a row is editable when either is active for it.
	const [editingRows, setEditingRows] = useState<Set<string>>(new Set());
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

	// Seed a single row's draft + original without touching the bulk `isEditing`
	// flag, so "Edit budget" makes just that row's name + price editable.
	const beginRow = useCallback((entry: BudgetEditEntry) => {
		setPriceDrafts((prev) => ({
			...prev,
			[entry.tradeId]: entry.price === null ? '' : String(entry.price),
		}));
		setNameDrafts((prev) => ({ ...prev, [entry.tradeId]: entry.name }));
		priceOriginalsRef.current[entry.tradeId] = entry.price;
		nameOriginalsRef.current[entry.tradeId] = entry.name;
		setEditingRows((prev) => {
			const next = new Set(prev);
			next.add(entry.tradeId);
			return next;
		});
	}, []);

	const endRow = useCallback((tradeId: string) => {
		setEditingRows((prev) => {
			const next = new Set(prev);
			next.delete(tradeId);
			return next;
		});
		setPriceDrafts((prev) => {
			const next = { ...prev };
			delete next[tradeId];
			return next;
		});
		setNameDrafts((prev) => {
			const next = { ...prev };
			delete next[tradeId];
			return next;
		});
		delete priceOriginalsRef.current[tradeId];
		delete nameOriginalsRef.current[tradeId];
	}, []);

	const isRowEditing = useCallback(
		(tradeId: string) => editingRows.has(tradeId),
		[editingRows]
	);

	const setPriceDraft = useCallback((tradeId: string, value: string) => {
		setPriceDrafts((prev) => ({ ...prev, [tradeId]: value }));
	}, []);

	const setNameDraft = useCallback((tradeId: string, value: string) => {
		setNameDrafts((prev) => ({ ...prev, [tradeId]: value }));
	}, []);

	const cancel = useCallback(() => {
		setIsEditing(false);
		setEditingRows(new Set());
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

	// Changed price and/or name for a single row, using the same trim/validate/
	// diff-vs-original rules as the bulk getters.
	const getRowChanges = useCallback(
		(tradeId: string): RowChanges => {
			const changes: RowChanges = {};
			const rawPrice = (priceDrafts[tradeId] ?? '').trim();
			if (rawPrice.length > 0 && isValidMoneyString(rawPrice)) {
				const price = parseMoneyString(rawPrice);
				const originalPrice = priceOriginalsRef.current[tradeId] ?? null;
				if (originalPrice === null || price !== originalPrice) {
					changes.price = price;
				}
			}
			const rawName = (nameDrafts[tradeId] ?? '').trim();
			const originalName = (nameOriginalsRef.current[tradeId] ?? '').trim();
			if (rawName.length > 0 && rawName !== originalName) {
				changes.name = rawName;
			}
			return changes;
		},
		[priceDrafts, nameDrafts]
	);

	return {
		isEditing,
		editingRows,
		priceDrafts,
		nameDrafts,
		begin,
		beginRow,
		endRow,
		isRowEditing,
		setPriceDraft,
		setNameDraft,
		cancel,
		getPriceChanges,
		getNameChanges,
		getRowChanges,
	};
}
