'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogPanel,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { useEffect } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { bannerFormFieldError, bannerFormSchema } from './banner-form-shared';

const FORM_ID = 'edit-banner-form';

export default function EditBanner({
	banner,
	open,
	onOpenChange,
}: {
	banner: Doc<'banners'>;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const updateBanner = useMutation(api.banners.update.update);

	const form = useForm({
		defaultValues: {
			title: banner.title,
			description: banner.description ?? '',
		},
		validators: {
			onChange: bannerFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = bannerFormSchema.parse(value);
				await updateBanner({
					bannerId: banner._id,
					title: parsed.title,
					description: parsed.description?.trim() || null,
				});
				toastManager.add({ title: 'Banner updated', type: 'success' });
				onOpenChange(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update banner. Please try again in a moment.'
					),
					title: 'Could not update banner',
					type: 'error',
				});
			}
		},
	});

	useEffect(() => {
		if (open) {
			form.reset({
				title: banner.title,
				description: banner.description ?? '',
			});
		}
	}, [open, banner.title, banner.description, form]);

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Banner</DialogTitle>
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
						<form.Field name="title">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Title</FieldLabel>
										<Input
											aria-invalid={invalid}
											autoFocus
											id={field.name}
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Banner title"
											value={field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{bannerFormFieldError(field.state.meta.errors)}
											</FieldError>
										) : null}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name="description">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>
										Description{' '}
										<span className="text-muted-foreground text-xs">
											(optional)
										</span>
									</FieldLabel>
									<Textarea
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Short description shown with the banner"
										rows={3}
										value={field.state.value ?? ''}
									/>
								</Field>
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
						loading={form.state.isSubmitting}
						type="submit"
					>
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
