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
import { type ReactElement, useEffect, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyTradeStageFormValues,
	tradeStageFormFieldError,
	tradeStageFormSchema,
} from './trade-stage-form-shared';

const FORM_ID = 'edit-trade-stage-form';

export default function EditTradeStage({
	stageId,
	initialName,
	trigger,
}: {
	stageId: Id<'tradeStages'>;
	initialName: string;
	trigger: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const updateStage = useMutation(api.tradeStages.update.update);

	const form = useForm({
		defaultValues: emptyTradeStageFormValues,
		validators: {
			onChange: tradeStageFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = tradeStageFormSchema.parse(value);
				await updateStage({ stageId, name: parsed.name });
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
			form.reset({ name: initialName }, { keepDefaultValues: true });
			return;
		}
		form.reset();
	}, [form, initialName, open]);

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger render={trigger} />
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
												{tradeStageFormFieldError(field.state.meta.errors)}
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
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
