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
import VendorSelect from '@/components/inclusions/vendor-select';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyMaterialItemDraft,
	type MaterialItemDraftValues,
	materialItemDraftSchema,
} from './material-form-shared';

export default function AddMaterialItem({
	materialId,
	trigger,
}: {
	materialId: Id<'materials'>;
	trigger?: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const [draft, setDraft] = useState<MaterialItemDraftValues>(
		emptyMaterialItemDraft
	);

	const units = useQuery(api.units.list.list, {});
	const addItem = useMutation(api.materialItems.add.add);

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
			await addItem({
				materialId,
				name: data.name,
				description: data.description?.trim() || undefined,
				vendor: data.vendor.trim(),
				unit: data.unit as never,
				price: Number(data.price),
				quantity: Number(data.quantity),
				sku: data.sku?.trim() || undefined,
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
						<Button variant="outline">
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
						<VendorSelect
							allowCreate
							id="add-item-vendor"
							onValueChange={(next) =>
								setDraft((p) => ({ ...p, vendor: next }))
							}
							value={draft.vendor}
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
						<FieldLabel htmlFor="add-item-price">
							Price{' '}
							<span className="text-muted-foreground text-xs">(per unit)</span>
						</FieldLabel>
						<Input
							id="add-item-price"
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
						<FieldLabel htmlFor="add-item-sku">
							SKU{' '}
							<span className="text-muted-foreground text-xs">(optional)</span>
						</FieldLabel>
						<Input
							id="add-item-sku"
							nativeInput
							onChange={(e) => setDraft((p) => ({ ...p, sku: e.target.value }))}
							placeholder="e.g. ABC-123"
							value={draft.sku ?? ''}
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
						variant="outline"
					>
						<Plus aria-hidden />
						Add Item
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
