'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import {
	Frame,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from '@workspace/ui/components/frame';
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
import { Check, Pencil, Plus, X } from 'lucide-react';
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
	ProjectStartDatePicker,
	type ProjectStatus,
	ProjectStatusCombobox,
	type ProjectStoredClient,
	projectClientAddressesEqual,
	projectClientFromDraft,
	toConvexUpdatePayload,
	XeroOptionCombobox,
} from '@/components/projects/project-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';

const FORM_ID = 'edit-project-form';

function projectDocToEditDefaults(project: Doc<'projects'>) {
	return {
		status: project.status,
		name: project.name,
		address: { ...project.address },
		startDate: project.startDate ? new Date(project.startDate) : undefined,
		quotePrice: project.quotePrice,
		expenses: project.expenses,
		received: project.received,
		xeroTrackingOptionId: project.xeroTrackingOptionId,
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
	project: projectProp,
	open: controlledOpen,
	onOpenChange,
}: {
	projectId: Id<'projects'>;
	trigger?: ReactElement;
	project?: Doc<'projects'>;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const queriedProject = useQuery(
		api.projects.get.get,
		projectProp ? 'skip' : { projectId }
	);
	const project = projectProp ?? queriedProject;
	const isControlled = controlledOpen !== undefined;
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
	const open = isControlled ? controlledOpen : uncontrolledOpen;
	const setOpen = (next: boolean) => {
		if (!isControlled) {
			setUncontrolledOpen(next);
		}
		onOpenChange?.(next);
	};
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
			form.setFieldValue('startDate', defaults.startDate as never);
			form.setFieldValue('quotePrice', defaults.quotePrice as never);
			form.setFieldValue('expenses', defaults.expenses as never);
			form.setFieldValue('received', defaults.received as never);
			form.setFieldValue(
				'xeroTrackingOptionId',
				defaults.xeroTrackingOptionId as never
			);
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
			{isControlled ? null : (
				<SheetTrigger
					render={
						trigger ?? (
							<Button variant="outline">
								<Pencil aria-hidden /> Edit project
							</Button>
						)
					}
				/>
			)}
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
						<Frame>
							<FrameHeader className="flex flex-row items-center py-3">
								<FrameTitle className="min-w-0 truncate leading-none">
									Project details
								</FrameTitle>
							</FrameHeader>
							<FramePanel className="space-y-4">
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

								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

									<form.Field name="startDate">
										{(field) => (
											<Field>
												<FieldLabel htmlFor={field.name}>Start Date</FieldLabel>
												<ProjectStartDatePicker
													onBlur={field.handleBlur}
													onChange={(date) => field.handleChange(date as never)}
													value={field.state.value as Date | undefined}
												/>
											</Field>
										)}
									</form.Field>
								</div>

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
														inputMode="decimal"
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
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader className="flex flex-row items-center py-3">
								<FrameTitle className="min-w-0 truncate leading-none">
									Pricing
								</FrameTitle>
							</FrameHeader>
							<FramePanel className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<form.Field name="quotePrice">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>
													Quote price
												</FieldLabel>
												<Input
													aria-invalid={invalid}
													id={field.name}
													inputMode="decimal"
													min={0}
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) =>
														field.handleChange(
															e.target.value === ''
																? undefined
																: Number(e.target.value)
														)
													}
													placeholder="0"
													step="0.01"
													type="number"
													value={field.state.value ?? ''}
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
								<form.Field name="expenses">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Expenses</FieldLabel>
												<Input
													aria-invalid={invalid}
													id={field.name}
													inputMode="decimal"
													min={0}
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) =>
														field.handleChange(
															e.target.value === ''
																? undefined
																: Number(e.target.value)
														)
													}
													placeholder="0"
													step="0.01"
													type="number"
													value={field.state.value ?? ''}
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
								<form.Field name="received">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Received</FieldLabel>
												<Input
													aria-invalid={invalid}
													id={field.name}
													inputMode="decimal"
													min={0}
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) =>
														field.handleChange(
															e.target.value === ''
																? undefined
																: Number(e.target.value)
														)
													}
													placeholder="0"
													step="0.01"
													type="number"
													value={field.state.value ?? ''}
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
								<form.Field name="xeroTrackingOptionId">
									{(field) => (
										<Field>
											<FieldLabel htmlFor={field.name}>
												Xero project (for Spent sync)
											</FieldLabel>
											<XeroOptionCombobox
												id={field.name}
												onBlur={field.handleBlur}
												onChange={(next) => field.handleChange(next)}
												placeholder="Select Xero project"
												value={field.state.value}
											/>
										</Field>
									)}
								</form.Field>
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader className="flex flex-row items-center justify-between gap-3 py-3">
								<FrameTitle className="min-w-0 truncate leading-none">
									Client details
								</FrameTitle>
								{clientFormMode.kind === 'hidden' ? (
									<Button
										onClick={startAddClient}
										type="button"
										variant="outline"
									>
										<Plus aria-hidden /> Add client
									</Button>
								) : null}
							</FrameHeader>

							<FramePanel className="space-y-4">
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
												<X aria-hidden /> Cancel
											</Button>
											<Button
												onClick={handleAddOrSaveClient}
												type="button"
												variant="outline"
											>
												<Plus aria-hidden />
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
							</FramePanel>
						</Frame>
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
						variant="outline"
					>
						<Check aria-hidden /> Save
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
