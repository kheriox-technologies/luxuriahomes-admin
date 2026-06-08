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
	return (
		<Frame>
			<FrameHeader className="flex flex-row items-center justify-between gap-3 py-3">
				<FrameTitle className="min-w-0 truncate leading-none">
					{contact.name}
				</FrameTitle>
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
									variant="destructive"
								>
									Delete contact
								</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</Group>
			</FrameHeader>
			<FramePanel className="space-y-1 text-muted-foreground">
				<p className="text-sm leading-snug">{contact.email}</p>
				<p className="text-sm leading-snug">{contact.phone}</p>
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
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field>
					<FieldLabel htmlFor="contact-draft-email">Email</FieldLabel>
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
					<FieldLabel htmlFor="contact-draft-phone">Phone</FieldLabel>
					<Input
						autoComplete="tel"
						id="contact-draft-phone"
						nativeInput
						onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
						placeholder="Phone"
						type="tel"
						value={draft.phone}
					/>
				</Field>
			</div>
		</div>
	);
}
