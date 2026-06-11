'use client';

import type { Doc } from '@workspace/backend/dataModel';
import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@workspace/ui/components/alert-dialog';
import { Button } from '@workspace/ui/components/button';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { Frame, FrameHeader, FrameTitle } from '@workspace/ui/components/frame';
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import { Input } from '@workspace/ui/components/input';
import { Pencil, Trash2 } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import UnitCombobox from '@/components/inclusions/unit-combobox';
import VendorCombobox from '@/components/inclusions/vendor-combobox';
import type { MaterialItemDraftValues } from './material-form-shared';

export function MaterialItemCard({
	item,
	unitLabel,
	onEdit,
	onDelete,
}: {
	item: MaterialItemDraftValues;
	unitLabel: string;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const [confirmOpen, setConfirmOpen] = useState(false);
	const displayVendor = item.newVendorName?.trim() || item.vendor;
	return (
		<Frame>
			<FrameHeader className="flex flex-row items-center justify-between gap-3 py-3">
				<div className="min-w-0">
					<FrameTitle className="truncate leading-none">{item.name}</FrameTitle>
					{displayVendor ? (
						<p className="mt-0.5 truncate text-muted-foreground text-xs leading-snug">
							{displayVendor}
						</p>
					) : null}
					{unitLabel ? (
						<p className="mt-0.5 truncate text-muted-foreground text-xs leading-snug">
							{unitLabel}
						</p>
					) : null}
				</div>
				<Group className="shrink-0">
					<Button
						aria-label="Edit item"
						onClick={onEdit}
						size="icon"
						type="button"
						variant="outline"
					>
						<Pencil />
					</Button>
					<GroupSeparator />
					<AlertDialog onOpenChange={setConfirmOpen} open={confirmOpen}>
						<AlertDialogTrigger
							render={
								<Button
									aria-label="Delete item"
									size="icon"
									type="button"
									variant="destructive-outline"
								/>
							}
						>
							<Trash2 />
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete item?</AlertDialogTitle>
								<AlertDialogDescription>
									{`Remove ${item.name} from this variant?`}
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogClose
									render={<Button type="button" variant="outline" />}
								>
									Cancel
								</AlertDialogClose>
								<Button
									onClick={() => {
										onDelete();
										setConfirmOpen(false);
									}}
									type="button"
									variant="destructive"
								>
									Delete item
								</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</Group>
			</FrameHeader>
		</Frame>
	);
}

export function MaterialItemDraftFields({
	draft,
	setDraft,
	vendors,
	units,
}: {
	draft: MaterialItemDraftValues;
	setDraft: Dispatch<SetStateAction<MaterialItemDraftValues>>;
	vendors: Doc<'vendors'>[] | undefined;
	units: Doc<'units'>[] | undefined;
}) {
	return (
		<div className="flex flex-col gap-4">
			<Field>
				<FieldLabel htmlFor="item-draft-name">Name</FieldLabel>
				<Input
					id="item-draft-name"
					nativeInput
					onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
					placeholder="Item name"
					value={draft.name}
				/>
			</Field>
			<Field>
				<FieldLabel htmlFor="item-draft-description">
					Description{' '}
					<span className="text-muted-foreground text-xs">(optional)</span>
				</FieldLabel>
				<Input
					id="item-draft-description"
					nativeInput
					onChange={(e) =>
						setDraft((p) => ({ ...p, description: e.target.value }))
					}
					placeholder="Short description"
					value={draft.description ?? ''}
				/>
			</Field>
			<Field>
				<FieldLabel htmlFor="item-draft-vendor">Vendor</FieldLabel>
				<VendorCombobox
					id="item-draft-vendor"
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
				<FieldLabel htmlFor="item-draft-new-vendor">
					Or add new vendor
				</FieldLabel>
				<Input
					id="item-draft-new-vendor"
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
				<FieldLabel htmlFor="item-draft-unit">Unit</FieldLabel>
				<UnitCombobox
					id="item-draft-unit"
					onBlur={() => undefined}
					onChange={(next) => setDraft((p) => ({ ...p, unit: next }))}
					units={units}
					value={draft.unit}
				/>
			</Field>
			<Field>
				<FieldLabel htmlFor="item-draft-quantity">Quantity</FieldLabel>
				<Input
					id="item-draft-quantity"
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
				<FieldLabel htmlFor="item-draft-sku">
					SKU{' '}
					<span className="text-muted-foreground text-xs">(optional)</span>
				</FieldLabel>
				<Input
					id="item-draft-sku"
					nativeInput
					onChange={(e) => setDraft((p) => ({ ...p, sku: e.target.value }))}
					placeholder="e.g. ABC-123"
					value={draft.sku ?? ''}
				/>
			</Field>
			<Field>
				<FieldLabel htmlFor="item-draft-link">
					Link <span className="text-muted-foreground text-xs">(optional)</span>
				</FieldLabel>
				<Input
					id="item-draft-link"
					nativeInput
					onChange={(e) => setDraft((p) => ({ ...p, link: e.target.value }))}
					placeholder="https://"
					type="url"
					value={draft.link ?? ''}
				/>
			</Field>
		</div>
	);
}
