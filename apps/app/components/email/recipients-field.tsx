'use client';

import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
	useComboboxFilter,
} from '@workspace/ui/components/combobox';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { useMemo, useState } from 'react';
import { isValidEmail, type RecipientSuggestion } from '@/lib/email';

export default function RecipientsField({
	id,
	label,
	values,
	suggestions,
	onChange,
}: {
	id: string;
	label: string;
	values: string[];
	suggestions: RecipientSuggestion[];
	onChange: (next: string[]) => void;
}) {
	const [query, setQuery] = useState('');
	const filter = useComboboxFilter();

	const optionLabelByEmail = useMemo(() => {
		const map = new Map<string, string>();
		for (const suggestion of suggestions) {
			map.set(
				suggestion.email.toLowerCase(),
				`${suggestion.label} (${suggestion.email})`
			);
		}
		return map;
	}, [suggestions]);

	const chipLabel = (email: string) =>
		suggestions.find(
			(suggestion) => suggestion.email.toLowerCase() === email.toLowerCase()
		)?.label ?? email;

	const trimmedQuery = query.trim();
	const selectedSet = new Set(values.map((value) => value.toLowerCase()));
	const isKnown = (email: string) =>
		suggestions.some(
			(suggestion) => suggestion.email.toLowerCase() === email.toLowerCase()
		);

	// All selectable emails (excluding already-selected), filtered by the query.
	const allEmails = suggestions
		.filter((suggestion) => !selectedSet.has(suggestion.email.toLowerCase()))
		.map((suggestion) => suggestion.email);
	const filteredEmails = allEmails.filter((email) =>
		filter.contains(
			email,
			query,
			(value) => optionLabelByEmail.get(value.toLowerCase()) ?? value
		)
	);

	const showCreateOption =
		isValidEmail(trimmedQuery) &&
		!selectedSet.has(trimmedQuery.toLowerCase()) &&
		!isKnown(trimmedQuery);
	const filteredItems = showCreateOption
		? [trimmedQuery, ...filteredEmails]
		: filteredEmails;

	return (
		<Field>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<Combobox
				filteredItems={filteredItems}
				items={allEmails}
				itemToStringLabel={(value) =>
					optionLabelByEmail.get(String(value ?? '').toLowerCase()) ??
					String(value ?? '')
				}
				multiple
				onInputValueChange={(value) => setQuery(value)}
				onValueChange={(value) => {
					onChange(value as string[]);
					setQuery('');
				}}
				value={values}
			>
				<ComboboxChips>
					{values.map((email) => (
						<ComboboxChip key={email}>{chipLabel(email)}</ComboboxChip>
					))}
					<ComboboxChipsInput id={id} placeholder="Search name or email…" />
				</ComboboxChips>
				<ComboboxPopup>
					<ComboboxEmpty>
						No matches. Type a full email address to add it.
					</ComboboxEmpty>
					<ComboboxList>
						{(email: string) =>
							showCreateOption && email === trimmedQuery ? (
								<ComboboxItem key={email} value={email}>
									{`Add "${email}"`}
								</ComboboxItem>
							) : (
								<ComboboxItem key={email} value={email}>
									{chipLabel(email)}{' '}
									<span className="text-muted-foreground">({email})</span>
								</ComboboxItem>
							)
						}
					</ComboboxList>
				</ComboboxPopup>
			</Combobox>
		</Field>
	);
}
