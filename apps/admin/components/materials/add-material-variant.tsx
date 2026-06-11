'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import {
	Frame,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from '@workspace/ui/components/frame';
import { Input } from '@workspace/ui/components/input';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetPanel,
	SheetTitle,
	SheetTrigger,
} from '@workspace/ui/components/sheet';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Plus } from 'lucide-react';
import { type ReactElement, useState } from 'react';
import VendorCombobox from '@/components/inclusions/vendor-combobox';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyMaterialItemDraft,
	emptyMaterialVariantFormValues,
	type MaterialItemDraftValues,
	materialFormFieldError,
	materialItemDraftErrorMessage,
	materialItemDraftSchema,
	materialVariantFormSchema,
} from './material-form-shared';
import { MaterialItemCard, MaterialItemDraftFields } from './material-item-ui';

const FORM_ID = 'add-material-variant-form';

export default function AddMaterialVariant({
	materialId,
	trigger,
}: {
	materialId: Id<'materials'>;
	trigger?: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const [items, setItems] = useState<MaterialItemDraftValues[]>([]);
	const [draft, setDraft] = useState<MaterialItemDraftValues>(
		emptyMaterialItemDraft
	);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	const vendors = useQuery(api.vendors.list.list, {});
	const units = useQuery(api.units.list.list, {});
	const addVariant = useMutation(api.materialVariants.add.add);
	const addItem = useMutation(api.materialItems.add.add);
	const addVendor = useMutation(api.vendors.add.add);

	const unitLabelById = new Map(
		(units ?? []).map((u) => [u._id, `${u.label} (${u.abbr})`])
	);

	const form = useForm({
		defaultValues: emptyMaterialVariantFormValues,
		validators: {
			onChange: materialVariantFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			const parsed = materialVariantFormSchema.parse(value);
			try {
				const newVendorTrimmed = parsed.newVendorName?.trim();
				const resolvedVendor = newVendorTrimmed ?? parsed.vendor.trim();
				if (newVendorTrimmed) {
					await addVendor({ name: newVendorTrimmed });
				}

				const variantId = await addVariant({
					materialId,
					name: parsed.name,
					description: parsed.description?.trim() || undefined,
					vendor: resolvedVendor,
					link: parsed.link?.trim() || undefined,
				});

				for (const item of items) {
					const itemNewVendorTrimmed = item.newVendorName?.trim();
					const itemVendor = itemNewVendorTrimmed ?? item.vendor.trim();
					if (itemNewVendorTrimmed) {
						await addVendor({ name: itemNewVendorTrimmed });
					}
					await addItem({
						materialVariantId: variantId,
						name: item.name,
						description: item.description?.trim() || undefined,
						vendor: itemVendor,
						unit: item.unit as never,
						link: item.link?.trim() || undefined,
					});
				}

				toastManager.add({ title: 'Variant added', type: 'success' });
				resetAll();
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not add variant. Please try again in a moment.'
					),
					title: 'Could not add variant',
					type: 'error',
				});
			}
		},
	});

	const resetAll = () => {
		form.reset();
		setItems([]);
		setDraft(emptyMaterialItemDraft);
		setEditingIndex(null);
	};

	const handleAddOrSaveItem = () => {
		const parsed = materialItemDraftSchema.safeParse(draft);
		if (!parsed.success) {
			toastManager.add({
				description: materialItemDraftErrorMessage(parsed.error),
				title: 'Item details invalid',
				type: 'error',
			});
			return;
		}
		if (editingIndex === null) {
			setItems((prev) => [...prev, parsed.data]);
		} else {
			setItems((prev) => {
				const copy = [...prev];
				copy[editingIndex] = parsed.data;
				return copy;
			});
		}
		setDraft(emptyMaterialItemDraft);
		setEditingIndex(null);
	};

	const handleEditItem = (index: number) => {
		const item = items[index];
		if (!item) {
			return;
		}
		setDraft(item);
		setEditingIndex(index);
	};

	const handleDeleteItem = (index: number) => {
		setItems((prev) => prev.filter((_, i) => i !== index));
		if (editingIndex === index) {
			setDraft(emptyMaterialItemDraft);
			setEditingIndex(null);
		}
	};

	return (
		<Sheet
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) {
					resetAll();
				}
			}}
			open={open}
		>
			<SheetTrigger
				render={
					trigger ?? (
						<Button size="icon" type="button" variant="outline">
							<Plus />
						</Button>
					)
				}
			/>
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0"
				side="right"
			>
				<SheetHeader>
					<SheetTitle>Add variant</SheetTitle>
				</SheetHeader>
				<form
					className="flex min-h-0 min-w-0 flex-1 flex-col"
					id={FORM_ID}
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit().catch(() => {
							/* TanStack Form handles validation */
						});
					}}
				>
					<SheetPanel className="flex flex-col gap-6">
						<Frame>
							<FrameHeader className="flex flex-row items-center py-3">
								<FrameTitle className="min-w-0 truncate leading-none">
									Variant details
								</FrameTitle>
							</FrameHeader>
							<FramePanel className="space-y-4">
								<form.Field name="name">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Name</FieldLabel>
												<Input
													aria-invalid={invalid}
													autoFocus
													id={field.name}
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Variant name"
													value={field.state.value}
												/>
												{invalid ? (
													<FieldError>
														{materialFormFieldError(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
								<form.Field name="description">
									{(field) => (
										<Field>
											<FieldLabel htmlFor={field.name}>
												Description{' '}
												<span className="text-muted-foreground text-xs">
													(optional)
												</span>
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												nativeInput
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Short description"
												value={field.state.value ?? ''}
											/>
										</Field>
									)}
								</form.Field>
								<form.Field name="vendor">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Vendor</FieldLabel>
												<VendorCombobox
													id={field.name}
													invalid={invalid}
													onBlur={field.handleBlur}
													onChange={(next) => {
														field.handleChange(next);
														if (next) {
															form.setFieldValue('newVendorName', '');
														}
													}}
													value={field.state.value}
													vendors={vendors}
												/>
												{invalid ? (
													<FieldError>
														{materialFormFieldError(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
								<form.Field name="newVendorName">
									{(field) => (
										<Field>
											<FieldLabel htmlFor={field.name}>
												Or add new vendor
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												nativeInput
												onBlur={field.handleBlur}
												onChange={(e) => {
													field.handleChange(e.target.value);
													if (e.target.value.trim()) {
														form.setFieldValue('vendor', '');
													}
												}}
												placeholder="New vendor name"
												value={field.state.value ?? ''}
											/>
										</Field>
									)}
								</form.Field>
								<form.Field name="link">
									{(field) => (
										<Field>
											<FieldLabel htmlFor={field.name}>
												Link{' '}
												<span className="text-muted-foreground text-xs">
													(optional)
												</span>
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												nativeInput
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="https://"
												type="url"
												value={field.state.value ?? ''}
											/>
										</Field>
									)}
								</form.Field>
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader className="flex flex-row items-center py-3">
								<FrameTitle className="min-w-0 truncate leading-none">
									Items
								</FrameTitle>
							</FrameHeader>
							<FramePanel className="space-y-4">
								<MaterialItemDraftFields
									draft={draft}
									setDraft={setDraft}
									units={units}
									vendors={vendors}
								/>
								<Button
									className="w-full"
									onClick={handleAddOrSaveItem}
									size="sm"
									type="button"
									variant="outline"
								>
									{editingIndex === null ? 'Add item' : 'Save item'}
								</Button>
								{items.length > 0 ? (
									<div className="flex flex-col gap-2">
										{items.map((item, index) => (
											<MaterialItemCard
												item={item}
												key={`${item.name}-${item.vendor}-${item.unit}`}
												onDelete={() => handleDeleteItem(index)}
												onEdit={() => handleEditItem(index)}
												unitLabel={
													unitLabelById.get(item.unit as never) ?? item.unit
												}
											/>
										))}
									</div>
								) : null}
							</FramePanel>
						</Frame>
					</SheetPanel>
				</form>
				<SheetFooter>
					<SheetClose render={<Button type="button" variant="outline" />}>
						Cancel
					</SheetClose>
					<Button
						disabled={
							!(
								form.state.isValid &&
								!form.state.isValidating &&
								!form.state.isSubmitting
							)
						}
						form={FORM_ID}
						type="submit"
					>
						Add variant
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
