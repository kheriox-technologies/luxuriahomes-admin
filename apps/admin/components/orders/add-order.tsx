'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
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
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { type ReactElement, useState } from 'react';
import {
	emptyOrderFormValues,
	orderFormFieldError,
	orderFormSchema,
} from '@/components/orders/order-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';

const FORM_ID = 'add-order-form';

export default function AddOrder({ trigger }: { trigger?: ReactElement } = {}) {
	const [open, setOpen] = useState(false);
	const addOrder = useMutation(api.orders.add.add);

	const form = useForm({
		defaultValues: emptyOrderFormValues,
		validators: {
			onChange: orderFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = orderFormSchema.parse(value);
				await addOrder({
					name: parsed.name,
					description: parsed.description || undefined,
					duration: parsed.duration,
				});
				toastManager.add({
					title: 'Order added',
					type: 'success',
				});
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
				form.reset();
				setOpen(false);
			}
		},
	});

	return (
		<Dialog
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (nextOpen) {
					form.reset(emptyOrderFormValues, { keepDefaultValues: true });
				} else {
					form.reset();
				}
			}}
			open={open}
		>
			<DialogTrigger render={trigger ?? <Button>Add Order</Button>} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Order</DialogTitle>
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
										<span className="text-muted-foreground">(optional)</span>
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
						<form.Field name="duration">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>
											Duration (Days)
										</FieldLabel>
										<Input
											aria-invalid={invalid}
											id={field.name}
											min={0}
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange(e.target.valueAsNumber)
											}
											placeholder="0"
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
					>
						Add Order
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
