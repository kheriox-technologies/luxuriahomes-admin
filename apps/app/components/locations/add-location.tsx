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
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { PlusIcon } from 'lucide-react';
import { type ReactElement, useRef, useState } from 'react';
import { PendingItemsList } from '@/components/lists/pending-items-list';
import { useMultiAdd } from '@/components/lists/use-multi-add';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyLocationFormValues,
	locationFormFieldError,
	locationFormSchema,
} from './location-form-shared';

const FORM_ID = 'add-location-form';

export default function AddLocation({
	trigger,
}: {
	trigger?: ReactElement;
} = {}) {
	const [open, setOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const multi = useMultiAdd();
	const nameInputRef = useRef<HTMLInputElement>(null);
	const addLocation = useMutation(api.locations.add.add);
	const addManyLocations = useMutation(api.locations.addMany.addMany);

	const form = useForm({
		defaultValues: emptyLocationFormValues,
		validators: {
			onChange: locationFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = locationFormSchema.parse(value);
				await addLocation({
					name: parsed.name,
					description: parsed.description?.trim() || undefined,
				});
				toastManager.add({
					title: 'Location added',
					type: 'success',
				});
				form.reset();
				multi.reset();
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not add location. Please try again in a moment.'
					),
					title: 'Could not add location',
					type: 'error',
				});
				form.reset();
				multi.reset();
				setOpen(false);
			}
		},
	});

	const addCurrentName = (value: string) => {
		if (multi.addItem(value)) {
			form.resetField('name');
			nameInputRef.current?.focus();
		}
	};

	const saveMultiple = async () => {
		if (isSaving) {
			return;
		}
		const names = [...multi.items];
		const trailing = form.state.values.name.trim();
		if (trailing) {
			names.push(trailing);
		}
		if (names.length === 0) {
			return;
		}
		setIsSaving(true);
		try {
			await addManyLocations({ names });
			toastManager.add({
				title: `${names.length} locations added`,
				type: 'success',
			});
			form.reset();
			multi.reset();
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not add locations. Please try again in a moment.'
				),
				title: 'Could not add locations',
				type: 'error',
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Dialog
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (!nextOpen) {
					form.reset();
					multi.reset();
				}
			}}
			open={open}
		>
			<DialogTrigger render={trigger ?? <Button>Add Location</Button>} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Location</DialogTitle>
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
									!multi.isMultiAdd &&
									field.state.meta.isTouched &&
									!field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Name</FieldLabel>
										<div className="flex w-full items-center gap-2">
											<div className="flex-1">
												<Input
													aria-invalid={invalid}
													autoFocus
													id={field.name}
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													onKeyDown={(e) => {
														if (e.key === 'Enter') {
															e.preventDefault();
															addCurrentName(field.state.value);
														}
													}}
													placeholder="Location name"
													ref={nameInputRef}
													value={field.state.value}
												/>
											</div>
											<Button
												aria-label="Add to list"
												onClick={() => addCurrentName(field.state.value)}
												size="icon"
												type="button"
												variant="outline"
											>
												<PlusIcon />
											</Button>
										</div>
										{invalid ? (
											<FieldError>
												{locationFormFieldError(field.state.meta.errors)}
											</FieldError>
										) : null}
									</Field>
								);
							}}
						</form.Field>
						<PendingItemsList items={multi.items} onRemove={multi.removeItem} />
						{multi.isMultiAdd ? null : (
							<form.Field name="description">
								{(field) => (
									<Field>
										<FieldLabel htmlFor={field.name}>
											Description
											<span className="ml-1 text-muted-foreground text-xs">
												(optional)
											</span>
										</FieldLabel>
										<Textarea
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Brief description of this location"
											rows={3}
											value={field.state.value ?? ''}
										/>
									</Field>
								)}
							</form.Field>
						)}
					</DialogPanel>
				</form>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					{multi.isMultiAdd ? (
						<Button disabled={isSaving} onClick={saveMultiple} type="button">
							{`Add ${multi.items.length} Locations`}
						</Button>
					) : (
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
							Add Location
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
