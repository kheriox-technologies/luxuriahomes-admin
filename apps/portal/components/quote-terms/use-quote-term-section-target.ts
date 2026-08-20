'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation } from 'convex/react';
import { useCallback, useState } from 'react';
import { useQuoteTemplateId } from '@/components/quotations/quote-template-context';

/**
 * Owns the "pick an existing section or type a new one" state for the clause
 * dialogs, creating the section at submit time. One-level trim of
 * `quote-items/use-quote-target.ts`.
 */
export function useQuoteTermSectionTarget(
	initialSectionId?: Id<'quoteTermSections'>
) {
	const [sectionId, setSectionId] = useState<Id<'quoteTermSections'> | ''>(
		initialSectionId ?? ''
	);
	const [newSectionName, setNewSectionName] = useState('');
	const templateId = useQuoteTemplateId();
	const addSection = useMutation(api.quoteTermSections.add.add);

	const reset = useCallback((next?: Id<'quoteTermSections'>) => {
		setSectionId(next ?? '');
		setNewSectionName('');
	}, []);

	// Create the section when a new name is typed, otherwise use the selected one.
	const resolveSectionId = useCallback(async (): Promise<
		Id<'quoteTermSections'>
	> => {
		const trimmed = newSectionName.trim();
		if (trimmed) {
			return await addSection({ name: trimmed, templateId });
		}
		if (sectionId === '') {
			throw new Error('Select a section or enter a new section name');
		}
		return sectionId;
	}, [addSection, newSectionName, sectionId, templateId]);

	return {
		isComplete: sectionId !== '' || newSectionName.trim().length > 0,
		newSectionName,
		reset,
		resolveSectionId,
		sectionId,
		setNewSectionName,
		setSectionId,
	};
}
