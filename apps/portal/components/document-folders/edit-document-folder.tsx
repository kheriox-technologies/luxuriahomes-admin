'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
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
import { Check } from 'lucide-react';
import { type ReactElement, useEffect, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	documentFolderFormFieldError,
	documentFolderFormSchema,
	emptyDocumentFolderFormValues,
} from './document-folder-form-shared';

const FORM_ID = 'edit-document-folder-form';

export default function EditDocumentFolder({
	documentFolderId,
	initialName,
	trigger,
}: {
	documentFolderId: Id<'documentFolders'>;
	initialName: string;
	trigger: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const updateDocumentFolder = useMutation(api.documentFolders.update.update);

	const form = useForm({
		defaultValues: emptyDocumentFolderFormValues,
		validators: {
			onChange: documentFolderFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = documentFolderFormSchema.parse(value);
				await updateDocumentFolder({
					documentFolderId,
					name: parsed.name,
				});
				toastManager.add({
					title: 'Document folder updated',
					type: 'success',
				});
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update document folder. Please try again in a moment.'
					),
					title: 'Could not update document folder',
					type: 'error',
				});
				form.reset();
				setOpen(false);
			}
		},
	});

	useEffect(() => {
		if (open) {
			form.reset({ name: initialName }, { keepDefaultValues: true });
			return;
		}
		form.reset();
	}, [form, initialName, open]);

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
					<DialogTitle>Edit Document Folder</DialogTitle>
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
											placeholder="Folder name"
											value={field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{documentFolderFormFieldError(field.state.meta.errors)}
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
