'use client';

import { useCallback, useState } from 'react';

/**
 * Form-agnostic state for adding multiple list items in a single dialog
 * session. Names are trimmed, blanks ignored, and duplicates collapsed
 * case-insensitively. The dialog enters "multi-add mode" once at least one
 * item is pending.
 */
export function useMultiAdd() {
	const [items, setItems] = useState<string[]>([]);

	const addItem = useCallback((raw: string) => {
		const name = raw.trim();
		if (name.length === 0) {
			return false;
		}
		setItems((prev) =>
			prev.some((existing) => existing.toLowerCase() === name.toLowerCase())
				? prev
				: [...prev, name]
		);
		return true;
	}, []);

	const removeItem = useCallback((index: number) => {
		setItems((prev) => prev.filter((_, i) => i !== index));
	}, []);

	const reset = useCallback(() => {
		setItems([]);
	}, []);

	return { addItem, isMultiAdd: items.length > 0, items, removeItem, reset };
}
