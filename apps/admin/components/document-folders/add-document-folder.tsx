'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
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
import { type ReactElement, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	documentFolderFormFieldError,
	documentFolderFormSchema,
	emptyDocumentFolderFormValues,
} from './document-folder-form-shared';

const FORM_ID = 'add-document-folder-form';

export default function AddDocumentFolder({
	trigger,
}: {
	trigger?: ReactElement;
} = {}) {
	const [open, setOpen] = useState(false);
	const addDocumentFolder = useMutation(api.documentFolders.add.add);

	const form = useForm({
		defaultValues: emptyDocumentFolderFormValues,
		validators: {
			onChange: documentFolderFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = documentFolderFormSchema.parse(value);
				await addDocumentFolder({ name: parsed.name });
				toastManager.add({
					title: 'Document folder added',
					type: 'success',
				});
				form.reset();
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not add document folder. Please try again in a moment.'
					),
					title: 'Could not add document folder',
					type: 'error',
				});
				form.reset();
				setOpen(false);
			}
		},
	});

	return (
		<Dialog
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (!nextOpen) {
					form.reset();
				}
			}}
			open={open}
		>
			<DialogTrigger render={trigger ?? <Button>Add Document Folder</Button>} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Document Folder</DialogTitle>
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
											autoFocus
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
					>
						Add Document Folder
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
