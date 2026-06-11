'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogPanel,
	DialogTitle,
	DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Plus } from 'lucide-react';
import { type ReactElement, useState } from 'react';
import UnitCombobox from '@/components/inclusions/unit-combobox';
import VendorCombobox from '@/components/inclusions/vendor-combobox';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyMaterialItemDraft,
	type MaterialItemDraftValues,
	materialItemDraftSchema,
} from './material-form-shared';

export default function AddMaterialItem({
	variantId,
	trigger,
}: {
	variantId: Id<'materialVariants'>;
	trigger?: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const [draft, setDraft] = useState<MaterialItemDraftValues>(
		emptyMaterialItemDraft
	);

	const vendors = useQuery(api.vendors.list.list, {});
	const units = useQuery(api.units.list.list, {});
	const addItem = useMutation(api.materialItems.add.add);
	const addVendor = useMutation(api.vendors.add.add);

	const handleSubmit = async () => {
		const parsed = materialItemDraftSchema.safeParse(draft);
		if (!parsed.success) {
			toastManager.add({
				description: parsed.error.issues.map((i) => i.message).join(' '),
				title: 'Item details invalid',
				type: 'error',
			});
			return;
		}
		try {
			const { data } = parsed;
			const newVendorTrimmed = data.newVendorName?.trim();
			const resolvedVendor = newVendorTrimmed || data.vendor.trim();
			if (newVendorTrimmed) {
				await addVendor({ name: newVendorTrimmed });
			}
			await addItem({
				materialVariantId: variantId,
				name: data.name,
				description: data.description?.trim() || undefined,
				vendor: resolvedVendor,
				unit: data.unit as never,
				quantity: Number(data.quantity),
				link: data.link?.trim() || undefined,
			});
			toastManager.add({ title: 'Item added', type: 'success' });
			setDraft(emptyMaterialItemDraft);
			setOpen(false);
		} catch (error) {
			setOpen(false);
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not add item. Please try again in a moment.'
				),
				title: 'Could not add item',
				type: 'error',
			});
		}
	};

	return (
		<Dialog
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) {
					setDraft(emptyMaterialItemDraft);
				}
			}}
			open={open}
		>
			<DialogTrigger
				render={
					trigger ?? (
						<Button>
							<Plus />
							Add Item
						</Button>
					)
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Item</DialogTitle>
				</DialogHeader>
				<DialogPanel className="flex flex-col gap-4">
					<Field>
						<FieldLabel htmlFor="add-item-name">Name</FieldLabel>
						<Input
							autoFocus
							id="add-item-name"
							nativeInput
							onChange={(e) =>
								setDraft((p) => ({ ...p, name: e.target.value }))
							}
							placeholder="Item name"
							value={draft.name}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="add-item-description">
							Description{' '}
							<span className="text-muted-foreground text-xs">(optional)</span>
						</FieldLabel>
						<Input
							id="add-item-description"
							nativeInput
							onChange={(e) =>
								setDraft((p) => ({ ...p, description: e.target.value }))
							}
							placeholder="Short description"
							value={draft.description ?? ''}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="add-item-vendor">Vendor</FieldLabel>
						<VendorCombobox
							id="add-item-vendor"
							onBlur={() => undefined}
							onChange={(next) => {
								setDraft((p) => ({
									...p,
									vendor: next,
									newVendorName: next ? '' : p.newVendorName,
								}));
							}}
							value={draft.vendor}
							vendors={vendors}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="add-item-new-vendor">
							Or add new vendor
						</FieldLabel>
						<Input
							id="add-item-new-vendor"
							nativeInput
							onChange={(e) => {
								setDraft((p) => ({
									...p,
									newVendorName: e.target.value,
									vendor: e.target.value.trim() ? '' : p.vendor,
								}));
							}}
							placeholder="New vendor name"
							value={draft.newVendorName ?? ''}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="add-item-unit">Unit</FieldLabel>
						<UnitCombobox
							id="add-item-unit"
							onBlur={() => undefined}
							onChange={(next) => setDraft((p) => ({ ...p, unit: next }))}
							units={units}
							value={draft.unit}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="add-item-quantity">Quantity</FieldLabel>
						<Input
							id="add-item-quantity"
							min="0"
							nativeInput
							onChange={(e) =>
								setDraft((p) => ({ ...p, quantity: e.target.value }))
							}
							placeholder="e.g. 100"
							step="any"
							type="number"
							value={draft.quantity}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="add-item-link">
							Link{' '}
							<span className="text-muted-foreground text-xs">(optional)</span>
						</FieldLabel>
						<Input
							id="add-item-link"
							nativeInput
							onChange={(e) =>
								setDraft((p) => ({ ...p, link: e.target.value }))
							}
							placeholder="https://"
							type="url"
							value={draft.link ?? ''}
						/>
					</Field>
				</DialogPanel>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						onClick={() => {
							handleSubmit().catch(() => {
								/* Error handled in handleSubmit */
							});
						}}
						type="button"
					>
						Add Item
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
