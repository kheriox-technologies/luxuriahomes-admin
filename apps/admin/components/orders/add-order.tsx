'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
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
import { type ReactElement, useMemo, useState } from 'react';
import VendorCombobox from '@/components/inclusions/vendor-combobox';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyOrderFormValues,
	ORDER_STATUSES,
	orderFormFieldError,
	orderFormSchema,
} from './order-form-shared';

const FORM_ID = 'add-order-form';

export default function AddOrder({
	projectId,
	trigger,
}: {
	projectId: Id<'projects'>;
	trigger?: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const addOrder = useMutation(api.projectOrders.add.add);
	const addVendor = useMutation(api.vendors.add.add);
	const vendors = useQuery(api.vendors.list.list, {});
	const units = useQuery(api.units.list.list, {});
	const unitItems = useMemo(() => (units ?? []).map((u) => u.abbr), [units]);
	const unitLabelByAbbr = useMemo(() => {
		const m = new Map<string, string>();
		for (const u of units ?? []) {
			m.set(u.abbr, `${u.label} (${u.abbr})`);
		}
		return m;
	}, [units]);

	const form = useForm({
		defaultValues: emptyOrderFormValues,
		validators: {
			onChange: orderFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = orderFormSchema.parse(value);
				const newVendorTrimmed = parsed.newVendorName?.trim();
				const resolvedVendor = newVendorTrimmed || parsed.vendor.trim();
				if (newVendorTrimmed) {
					await addVendor({ name: newVendorTrimmed });
				}
				await addOrder({
					projectId,
					name: parsed.name,
					description: parsed.description?.trim() || undefined,
					vendor: resolvedVendor,
					quantity: Number(parsed.quantity),
					unit: parsed.unit,
					link: parsed.link?.trim() || undefined,
					status: parsed.status,
				});
				toastManager.add({ title: 'Order added', type: 'success' });
				form.reset();
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not add order. Please try again in a moment.'
					),
					title: 'Could not add order',
					type: 'error',
				});
			}
		},
	});

	return (
		<Sheet
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) {
					form.reset();
				}
			}}
			open={open}
		>
			<SheetTrigger render={trigger ?? <Button>Add Order</Button>} />
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0"
				side="right"
			>
				<SheetHeader>
					<SheetTitle>Add Order</SheetTitle>
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
					<SheetPanel className="flex flex-col gap-4">
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
											placeholder="Order name"
											value={field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{orderFormFieldError(field.state.meta.errors)}
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
												{orderFormFieldError(field.state.meta.errors)}
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
						<div className="grid grid-cols-2 gap-4">
							<form.Field name="quantity">
								{(field) => {
									const invalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={invalid}>
											<FieldLabel htmlFor={field.name}>Quantity</FieldLabel>
											<Input
												aria-invalid={invalid}
												id={field.name}
												min="0"
												name={field.name}
												nativeInput
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="0"
												step="any"
												type="number"
												value={field.state.value}
											/>
											{invalid ? (
												<FieldError>
													{orderFormFieldError(field.state.meta.errors)}
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
											<Combobox<string>
												disabled={units === undefined}
												items={unitItems}
												itemToStringLabel={(item) =>
													unitLabelByAbbr.get(item) ?? item
												}
												onValueChange={(next) => field.handleChange(next ?? '')}
												value={field.state.value || null}
											>
												<ComboboxInput
													aria-invalid={invalid}
													id={field.name}
													onBlur={field.handleBlur}
													placeholder="Select a unit"
												/>
												<ComboboxPopup>
													<ComboboxEmpty>No unit found.</ComboboxEmpty>
													<ComboboxList>
														{(item: string) => (
															<ComboboxItem key={item} value={item}>
																{unitLabelByAbbr.get(item) ?? item}
															</ComboboxItem>
														)}
													</ComboboxList>
												</ComboboxPopup>
											</Combobox>
											{invalid ? (
												<FieldError>
													{orderFormFieldError(field.state.meta.errors)}
												</FieldError>
											) : null}
										</Field>
									);
								}}
							</form.Field>
						</div>
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
						<form.Field name="status">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Status</FieldLabel>
									<select
										className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) =>
											field.handleChange(e.target.value as never)
										}
										value={field.state.value}
									>
										{ORDER_STATUSES.map((s) => (
											<option key={s} value={s}>
												{s}
											</option>
										))}
									</select>
								</Field>
							)}
						</form.Field>
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
						Add Order
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
