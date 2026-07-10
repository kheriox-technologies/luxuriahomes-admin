'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Plus, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

interface LocationSelectBaseProps {
	/** Show the inline "New location" create affordance. */
	allowCreate?: boolean;
	disabled?: boolean;
	/** Locations to hide from the list. */
	excludeLocationIds?: Id<'locations'>[];
	id?: string;
	invalid?: boolean;
	onBlur?: () => void;
	placeholder?: string;
}

interface LocationSelectSingleProps extends LocationSelectBaseProps {
	multiple?: false;
	onValueChange: (next: Id<'locations'> | '') => void;
	value: Id<'locations'> | '';
}

interface LocationSelectMultiProps extends LocationSelectBaseProps {
	multiple: true;
	onValueChange: (next: Id<'locations'>[]) => void;
	value: Id<'locations'>[];
}

export type LocationSelectProps =
	| LocationSelectSingleProps
	| LocationSelectMultiProps;

/**
 * The single source of truth for picking a location anywhere in the app. Works
 * as a single- or multi-select (via `multiple`) and — when `allowCreate` is set
 * — offers an inline "New location" flow that saves the location to the shared
 * catalog immediately and selects it.
 */
export default function LocationSelect(props: LocationSelectProps) {
	const {
		id,
		disabled,
		invalid,
		onBlur,
		placeholder,
		excludeLocationIds,
		allowCreate,
	} = props;

	const locations = useQuery(api.locations.list.list, {});
	const addLocation = useMutation(api.locations.add.add);

	const [creating, setCreating] = useState(false);
	const [newLocationName, setNewLocationName] = useState('');
	const [isCreating, setIsCreating] = useState(false);

	const excludeSet = useMemo(
		() => new Set(excludeLocationIds ?? []),
		[excludeLocationIds]
	);
	const items = useMemo(
		() =>
			(locations ?? [])
				.map((location) => location._id)
				.filter((locationId) => !excludeSet.has(locationId)),
		[locations, excludeSet]
	);
	const labelById = useMemo(() => {
		const map = new Map<Id<'locations'>, string>();
		for (const location of locations ?? []) {
			map.set(location._id, location.name);
		}
		return map;
	}, [locations]);

	const busy = locations === undefined;
	const idPrefix = id ?? 'location-select';

	const resetCreate = () => {
		setCreating(false);
		setNewLocationName('');
	};

	const handleCreate = async () => {
		const name = newLocationName.trim();
		if (!name) {
			toastManager.add({ title: 'Enter a location name', type: 'error' });
			return;
		}
		setIsCreating(true);
		try {
			const locationId = await addLocation({ name });
			if (props.multiple) {
				props.onValueChange([...props.value, locationId]);
			} else {
				props.onValueChange(locationId);
			}
			toastManager.add({ title: 'Location created', type: 'success' });
			resetCreate();
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not create location. Please try again in a moment.'
				),
				title: 'Could not create location',
				type: 'error',
			});
		} finally {
			setIsCreating(false);
		}
	};

	const optionList = (
		<ComboboxList>
			{(item: Id<'locations'>) => (
				<ComboboxItem key={item} value={item}>
					{labelById.get(item) ?? item}
				</ComboboxItem>
			)}
		</ComboboxList>
	);

	return (
		<div className="flex w-full flex-col gap-2">
			{props.multiple ? (
				<Combobox<Id<'locations'>, true>
					disabled={disabled || busy}
					items={items}
					itemToStringLabel={(item) => labelById.get(item) ?? ''}
					multiple
					onValueChange={(next) =>
						props.onValueChange((next as Id<'locations'>[] | null) ?? [])
					}
					value={props.value}
				>
					<ComboboxChips>
						{props.value.map((locationId) => (
							<ComboboxChip key={locationId}>
								{labelById.get(locationId) ?? locationId}
							</ComboboxChip>
						))}
						<ComboboxChipsInput
							placeholder={
								busy
									? 'Loading locations…'
									: (placeholder ?? 'Search locations…')
							}
						/>
					</ComboboxChips>
					<ComboboxPopup>
						<ComboboxEmpty>No location found.</ComboboxEmpty>
						{optionList}
					</ComboboxPopup>
				</Combobox>
			) : (
				<Combobox<Id<'locations'>>
					disabled={disabled || busy}
					items={items}
					itemToStringLabel={(item) => labelById.get(item) ?? ''}
					onValueChange={(next) => props.onValueChange(next ?? '')}
					value={props.value === '' ? null : props.value}
				>
					<ComboboxInput
						aria-invalid={invalid}
						className="w-full"
						id={id}
						onBlur={onBlur}
						placeholder={
							busy ? 'Loading locations…' : (placeholder ?? 'Select a location')
						}
					/>
					<ComboboxPopup>
						<ComboboxEmpty>No location found.</ComboboxEmpty>
						{optionList}
					</ComboboxPopup>
				</Combobox>
			)}

			{allowCreate && !creating ? (
				<div>
					<Button
						disabled={disabled}
						onClick={() => setCreating(true)}
						size="sm"
						type="button"
						variant="ghost"
					>
						<Plus /> New location
					</Button>
				</div>
			) : null}

			{allowCreate && creating ? (
				<div className="flex flex-col gap-3 rounded-md border p-3">
					<Field>
						<FieldLabel htmlFor={`${idPrefix}-new-name`}>
							Location name
						</FieldLabel>
						<Input
							id={`${idPrefix}-new-name`}
							nativeInput
							onChange={(e) => setNewLocationName(e.target.value)}
							placeholder="e.g. Kitchen"
							value={newLocationName}
						/>
					</Field>
					<div className="flex justify-end gap-2">
						<Button
							disabled={isCreating}
							onClick={resetCreate}
							size="sm"
							type="button"
							variant="outline"
						>
							<X aria-hidden /> Cancel
						</Button>
						<Button
							loading={isCreating}
							onClick={() => {
								handleCreate().catch(() => {
									/* Error handled in handleCreate */
								});
							}}
							size="sm"
							type="button"
							variant="outline"
						>
							<Plus aria-hidden /> Create location
						</Button>
					</div>
				</div>
			) : null}
		</div>
	);
}
