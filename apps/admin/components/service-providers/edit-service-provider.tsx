'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
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
import { type ReactElement, useEffect, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	ServiceProviderContactCard,
	ServiceProviderContactDraftFields,
} from './service-provider-contact-ui';
import {
	type ContactDraftValues,
	contactDraftErrorMessage,
	emptyContactDraft,
	emptyServiceProviderFormValues,
	formatFieldErrors,
	serviceProviderContactSchema,
	serviceProviderFormSchema,
} from './service-provider-form-shared';

const FORM_ID = 'edit-service-provider-form';

interface StoredContact {
	email: string;
	name: string;
	phone: string;
}

export default function EditServiceProvider({
	serviceProviderId,
	initialCompany,
	initialName,
	initialEmail,
	initialPhone,
	initialTradeIds,
	initialContacts,
	open: openProp,
	onOpenChange: onOpenChangeProp,
	trigger,
}: {
	serviceProviderId: Id<'serviceProviders'>;
	initialCompany: string;
	initialName: string;
	initialEmail: string;
	initialPhone: string;
	initialTradeIds: string[];
	initialContacts: StoredContact[];
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	trigger?: ReactElement;
}) {
	const [openInternal, setOpenInternal] = useState(false);
	const isControlled = openProp !== undefined;
	const open = isControlled ? (openProp ?? false) : openInternal;
	const setOpen = (next: boolean) => {
		if (isControlled) {
			onOpenChangeProp?.(next);
		} else {
			setOpenInternal(next);
		}
	};

	const [selectedTradeIds, setSelectedTradeIds] = useState<string[]>([]);
	const [contacts, setContacts] = useState<ContactDraftValues[]>([]);
	const [draft, setDraft] = useState<ContactDraftValues>(emptyContactDraft);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	const trades = useQuery(api.trades.list.list, {});
	const updateServiceProvider = useMutation(api.serviceProviders.update.update);

	const form = useForm({
		defaultValues: emptyServiceProviderFormValues,
		validators: {
			onChange: serviceProviderFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			const parsed = serviceProviderFormSchema.parse(value);
			try {
				await updateServiceProvider({
					serviceProviderId,
					company: parsed.company,
					name: parsed.name,
					email: parsed.email,
					phone: parsed.phone,
					tradeIds: selectedTradeIds as never,
					contacts,
				});
				toastManager.add({
					title: 'Service provider updated',
					type: 'success',
				});
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update service provider. Please try again in a moment.'
					),
					title: 'Could not update service provider',
					type: 'error',
				});
			}
		},
	});

	useEffect(() => {
		if (open) {
			form.reset(
				{
					company: initialCompany,
					name: initialName,
					email: initialEmail,
					phone: initialPhone,
				},
				{ keepDefaultValues: true }
			);
			setSelectedTradeIds(initialTradeIds);
			setContacts(initialContacts);
			setDraft(emptyContactDraft);
			setEditingIndex(null);
			return;
		}
		form.reset();
		setSelectedTradeIds([]);
		setContacts([]);
		setDraft(emptyContactDraft);
		setEditingIndex(null);
	}, [
		open,
		form,
		initialCompany,
		initialName,
		initialEmail,
		initialPhone,
		initialTradeIds,
		initialContacts,
	]);

	const handleAddOrSaveContact = () => {
		const parsed = serviceProviderContactSchema.safeParse(draft);
		if (!parsed.success) {
			toastManager.add({
				description: contactDraftErrorMessage(parsed.error),
				title: 'Contact details invalid',
				type: 'error',
			});
			return;
		}
		if (editingIndex === null) {
			setContacts((prev) => [...prev, parsed.data]);
		} else {
			setContacts((prev) => {
				const copy = [...prev];
				copy[editingIndex] = parsed.data;
				return copy;
			});
		}
		setDraft(emptyContactDraft);
		setEditingIndex(null);
	};

	const handleEditContact = (index: number) => {
		const c = contacts[index];
		if (!c) {
			return;
		}
		setDraft(c);
		setEditingIndex(index);
	};

	const handleDeleteContact = (index: number) => {
		setContacts((prev) => prev.filter((_, i) => i !== index));
		if (editingIndex === index) {
			setDraft(emptyContactDraft);
			setEditingIndex(null);
		}
	};

	return (
		<Sheet onOpenChange={setOpen} open={open}>
			{trigger ? <SheetTrigger render={trigger} /> : null}
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0"
				side="right"
			>
				<SheetHeader>
					<SheetTitle>Edit Service Provider</SheetTitle>
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
									Provider details
								</FrameTitle>
							</FrameHeader>
							<FramePanel className="space-y-4">
								<form.Field name="company">
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
													placeholder="Company name"
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
								<form.Field name="name">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>
													Contact Name
												</FieldLabel>
												<Input
													aria-invalid={invalid}
													id={field.name}
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Primary contact name"
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
									<form.Field name="email">
										{(field) => {
											const invalid =
												field.state.meta.isTouched && !field.state.meta.isValid;
											return (
												<Field data-invalid={invalid}>
													<FieldLabel htmlFor={field.name}>Email</FieldLabel>
													<Input
														aria-invalid={invalid}
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
									<form.Field name="phone">
										{(field) => {
											const invalid =
												field.state.meta.isTouched && !field.state.meta.isValid;
											return (
												<Field data-invalid={invalid}>
													<FieldLabel htmlFor={field.name}>Phone</FieldLabel>
													<Input
														aria-invalid={invalid}
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
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader className="flex flex-row items-center py-3">
								<FrameTitle className="min-w-0 truncate leading-none">
									Trades
								</FrameTitle>
							</FrameHeader>
							<FramePanel>
								<Combobox
									itemToStringLabel={(val) =>
										(trades ?? []).find((t) => t._id === val)?.name ??
										String(val ?? '')
									}
									multiple
									onValueChange={(val) => setSelectedTradeIds(val as string[])}
									value={selectedTradeIds}
								>
									<ComboboxChips>
										{selectedTradeIds.map((id) => {
											const trade = (trades ?? []).find((t) => t._id === id);
											return (
												<ComboboxChip key={id}>
													{trade?.name ?? id}
												</ComboboxChip>
											);
										})}
										<ComboboxChipsInput placeholder="Search trades…" />
									</ComboboxChips>
									<ComboboxPopup>
										<ComboboxList>
											{(trades ?? []).map((trade) => (
												<ComboboxItem key={trade._id} value={trade._id}>
													{trade.name}
												</ComboboxItem>
											))}
										</ComboboxList>
									</ComboboxPopup>
								</Combobox>
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader className="flex flex-row items-center py-3">
								<FrameTitle className="min-w-0 truncate leading-none">
									Additional contacts
								</FrameTitle>
							</FrameHeader>
							<FramePanel className="space-y-4">
								<ServiceProviderContactDraftFields
									draft={draft}
									setDraft={setDraft}
								/>
								<div className="flex justify-end">
									<Button
										onClick={handleAddOrSaveContact}
										type="button"
										variant="outline"
									>
										{editingIndex === null ? 'Add Contact' : 'Save Contact'}
									</Button>
								</div>
								{contacts.length > 0 ? (
									<div className="flex flex-col gap-3">
										{contacts.map((c, index) => (
											<ServiceProviderContactCard
												contact={c}
												key={`${c.email}-${index}`}
												onDelete={() => handleDeleteContact(index)}
												onEdit={() => handleEditContact(index)}
											/>
										))}
									</div>
								) : null}
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
								!form.state.isSubmitting
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
