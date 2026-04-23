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
import { useMutation } from 'convex/react';
import { useRef, useState } from 'react';
import {
	defaultInclusionCategoryCodeFromName,
	emptyInclusionCategoryFormValues,
	inclusionCategoryFieldError,
	inclusionCategoryFormSchema,
} from '@/components/inclusions/inclusion-category-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';

const FORM_ID = 'add-inclusion-category-form';

export default function AddInclusionCategory() {
	const [open, setOpen] = useState(false);
	const codeManuallyEditedRef = useRef(false);
	const addCategory = useMutation(api.inclusionCategories.add.add);

	const form = useForm({
		defaultValues: emptyInclusionCategoryFormValues,
		validators: {
			onChange: inclusionCategoryFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = inclusionCategoryFormSchema.parse(value);
				await addCategory({
					name: parsed.name,
					code: parsed.code.toUpperCase(),
				});
				toastManager.add({
					title: 'Category added',
					type: 'success',
				});
				form.reset();
				codeManuallyEditedRef.current = false;
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not add category. Please try again in a moment.'
					),
					title: 'Could not add category',
					type: 'error',
				});
				form.reset();
				codeManuallyEditedRef.current = false;
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
					codeManuallyEditedRef.current = false;
				}
			}}
			open={open}
		>
			<DialogTrigger render={<Button>Add Category</Button>} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Category</DialogTitle>
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
											onChange={(e) => {
												const next = e.target.value;
												field.handleChange(next);
												if (!codeManuallyEditedRef.current) {
													form.setFieldValue(
														'code',
														defaultInclusionCategoryCodeFromName(next)
													);
												}
											}}
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
						<form.Field name="code">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Code</FieldLabel>
										<Input
											aria-invalid={invalid}
											autoCapitalize="characters"
											id={field.name}
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) => {
												codeManuallyEditedRef.current = true;
												field.handleChange(e.target.value);
											}}
											placeholder="e.g. KIT"
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
						Add Category
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
