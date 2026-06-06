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
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyVendorFormValues,
	vendorFormFieldError,
	vendorFormSchema,
} from './vendor-form-shared';

const FORM_ID = 'add-vendor-form';

export default function AddVendor({
	trigger,
}: {
	trigger?: ReactElement;
} = {}) {
	const [open, setOpen] = useState(false);
	const addVendor = useMutation(api.vendors.add.add);

	const form = useForm({
		defaultValues: emptyVendorFormValues,
		validators: {
			onChange: vendorFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = vendorFormSchema.parse(value);
				await addVendor({
					name: parsed.name,
					description: parsed.description?.trim() || undefined,
					link: parsed.link?.trim() || undefined,
				});
				toastManager.add({
					title: 'Vendor added',
					type: 'success',
				});
				form.reset();
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not add vendor. Please try again in a moment.'
					),
					title: 'Could not add vendor',
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
			<DialogTrigger render={trigger ?? <Button>Add Vendor</Button>} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Vendor</DialogTitle>
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
											placeholder="Vendor name"
											value={field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{vendorFormFieldError(field.state.meta.errors)}
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
										Description
										<span className="ml-1 text-muted-foreground text-xs">
											(optional)
										</span>
									</FieldLabel>
									<Textarea
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Brief description of this vendor"
										rows={3}
										value={field.state.value ?? ''}
									/>
								</Field>
							)}
						</form.Field>
						<form.Field name="link">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>
										Link
										<span className="ml-1 text-muted-foreground text-xs">
											(optional)
										</span>
									</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										nativeInput
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="https://example.com"
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
					>
						Add Vendor
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
