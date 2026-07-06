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
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { Check } from 'lucide-react';
import { type ReactElement, useEffect, useState } from 'react';
import {
	editInclusionCategoryFormSchema,
	emptyEditInclusionCategoryFormValues,
	inclusionCategoryFieldError,
	parseAllowanceString,
} from '@/components/inclusions/inclusion-category-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';

const FORM_ID = 'edit-inclusion-category-form';

type InclusionCategory = Doc<'inclusionCategories'>;

export default function EditInclusionCategory({
	categoryId,
	initialName,
	initialCode,
	initialAllowance,
	initialLabourAllowance,
	showCodeField = false,
	trigger,
}: {
	categoryId: Id<'inclusionCategories'>;
	initialName: InclusionCategory['name'];
	initialCode: InclusionCategory['code'];
	initialAllowance?: InclusionCategory['allowance'];
	initialLabourAllowance?: InclusionCategory['labourAllowance'];
	showCodeField?: boolean;
	trigger: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const updateCategory = useMutation(api.inclusionCategories.update.update);

	const form = useForm({
		defaultValues: emptyEditInclusionCategoryFormValues,
		validators: {
			onChange: editInclusionCategoryFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = editInclusionCategoryFormSchema.parse(value);
				await updateCategory({
					categoryId,
					name: parsed.name,
					code: parsed.code.toUpperCase(),
					allowance: parseAllowanceString(parsed.allowance),
					labourAllowance: parseAllowanceString(parsed.labourAllowance),
				});
				toastManager.add({
					title: 'Category updated',
					type: 'success',
				});
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update category. Please try again in a moment.'
					),
					title: 'Could not update category',
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
					code: initialCode,
					allowance:
						initialAllowance === undefined ? '' : String(initialAllowance),
					labourAllowance:
						initialLabourAllowance === undefined
							? ''
							: String(initialLabourAllowance),
				},
				{ keepDefaultValues: true }
			);
			return;
		}

		form.reset();
	}, [
		form,
		initialCode,
		initialName,
		initialAllowance,
		initialLabourAllowance,
		open,
	]);

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
						{showCodeField ? (
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
												onChange={(e) => field.handleChange(e.target.value)}
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
						) : null}
						<form.Field name="allowance">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Allowance</FieldLabel>
										<InputGroup>
											<InputGroupAddon align="inline-start">
												<InputGroupText>$</InputGroupText>
											</InputGroupAddon>
											<InputGroupInput
												aria-invalid={invalid || undefined}
												id={field.name}
												inputMode="decimal"
												nativeInput
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="0.00"
												type="text"
												value={field.state.value}
											/>
											<InputGroupAddon align="inline-end">
												<InputGroupText>AUD</InputGroupText>
											</InputGroupAddon>
										</InputGroup>
										{invalid ? (
											<FieldError>
												{inclusionCategoryFieldError(field.state.meta.errors)}
											</FieldError>
										) : null}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name="labourAllowance">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>
											Labour allowance
										</FieldLabel>
										<InputGroup>
											<InputGroupAddon align="inline-start">
												<InputGroupText>$</InputGroupText>
											</InputGroupAddon>
											<InputGroupInput
												aria-invalid={invalid || undefined}
												id={field.name}
												inputMode="decimal"
												nativeInput
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="0.00"
												type="text"
												value={field.state.value}
											/>
											<InputGroupAddon align="inline-end">
												<InputGroupText>AUD</InputGroupText>
											</InputGroupAddon>
										</InputGroup>
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
						variant="outline"
					>
						<Check aria-hidden />
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
