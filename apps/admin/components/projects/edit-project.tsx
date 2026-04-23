'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Card,
	CardFrame,
	CardFrameAction,
	CardFrameHeader,
	CardFrameTitle,
	CardPanel,
} from '@workspace/ui/components/card';
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
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
import { type ReactElement, useCallback, useEffect, useState } from 'react';
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
	editProjectFormSchema,
	emptyClientDraft,
	emptyEditProjectFormValues,
	formatFieldErrors,
	type ProjectStatus,
	ProjectStatusCombobox,
	type ProjectStoredClient,
	projectClientAddressesEqual,
	projectClientFromDraft,
	toConvexUpdatePayload,
} from '@/components/projects/project-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';

const FORM_ID = 'edit-project-form';

function projectDocToEditDefaults(project: Doc<'projects'>) {
	return {
		status: project.status,
		name: project.name,
		address: { ...project.address },
	};
}

type ClientFormMode =
	| { kind: 'hidden' }
	| { kind: 'new' }
	| { kind: 'edit'; index: number };

function cloneClient(client: ProjectStoredClient): ProjectStoredClient {
	return {
		...client,
		...(client.address ? { address: { ...client.address } } : {}),
	};
}

function cloneClientsFromProject(
	project: Doc<'projects'>
): ProjectStoredClient[] {
	return project.clients.map(cloneClient);
}

