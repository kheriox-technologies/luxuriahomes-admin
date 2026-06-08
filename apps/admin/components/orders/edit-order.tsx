'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxGroupLabel,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
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
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Info, Plus, X } from 'lucide-react';
import { type ReactElement, useEffect, useMemo, useState } from 'react';
import {
	emptyOrderFormValues,
	orderFormFieldError,
	orderFormSchema,
} from '@/components/orders/order-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';

const FORM_ID = 'edit-order-form';

export default function EditOrder({
	orderId,
	initialName,
	initialDescription,
	initialMaterials,
	trigger,
}: {
	orderId: Id<'orders'>;
	initialName: string;
	initialDescription?: string;
	initialMaterials?: Array<{ name: string; units: string }>;
	trigger: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const [newMaterialName, setNewMaterialName] = useState('');
	const [newMaterialUnits, setNewMaterialUnits] = useState('');
	const updateOrder = useMutation(api.orders.update.update);
	const units = useQuery(api.units.list.list, {});
	const groupedUnits = useMemo(() => {
		if (!units) {
			return {} as Record<string, NonNullable<typeof units>>;
		}
		return units.reduce<Record<string, NonNullable<typeof units>>>(
			(acc, unit) => {
				if (!acc[unit.category]) {
					acc[unit.category] = [];
				}
				acc[unit.category].push(unit);
				return acc;
			},
			{}
		);
	}, [units]);

	const form = useForm({
		defaultValues: emptyOrderFormValues,
		validators: {
			onChange: orderFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = orderFormSchema.parse(value);
				await updateOrder({
					orderId,
					name: parsed.name,
					description: parsed.description || undefined,
					materials: parsed.materials.length > 0 ? parsed.materials : undefined,
				});
				toastManager.add({
					title: 'Order updated',
					type: 'success',
				});
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update order. Please try again in a moment.'
					),
					title: 'Could not update order',
					type: 'error',
				});
				form.reset();
				setOpen(false);
			}
		},
	});

	useEffect(() => {
		if (open) {
			form.reset(
				{
					name: initialName,
					description: initialDescription ?? '',
					materials: initialMaterials ?? [],
				},
				{ keepDefaultValues: true }
			);
			setNewMaterialName('');
			setNewMaterialUnits('');
			return;
		}
		form.reset();
	}, [form, initialName, initialDescription, initialMaterials, open]);

	function handleAddMaterial() {
		const name = newMaterialName.trim();
		const units = newMaterialUnits.trim();
		if (!(name && units)) {
			return;
		}
		const current = form.getFieldValue('materials') ?? [];
		form.setFieldValue('materials', [...current, { name, units }]);
		setNewMaterialName('');
		setNewMaterialUnits('');
	}

	function handleRemoveMaterial(index: number) {
		const current = form.getFieldValue('materials') ?? [];
		form.setFieldValue(
			'materials',
			current.filter((_, i) => i !== index)
		);
	}

	return (
		<Sheet
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
			}}
			open={open}
		>
			<SheetTrigger render={trigger} />
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
					onSubmit={(event) => {
						event.preventDefault();
						form.handleSubmit().catch(() => {
							/* TanStack Form handles validation */
						});
					}}
				>
					<SheetPanel className="flex flex-col gap-6">
						<Frame>
							<FrameHeader className="flex flex-row items-center py-3">
								<FrameTitle className="min-w-0 truncate leading-none">
									Order details
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
												<span className="text-muted-foreground">
													(optional)
												</span>
											</FieldLabel>
											<Textarea
												id={field.name}
												name={field.name}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Order description"
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
									Add material
								</FrameTitle>
							</FrameHeader>
							<FramePanel>
								<div className="flex w-full flex-col gap-2">
									<Input
										nativeInput
										onChange={(e) => setNewMaterialName(e.target.value)}
										placeholder="Material name"
										value={newMaterialName}
									/>
									<div className="flex w-full gap-2">
										<div className="flex-1">
											<Combobox
												onValueChange={(val) => setNewMaterialUnits(val ?? '')}
												value={newMaterialUnits || null}
											>
												<ComboboxInput placeholder="Select units" />
												<ComboboxPopup>
													<ComboboxList>
														<ComboboxEmpty>No units found.</ComboboxEmpty>
														{Object.entries(groupedUnits).map(
															([category, categoryUnits]) => (
																<ComboboxGroup key={category}>
																	<ComboboxGroupLabel>
																		{category}
																	</ComboboxGroupLabel>
																	{categoryUnits.map((unit) => (
																		<ComboboxItem
																			key={unit._id}
																			value={unit.abbr}
																		>
																			{unit.label} ({unit.abbr})
																		</ComboboxItem>
																	))}
																</ComboboxGroup>
															)
														)}
													</ComboboxList>
												</ComboboxPopup>
											</Combobox>
										</div>
										<Button
											aria-label="Add material"
											onClick={handleAddMaterial}
											size="icon"
											type="button"
											variant="outline"
										>
											<Plus />
										</Button>
									</div>
								</div>
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader className="flex flex-row items-center py-3">
								<FrameTitle className="min-w-0 truncate leading-none">
									Materials
								</FrameTitle>
							</FrameHeader>
							<FramePanel className="p-0">
								<form.Field name="materials">
									{(field) => {
										const materials = field.state.value ?? [];
										return materials.length === 0 ? (
											<Alert variant="info">
												<Info />
												<AlertDescription>
													No materials added yet.
												</AlertDescription>
											</Alert>
										) : (
											<div className="flex w-full flex-col">
												{materials.map((material, index) => (
													<div
														className="flex w-full items-center justify-between rounded-lg border px-3 py-2"
														key={`${material.name}-${index}`}
													>
														<span className="font-medium text-sm">
															{material.name}
														</span>
														<div className="flex items-center gap-2">
															<Badge variant="outline">{material.units}</Badge>
															<Button
																aria-label={`Remove ${material.name}`}
																onClick={() => handleRemoveMaterial(index)}
																size="icon"
																type="button"
																variant="destructive-outline"
															>
																<X />
															</Button>
														</div>
													</div>
												))}
											</div>
										);
									}}
								</form.Field>
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
						Save
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
