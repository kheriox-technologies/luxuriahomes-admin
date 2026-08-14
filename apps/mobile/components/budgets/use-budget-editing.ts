import { useCallback, useRef, useState } from 'react';
import {
	isValidMoneyString,
	isValidPercentString,
	parseMoneyString,
	parsePercentString,
} from './budget-form-shared';

export interface BudgetEditEntry {
	contingencyPercent: number | null;
	name: string;
	price: number | null;
	tradeId: string;
}

export interface PriceChange {
	contingencyPercent?: number;
	price?: number;
	tradeId: string;
}

export interface NameChange {
	name: string;
	tradeId: string;
}

export interface RowChanges {
	contingencyPercent?: number;
	name?: string;
	price?: number;
}

// A blank percent field means 0% — unlike price, where blank is a no-op.
function draftToPercent(raw: string): number | null {
	const trimmed = raw.trim();
	if (trimmed.length === 0) {
		return 0;
	}
	return isValidPercentString(trimmed) ? parsePercentString(trimmed) : null;
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
	const [contingencyDrafts, setContingencyDrafts] = useState<
		Record<string, string>
	>({});
	const [nameDrafts, setNameDrafts] = useState<Record<string, string>>({});
	const priceOriginalsRef = useRef<Record<string, number | null>>({});
	const contingencyOriginalsRef = useRef<Record<string, number>>({});
	const nameOriginalsRef = useRef<Record<string, string>>({});

	const begin = useCallback((entries: BudgetEditEntry[]) => {
		const nextPrices: Record<string, string> = {};
		const nextContingencies: Record<string, string> = {};
		const nextNames: Record<string, string> = {};
		const nextPriceOriginals: Record<string, number | null> = {};
		const nextContingencyOriginals: Record<string, number> = {};
		const nextNameOriginals: Record<string, string> = {};
		for (const entry of entries) {
			const percent = entry.contingencyPercent ?? 0;
			nextPrices[entry.tradeId] =
				entry.price === null ? '' : String(entry.price);
			nextPriceOriginals[entry.tradeId] = entry.price;
			nextContingencies[entry.tradeId] = String(percent);
			nextContingencyOriginals[entry.tradeId] = percent;
			nextNames[entry.tradeId] = entry.name;
			nextNameOriginals[entry.tradeId] = entry.name;
		}
		setPriceDrafts(nextPrices);
		setContingencyDrafts(nextContingencies);
		setNameDrafts(nextNames);
		priceOriginalsRef.current = nextPriceOriginals;
		contingencyOriginalsRef.current = nextContingencyOriginals;
		nameOriginalsRef.current = nextNameOriginals;
		setIsEditing(true);
	}, []);

	// Seed a single row's draft + original without touching the bulk `isEditing`
	// flag, so "Edit budget" makes just that row's name + price editable.
	const beginRow = useCallback((entry: BudgetEditEntry) => {
		const percent = entry.contingencyPercent ?? 0;
		setPriceDrafts((prev) => ({
			...prev,
			[entry.tradeId]: entry.price === null ? '' : String(entry.price),
		}));
		setContingencyDrafts((prev) => ({
			...prev,
			[entry.tradeId]: String(percent),
		}));
		setNameDrafts((prev) => ({ ...prev, [entry.tradeId]: entry.name }));
		priceOriginalsRef.current[entry.tradeId] = entry.price;
		contingencyOriginalsRef.current[entry.tradeId] = percent;
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
		setContingencyDrafts((prev) => {
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
		delete contingencyOriginalsRef.current[tradeId];
		delete nameOriginalsRef.current[tradeId];
	}, []);

	const isRowEditing = useCallback(
		(tradeId: string) => editingRows.has(tradeId),
		[editingRows]
	);

	const setPriceDraft = useCallback((tradeId: string, value: string) => {
		setPriceDrafts((prev) => ({ ...prev, [tradeId]: value }));
	}, []);

	const setContingencyDraft = useCallback((tradeId: string, value: string) => {
		setContingencyDrafts((prev) => ({ ...prev, [tradeId]: value }));
	}, []);

	const setNameDraft = useCallback((tradeId: string, value: string) => {
		setNameDrafts((prev) => ({ ...prev, [tradeId]: value }));
	}, []);

	const cancel = useCallback(() => {
		setIsEditing(false);
		setEditingRows(new Set());
		setPriceDrafts({});
		setContingencyDrafts({});
		setNameDrafts({});
		priceOriginalsRef.current = {};
		contingencyOriginalsRef.current = {};
		nameOriginalsRef.current = {};
	}, []);

	// Changed price and/or contingency per trade, merged into one entry so the
	// caller can send a single `setPrices` payload.
	const getPriceChanges = useCallback((): PriceChange[] => {
		const byTrade = new Map<string, PriceChange>();
		const changeFor = (tradeId: string): PriceChange => {
			const existing = byTrade.get(tradeId);
			if (existing) {
				return existing;
			}
			const created: PriceChange = { tradeId };
			byTrade.set(tradeId, created);
			return created;
		};
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
				changeFor(tradeId).price = price;
			}
		}
		for (const [tradeId, raw] of Object.entries(contingencyDrafts)) {
			const percent = draftToPercent(raw);
			if (percent === null) {
				continue;
			}
			if (percent !== (contingencyOriginalsRef.current[tradeId] ?? 0)) {
				changeFor(tradeId).contingencyPercent = percent;
			}
		}
		return [...byTrade.values()];
	}, [contingencyDrafts, priceDrafts]);

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
			const percent = draftToPercent(contingencyDrafts[tradeId] ?? '');
			if (
				percent !== null &&
				percent !== (contingencyOriginalsRef.current[tradeId] ?? 0)
			) {
				changes.contingencyPercent = percent;
			}
			const rawName = (nameDrafts[tradeId] ?? '').trim();
			const originalName = (nameOriginalsRef.current[tradeId] ?? '').trim();
			if (rawName.length > 0 && rawName !== originalName) {
				changes.name = rawName;
			}
			return changes;
		},
		[contingencyDrafts, priceDrafts, nameDrafts]
	);

	return {
		isEditing,
		editingRows,
		priceDrafts,
		contingencyDrafts,
		nameDrafts,
		begin,
		beginRow,
		endRow,
		isRowEditing,
		setPriceDraft,
		setContingencyDraft,
		setNameDraft,
		cancel,
		getPriceChanges,
		getNameChanges,
		getRowChanges,
	};
}
