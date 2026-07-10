'use client';

import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogPanel,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import UnitCombobox from '@/components/inclusions/unit-combobox';
import VendorSelect from '@/components/inclusions/vendor-select';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	type MaterialItemDraftValues,
	materialItemDraftSchema,
} from './material-form-shared';

export default function EditMaterialItem({
	item,
	open,
	onOpenChange,
}: {
	item: Doc<'materialItems'>;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [draft, setDraft] = useState<MaterialItemDraftValues>({
		name: '',
		description: '',
		vendor: '',
		unit: '',
		price: '',
		quantity: '',
		sku: '',
		link: '',
	});

	const units = useQuery(api.units.list.list, {});
	const updateItem = useMutation(api.materialItems.update.update);

	useEffect(() => {
		if (open) {
			setDraft({
				name: item.name,
				description: item.description ?? '',
				vendor: item.vendor,
				unit: item.unit,
				price: item.price.toString(),
				quantity: item.quantity?.toString() ?? '',
				sku: item.sku ?? '',
				link: item.link ?? '',
			});
		}
	}, [open, item]);

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
			await updateItem({
				itemId: item._id,
				name: data.name,
				description: data.description?.trim() || undefined,
				vendor: data.vendor.trim(),
				unit: data.unit as never,
				price: Number(data.price),
				quantity: Number(data.quantity),
				sku: data.sku?.trim() || undefined,
				link: data.link?.trim() || undefined,
			});
			toastManager.add({ title: 'Item updated', type: 'success' });
			onOpenChange(false);
		} catch (error) {
			onOpenChange(false);
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not update item. Please try again in a moment.'
				),
				title: 'Could not update item',
				type: 'error',
			});
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Item</DialogTitle>
				</DialogHeader>
				<DialogPanel className="flex flex-col gap-4">
					<Field>
						<FieldLabel htmlFor="edit-item-name">Name</FieldLabel>
						<Input
							autoFocus
							id="edit-item-name"
							nativeInput
							onChange={(e) =>
								setDraft((p) => ({ ...p, name: e.target.value }))
							}
							placeholder="Item name"
							value={draft.name}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="edit-item-description">
							Description{' '}
							<span className="text-muted-foreground text-xs">(optional)</span>
						</FieldLabel>
						<Input
							id="edit-item-description"
							nativeInput
							onChange={(e) =>
								setDraft((p) => ({ ...p, description: e.target.value }))
							}
							placeholder="Short description"
							value={draft.description ?? ''}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="edit-item-vendor">Vendor</FieldLabel>
						<VendorSelect
							allowCreate
							id="edit-item-vendor"
							onValueChange={(next) =>
								setDraft((p) => ({ ...p, vendor: next }))
							}
							value={draft.vendor}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="edit-item-unit">Unit</FieldLabel>
						<UnitCombobox
							id="edit-item-unit"
							onBlur={() => undefined}
							onChange={(next) => setDraft((p) => ({ ...p, unit: next }))}
							units={units}
							value={draft.unit}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="edit-item-price">
							Price{' '}
							<span className="text-muted-foreground text-xs">(per unit)</span>
						</FieldLabel>
						<Input
							id="edit-item-price"
							min="0"
							nativeInput
							onChange={(e) =>
								setDraft((p) => ({ ...p, price: e.target.value }))
							}
							placeholder="e.g. 12.50"
							step="any"
							type="number"
							value={draft.price}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="edit-item-quantity">Quantity</FieldLabel>
						<Input
							id="edit-item-quantity"
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
						<FieldLabel htmlFor="edit-item-sku">
							SKU{' '}
							<span className="text-muted-foreground text-xs">(optional)</span>
						</FieldLabel>
						<Input
							id="edit-item-sku"
							nativeInput
							onChange={(e) => setDraft((p) => ({ ...p, sku: e.target.value }))}
							placeholder="e.g. ABC-123"
							value={draft.sku ?? ''}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="edit-item-link">
							Link{' '}
							<span className="text-muted-foreground text-xs">(optional)</span>
						</FieldLabel>
						<Input
							id="edit-item-link"
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
						variant="outline"
					>
						<Check aria-hidden />
						Save Changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