export default function EditProjectForm({
	projectId,
	trigger,
}: {
	projectId: Id<'projects'>;
	trigger?: ReactElement;
}) {
	const project = useQuery(api.projects.get.get, { projectId });
	const [open, setOpen] = useState(false);
	const [clients, setClients] = useState<ProjectStoredClient[]>([]);
	const [draft, setDraft] = useState(emptyClientDraft);
	const [sameAsFirstClient, setSameAsFirstClient] = useState(true);
	const [clientFormMode, setClientFormMode] = useState<ClientFormMode>({
		kind: 'hidden',
	});

	const updateProject = useMutation(api.projects.update.update);

	const showSameAsFirstCheckbox =
		clientFormMode.kind !== 'hidden' &&
		clients.length >= 1 &&
		(clientFormMode.kind === 'new' ||
			(clientFormMode.kind === 'edit' && clientFormMode.index !== 0));

	const showAddressInputs =
		clientFormMode.kind === 'hidden'
			? false
			: clients.length === 0 ||
				(clientFormMode.kind === 'edit' && clientFormMode.index === 0) ||
				!sameAsFirstClient;

	const form = useForm({
		defaultValues: emptyEditProjectFormValues,
		validators: {
			onChange: editProjectFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			const parsed = editProjectFormSchema.parse(value);
			if (clients.length < 1) {
				toastManager.add({
					description: 'A project must have at least one client.',
					title: 'Clients required',
					type: 'error',
				});
				return;
			}
			try {
				await updateProject({
					projectId,
					...toConvexUpdatePayload(parsed, clients),
				});
				toastManager.add({
					title: 'Project updated',
					type: 'success',
				});
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update project. Please try again in a moment.'
					),
					title: 'Could not update project',
					type: 'error',
				});
			}
		},
	});

	const hydrateFromProject = useCallback(
		(nextProject: Doc<'projects'>) => {
			const defaults = projectDocToEditDefaults(nextProject);
			form.reset();
			form.setFieldValue('name', defaults.name);
			form.setFieldValue('status', defaults.status);
			form.setFieldValue('address.street', defaults.address.street);
			form.setFieldValue('address.suburb', defaults.address.suburb);
			form.setFieldValue('address.state', defaults.address.state);
			form.setFieldValue('address.postcode', defaults.address.postcode);
			setClients(cloneClientsFromProject(nextProject));
			setDraft(emptyClientDraft);
			setSameAsFirstClient(true);
			setClientFormMode({ kind: 'hidden' });
		},
		[form]
	);

	useEffect(() => {
		if (!(open && project)) {
			return;
		}
		hydrateFromProject(project);
	}, [hydrateFromProject, open, project]);

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
		if (clientFormMode.kind === 'new') {
			setClients((prev) => [...prev, next]);
		} else if (clientFormMode.kind === 'edit') {
			const index = clientFormMode.index;
			setClients((prev) => {
				const copy = [...prev];
				copy[index] = next;
				return copy;
			});
		}
		setDraft(emptyClientDraft);
		setSameAsFirstClient(true);
		setClientFormMode({ kind: 'hidden' });
	};

	const handleEditClient = (index: number) => {
		const c = clients[index];
		if (!c) {
			return;
		}
		setDraft(clientDraftFromStored(c));
		setClientFormMode({ kind: 'edit', index });
		if (index > 0) {
			setSameAsFirstClient(
				projectClientAddressesEqual(c.address, clients[0]?.address)
			);
		} else {
			setSameAsFirstClient(true);
		}
	};

	const handleDeleteClient = (index: number) => {
		if (clients.length <= 1) {
			toastManager.add({
				description:
					'Remove clients from the project only after adding another.',
				title: 'At least one client required',
				type: 'error',
			});
			return;
		}
		setClients((prev) => prev.filter((_, i) => i !== index));
		if (clientFormMode.kind === 'edit' && clientFormMode.index === index) {
			setDraft(emptyClientDraft);
			setClientFormMode({ kind: 'hidden' });
			setSameAsFirstClient(true);
		}
	};

	const startAddClient = () => {
		setDraft(emptyClientDraft);
		setSameAsFirstClient(true);
		setClientFormMode({ kind: 'new' });
	};

	const clientFormVisible = clientFormMode.kind !== 'hidden';

	return (
		<Sheet
			onOpenChange={(next) => {
				setOpen(next);
				if (next) {
					if (project) {
						hydrateFromProject(project);
					}
				} else {
					form.reset(emptyEditProjectFormValues);
					setClients([]);
					setDraft(emptyClientDraft);
					setClientFormMode({ kind: 'hidden' });
					setSameAsFirstClient(true);
				}
			}}
			open={open}
		>
			<SheetTrigger
				render={trigger ?? <Button variant="outline">Edit project</Button>}
			/>
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
						<CardFrame>
							<CardFrameHeader className="grid-rows-1 items-center">
								<CardFrameTitle className="min-w-0 truncate leading-none">
									Project details
								</CardFrameTitle>
							</CardFrameHeader>
							<Card>
								<CardPanel className="space-y-4">
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
													field.state.meta.isTouched &&
													!field.state.meta.isValid;
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
													field.state.meta.isTouched &&
													!field.state.meta.isValid;
												return (
													<Field data-invalid={invalid}>
														<FieldLabel htmlFor={field.name}>
															Postcode
														</FieldLabel>
														<Input
															aria-invalid={invalid}
															id={field.name}
															inputMode="numeric"
															name={field.name}
															nativeInput
															onBlur={field.handleBlur}
															onChange={(e) =>
																field.handleChange(e.target.value)
															}
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
								</CardPanel>
							</Card>
						</CardFrame>

						<CardFrame>
							<CardFrameHeader className="grid-rows-1 items-center">
								<CardFrameTitle className="min-w-0 truncate leading-none">
									Client details
								</CardFrameTitle>
								<CardFrameAction className="row-span-1 row-start-1 self-center">
									{clientFormMode.kind === 'hidden' ? (
										<Button
											onClick={startAddClient}
											type="button"
											variant="outline"
										>
											Add client
										</Button>
									) : null}
								</CardFrameAction>
							</CardFrameHeader>

							<Card>
								<CardPanel className="space-y-4">
									{clientFormVisible ? (
										<div className="space-y-4">
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
											<div className="flex justify-end gap-2">
												<Button
													onClick={() => {
														setDraft(emptyClientDraft);
														setSameAsFirstClient(true);
														setClientFormMode({ kind: 'hidden' });
													}}
													type="button"
													variant="ghost"
												>
													Cancel
												</Button>
												<Button
													onClick={handleAddOrSaveClient}
													type="button"
													variant="outline"
												>
													{clientFormMode.kind === 'new'
														? 'Add Client'
														: 'Save Client'}
												</Button>
											</div>
										</div>
									) : null}

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
								</CardPanel>
							</Card>
						</CardFrame>
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
