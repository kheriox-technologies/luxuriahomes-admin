'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import { CheckboxCard } from '@workspace/ui/components/checkbox-card';
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetPanel,
	SheetTitle,
	SheetTrigger,
} from '@workspace/ui/components/sheet';
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { Check } from 'lucide-react';
import { useState } from 'react';
import CopySignatureButton from '@/components/settings/copy-signature-button';
import {
	emptySignatureFormValues,
	renderSignaturePreview,
	type SignatureFormValues,
	signatureFormFieldError,
	signatureFormSchema,
	toSignatureFields,
	toSignatureFormValues,
} from '@/components/settings/signature-form-shared';
import SignaturePreview from '@/components/settings/signature-preview';
import { getConvexErrorMessage } from '@/lib/convex-errors';

type EmailSignature = Doc<'emailSignatures'>;

type TextFieldName = Exclude<keyof SignatureFormValues, 'isDefault'>;

/** Declarative spec for the plain text inputs, keeping the JSX flat. */
const TEXT_FIELDS: {
	name: TextFieldName;
	label: string;
	placeholder: string;
	description?: string;
	half?: boolean;
}[] = [
	{
		name: 'fullName',
		label: 'Full name',
		placeholder: 'Jane Smith',
		half: true,
	},
	{
		name: 'designation',
		label: 'Designation',
		placeholder: 'Sales Manager',
		half: true,
	},
	{
		name: 'company',
		label: 'Company',
		placeholder: 'Luxuria Homes',
		half: true,
	},
	{ name: 'mobile', label: 'Mobile', placeholder: '0400 000 000', half: true },
	{
		name: 'phone',
		label: 'Office phone',
		placeholder: '(03) 9000 0000',
		half: true,
	},
	{
		name: 'email',
		label: 'Email',
		placeholder: 'jane@luxuriahomes.com.au',
		half: true,
	},
	{
		name: 'address',
		label: 'Address',
		placeholder: '123 Example St, Melbourne VIC 3000',
	},
	{
		name: 'website',
		label: 'Website',
		placeholder: 'https://luxuriahomes.com.au',
		description: 'Shown on every signature.',
	},
	{
		name: 'tagline',
		label: 'Tagline',
		placeholder: 'Building homes people love',
		description: 'Optional line under your name.',
	},
];

export default function SignatureSheet({
	signature,
	trigger,
}: {
	signature?: EmailSignature;
	trigger: React.ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const addSignature = useMutation(api.emailSignatures.add.add);
	const updateSignature = useMutation(api.emailSignatures.update.update);

	const initialValues = signature
		? toSignatureFormValues(signature)
		: emptySignatureFormValues;

	const form = useForm({
		defaultValues: initialValues,
		validators: {
			onChange: signatureFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			const parsed = signatureFormSchema.parse(value);
			const fields = toSignatureFields(parsed);
			try {
				if (signature) {
					await updateSignature({
						signatureId: signature._id,
						name: parsed.name.trim(),
						fields,
						isDefault: parsed.isDefault,
					});
					toastManager.add({ title: 'Signature updated', type: 'success' });
				} else {
					await addSignature({
						name: parsed.name.trim(),
						fields,
						isDefault: parsed.isDefault,
					});
					toastManager.add({ title: 'Signature added', type: 'success' });
				}
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not save the signature. Please try again.'
					),
					title: 'Could not save signature',
					type: 'error',
				});
			}
		},
	});

	const formId = signature
		? `edit-signature-form-${signature._id}`
		: 'add-signature-form';

	return (
		<Sheet
			onOpenChange={(next) => {
				setOpen(next);
				if (next) {
					form.reset(initialValues, { keepDefaultValues: true });
				} else {
					form.reset();
				}
			}}
			open={open}
		>
			<SheetTrigger render={trigger} />
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0 sm:max-w-2xl"
				side="right"
			>
				<SheetHeader>
					<SheetTitle>
						{signature ? 'Edit signature' : 'Add signature'}
					</SheetTitle>
					<SheetDescription>
						Fill in your details — the preview updates as you type.
					</SheetDescription>
				</SheetHeader>

				{/* Pinned between the header and the scrolling form, so the preview
				    stays in view while you work through the fields. */}
				<form.Subscribe selector={(state) => state.values}>
					{(values) => {
						const html = renderSignaturePreview(toSignatureFields(values));
						return (
							<div className="flex shrink-0 flex-col gap-2 border-b px-6 pb-4">
								<div className="flex items-center justify-between gap-2">
									<span className="font-medium text-sm">Preview</span>
									<CopySignatureButton html={html} />
								</div>
								<SignaturePreview html={html} />
								<p className="text-muted-foreground text-xs">
									Paste straight into Gmail → Settings → Signature.
								</p>
							</div>
						);
					}}
				</form.Subscribe>

				<form
					className="flex min-h-0 min-w-0 flex-1 flex-col"
					id={formId}
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit().catch(() => {
							/* TanStack Form handles validation errors */
						});
					}}
				>
					{/* `mt-4` rather than padding: SheetPanel's own top padding is set by
					    a `:has()` variant that a plain utility cannot override. */}
					<SheetPanel className="mt-4 flex flex-col gap-4">
						<form.Field name="name">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Signature name</FieldLabel>
										<Input
											aria-invalid={invalid}
											id={field.name}
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="e.g. Sales — Jane"
											value={field.state.value}
										/>
										<FieldDescription>
											Only used to identify this signature in the portal.
										</FieldDescription>
										{invalid ? (
											<FieldError>
												{signatureFormFieldError(field.state.meta.errors)}
											</FieldError>
										) : null}
									</Field>
								);
							}}
						</form.Field>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							{TEXT_FIELDS.map((spec) => (
								<form.Field key={spec.name} name={spec.name}>
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field
												className={spec.half ? undefined : 'sm:col-span-2'}
												data-invalid={invalid}
											>
												<FieldLabel htmlFor={field.name}>
													{spec.label}
												</FieldLabel>
												<Input
													aria-invalid={invalid}
													id={field.name}
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder={spec.placeholder}
													value={field.state.value ?? ''}
												/>
												{spec.description ? (
													<FieldDescription>
														{spec.description}
													</FieldDescription>
												) : null}
												{invalid ? (
													<FieldError>
														{signatureFormFieldError(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
							))}
						</div>

						<form.Field name="disclaimer">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Disclaimer</FieldLabel>
									<Textarea
										className="min-h-[70px] resize-y"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Optional confidentiality notice"
										value={field.state.value ?? ''}
									/>
								</Field>
							)}
						</form.Field>

						<form.Field name="isDefault">
							{(field) => (
								<CheckboxCard
									checked={field.state.value}
									description="Applied automatically when composing a new email."
									onCheckedChange={(checked) => field.handleChange(checked)}
									title="Default signature"
								/>
							)}
						</form.Field>
					</SheetPanel>
				</form>
				<SheetFooter>
					<SheetClose render={<Button type="button" variant="outline" />}>
						Cancel
					</SheetClose>
					<Button
						disabled={
							!(
								form.state.isValid &&
								!form.state.isValidating &&
								!form.state.isSubmitting
							)
						}
						form={formId}
						type="submit"
						variant="outline"
					>
						<Check aria-hidden /> {signature ? 'Save changes' : 'Add signature'}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
