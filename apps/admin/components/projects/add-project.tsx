'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
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
import { useMutation } from 'convex/react';
import { useState } from 'react';
import {
	ClientAddressTitleRow,
	clientDraftErrorMessage,
	ProjectClientCard,
	ProjectClientDraftFields,
} from '@/components/projects/project-client-ui';
import {
	type AustralianState,
	AustralianStateCombobox,
	clientDraftFromStored,
	clientDraftSchema,
	cloneProjectClientAddress,
	emptyClientDraft,
	emptyProjectCoreFormValues,
	formatFieldErrors,
	type ProjectStoredClient,
	projectClientAddressesEqual,
	projectClientFromDraft,
	projectCoreFormSchema,
	toConvexCreatePayload,
} from '@/components/projects/project-form-shared';

const FORM_ID = 'add-project-form';

export default function AddProjectForm() {
	const [open, setOpen] = useState(false);
	const [clients, setClients] = useState<ProjectStoredClient[]>([]);
	const [draft, setDraft] = useState(emptyClientDraft);
	const [sameAsFirstClient, setSameAsFirstClient] = useState(true);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	const addProject = useMutation(api.projects.add.add);

	const showSameAsFirstCheckbox = clients.length >= 1 && editingIndex !== 0;
	const showAddressInputs =
		clients.length === 0 || editingIndex === 0 || !sameAsFirstClient;

	const form = useForm({
		defaultValues: emptyProjectCoreFormValues,
		validators: {
			onChange: projectCoreFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			const parsed = projectCoreFormSchema.parse(value);
			if (clients.length < 1) {
				toastManager.add({
					description: 'Add at least one client before saving.',
					title: 'Clients required',
					type: 'error',
				});
				return;
			}
			try {
				await addProject(toConvexCreatePayload(parsed, clients));
				toastManager.add({
					title: 'Project created',
					type: 'success',
				});
				form.reset();
				setClients([]);
				setDraft(emptyClientDraft);
				setEditingIndex(null);
				setSameAsFirstClient(true);
				setOpen(false);
			} catch (e) {
				const message =
					e instanceof Error ? e.message : 'Could not create project';
				toastManager.add({
					description: message,
					title: 'Could not create project',
					type: 'error',
				});
			}
		},
	});

	const buildClientFromDraft = (): ProjectStoredClient | null => {
		const parsed = clientDraftSchema.safeParse(draft);
		if (!parsed.success) {
			toastManager.add({
				description: clientDraftErrorMessage(parsed.error),
				title: 'Client details invalid',
				type: 'error',
			});
			return null;
		}
		let next = projectClientFromDraft(parsed.data);
		if (showSameAsFirstCheckbox && sameAsFirstClient && clients.length >= 1) {
			const first = clients[0];
			if (first.address) {
				next = {
					...next,
					address: cloneProjectClientAddress(first.address),
				};
			} else {
				const { address: _a, ...rest } = next;
				next = rest;
			}
		}
		return next;
	};

	const handleAddOrSaveClient = () => {
		const next = buildClientFromDraft();
		if (!next) {
			return;
		}
		if (editingIndex === null) {
			setClients((prev) => [...prev, next]);
		} else {
			setClients((prev) => {
				const copy = [...prev];
				copy[editingIndex] = next;
				return copy;
			});
		}
		setDraft(emptyClientDraft);
		setEditingIndex(null);
		setSameAsFirstClient(true);
	};

	const handleEditClient = (index: number) => {
		const c = clients[index];
		if (!c) {
			return;
		}
		setDraft(clientDraftFromStored(c));
		setEditingIndex(index);
		if (index > 0) {
			setSameAsFirstClient(
				projectClientAddressesEqual(c.address, clients[0]?.address)
			);
		} else {
			setSameAsFirstClient(true);
		}
	};

	const handleDeleteClient = (index: number) => {
		setClients((prev) => prev.filter((_, i) => i !== index));
		if (editingIndex === index) {
			setDraft(emptyClientDraft);
			setEditingIndex(null);
			setSameAsFirstClient(true);
		}
	};

	return (
		<Sheet
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) {
					form.reset();
					setClients([]);
					setDraft(emptyClientDraft);
					setEditingIndex(null);
					setSameAsFirstClient(true);
				}
			}}
			open={open}
		>
			<SheetTrigger render={<Button variant="default">Add project</Button>} />
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0"
				side="right"
			>
				<SheetHeader>
					<SheetTitle>Add project</SheetTitle>
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
							<ProjectClientDraftFields
								addressTitleSlot={
									<ClientAddressTitleRow
										onSameAsFirstChange={setSameAsFirstClient}
										sameAsFirstClient={sameAsFirstClient}
										showSameAsFirst={showSameAsFirstCheckbox}
										title="Client address"
									/>
								}
								draft={draft}
								setDraft={setDraft}
								showAddressInputs={showAddressInputs}
							/>
							<div className="flex justify-end">
								<Button
									onClick={handleAddOrSaveClient}
									type="button"
									variant="outline"
								>
									{editingIndex === null ? 'Add Client' : 'Save Client'}
								</Button>
							</div>

							{clients.length > 0 ? (
								<div className="flex flex-col gap-3">
									{clients.map((c, index) => (
										<ProjectClientCard
											client={c}
											key={`${c.email}-${index}`}
											onDelete={() => handleDeleteClient(index)}
											onEdit={() => handleEditClient(index)}
										/>
									))}
								</div>
							) : null}
						</div>
					</SheetPanel>
				</form>
				<SheetFooter>
					<SheetClose render={<Button type="button" variant="outline" />}>
						Cancel
					</SheetClose>
					<Button
						disabled={
							!(
								form.state.isValid &&
								!form.state.isValidating &&
								!form.state.isSubmitting &&
								clients.length >= 1
							)
						}
						form={FORM_ID}
						type="submit"
						variant="default"
					>
						Save
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
