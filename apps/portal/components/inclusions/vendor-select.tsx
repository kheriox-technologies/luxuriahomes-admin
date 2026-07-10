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

interface VendorSelectBaseProps {
	/** Show the inline "New vendor" create affordance. */
	allowCreate?: boolean;
	disabled?: boolean;
	/** Vendor names to hide from the list (e.g. ones already added). */
	excludeVendors?: string[];
	id?: string;
	invalid?: boolean;
	onBlur?: () => void;
	placeholder?: string;
}

interface VendorSelectSingleProps extends VendorSelectBaseProps {
	multiple?: false;
	onValueChange: (next: string) => void;
	value: string;
}

interface VendorSelectMultiProps extends VendorSelectBaseProps {
	multiple: true;
	onValueChange: (next: string[]) => void;
	value: string[];
}

export type VendorSelectProps =
	| VendorSelectSingleProps
	| VendorSelectMultiProps;

/**
 * The single source of truth for picking a vendor anywhere in the app. Vendors
 * are stored by name on the parent records, so this select works with vendor
 * name strings. Works as a single- or multi-select (via `multiple`) and — when
 * `allowCreate` is set — offers an inline "New vendor" flow that saves the
 * vendor to the shared catalog immediately and selects it.
 */
export default function VendorSelect(props: VendorSelectProps) {
	const {
		id,
		disabled,
		invalid,
		onBlur,
		placeholder,
		excludeVendors,
		allowCreate,
	} = props;

	const vendors = useQuery(api.vendors.list.list, {});
	const addVendor = useMutation(api.vendors.add.add);

	const [creating, setCreating] = useState(false);
	const [newVendorName, setNewVendorName] = useState('');
	const [isCreating, setIsCreating] = useState(false);

	const excludeSet = useMemo(
		() => new Set(excludeVendors ?? []),
		[excludeVendors]
	);
	const items = useMemo(
		() =>
			(vendors ?? [])
				.map((vendor) => vendor.name)
				.filter((name) => !excludeSet.has(name)),
		[vendors, excludeSet]
	);

	const busy = vendors === undefined;
	const idPrefix = id ?? 'vendor-select';

	const resetCreate = () => {
		setCreating(false);
		setNewVendorName('');
	};

	const handleCreate = async () => {
		const name = newVendorName.trim();
		if (!name) {
			toastManager.add({ title: 'Enter a vendor name', type: 'error' });
			return;
		}
		setIsCreating(true);
		try {
			await addVendor({ name });
			if (props.multiple) {
				props.onValueChange([...props.value, name]);
			} else {
				props.onValueChange(name);
			}
			toastManager.add({ title: 'Vendor created', type: 'success' });
			resetCreate();
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not create vendor. Please try again in a moment.'
				),
				title: 'Could not create vendor',
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
						{props.value.map((vendor) => (
							<ComboboxChip key={vendor}>{vendor}</ComboboxChip>
						))}
						<ComboboxChipsInput
							placeholder={
								busy ? 'Loading vendors…' : (placeholder ?? 'Search vendors…')
							}
						/>
					</ComboboxChips>
					<ComboboxPopup>
						<ComboboxEmpty>No vendor found.</ComboboxEmpty>
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
							busy ? 'Loading vendors…' : (placeholder ?? 'Search vendors')
						}
					/>
					<ComboboxPopup>
						<ComboboxEmpty>No vendor found.</ComboboxEmpty>
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
						<Plus /> New vendor
					</Button>
				</div>
			) : null}

			{allowCreate && creating ? (
				<div className="flex flex-col gap-3 rounded-md border p-3">
					<Field>
						<FieldLabel htmlFor={`${idPrefix}-new-name`}>
							Vendor name
						</FieldLabel>
						<Input
							id={`${idPrefix}-new-name`}
							nativeInput
							onChange={(e) => setNewVendorName(e.target.value)}
							placeholder="e.g. Reece Plumbing"
							value={newVendorName}
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
							<Plus aria-hidden /> Create vendor
						</Button>
					</div>
				</div>
			) : null}
		</div>
	);
}
