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
import { Plus, PlusIcon } from 'lucide-react';
import { type ReactElement, useRef, useState } from 'react';
import { PendingItemsList } from '@/components/lists/pending-items-list';
import { useMultiAdd } from '@/components/lists/use-multi-add';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyMaterialColorFormValues,
	materialColorFormFieldError,
	materialColorFormSchema,
} from './material-color-form-shared';

const FORM_ID = 'add-material-color-form';

export default function AddMaterialColor({
	trigger,
}: {
	trigger?: ReactElement;
} = {}) {
	const [open, setOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const multi = useMultiAdd();
	const nameInputRef = useRef<HTMLInputElement>(null);
	const addMaterialColor = useMutation(api.materialColors.add.add);
	const addManyMaterialColors = useMutation(api.materialColors.addMany.addMany);

	const form = useForm({
		defaultValues: emptyMaterialColorFormValues,
		validators: {
			onChange: materialColorFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = materialColorFormSchema.parse(value);
				await addMaterialColor({
					name: parsed.name,
					description: parsed.description?.trim() || undefined,
				});
				toastManager.add({
					title: 'Material color added',
					type: 'success',
				});
				form.reset();
				multi.reset();
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not add material color. Please try again in a moment.'
					),
					title: 'Could not add material color',
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
			await addManyMaterialColors({ names });
			toastManager.add({
				title: `${names.length} material colors added`,
				type: 'success',
			});
			form.reset();
			multi.reset();
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not add material colors. Please try again in a moment.'
				),
				title: 'Could not add material colors',
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
			<DialogTrigger
				render={
					trigger ?? (
						<Button variant="outline">
							<Plus aria-hidden />
							Add Material Color
						</Button>
					)
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Material Color</DialogTitle>
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
													placeholder="Material color name"
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
												{materialColorFormFieldError(field.state.meta.errors)}
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
											placeholder="Brief description of this material color"
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
						<Button
							disabled={isSaving}
							onClick={saveMultiple}
							type="button"
							variant="outline"
						>
							<Plus aria-hidden />
							{`Add ${multi.items.length} Material Colors`}
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
							variant="outline"
						>
							<Plus aria-hidden />
							Add Material Color
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
