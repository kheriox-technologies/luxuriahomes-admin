'use client';

import { api } from '@workspace/backend/api';
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

interface MaterialColorSelectBaseProps {
	/** Show the inline "New color" create affordance. */
	allowCreate?: boolean;
	disabled?: boolean;
	/** Color names to hide from the list. */
	excludeColors?: string[];
	id?: string;
	invalid?: boolean;
	onBlur?: () => void;
	placeholder?: string;
}

interface MaterialColorSelectSingleProps extends MaterialColorSelectBaseProps {
	multiple?: false;
	onValueChange: (next: string) => void;
	value: string;
}

interface MaterialColorSelectMultiProps extends MaterialColorSelectBaseProps {
	multiple: true;
	onValueChange: (next: string[]) => void;
	value: string[];
}

export type MaterialColorSelectProps =
	| MaterialColorSelectSingleProps
	| MaterialColorSelectMultiProps;

/**
 * The single source of truth for picking a material color anywhere in the app.
 * Colors are stored by name on the parent records, so this select works with
 * color name strings. Works as a single- or multi-select (via `multiple`) and —
 * when `allowCreate` is set — offers an inline "New color" flow that saves the
 * color to the shared catalog immediately and selects it.
 */
export default function MaterialColorSelect(props: MaterialColorSelectProps) {
	const {
		id,
		disabled,
		invalid,
		onBlur,
		placeholder,
		excludeColors,
		allowCreate,
	} = props;

	const colors = useQuery(api.materialColors.list.list, {});
	const addColor = useMutation(api.materialColors.add.add);

	const [creating, setCreating] = useState(false);
	const [newColorName, setNewColorName] = useState('');
	const [isCreating, setIsCreating] = useState(false);

	const excludeSet = useMemo(
		() => new Set(excludeColors ?? []),
		[excludeColors]
	);
	const items = useMemo(
		() =>
			(colors ?? [])
				.map((color) => color.name)
				.filter((name) => !excludeSet.has(name)),
		[colors, excludeSet]
	);

	const busy = colors === undefined;
	const idPrefix = id ?? 'material-color-select';

	const resetCreate = () => {
		setCreating(false);
		setNewColorName('');
	};

	const handleCreate = async () => {
		const name = newColorName.trim();
		if (!name) {
			toastManager.add({ title: 'Enter a color name', type: 'error' });
			return;
		}
		setIsCreating(true);
		try {
			await addColor({ name });
			if (props.multiple) {
				props.onValueChange([...props.value, name]);
			} else {
				props.onValueChange(name);
			}
			toastManager.add({ title: 'Color created', type: 'success' });
			resetCreate();
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not create color. Please try again in a moment.'
				),
				title: 'Could not create color',
				type: 'error',
			});
		} finally {
			setIsCreating(false);
		}
	};

	const optionList = (
		<ComboboxList>
			{(item: string) => (
				<ComboboxItem key={item} value={item}>
					{item}
				</ComboboxItem>
			)}
		</ComboboxList>
	);

	return (
		<div className="flex w-full flex-col gap-2">
			{props.multiple ? (
				<Combobox<string, true>
					disabled={disabled || busy}
					items={items}
					itemToStringLabel={(item) => item}
					multiple
					onValueChange={(next) =>
						props.onValueChange((next as string[] | null) ?? [])
					}
					value={props.value}
				>
					<ComboboxChips>
						{props.value.map((color) => (
							<ComboboxChip key={color}>{color}</ComboboxChip>
						))}
						<ComboboxChipsInput
							placeholder={
								busy ? 'Loading colors…' : (placeholder ?? 'Search colors…')
							}
						/>
					</ComboboxChips>
					<ComboboxPopup>
						<ComboboxEmpty>No color found.</ComboboxEmpty>
						{optionList}
					</ComboboxPopup>
				</Combobox>
			) : (
				<Combobox<string>
					disabled={disabled || busy}
					items={items}
					itemToStringLabel={(item) => item}
					onValueChange={(next) => props.onValueChange(next ?? '')}
					value={props.value === '' ? null : props.value}
				>
					<ComboboxInput
						aria-invalid={invalid}
						id={id}
						onBlur={onBlur}
						placeholder={
							busy ? 'Loading colors…' : (placeholder ?? 'Search colors')
						}
					/>
					<ComboboxPopup>
						<ComboboxEmpty>No color found.</ComboboxEmpty>
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
						<Plus /> New color
					</Button>
				</div>
			) : null}

			{allowCreate && creating ? (
				<div className="flex flex-col gap-3 rounded-md border p-3">
					<Field>
						<FieldLabel htmlFor={`${idPrefix}-new-name`}>Color name</FieldLabel>
						<Input
							id={`${idPrefix}-new-name`}
							nativeInput
							onChange={(e) => setNewColorName(e.target.value)}
							placeholder="e.g. Matte Black"
							value={newColorName}
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
							<Plus aria-hidden /> Create color
						</Button>
					</div>
				</div>
			) : null}
		</div>
	);
}
