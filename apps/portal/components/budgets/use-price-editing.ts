'use client';

import { useCallback, useRef, useState } from 'react';
import {
	isValidMoneyString,
	isValidPercentString,
	parseMoneyString,
	parsePercentString,
} from './budget-form-shared';

export interface PriceEntry {
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
 * Shared edit-mode + draft state for budget price tables. Keyed by trade id so
 * both the budget template page and the project budgets tab behave identically:
 * clicking "Edit" seeds drafts for every row, the price, contingency and
 * trade-name columns become editable, and "Done" saves changed prices and
 * contingency percentages via `getChanges()` and changed trade names via
 * `getNameChanges()`.
 */
export function usePriceEditing() {
	const [isEditing, setIsEditing] = useState(false);
	// Trade ids currently in single-row edit mode. Coexists with the bulk
	// `isEditing` flag: a row is editable when either is active for it.
	const [editingRows, setEditingRows] = useState<Set<string>>(new Set());
	const [drafts, setDrafts] = useState<Record<string, string>>({});
	const [contingencyDrafts, setContingencyDrafts] = useState<
		Record<string, string>
	>({});
	const [nameDrafts, setNameDrafts] = useState<Record<string, string>>({});
	const originalsRef = useRef<Record<string, number | null>>({});
	const contingencyOriginalsRef = useRef<Record<string, number>>({});
	const nameOriginalsRef = useRef<Record<string, string>>({});

	const begin = useCallback((entries: PriceEntry[]) => {
		const nextDrafts: Record<string, string> = {};
		const nextContingencyDrafts: Record<string, string> = {};
		const nextNameDrafts: Record<string, string> = {};
		const nextOriginals: Record<string, number | null> = {};
		const nextContingencyOriginals: Record<string, number> = {};
		const nextNameOriginals: Record<string, string> = {};
		for (const entry of entries) {
			const percent = entry.contingencyPercent ?? 0;
			nextDrafts[entry.tradeId] =
				entry.price === null ? '' : String(entry.price);
			nextOriginals[entry.tradeId] = entry.price;
			nextContingencyDrafts[entry.tradeId] = String(percent);
			nextContingencyOriginals[entry.tradeId] = percent;
			nextNameDrafts[entry.tradeId] = entry.name;
			nextNameOriginals[entry.tradeId] = entry.name;
		}
		setDrafts(nextDrafts);
		setContingencyDrafts(nextContingencyDrafts);
		setNameDrafts(nextNameDrafts);
		originalsRef.current = nextOriginals;
		contingencyOriginalsRef.current = nextContingencyOriginals;
		nameOriginalsRef.current = nextNameOriginals;
		setIsEditing(true);
	}, []);

	// Seed a single row's draft + original without touching the bulk `isEditing`
	// flag, so "Edit Budget" makes just that row's name + price editable.
	const beginRow = useCallback((entry: PriceEntry) => {
		const percent = entry.contingencyPercent ?? 0;
		setDrafts((prev) => ({
			...prev,
			[entry.tradeId]: entry.price === null ? '' : String(entry.price),
		}));
		setContingencyDrafts((prev) => ({
			...prev,
			[entry.tradeId]: String(percent),
		}));
		setNameDrafts((prev) => ({ ...prev, [entry.tradeId]: entry.name }));
		originalsRef.current[entry.tradeId] = entry.price;
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
		setDrafts((prev) => {
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
		delete originalsRef.current[tradeId];
		delete contingencyOriginalsRef.current[tradeId];
		delete nameOriginalsRef.current[tradeId];
	}, []);

	const isRowEditing = useCallback(
		(tradeId: string) => editingRows.has(tradeId),
		[editingRows]
	);

	const setDraft = useCallback((tradeId: string, value: string) => {
		setDrafts((prev) => ({ ...prev, [tradeId]: value }));
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
		setDrafts({});
		setContingencyDrafts({});
		setNameDrafts({});
		originalsRef.current = {};
		contingencyOriginalsRef.current = {};
		nameOriginalsRef.current = {};
	}, []);

	// Changed price and/or contingency per trade, merged into one entry so the
	// caller can send a single `setPrices` payload.
	const getChanges = useCallback((): PriceChange[] => {
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
				changeFor(tradeId).price = price;
			}
		}
		for (const [tradeId, raw] of Object.entries(contingencyDrafts)) {
			const percent = draftToPercent(raw);
			if (percent === null) {
				continue;
			}
			const original = contingencyOriginalsRef.current[tradeId] ?? 0;
			if (percent !== original) {
				changeFor(tradeId).contingencyPercent = percent;
			}
		}
		return [...byTrade.values()];
	}, [contingencyDrafts, drafts]);

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

	// Changed price, contingency and/or name for a single row, using the same
	// trim/validate/diff-vs-original rules as the bulk getters.
	const getRowChanges = useCallback(
		(tradeId: string): RowChanges => {
			const changes: RowChanges = {};
			const rawPrice = (drafts[tradeId] ?? '').trim();
			if (rawPrice.length > 0 && isValidMoneyString(rawPrice)) {
				const price = parseMoneyString(rawPrice);
				const originalPrice = originalsRef.current[tradeId] ?? null;
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
		[contingencyDrafts, drafts, nameDrafts]
	);

	return {
		isEditing,
		editingRows,
		drafts,
		contingencyDrafts,
		nameDrafts,
		begin,
		beginRow,
		endRow,
		isRowEditing,
		setDraft,
		setContingencyDraft,
		setNameDraft,
		cancel,
		getChanges,
		getNameChanges,
		getRowChanges,
	};
}
