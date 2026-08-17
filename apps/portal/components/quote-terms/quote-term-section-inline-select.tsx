'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { useQuery } from 'convex/react';
import QuoteTermSectionCombobox from './quote-term-section-combobox';

/**
 * Pick an existing terms section, or type a new one to create on submit. Same
 * two-control pattern as the quote catalogue's stage/section pickers.
 */
export default function QuoteTermSectionInlineSelect({
	idPrefix,
	sectionId,
	onSectionIdChange,
	newSectionName,
	onNewSectionNameChange,
	disabled,
}: {
	idPrefix: string;
	sectionId: Id<'quoteTermSections'> | '';
	onSectionIdChange: (next: Id<'quoteTermSections'> | '') => void;
	newSectionName: string;
	onNewSectionNameChange: (next: string) => void;
	disabled?: boolean;
}) {
	const sections = useQuery(api.quoteTermSections.list.list, {});
	const creatingNew = newSectionName.trim().length > 0;

	return (
		<Field>
			<FieldLabel htmlFor={`${idPrefix}-section`}>Section</FieldLabel>
			<QuoteTermSectionCombobox
				disabled={disabled || creatingNew}
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
