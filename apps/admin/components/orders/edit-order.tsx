'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
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
} from '@workspace/ui/components/sheet';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import VendorCombobox from '@/components/inclusions/vendor-combobox';
import { ProjectStartDatePicker } from '@/components/projects/project-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyOrderItem,
	ORDER_STATUSES,
	type OrderStatus,
	orderFormFieldError,
	orderFormSchema,
} from './order-form-shared';

const FORM_ID = 'edit-order-form';

export default function EditOrder({
	order,
	open,
	onOpenChange,
}: {
	order: Doc<'projectOrders'>;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const updateOrder = useMutation(api.projectOrders.update.update);
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
		defaultValues: {
			vendor: order.vendor,
			newVendorName: '',
			orderBy: order.orderBy ? new Date(order.orderBy) : undefined,
			deliveryDurationDays: order.deliveryDurationDays,
			items: order.items.map((item) => ({
				name: item.name,
				description: item.description ?? '',
				quantity: String(item.quantity),
				unit: item.unit,
				sku: item.sku ?? '',
				link: item.link ?? '',
			})),
			status: order.status as OrderStatus,
		},
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
				await updateOrder({
					orderId: order._id as Id<'projectOrders'>,
					vendor: resolvedVendor,
					orderBy: parsed.orderBy?.getTime(),
					deliveryDurationDays: parsed.deliveryDurationDays,
					items: parsed.items.map((item) => ({
						name: item.name,
						description: item.description?.trim() || undefined,
						quantity: Number(item.quantity),
						unit: item.unit,
						sku: item.sku?.trim() || undefined,
						link: item.link?.trim() || undefined,
					})),
					status: parsed.status,
				});
				toastManager.add({ title: 'Order updated', type: 'success' });
				onOpenChange(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update order. Please try again in a moment.'
					),
					title: 'Could not update order',
					type: 'error',
				});
			}
		},
	});

	useEffect(() => {
		if (open) {
			form.reset({
				vendor: order.vendor,
				newVendorName: '',
				orderBy: order.orderBy ? new Date(order.orderBy) : undefined,
				deliveryDurationDays: order.deliveryDurationDays,
				items: order.items.map((item) => ({
					name: item.name,
					description: item.description ?? '',
					quantity: String(item.quantity),
					unit: item.unit,
					sku: item.sku ?? '',
					link: item.link ?? '',
				})),
				status: order.status as OrderStatus,
			});
		}
	}, [open, order, form]);

	return (
		<Sheet
			onOpenChange={(next) => {
				onOpenChange(next);
				if (!next) {
					form.reset();
				}
			}}
			open={open}
		>
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0"
				side="right"
			>
				<SheetHeader>
					<SheetTitle>Edit Order</SheetTitle>
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
						<form.Field name="orderBy">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>
										Order By{' '}
										<span className="text-muted-foreground text-xs">
											(optional)
										</span>
									</FieldLabel>
									<ProjectStartDatePicker
										onBlur={field.handleBlur}
										onChange={(date) => field.handleChange(date)}
										value={field.state.value}
									/>
								</Field>
							)}
						</form.Field>
						<form.Field name="deliveryDurationDays">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>
										Delivery Duration (Days){' '}
										<span className="text-muted-foreground text-xs">
											(optional)
										</span>
									</FieldLabel>
									<Input
										id={field.name}
										min="1"
										name={field.name}
										nativeInput
										onBlur={field.handleBlur}
										onChange={(e) => {
											const raw = e.target.value;
											field.handleChange(
												raw === '' ? undefined : Math.floor(Number(raw))
											);
										}}
										placeholder="e.g. 14"
										type="number"
										value={field.state.value ?? ''}
									/>
								</Field>
							)}
						</form.Field>
						<div className="flex flex-col gap-3">
							<span className="font-medium text-sm">Items</span>
							<form.Field mode="array" name="items">
								{(itemsField) => (
									<div className="flex flex-col gap-4">
										{itemsField.state.value.map((_, index) => (
											<div
												className="relative flex flex-col gap-3 rounded-md border p-3"
												// biome-ignore lint/suspicious/noArrayIndexKey: form array items have no stable ID
												key={index}
											>
												{itemsField.state.value.length > 1 ? (
													<button
														aria-label="Remove item"
														className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
														onClick={() => itemsField.removeValue(index)}
														type="button"
													>
														<Trash2 className="size-4" />
													</button>
												) : null}
												<form.Field name={`items[${index}].name`}>
													{(field) => {
														const invalid =
															field.state.meta.isTouched &&
															!field.state.meta.isValid;
														return (
															<Field data-invalid={invalid}>
																<FieldLabel htmlFor={field.name}>
																	Name
																</FieldLabel>
																<Input
																	aria-invalid={invalid}
																	id={field.name}
																	name={field.name}
																	nativeInput
																	onBlur={field.handleBlur}
																	onChange={(e) =>
																		field.handleChange(e.target.value)
																	}
																	placeholder="Item name"
																	value={field.state.value}
																/>
																{invalid ? (
																	<FieldError>
																		{orderFormFieldError(
																			field.state.meta.errors
																		)}
																	</FieldError>
																) : null}
															</Field>
														);
													}}
												</form.Field>
												<form.Field name={`items[${index}].description`}>
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
																onChange={(e) =>
																	field.handleChange(e.target.value)
																}
																placeholder="Short description"
																value={field.state.value ?? ''}
															/>
														</Field>
													)}
												</form.Field>
												<div className="grid grid-cols-2 gap-3">
													<form.Field name={`items[${index}].quantity`}>
														{(field) => {
															const invalid =
																field.state.meta.isTouched &&
																!field.state.meta.isValid;
															return (
																<Field data-invalid={invalid}>
																	<FieldLabel htmlFor={field.name}>
																		Quantity
																	</FieldLabel>
																	<Input
																		aria-invalid={invalid}
																		id={field.name}
																		min="0"
																		name={field.name}
																		nativeInput
																		onBlur={field.handleBlur}
																		onChange={(e) =>
																			field.handleChange(e.target.value)
																		}
																		placeholder="0"
																		step="any"
																		type="number"
																		value={field.state.value}
																	/>
																	{invalid ? (
																		<FieldError>
																			{orderFormFieldError(
																				field.state.meta.errors
																			)}
																		</FieldError>
																	) : null}
																</Field>
															);
														}}
													</form.Field>
													<form.Field name={`items[${index}].unit`}>
														{(field) => {
															const invalid =
																field.state.meta.isTouched &&
																!field.state.meta.isValid;
															return (
																<Field data-invalid={invalid}>
																	<FieldLabel htmlFor={field.name}>
																		Unit
																	</FieldLabel>
																	<Combobox<string>
																		disabled={units === undefined}
																		items={unitItems}
																		itemToStringLabel={(item) =>
																			unitLabelByAbbr.get(item) ?? item
																		}
																		onValueChange={(next) =>
																			field.handleChange(next ?? '')
																		}
																		value={field.state.value || null}
																	>
																		<ComboboxInput
																			aria-invalid={invalid}
																			id={field.name}
																			onBlur={field.handleBlur}
																			placeholder="Select a unit"
																		/>
																		<ComboboxPopup>
																			<ComboboxEmpty>
																				No unit found.
																			</ComboboxEmpty>
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
																			{orderFormFieldError(
																				field.state.meta.errors
																			)}
																		</FieldError>
																	) : null}
																</Field>
															);
														}}
													</form.Field>
												</div>
												<form.Field name={`items[${index}].sku`}>
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
																onChange={(e) =>
																	field.handleChange(e.target.value)
																}
																placeholder="e.g. ABC-123"
																value={field.state.value ?? ''}
															/>
														</Field>
													)}
												</form.Field>
												<form.Field name={`items[${index}].link`}>
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
																onChange={(e) =>
																	field.handleChange(e.target.value)
																}
																placeholder="https://"
																type="url"
																value={field.state.value ?? ''}
															/>
														</Field>
													)}
												</form.Field>
											</div>
										))}
										<Button
											onClick={() =>
												itemsField.pushValue({ ...emptyOrderItem })
											}
											size="sm"
											type="button"
											variant="outline"
										>
											<PlusCircle className="size-4" />
											Add Item
										</Button>
									</div>
								)}
							</form.Field>
						</div>
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
						Save Changes
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
