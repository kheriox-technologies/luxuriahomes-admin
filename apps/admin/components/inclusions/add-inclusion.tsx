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
import { type ReactElement, useState } from 'react';
import InclusionCategoryCombobox from '@/components/inclusions/inclusion-category-combobox';
import {
	emptyInclusionFormValues,
	inclusionFormFieldError,
	inclusionFormSchema,
} from '@/components/inclusions/inclusion-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';

const FORM_ID = 'add-inclusion-form';

export default function AddInclusion({
	initialCategoryId,
	trigger,
}: {
	initialCategoryId?: Id<'inclusionCategories'>;
	trigger?: ReactElement;
} = {}) {
	const [open, setOpen] = useState(false);
	const categories = useQuery(api.inclusionCategories.list.list, {});
	const addInclusion = useMutation(api.inclusions.add.add);

	const form = useForm({
		defaultValues: emptyInclusionFormValues,
		validators: {
			onChange: inclusionFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = inclusionFormSchema.parse(value);
				await addInclusion({
					categoryId: parsed.categoryId as Id<'inclusionCategories'>,
					title: parsed.title,
				});
				toastManager.add({
					title: 'Inclusion added',
					type: 'success',
				});
				form.reset();
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not add inclusion. Please try again in a moment.'
					),
					title: 'Could not add inclusion',
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
					form.reset(
						{
							...emptyInclusionFormValues,
							categoryId: initialCategoryId ?? '',
						},
						{ keepDefaultValues: true }
					);
				} else {
					form.reset();
				}
			}}
			open={open}
		>
			<DialogTrigger render={trigger ?? <Button>Add Inclusion</Button>} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Inclusion</DialogTitle>
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
						<form.Field name="title">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Title</FieldLabel>
										<Input
											aria-invalid={invalid}
											autoFocus
											id={field.name}
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Inclusion title"
											value={field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{inclusionFormFieldError(field.state.meta.errors)}
											</FieldError>
										) : null}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name="categoryId">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Category</FieldLabel>
										<InclusionCategoryCombobox
											categories={categories}
											id={field.name}
											invalid={invalid}
											onBlur={field.handleBlur}
											onChange={(next) => field.handleChange(next)}
											placeholder="Select a category"
											value={field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{inclusionFormFieldError(field.state.meta.errors)}
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
						Add Inclusion
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
