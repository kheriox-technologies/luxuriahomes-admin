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
import { type ReactElement, useEffect } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyQuoteStageFormValues,
	parseOptionalPercent,
	quoteFormFieldError,
	quoteStageFormSchema,
} from './quote-form-shared';
import QuoteStageDefaultsFields from './quote-stage-defaults-fields';
import { type ControllableDialogProps, useDialogOpen } from './use-dialog-open';

const FORM_ID = 'edit-quote-stage-form';

export default function EditQuoteStage({
	stageId,
	initialName,
	initialDefaultPercent,
	initialScopeSummary,
	trigger,
	...openProps
}: {
	stageId: Id<'quoteStages'>;
	initialName: string;
	initialDefaultPercent?: number;
	initialScopeSummary?: string;
	trigger?: ReactElement;
} & ControllableDialogProps) {
	const { open, setOpen } = useDialogOpen(openProps);
	const updateStage = useMutation(api.quoteStages.update.update);

	const form = useForm({
		defaultValues: emptyQuoteStageFormValues,
		validators: {
			onChange: quoteStageFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = quoteStageFormSchema.parse(value);
				await updateStage({
					stageId,
					name: parsed.name,
					defaultPercent: parseOptionalPercent(parsed.defaultPercent),
					scopeSummary: parsed.scopeSummary || undefined,
				});
				toastManager.add({ title: 'Stage updated', type: 'success' });
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update stage. Please try again in a moment.'
					),
					title: 'Could not update stage',
					type: 'error',
				});
				form.reset();
				setOpen(false);
			}
		},
	});

	useEffect(() => {
		if (open) {
			form.reset(
				{
					name: initialName,
					defaultPercent:
						initialDefaultPercent === undefined
							? ''
							: String(initialDefaultPercent),
					scopeSummary: initialScopeSummary ?? '',
				},
				{ keepDefaultValues: true }
			);
			return;
		}
		form.reset();
	}, [form, initialDefaultPercent, initialName, initialScopeSummary, open]);

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			{trigger ? <DialogTrigger render={trigger} /> : null}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Stage</DialogTitle>
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
											placeholder="Stage name"
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
						<Check aria-hidden /> Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
