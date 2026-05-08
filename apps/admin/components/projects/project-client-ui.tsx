'use client';

import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@workspace/ui/components/alert-dialog';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import {
	Frame,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from '@workspace/ui/components/frame';
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import { Input } from '@workspace/ui/components/input';
import { Pencil, Trash2 } from 'lucide-react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { useState } from 'react';
import type { z } from 'zod';
import {
	type AustralianState,
	AustralianStateCombobox,
	type ClientDraftValues,
	type ProjectStoredClient,
	projectClientAddressLine,
	projectClientDisplayName,
	projectClientEmailPhoneLine,
} from '@/components/projects/project-form-shared';
export function clientDraftErrorMessage(
	error: z.ZodError<ClientDraftValues>
): string {
	return error.issues.map((i) => i.message).join(' ');
}

export function ProjectClientCard({
	client,
	onEdit,
	onDelete,
}: {
	client: ProjectStoredClient;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const [confirmOpen, setConfirmOpen] = useState(false);
	const addressLine = projectClientAddressLine(client);
	return (
		<Frame>
			<FrameHeader className="flex flex-row items-center justify-between gap-3 py-3">
				<FrameTitle className="min-w-0 truncate leading-none">
					{projectClientDisplayName(client)}
				</FrameTitle>
				<Group className="shrink-0">
					<Button
						aria-label="Edit client"
						onClick={onEdit}
						size="icon"
						type="button"
						variant="outline"
					>
						<Pencil />
					</Button>
					<GroupSeparator />
					<AlertDialog onOpenChange={setConfirmOpen} open={confirmOpen}>
						<AlertDialogTrigger
							render={
								<Button
									aria-label="Delete client"
									size="icon"
									type="button"
									variant="destructive-outline"
								/>
							}
						>
							<Trash2 />
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete client?</AlertDialogTitle>
								<AlertDialogDescription>
									{`Remove ${projectClientDisplayName(client)} from this project?`}
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogClose
									render={<Button type="button" variant="outline" />}
								>
									Cancel
								</AlertDialogClose>
								<Button
									onClick={() => {
										onDelete();
										setConfirmOpen(false);
									}}
									type="button"
									variant="destructive"
								>
									Delete client
								</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</Group>
			</FrameHeader>
			<FramePanel className="space-y-2 text-muted-foreground">
				<p className="text-sm leading-snug">
					{projectClientEmailPhoneLine(client)}
				</p>
				<p className="text-sm leading-snug">
					{addressLine || (
						<span className="text-muted-foreground/72">No address</span>
					)}
				</p>
			</FramePanel>
		</Frame>
	);
}

export function ProjectClientDraftFields({
	draft,
	setDraft,
	showAddressInputs,
	addressTitleSlot,
}: {
	draft: ClientDraftValues;
	setDraft: Dispatch<SetStateAction<ClientDraftValues>>;
	showAddressInputs: boolean;
	/** Title row for client address (e.g. label + “Same as first client” checkbox) */
	addressTitleSlot: ReactNode;
}) {
	const patchAddress = (patch: Partial<ClientDraftValues['address']>) => {
		setDraft((prev) => ({
			...prev,
			address: { ...prev.address, ...patch },
		}));
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field>
					<FieldLabel htmlFor="client-draft-firstName">First name</FieldLabel>
					<Input
						autoComplete="given-name"
						id="client-draft-firstName"
						nativeInput
						onChange={(e) =>
							setDraft((p) => ({ ...p, firstName: e.target.value }))
						}
						placeholder="First name"
						value={draft.firstName}
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor="client-draft-lastName">Last name</FieldLabel>
					<Input
						autoComplete="family-name"
						id="client-draft-lastName"
						nativeInput
						onChange={(e) =>
							setDraft((p) => ({ ...p, lastName: e.target.value }))
						}
						placeholder="Last name"
						value={draft.lastName}
					/>
				</Field>
			</div>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field>
					<FieldLabel htmlFor="client-draft-email">Email</FieldLabel>
					<Input
						autoComplete="email"
						id="client-draft-email"
						nativeInput
						onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))}
						placeholder="Email"
						type="email"
						value={draft.email}
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor="client-draft-phone">Phone</FieldLabel>
					<Input
						autoComplete="tel"
						id="client-draft-phone"
						nativeInput
						onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
						placeholder="Phone"
						type="tel"
						value={draft.phone}
					/>
				</Field>
			</div>
			<Field>
				<FieldLabel htmlFor="client-draft-company">Company</FieldLabel>
				<Input
					id="client-draft-company"
					nativeInput
					onChange={(e) => setDraft((p) => ({ ...p, company: e.target.value }))}
					placeholder="Company (optional)"
					value={draft.company}
				/>
			</Field>

			{addressTitleSlot}

			{showAddressInputs ? (
				<>
					<Field>
						<FieldLabel htmlFor="client-draft-addr-street">Street</FieldLabel>
						<Input
							id="client-draft-addr-street"
							nativeInput
							onChange={(e) => patchAddress({ street: e.target.value })}
							placeholder="Street (optional)"
							value={draft.address.street}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="client-draft-addr-suburb">Suburb</FieldLabel>
						<Input
							id="client-draft-addr-suburb"
							nativeInput
							onChange={(e) => patchAddress({ suburb: e.target.value })}
							placeholder="Suburb (optional)"
							value={draft.address.suburb}
						/>
					</Field>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Field>
							<FieldLabel htmlFor="client-draft-addr-state">State</FieldLabel>
							<AustralianStateCombobox
								id="client-draft-addr-state"
								onBlur={() => undefined}
								onChange={(next) =>
									patchAddress({ state: next as AustralianState })
								}
								placeholder="State (optional)"
								value={draft.address.state}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="client-draft-addr-postcode">
								Postcode
							</FieldLabel>
							<Input
								id="client-draft-addr-postcode"
								inputMode="numeric"
								nativeInput
								onChange={(e) => patchAddress({ postcode: e.target.value })}
								placeholder="Postcode (optional)"
								value={draft.address.postcode}
							/>
						</Field>
					</div>
				</>
			) : null}
		</div>
	);
}

export function ClientAddressTitleRow({
	title,
	showSameAsFirst,
	sameAsFirstClient,
	onSameAsFirstChange,
}: {
	title: string;
	showSameAsFirst: boolean;
	sameAsFirstClient: boolean;
	onSameAsFirstChange: (checked: boolean) => void;
}) {
	return (
		<div className="flex items-center justify-between gap-3">
			<p className="font-medium text-muted-foreground text-sm">{title}</p>
			{showSameAsFirst ? (
				<label
					className="flex cursor-pointer items-center gap-2 text-muted-foreground text-sm"
					htmlFor="client-same-as-first"
				>
					<Checkbox
						checked={sameAsFirstClient}
						id="client-same-as-first"
						onCheckedChange={(next) => onSameAsFirstChange(Boolean(next))}
					/>
					Same as first client
				</label>
			) : null}
		</div>
	);
}
