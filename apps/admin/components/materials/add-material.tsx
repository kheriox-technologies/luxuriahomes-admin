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
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { type ReactElement, useState } from 'react';
import UnitCombobox from '@/components/inclusions/unit-combobox';
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
	const addMaterial = useMutation(api.materials.add.add);

	const form = useForm({
		defaultValues: emptyMaterialFormValues,
		validators: {
			onChange: materialFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = materialFormSchema.parse(value);
				await addMaterial({
					name: parsed.name,
					description: parsed.description?.trim() || undefined,
					unit: parsed.unit as never,
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
			<DialogTrigger render={trigger ?? <Button>Add Material</Button>} />
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
						Add Material
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
