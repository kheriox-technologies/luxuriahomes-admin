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

interface InclusionCategorySelectBaseProps {
	/** Show the inline "New category" create affordance (name + code). */
	allowCreate?: boolean;
	disabled?: boolean;
	/** Categories to hide from the list. */
	excludeCategoryIds?: Id<'inclusionCategories'>[];
	id?: string;
	invalid?: boolean;
	onBlur?: () => void;
	placeholder?: string;
}

interface InclusionCategorySelectSingleProps
	extends InclusionCategorySelectBaseProps {
	multiple?: false;
	onValueChange: (next: Id<'inclusionCategories'> | '') => void;
	value: Id<'inclusionCategories'> | '';
}

interface InclusionCategorySelectMultiProps
	extends InclusionCategorySelectBaseProps {
	multiple: true;
	onValueChange: (next: Id<'inclusionCategories'>[]) => void;
	value: Id<'inclusionCategories'>[];
}

export type InclusionCategorySelectProps =
	| InclusionCategorySelectSingleProps
	| InclusionCategorySelectMultiProps;

/**
 * The single source of truth for picking an inclusion category anywhere in the
 * app. Works as a single- or multi-select (via `multiple`) and — when
 * `allowCreate` is set — offers an inline "New category" flow (name + code) that
 * saves the category to the shared catalog immediately and selects it. Both name
 * and code are required and enforced unique by the backend.
 */
export default function InclusionCategorySelect(
	props: InclusionCategorySelectProps
) {
	const {
		id,
		disabled,
		invalid,
		onBlur,
		placeholder,
		excludeCategoryIds,
		allowCreate,
	} = props;

	const categories = useQuery(api.inclusionCategories.list.list, {});
	const addCategory = useMutation(api.inclusionCategories.add.add);

	const [creating, setCreating] = useState(false);
	const [newCategoryName, setNewCategoryName] = useState('');
	const [newCategoryCode, setNewCategoryCode] = useState('');
	const [isCreating, setIsCreating] = useState(false);

	const excludeSet = useMemo(
		() => new Set(excludeCategoryIds ?? []),
		[excludeCategoryIds]
	);
	const items = useMemo(
		() =>
			(categories ?? [])
				.map((category) => category._id)
				.filter((categoryId) => !excludeSet.has(categoryId)),
		[categories, excludeSet]
	);
	const labelById = useMemo(() => {
		const map = new Map<Id<'inclusionCategories'>, string>();
		for (const category of categories ?? []) {
			map.set(category._id, category.name);
		}
		return map;
	}, [categories]);

	const busy = categories === undefined;
	const idPrefix = id ?? 'inclusion-category-select';

	const resetCreate = () => {
		setCreating(false);
		setNewCategoryName('');
		setNewCategoryCode('');
	};

	const handleCreate = async () => {
		const name = newCategoryName.trim();
		const code = newCategoryCode.trim();
		if (!(name && code)) {
			toastManager.add({
				title: 'Enter a category name and code',
				type: 'error',
			});
			return;
		}
		setIsCreating(true);
		try {
			const categoryId = await addCategory({ name, code });
			if (props.multiple) {
				props.onValueChange([...props.value, categoryId]);
			} else {
				props.onValueChange(categoryId);
			}
			toastManager.add({ title: 'Category created', type: 'success' });
			resetCreate();
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not create category. Please try again in a moment.'
				),
				title: 'Could not create category',
				type: 'error',
			});
		} finally {
			setIsCreating(false);
		}
	};

	const optionList = (
		<ComboboxList>
			{(item: Id<'inclusionCategories'>) => (
				<ComboboxItem key={item} value={item}>
					{labelById.get(item) ?? item}
				</ComboboxItem>
			)}
		</ComboboxList>
	);

	return (
		<div className="flex w-full flex-col gap-2">
			{props.multiple ? (
				<Combobox<Id<'inclusionCategories'>, true>
					disabled={disabled || busy}
					items={items}
					itemToStringLabel={(item) => labelById.get(item) ?? ''}
					multiple
					onValueChange={(next) =>
						props.onValueChange(
							(next as Id<'inclusionCategories'>[] | null) ?? []
						)
					}
					value={props.value}
				>
					<ComboboxChips>
						{props.value.map((categoryId) => (
							<ComboboxChip key={categoryId}>
								{labelById.get(categoryId) ?? categoryId}
							</ComboboxChip>
						))}
						<ComboboxChipsInput
							placeholder={
								busy
									? 'Loading categories…'
									: (placeholder ?? 'Search categories…')
							}
						/>
					</ComboboxChips>
					<ComboboxPopup>
						<ComboboxEmpty>No category found.</ComboboxEmpty>
						{optionList}
					</ComboboxPopup>
				</Combobox>
			) : (
				<Combobox<Id<'inclusionCategories'>>
					disabled={disabled || busy}
					items={items}
					itemToStringLabel={(item) => labelById.get(item) ?? ''}
					onValueChange={(next) => props.onValueChange(next ?? '')}
					value={props.value === '' ? null : props.value}
				>
					<ComboboxInput
						aria-invalid={invalid}
						id={id}
						onBlur={onBlur}
						placeholder={
							busy
								? 'Loading categories…'
								: (placeholder ?? 'Select a category')
						}
					/>
					<ComboboxPopup>
						<ComboboxEmpty>No category found.</ComboboxEmpty>
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
						<Plus /> New category
					</Button>
				</div>
			) : null}

			{allowCreate && creating ? (
				<div className="flex flex-col gap-3 rounded-md border p-3">
					<Field>
						<FieldLabel htmlFor={`${idPrefix}-new-name`}>
							Category name
						</FieldLabel>
						<Input
							id={`${idPrefix}-new-name`}
							nativeInput
							onChange={(e) => setNewCategoryName(e.target.value)}
							placeholder="e.g. Tapware"
							value={newCategoryName}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor={`${idPrefix}-new-code`}>
							Category code
						</FieldLabel>
						<Input
							id={`${idPrefix}-new-code`}
							nativeInput
							onChange={(e) => setNewCategoryCode(e.target.value)}
							placeholder="e.g. TAP"
							value={newCategoryCode}
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
							<Plus aria-hidden /> Create category
						</Button>
					</div>
				</div>
			) : null}
		</div>
	);
}
