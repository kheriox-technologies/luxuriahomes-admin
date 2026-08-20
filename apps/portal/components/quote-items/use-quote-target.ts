'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation } from 'convex/react';
import { useCallback, useState } from 'react';
import { useQuoteTemplateId } from '@/components/quotations/quote-template-context';

export interface QuoteTargetInitial {
	sectionId?: Id<'quoteSections'>;
	stageId?: Id<'quoteStages'>;
}

/**
 * Owns the stage + section "select existing or create new" state used by the
 * add/edit item dialogs, and resolves it to a concrete section id at submit time
 * (creating the stage and/or section on the way). Mirrors `resolveStageId` in
 * `components/trades/add-trade.tsx`, extended to the second level.
 */
export function useQuoteTarget(initial?: QuoteTargetInitial) {
	const templateId = useQuoteTemplateId();
	const addStage = useMutation(api.quoteStages.add.add);
	const addSection = useMutation(api.quoteSections.add.add);

	const [stageId, setStageId] = useState<Id<'quoteStages'> | ''>(
		initial?.stageId ?? ''
	);
	const [newStageName, setNewStageName] = useState('');
	const [sectionId, setSectionId] = useState<Id<'quoteSections'> | ''>(
		initial?.sectionId ?? ''
	);
	const [newSectionName, setNewSectionName] = useState('');

	const creatingNewStage = newStageName.trim().length > 0;

	// Changing the stage invalidates any section chosen under the previous one.
	const changeStageId = useCallback((next: Id<'quoteStages'> | '') => {
		setStageId(next);
		setSectionId('');
	}, []);

	const changeNewStageName = useCallback((next: string) => {
		setNewStageName(next);
		// A brand-new stage has no sections, so an existing selection can't apply.
		if (next.trim().length > 0) {
			setSectionId('');
		}
	}, []);

	const reset = useCallback((values?: QuoteTargetInitial) => {
		setStageId(values?.stageId ?? '');
		setSectionId(values?.sectionId ?? '');
		setNewStageName('');
		setNewSectionName('');
	}, []);

	// A section must be reachable: either an existing one is picked, or a new name
	// is typed alongside a stage (existing or new).
	const isComplete =
		sectionId !== '' ||
		(newSectionName.trim().length > 0 && (stageId !== '' || creatingNewStage));

	/**
	 * Creates the stage and/or section as needed and returns the section the item
	 * belongs to. Throws when neither an existing nor a new section is available.
	 */
	const resolveSectionId = useCallback(async (): Promise<
		Id<'quoteSections'>
	> => {
		const trimmedSection = newSectionName.trim();
		if (!trimmedSection) {
			if (sectionId === '') {
				throw new Error('Select a section or enter a new section name');
			}
			return sectionId;
		}
		const trimmedStage = newStageName.trim();
		let resolvedStageId: Id<'quoteStages'>;
		if (trimmedStage) {
			resolvedStageId = await addStage({ name: trimmedStage, templateId });
		} else {
			if (stageId === '') {
				throw new Error('Select a stage or enter a new stage name');
			}
			resolvedStageId = stageId;
		}
		return await addSection({
			name: trimmedSection,
			stageId: resolvedStageId,
		});
	}, [
		addSection,
		addStage,
		newSectionName,
		newStageName,
		sectionId,
		stageId,
		templateId,
	]);

	return {
		changeNewStageName,
		changeStageId,
		creatingNewStage,
		isComplete,
		newSectionName,
		newStageName,
		reset,
		resolveSectionId,
		sectionId,
		setNewSectionName,
		setSectionId,
		stageId,
	};
}
