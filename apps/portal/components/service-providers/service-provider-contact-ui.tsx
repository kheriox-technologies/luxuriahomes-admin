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
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import type { ContactDraftValues } from './service-provider-form-shared';

export function ServiceProviderContactCard({
	contact,
	onEdit,
	onDelete,
}: {
	contact: ContactDraftValues;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const [confirmOpen, setConfirmOpen] = useState(false);
	const phoneDisplay = [contact.phone, contact.landline]
		.filter(Boolean)
		.join(' | ');
	return (
		<Frame>
			<FrameHeader className="flex flex-row items-center justify-between gap-3 py-3">
				<div className="min-w-0">
					<FrameTitle className="truncate leading-none">
						{contact.name}
					</FrameTitle>
					{contact.position ? (
						<p className="mt-0.5 truncate text-muted-foreground text-xs leading-snug">
							{contact.position}
						</p>
					) : null}
				</div>
				<Group className="shrink-0">
					<Button
						aria-label="Edit contact"
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
									aria-label="Delete contact"
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
								<AlertDialogTitle>Delete contact?</AlertDialogTitle>
								<AlertDialogDescription>
									{`Remove ${contact.name} from this service provider?`}
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
									variant="destructive-outline"
								>
									<Trash2 aria-hidden /> Delete contact
								</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</Group>
			</FrameHeader>
			<FramePanel className="space-y-1 text-muted-foreground">
				{contact.email ? (
					<p className="text-sm leading-snug">{contact.email}</p>
				) : null}
				{phoneDisplay ? (
					<p className="text-sm leading-snug">{phoneDisplay}</p>
				) : null}
			</FramePanel>
		</Frame>
	);
}

export function ServiceProviderContactDraftFields({
	draft,
	setDraft,
}: {
	draft: ContactDraftValues;
	setDraft: Dispatch<SetStateAction<ContactDraftValues>>;
}) {
	return (
		<div className="flex flex-col gap-4">
			<Field>
				<FieldLabel htmlFor="contact-draft-name">Name</FieldLabel>
				<Input
					id="contact-draft-name"
					nativeInput
					onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
					placeholder="Full name"
					value={draft.name}
				/>
			</Field>
			<Field>
				<FieldLabel htmlFor="contact-draft-position">Position</FieldLabel>
				<Input
					id="contact-draft-position"
					nativeInput
					onChange={(e) =>
						setDraft((p) => ({ ...p, position: e.target.value }))
					}
					placeholder="Position / role"
					value={draft.position ?? ''}
				/>
			</Field>
			<Field>
				<FieldLabel htmlFor="contact-draft-email">
					Email{' '}
					<span className="text-muted-foreground text-xs">(optional)</span>
				</FieldLabel>
				<Input
					autoComplete="email"
					id="contact-draft-email"
					nativeInput
					onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))}
					placeholder="Email"
					type="email"
					value={draft.email}
				/>
			</Field>
			<Field>
				<FieldLabel htmlFor="contact-draft-phone">
					Phone{' '}
					<span className="text-muted-foreground text-xs">(optional)</span>
				</FieldLabel>
				<Input
					autoComplete="tel"
					id="contact-draft-phone"
					nativeInput
					onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
					placeholder="Mobile"
					type="tel"
					value={draft.phone}
				/>
			</Field>
			<Field>
				<FieldLabel htmlFor="contact-draft-landline">
					Landline{' '}
					<span className="text-muted-foreground text-xs">(optional)</span>
				</FieldLabel>
				<Input
					autoComplete="tel"
					id="contact-draft-landline"
					nativeInput
					onChange={(e) =>
						setDraft((p) => ({ ...p, landline: e.target.value }))
					}
					placeholder="Landline"
					type="tel"
					value={draft.landline}
				/>
			</Field>
		</div>
	);
}
