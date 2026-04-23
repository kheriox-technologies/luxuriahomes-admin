'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { Separator } from '@workspace/ui/components/separator';
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
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import {
	type AustralianState,
	AustralianStateCombobox,
	editProjectFormSchema,
	emptyEditProjectFormValues,
	formatFieldErrors,
	type ProjectStatus,
	ProjectStatusCombobox,
	toConvexUpdatePayload,
} from '@/components/forms/project-form-shared';

const FORM_ID = 'edit-project-form';

function projectDocToEditDefaults(project: Doc<'projects'>) {
	return {
		status: project.status,
		name: project.name,
		address: { ...project.address },
		client: {
			firstName: project.client.firstName,
			lastName: project.client.lastName,
			email: project.client.email,
			phone: project.client.phone,
			company: project.client.company ?? '',
			address: {
				street: project.client.address?.street ?? '',
				suburb: project.client.address?.suburb ?? '',
				state: project.client.address?.state ?? '',
				postcode: project.client.address?.postcode ?? '',
			},
		},
	};
}

export default function EditProjectForm({
	projectId,
}: {
	projectId: Id<'projects'>;
}) {
	const project = useQuery(api.projects.get.get, { projectId });
	const [open, setOpen] = useState(false);
	const updateProject = useMutation(api.projects.update.update);

	const form = useForm({
		defaultValues: emptyEditProjectFormValues,
		validators: {
			onChange: editProjectFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			const parsed = editProjectFormSchema.parse(value);
			try {
				await updateProject({
					projectId,
					...toConvexUpdatePayload(parsed),
				});
				toastManager.add({
					title: 'Project updated',
					type: 'success',
				});
				setOpen(false);
			} catch (e) {
				const message =
					e instanceof Error ? e.message : 'Could not update project';
				toastManager.add({
					description: message,
					title: 'Could not update project',
					type: 'error',
				});
			}
		},
	});

	useEffect(() => {
		if (!(open && project)) {
			return;
		}
		form.reset(projectDocToEditDefaults(project));
	}, [form, open, project]);

	return (
		<Sheet
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) {
					form.reset(emptyEditProjectFormValues);
				}
			}}
			open={open}
		>
			<SheetTrigger render={<Button variant="outline">Edit project</Button>} />
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0"
				side="right"
			>
				<SheetHeader>
					<SheetTitle>Edit project</SheetTitle>
				</SheetHeader>
				<form
					className="flex min-h-0 min-w-0 flex-1 flex-col"
					id={FORM_ID}
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit().catch(() => {
							/* TanStack Form handles validation errors */
						});
					}}
				>
					<SheetPanel className="flex flex-col gap-6">
						<div className="flex flex-col gap-4">
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
												placeholder="Project name"
												value={field.state.value}
											/>
											{invalid ? (
												<FieldError>
													{formatFieldErrors(field.state.meta.errors)}
												</FieldError>
											) : null}
										</Field>
									);
								}}
							</form.Field>

							<form.Field name="status">
								{(field) => {
									const invalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={invalid}>
											<FieldLabel htmlFor={field.name}>Status</FieldLabel>
											<ProjectStatusCombobox
												id={field.name}
												invalid={invalid}
												onBlur={field.handleBlur}
												onChange={(next) =>
													field.handleChange(next as ProjectStatus)
												}
												placeholder="Select status"
												value={field.state.value}
											/>
											{invalid ? (
												<FieldError>
													{formatFieldErrors(field.state.meta.errors)}
												</FieldError>
											) : null}
										</Field>
									);
								}}
							</form.Field>

							<p className="font-medium text-muted-foreground text-sm">
								Address
							</p>
							<form.Field name="address.street">
								{(field) => {
									const invalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={invalid}>
											<FieldLabel htmlFor={field.name}>Street</FieldLabel>
											<Input
												aria-invalid={invalid}
												id={field.name}
												name={field.name}
												nativeInput
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Street"
												value={field.state.value}
											/>
											{invalid ? (
												<FieldError>
													{formatFieldErrors(field.state.meta.errors)}
												</FieldError>
											) : null}
										</Field>
									);
								}}
							</form.Field>
							<form.Field name="address.suburb">
								{(field) => {
									const invalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={invalid}>
											<FieldLabel htmlFor={field.name}>Suburb</FieldLabel>
											<Input
												aria-invalid={invalid}
												id={field.name}
												name={field.name}
												nativeInput
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Suburb"
												value={field.state.value}
											/>
											{invalid ? (
												<FieldError>
													{formatFieldErrors(field.state.meta.errors)}
												</FieldError>
											) : null}
										</Field>
									);
								}}
							</form.Field>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<form.Field name="address.state">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>State</FieldLabel>
												<AustralianStateCombobox
													id={field.name}
													invalid={invalid}
													onBlur={field.handleBlur}
													onChange={(next) =>
														field.handleChange(next as AustralianState)
													}
													placeholder="Select state"
													value={field.state.value}
												/>
												{invalid ? (
													<FieldError>
														{formatFieldErrors(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
								<form.Field name="address.postcode">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Postcode</FieldLabel>
												<Input
													aria-invalid={invalid}
													id={field.name}
													inputMode="numeric"
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="0000"
													value={field.state.value}
												/>
												{invalid ? (
													<FieldError>
														{formatFieldErrors(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
							</div>
						</div>

						<Separator />

						<div className="flex flex-col gap-4">
							<p className="font-medium text-muted-foreground text-sm">
								Client
							</p>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<form.Field name="client.firstName">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>First name</FieldLabel>
												<Input
													aria-invalid={invalid}
													autoComplete="given-name"
													id={field.name}
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="First name"
													value={field.state.value}
												/>
												{invalid ? (
													<FieldError>
														{formatFieldErrors(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
								<form.Field name="client.lastName">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Last name</FieldLabel>
												<Input
													aria-invalid={invalid}
													autoComplete="family-name"
													id={field.name}
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Last name"
													value={field.state.value}
												/>
												{invalid ? (
													<FieldError>
														{formatFieldErrors(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
							</div>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<form.Field name="client.email">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Email</FieldLabel>
												<Input
													aria-invalid={invalid}
													autoComplete="email"
													id={field.name}
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Email"
													type="email"
													value={field.state.value}
												/>
												{invalid ? (
													<FieldError>
														{formatFieldErrors(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
								<form.Field name="client.phone">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Phone</FieldLabel>
												<Input
													aria-invalid={invalid}
													autoComplete="tel"
													id={field.name}
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Phone"
													type="tel"
													value={field.state.value}
												/>
												{invalid ? (
													<FieldError>
														{formatFieldErrors(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
							</div>
							<form.Field name="client.company">
								{(field) => {
									const invalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={invalid}>
											<FieldLabel htmlFor={field.name}>Company</FieldLabel>
											<Input
												aria-invalid={invalid}
												id={field.name}
												name={field.name}
												nativeInput
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Company (optional)"
												value={field.state.value}
											/>
											{invalid ? (
												<FieldError>
													{formatFieldErrors(field.state.meta.errors)}
												</FieldError>
											) : null}
										</Field>
									);
								}}
							</form.Field>

							<p className="font-medium text-muted-foreground text-sm">
								Client address
							</p>
							<form.Field name="client.address.street">
								{(field) => {
									const invalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={invalid}>
											<FieldLabel htmlFor={field.name}>Street</FieldLabel>
											<Input
												aria-invalid={invalid}
												id={field.name}
												name={field.name}
												nativeInput
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Street (optional)"
												value={field.state.value}
											/>
											{invalid ? (
												<FieldError>
													{formatFieldErrors(field.state.meta.errors)}
												</FieldError>
											) : null}
										</Field>
									);
								}}
							</form.Field>
							<form.Field name="client.address.suburb">
								{(field) => {
									const invalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={invalid}>
											<FieldLabel htmlFor={field.name}>Suburb</FieldLabel>
											<Input
												aria-invalid={invalid}
												id={field.name}
												name={field.name}
												nativeInput
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Suburb (optional)"
												value={field.state.value}
											/>
											{invalid ? (
												<FieldError>
													{formatFieldErrors(field.state.meta.errors)}
												</FieldError>
											) : null}
										</Field>
									);
								}}
							</form.Field>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<form.Field name="client.address.state">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>State</FieldLabel>
												<AustralianStateCombobox
													id={field.name}
													invalid={invalid}
													onBlur={field.handleBlur}
													onChange={(next) =>
														field.handleChange(next as AustralianState)
													}
													placeholder="State (optional)"
													value={field.state.value}
												/>
												{invalid ? (
													<FieldError>
														{formatFieldErrors(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
								<form.Field name="client.address.postcode">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Postcode</FieldLabel>
												<Input
													aria-invalid={invalid}
													id={field.name}
													inputMode="numeric"
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Postcode (optional)"
													value={field.state.value}
												/>
												{invalid ? (
													<FieldError>
														{formatFieldErrors(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
							</div>
						</div>
					</SheetPanel>
				</form>
				<SheetFooter>
					<SheetClose render={<Button type="button" variant="outline" />}>
						Cancel
					</SheetClose>
					<form.Subscribe
						selector={(state) => ({
							canSave:
								state.isValid && !state.isValidating && !state.isSubmitting,
						})}
					>
						{({ canSave }) => (
							<Button
								disabled={!canSave}
								form={FORM_ID}
								type="submit"
								variant="default"
							>
								Save
							</Button>
						)}
					</form.Subscribe>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
