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
import { type ReactElement, useEffect, useState } from 'react';
import InclusionCategoryCombobox from '@/components/inclusions/inclusion-category-combobox';
import { defaultInclusionCategoryCodeFromName } from '@/components/inclusions/inclusion-category-form-shared';
import {
	emptyInclusionFormValues,
	inclusionFormFieldError,
	inclusionFormSchema,
} from '@/components/inclusions/inclusion-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';

const FORM_ID = 'edit-inclusion-form';

export default function EditInclusion({
	inclusionId,
	initialTitle,
	initialCategoryId,
	trigger,
}: {
	inclusionId: Id<'inclusions'>;
	initialTitle: string;
	initialCategoryId: Id<'inclusionCategories'>;
	trigger: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const categories = useQuery(api.inclusionCategories.list.list, {});
	const updateInclusion = useMutation(api.inclusions.update.update);
	const addCategory = useMutation(api.inclusionCategories.add.add);

	const form = useForm({
		defaultValues: emptyInclusionFormValues,
		validators: {
			onChange: inclusionFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = inclusionFormSchema.parse(value);
				let resolvedCategoryId: Id<'inclusionCategories'>;

				const newName = parsed.newCategoryName?.trim();
				if (newName) {
					const code = defaultInclusionCategoryCodeFromName(newName);
					resolvedCategoryId = await addCategory({ name: newName, code });
				} else {
					resolvedCategoryId = parsed.categoryId as Id<'inclusionCategories'>;
				}

				await updateInclusion({
					categoryId: resolvedCategoryId,
					inclusionId,
					title: parsed.title,
				});
				toastManager.add({
					title: 'Inclusion updated',
					type: 'success',
				});
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update inclusion. Please try again in a moment.'
					),
					title: 'Could not update inclusion',
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
				categoryId: initialCategoryId,
				title: initialTitle,
				newCategoryName: '',
			});
			return;
		}

		form.reset();
	}, [form, initialCategoryId, initialTitle, open]);

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
					<DialogTitle>Edit Inclusion</DialogTitle>
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
						<form.Field name="newCategoryName">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>
										Or create new category
									</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										nativeInput
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="New category name"
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
