'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
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
import { useMutation } from 'convex/react';
import { type ReactElement, useState } from 'react';
import {
	emptyInclusionCategoryFormValues,
	inclusionCategoryFieldError,
	inclusionCategoryNameSchema,
} from '@/components/inclusions/inclusion-category-form-shared';

const FORM_ID = 'edit-inclusion-category-form';

type InclusionCategory = Doc<'inclusionCategories'>;

export default function EditInclusionCategory({
	categoryId,
	initialName,
	trigger,
}: {
	categoryId: Id<'inclusionCategories'>;
	initialName: InclusionCategory['name'];
	trigger: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const updateCategory = useMutation(api.inclusionCategories.update.update);

	const form = useForm({
		defaultValues: emptyInclusionCategoryFormValues,
		validators: {
			onChange: inclusionCategoryNameSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = inclusionCategoryNameSchema.parse(value);
				await updateCategory({ categoryId, name: parsed.name });
				toastManager.add({
					title: 'Category updated',
					type: 'success',
				});
				setOpen(false);
			} catch (error) {
				const message =
					error instanceof Error ? error.message : 'Could not update category';
				toastManager.add({
					description: message,
					title: 'Could not update category',
					type: 'error',
				});
			}
		},
	});

	return (
		<Dialog
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (nextOpen) {
					form.reset({ name: initialName });
					return;
				}
				form.reset();
			}}
			open={open}
		>
			<DialogTrigger render={trigger} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Category</DialogTitle>
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
					<DialogPanel>
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
											placeholder="Category name"
											value={field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{inclusionCategoryFieldError(field.state.meta.errors)}
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
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
