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
import { type ReactElement, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyQuoteStageFormValues,
	parseOptionalPercent,
	quoteFormFieldError,
	quoteStageFormSchema,
} from './quote-form-shared';
import QuoteStageDefaultsFields from './quote-stage-defaults-fields';

const FORM_ID = 'add-quote-stage-form';

export default function AddQuoteStage({
	trigger,
}: {
	trigger?: ReactElement;
} = {}) {
	const [open, setOpen] = useState(false);
	const addStage = useMutation(api.quoteStages.add.add);

	const form = useForm({
		defaultValues: emptyQuoteStageFormValues,
		validators: {
			onChange: quoteStageFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = quoteStageFormSchema.parse(value);
				await addStage({
					name: parsed.name,
					defaultPercent: parseOptionalPercent(parsed.defaultPercent),
					scopeSummary: parsed.scopeSummary || undefined,
				});
				toastManager.add({ title: 'Stage added', type: 'success' });
				form.reset();
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not add stage. Please try again in a moment.'
					),
					title: 'Could not add stage',
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
			<DialogTrigger
				render={
					trigger ?? (
						<Button variant="outline">
							<Plus aria-hidden /> Add Stage
						</Button>
					)
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Stage</DialogTitle>
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
											placeholder="e.g. Site Works"
											value={field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{quoteFormFieldError(field.state.meta.errors)}
											</FieldError>
										) : null}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="defaultPercent">
							{(percentField) => (
								<form.Field name="scopeSummary">
									{(scopeField) => (
										<QuoteStageDefaultsFields
											defaultPercent={{
												error: quoteFormFieldError(
													percentField.state.meta.errors
												),
												invalid:
													percentField.state.meta.isTouched &&
													!percentField.state.meta.isValid,
												onBlur: percentField.handleBlur,
												onChange: percentField.handleChange,
												value: percentField.state.value,
											}}
											scopeSummary={{
												error: quoteFormFieldError(
													scopeField.state.meta.errors
												),
												invalid:
													scopeField.state.meta.isTouched &&
													!scopeField.state.meta.isValid,
												onBlur: scopeField.handleBlur,
												onChange: scopeField.handleChange,
												value: scopeField.state.value,
											}}
										/>
									)}
								</form.Field>
							)}
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
						<Plus aria-hidden /> Add Stage
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
