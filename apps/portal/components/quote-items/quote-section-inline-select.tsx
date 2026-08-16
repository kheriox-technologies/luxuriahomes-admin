'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { useQuery } from 'convex/react';
import QuoteSectionCombobox from './quote-section-combobox';

/**
 * Pick an existing section within the chosen stage, or type a new one to create.
 * Same two-control pattern as {@link QuoteStageInlineSelect}. The combobox can
 * only list sections once a stage id exists, so when the caller is creating a
 * brand-new stage (`creatingNewStage`) only the create-new input is offered.
 */
export default function QuoteSectionInlineSelect({
	idPrefix,
	stageId,
	creatingNewStage,
	sectionId,
	onSectionIdChange,
	newSectionName,
	onNewSectionNameChange,
	disabled,
}: {
	idPrefix: string;
	stageId: Id<'quoteStages'> | '';
	creatingNewStage: boolean;
	sectionId: Id<'quoteSections'> | '';
	onSectionIdChange: (next: Id<'quoteSections'> | '') => void;
	newSectionName: string;
	onNewSectionNameChange: (next: string) => void;
	disabled?: boolean;
}) {
	const sections = useQuery(
		api.quoteSections.listByStage.listByStage,
		stageId === '' ? 'skip' : { stageId }
	);
	const creatingNew = newSectionName.trim().length > 0;
	const canSelectExisting = !creatingNewStage && stageId !== '';

	return (
		<Field>
			<FieldLabel htmlFor={`${idPrefix}-section`}>Section</FieldLabel>
			<QuoteSectionCombobox
				disabled={disabled || creatingNew}
				hasStage={canSelectExisting}
				id={`${idPrefix}-section`}
				onChange={onSectionIdChange}
				sections={sections}
				value={sectionId}
			/>
			<Input
				aria-label="Or create new section"
				disabled={disabled || sectionId !== ''}
				nativeInput
				onChange={(e) => onNewSectionNameChange(e.target.value)}
				placeholder="Or create new section…"
				value={newSectionName}
			/>
		</Field>
	);
}
