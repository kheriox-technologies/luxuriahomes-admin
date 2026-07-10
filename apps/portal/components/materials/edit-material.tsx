'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
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
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Check } from 'lucide-react';
import { type ReactElement, useEffect, useState } from 'react';
import UnitCombobox from '@/components/inclusions/unit-combobox';
import VendorSelect from '@/components/inclusions/vendor-select';
import TradeSelect from '@/components/trades/trade-select';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyMaterialFormValues,
	materialFormFieldError,
	materialFormSchema,
} from './material-form-shared';

const FORM_ID = 'edit-material-form';

export default function EditMaterial({
	material,
	trigger,
	open: controlledOpen,
	onOpenChange,
}: {
	material: Doc<'materials'>;
	trigger?: ReactElement;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const [internalOpen, setInternalOpen] = useState(false);
	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : internalOpen;
	const setOpen = (next: boolean) => {
		if (!isControlled) {
			setInternalOpen(next);
		}
		onOpenChange?.(next);
	};
	const units = useQuery(api.units.list.list, {});
	const updateMaterial = useMutation(api.materials.update.update);

	const form = useForm({
		defaultValues: emptyMaterialFormValues,
		validators: {
			onChange: materialFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = materialFormSchema.parse(value);
				await updateMaterial({
					materialId: material._id,
					name: parsed.name,
					description: parsed.description?.trim() || undefined,
					tradeId: parsed.tradeId as never,
					unit: parsed.unit as never,
					price: Number(parsed.price),
					vendor: parsed.vendor.trim(),
					sku: parsed.sku?.trim() || undefined,
					link: parsed.link?.trim() || undefined,
				});
				toastManager.add({ title: 'Material updated', type: 'success' });
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update material. Please try again in a moment.'
					),
					title: 'Could not update material',
					type: 'error',
				});
			}
		},
	});

	useEffect(() => {
		if (open) {
			form.reset(
				{
					name: material.name,
					description: material.description ?? '',
					tradeId: material.tradeId,
					unit: material.unit,
					price: String(material.price),
					vendor: material.vendor,
					sku: material.sku ?? '',
					link: material.link ?? '',
				},
				{ keepDefaultValues: true }
			);
		}
	}, [open, material, form]);

	return (
		<Dialog
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (!nextOpen) {
					form.reset();
				}
			}}
			open={open}
		>
			{trigger ? <DialogTrigger render={trigger} /> : null}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Material</DialogTitle>
				</DialogHeader>
				<form
					id={FORM_ID}
					onSubmit={(event) => {
						event.preventDefault();
						form.handleSubmit().catch(() => {
							/* TanStack Form handles validation */
						});
					}}
				>
					<DialogPanel className="flex flex-col gap-4">
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
											placeholder="Material name"
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
						<form.Field name="tradeId">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Trade</FieldLabel>
										<TradeSelect
											allowCreate
											id={field.name}
											invalid={invalid}
											onBlur={field.handleBlur}
											onValueChange={(next) => field.handleChange(next)}
											value={field.state.value as Id<'trades'> | ''}
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
						<form.Field name="unit">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Unit</FieldLabel>
										<UnitCombobox
											id={field.name}
											invalid={invalid}
											onBlur={field.handleBlur}
											onChange={(next) => field.handleChange(next)}
											units={units}
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
						<form.Field name="price">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>
											Price{' '}
											<span className="text-muted-foreground text-xs">
												(per unit)
											</span>
										</FieldLabel>
										<Input
											aria-invalid={invalid}
											id={field.name}
											min="0"
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="e.g. 49.99"
											step="any"
											type="number"
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
						<form.Field name="vendor">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Vendor</FieldLabel>
										<VendorSelect
											allowCreate
											id={field.name}
											invalid={invalid}
											onBlur={field.handleBlur}
											onValueChange={(next) => field.handleChange(next)}
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
						<form.Field name="sku">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>
										SKU{' '}
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
										placeholder="e.g. ABC-123"
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
					</DialogPanel>
				</form>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
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
