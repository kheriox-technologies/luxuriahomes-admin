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
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
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
import { useMutation, useQuery } from 'convex/react';
import { type ReactElement, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyTradeStageFormValues,
	tradeStageFormFieldError,
	tradeStageFormSchema,
} from './trade-stage-form-shared';

const FORM_ID = 'add-trade-stage-form';

export default function AddTradeStage({
	trigger,
}: {
	trigger?: ReactElement;
} = {}) {
	const [open, setOpen] = useState(false);
	const [selectedTradeIds, setSelectedTradeIds] = useState<string[]>([]);
	const addStage = useMutation(api.tradeStages.add.add);
	const trades = useQuery(api.trades.list.list, {});

	// Only trades without a stage can be pulled into the new stage.
	const ungrouped = (trades ?? []).filter((t) => !t.stageId);
	const ungroupedIds = ungrouped.map((t) => t._id);
	const labelById = new Map(ungrouped.map((t) => [t._id, t.name]));

	const resetAll = () => {
		setSelectedTradeIds([]);
	};

	const form = useForm({
		defaultValues: emptyTradeStageFormValues,
		validators: {
			onChange: tradeStageFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = tradeStageFormSchema.parse(value);
				await addStage({
					name: parsed.name,
					tradeIds:
						selectedTradeIds.length > 0
							? (selectedTradeIds as Id<'trades'>[])
							: undefined,
				});
				toastManager.add({ title: 'Stage added', type: 'success' });
				form.reset();
				resetAll();
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
					resetAll();
				}
			}}
			open={open}
		>
			<DialogTrigger
				render={trigger ?? <Button variant="outline">Add Stage</Button>}
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
						<Field>
							<FieldLabel htmlFor="add-trade-stage-trades">
								Trades
								<span className="ml-1 text-muted-foreground text-xs">
									(optional)
								</span>
							</FieldLabel>
							<Combobox
								items={ungroupedIds}
								itemToStringLabel={(val) =>
									labelById.get(val as Id<'trades'>) ?? String(val ?? '')
								}
								multiple
								onValueChange={(val) => setSelectedTradeIds(val as string[])}
								value={selectedTradeIds}
							>
								<ComboboxChips>
									{selectedTradeIds.map((id) => (
										<ComboboxChip key={id}>
											{labelById.get(id as Id<'trades'>) ?? id}
										</ComboboxChip>
									))}
									<ComboboxChipsInput
										id="add-trade-stage-trades"
										placeholder="Add ungrouped trades…"
									/>
								</ComboboxChips>
								<ComboboxPopup>
									<ComboboxEmpty>No ungrouped trades.</ComboboxEmpty>
									<ComboboxList>
										{(item: Id<'trades'>) => (
											<ComboboxItem key={item} value={item}>
												{labelById.get(item) ?? item}
											</ComboboxItem>
										)}
									</ComboboxList>
								</ComboboxPopup>
							</Combobox>
						</Field>
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
						Add Stage
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
