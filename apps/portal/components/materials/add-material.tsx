'use client';

import { useForm } from '@tanstack/react-form';
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
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Plus } from 'lucide-react';
import { type ReactElement, useState } from 'react';
import UnitCombobox from '@/components/inclusions/unit-combobox';
import VendorCombobox from '@/components/inclusions/vendor-combobox';
import TradeSelect from '@/components/trades/trade-select';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyMaterialFormValues,
	materialFormFieldError,
	materialFormSchema,
} from './material-form-shared';

const FORM_ID = 'add-material-form';

export default function AddMaterial({
	trigger,
}: {
	trigger?: ReactElement;
} = {}) {
	const [open, setOpen] = useState(false);
	const units = useQuery(api.units.list.list, {});
	const vendors = useQuery(api.vendors.list.list, {});
	const addMaterial = useMutation(api.materials.add.add);
	const addVendor = useMutation(api.vendors.add.add);

	const form = useForm({
		defaultValues: emptyMaterialFormValues,
		validators: {
			onChange: materialFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = materialFormSchema.parse(value);
				const newVendorTrimmed = parsed.newVendorName?.trim();
				const resolvedVendor = newVendorTrimmed || parsed.vendor.trim();
				if (newVendorTrimmed) {
					await addVendor({ name: newVendorTrimmed });
				}
				await addMaterial({
					name: parsed.name,
					description: parsed.description?.trim() || undefined,
					tradeId: parsed.tradeId as never,
					unit: parsed.unit as never,
					price: Number(parsed.price),
					vendor: resolvedVendor,
					sku: parsed.sku?.trim() || undefined,
					link: parsed.link?.trim() || undefined,
				});
				toastManager.add({ title: 'Material added', type: 'success' });
				form.reset();
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not add material. Please try again in a moment.'
					),
					title: 'Could not add material',
					type: 'error',
				});
				form.reset();
				setOpen(false);
			}
		},
	});

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
			<DialogTrigger
				render={
					trigger ?? (
						<Button variant="outline">
							<Plus aria-hidden />
							Add Material
						</Button>
					)
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Material</DialogTitle>
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
						<Plus aria-hidden />
						Add Material
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
