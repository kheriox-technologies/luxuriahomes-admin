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
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { type ReactElement, useEffect, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyLocationFormValues,
	locationFormFieldError,
	locationFormSchema,
} from './location-form-shared';

const FORM_ID = 'edit-location-form';

export default function EditLocation({
	locationId,
	initialName,
	initialDescription,
	trigger,
}: {
	locationId: Id<'locations'>;
	initialName: string;
	initialDescription?: string;
	trigger: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const updateLocation = useMutation(api.locations.update.update);

	const form = useForm({
		defaultValues: emptyLocationFormValues,
		validators: {
			onChange: locationFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = locationFormSchema.parse(value);
				await updateLocation({
					locationId,
					name: parsed.name,
					description: parsed.description?.trim() || undefined,
				});
				toastManager.add({
					title: 'Location updated',
					type: 'success',
				});
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update location. Please try again in a moment.'
					),
					title: 'Could not update location',
					type: 'error',
				});
				form.reset();
				setOpen(false);
			}
		},
	});

	useEffect(() => {
		if (open) {
			form.reset({
				name: initialName,
				description: initialDescription ?? '',
			});
			return;
		}
		form.reset();
	}, [form, initialName, initialDescription, open]);

	return (
		<Dialog
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
			}}
			open={open}
		>
			<DialogTrigger render={trigger} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Location</DialogTitle>
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
											id={field.name}
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Location name"
											value={field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{locationFormFieldError(field.state.meta.errors)}
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
										placeholder="Brief description of this location"
										rows={3}
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
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
