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
import { Plus } from 'lucide-react';
import type { ReactElement } from 'react';
import {
	type ControllableDialogProps,
	useDialogOpen,
} from '@/components/quote-items/use-dialog-open';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyQuoteTermSectionFormValues,
	quoteTermFormFieldError,
	quoteTermSectionFormSchema,
} from './quote-term-form-shared';

const FORM_ID = 'add-quote-term-section-form';

export default function AddQuoteTermSection({
	trigger,
	...openProps
}: {
	trigger?: ReactElement;
} & ControllableDialogProps = {}) {
	const { open, setOpen } = useDialogOpen(openProps);
	const addSection = useMutation(api.quoteTermSections.add.add);

	const form = useForm({
		defaultValues: emptyQuoteTermSectionFormValues,
		validators: {
			onChange: quoteTermSectionFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = quoteTermSectionFormSchema.parse(value);
				await addSection({ name: parsed.name });
				toastManager.add({ title: 'Section added', type: 'success' });
				form.reset();
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not add section. Please try again in a moment.'
					),
					title: 'Could not add section',
					type: 'error',
				});
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
			{openProps.open === undefined ? (
				<DialogTrigger
					render={
						trigger ?? (
							<Button variant="outline">
								<Plus aria-hidden /> Add Section
							</Button>
						)
					}
				/>
			) : null}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Section</DialogTitle>
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
										<FieldLabel htmlFor={field.name}>Section name</FieldLabel>
										<Input
											aria-invalid={invalid}
											id={field.name}
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="e.g. Validity & acceptance"
											value={field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{quoteTermFormFieldError(field.state.meta.errors)}
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
						<Plus aria-hidden /> Add Section
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
