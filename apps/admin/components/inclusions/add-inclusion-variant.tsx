'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Card,
	CardFrame,
	CardFrameDescription,
	CardFrameHeader,
	CardFrameTitle,
	CardPanel,
} from '@workspace/ui/components/card';
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { Radio, RadioGroup } from '@workspace/ui/components/radio-group';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetPanel,
	SheetTitle,
	SheetTrigger,
} from '@workspace/ui/components/sheet';
import { SingleImageUpload } from '@workspace/ui/components/single-image-upload';
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { Plus, X } from 'lucide-react';
import { type ReactElement, useState } from 'react';
import {
	addInclusionVariantFormSchema,
	emptyAddInclusionVariantFormValues,
	inclusionFormFieldError,
	inclusionVariantClasses,
	normalizeOptionalText,
	parseMoneyString,
} from '@/components/inclusions/inclusion-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';

const FORM_ID = 'add-inclusion-variant-form';

function variantClassBorderClass(
	variantClass: (typeof inclusionVariantClasses)[number]
) {
	if (variantClass === 'Standard') {
		return 'border-info/40 bg-info/8 dark:border-info/50 dark:bg-info/16';
	}
	if (variantClass === 'Gold') {
		return 'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/30';
	}
	if (variantClass === 'Platinum') {
		return 'border-violet-300 bg-violet-50 dark:border-violet-700 dark:bg-violet-950/30';
	}
	return 'border-input';
}

export default function AddInclusionVariant({
	inclusionId,
	trigger,
}: {
	inclusionId: Id<'inclusions'>;
	trigger?: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const [uploadFieldKey, setUploadFieldKey] = useState(0);
	const [modelDraft, setModelDraft] = useState('');
	const [isUploadingImage, setIsUploadingImage] = useState(false);

	const addVariant = useMutation(api.inclusionVariants.add.add);
	const generateUploadUrl = useMutation(
		api.fileStorage.generateUploadUrl.generateUploadUrl
	);
	const resolvePublicUrl = useMutation(
		api.fileStorage.resolvePublicUrl.resolvePublicUrl
	);
	const deleteStoredFile = useMutation(
		api.fileStorage.deleteStorage.deleteStorage
	);

	const form = useForm({
		defaultValues: emptyAddInclusionVariantFormValues,
		validators: {
			onMount: addInclusionVariantFormSchema as never,
			onChange: addInclusionVariantFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = addInclusionVariantFormSchema.parse(value);
				await addVariant({
					inclusionId,
					class: parsed.class,
					costPrice: parseMoneyString(parsed.costPrice),
					salePrice: parseMoneyString(parsed.salePrice),
					vendor: parsed.vendor.trim(),
					models: parsed.models,
					color: normalizeOptionalText(parsed.color),
					details: normalizeOptionalText(parsed.details),
					link: normalizeOptionalText(parsed.link),
					image: normalizeOptionalText(parsed.image),
					storageId: parsed.storageId
						? (parsed.storageId as Id<'_storage'>)
						: undefined,
				});
				toastManager.add({
					title: 'Variant added',
					type: 'success',
				});
				form.reset();
				setModelDraft('');
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not add variant. Please try again in a moment.'
					),
					title: 'Could not add variant',
					type: 'error',
				});
			}
		},
	});

	const removeVariantImage = async () => {
		const storageId = form.getFieldValue('storageId')?.trim();
		if (storageId) {
			try {
				await deleteStoredFile({
					storageId: storageId as Id<'_storage'>,
				});
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not delete the file from storage. Please try again.'
					),
					title: 'Could not delete image',
					type: 'error',
				});
				throw error;
			}
		}
		form.setFieldValue('image', '');
		form.setFieldValue('storageId', '');
	};

	const uploadImage = async (file: File) => {
		setIsUploadingImage(true);
		try {
			const uploadUrl = await generateUploadUrl({});
			const response = await fetch(uploadUrl, {
				method: 'POST',
				headers: {
					'Content-Type': file.type || 'application/octet-stream',
				},
				body: file,
			});
			if (!response.ok) {
				throw new Error('Upload failed');
			}
			const payload = (await response.json()) as { storageId?: string };
			if (!payload.storageId) {
				throw new Error('Upload response missing storageId');
			}
			const resolved = await resolvePublicUrl({
				storageId: payload.storageId as Id<'_storage'>,
			});
			form.setFieldValue('storageId', resolved.storageId);
			form.setFieldValue('image', resolved.url);
			toastManager.add({
				title: 'Image uploaded',
				type: 'success',
			});
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not upload image. Please try again.'
				),
				title: 'Image upload failed',
				type: 'error',
			});
		} finally {
			setIsUploadingImage(false);
		}
	};

	return (
		<Sheet
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (nextOpen) {
					setUploadFieldKey((key) => key + 1);
					Promise.resolve(form.validate('change')).catch(() => {
						/* validation errors are reflected in form state */
					});
				}
				if (!nextOpen) {
					form.reset();
					setModelDraft('');
					setIsUploadingImage(false);
				}
			}}
			open={open}
		>
			<SheetTrigger
				render={trigger ?? <Button variant="default">Add variant</Button>}
			/>
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0"
				side="right"
			>
				<SheetHeader>
					<SheetTitle>Add variant</SheetTitle>
				</SheetHeader>
				<form
					className="flex min-h-0 min-w-0 flex-1 flex-col"
					id={FORM_ID}
					onSubmit={(event) => {
						event.preventDefault();
						form.handleSubmit().catch(() => {
							/* TanStack Form handles validation */
						});
					}}
				>
					<SheetPanel className="flex flex-col gap-6">
						<CardFrame>
							<CardFrameHeader>
								<CardFrameTitle>Class and pricing</CardFrameTitle>
								<CardFrameDescription>
									Select class and enter the prices in AUD.
								</CardFrameDescription>
							</CardFrameHeader>
							<Card>
								<CardPanel className="space-y-3">
									<form.Field name="class">
										{(classField) => {
											const classInvalid =
												classField.state.meta.isTouched &&
												!classField.state.meta.isValid;
											return (
												<Field data-invalid={classInvalid}>
													<FieldLabel htmlFor={classField.name}>
														Variant class
													</FieldLabel>
													<RadioGroup
														className="grid grid-cols-1 gap-3"
														name={classField.name}
														onValueChange={(next) =>
															classField.handleChange(
																next as (typeof inclusionVariantClasses)[number]
															)
														}
														value={classField.state.value}
													>
														{inclusionVariantClasses.map((variantClass) => {
															const selected =
																classField.state.value === variantClass;
															return (
																/* biome-ignore lint(a11y/noNoninteractiveElementInteractions, a11y/useKeyWithClickEvents, a11y/useSemanticElements): Base UI Radio is not a labelable control; whole row selects class; outer <button> cannot wrap nested price inputs. */
																<div
																	className="block cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
																	key={variantClass}
																	onClick={() => {
																		classField.handleChange(variantClass);
																	}}
																	onKeyDown={(event) => {
																		if (
																			event.key === 'Enter' ||
																			event.key === ' '
																		) {
																			event.preventDefault();
																			classField.handleChange(variantClass);
																		}
																	}}
																	role="group"
																>
																	<Card
																		className={
																			selected
																				? variantClassBorderClass(variantClass)
																				: 'border-input'
																		}
																	>
																		<CardPanel className="space-y-3">
																			<div className="flex items-center gap-2">
																				<Radio
																					id={`variant-class-${variantClass}`}
																					value={variantClass}
																				/>
																				<span className="font-medium text-sm">
																					{variantClass}
																				</span>
																			</div>
																			{selected ? (
																				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
																					<form.Field name="costPrice">
																						{(field) => {
																							const invalid =
																								field.state.meta.isTouched &&
																								!field.state.meta.isValid;
																							return (
																								<Field data-invalid={invalid}>
																									<FieldLabel
																										htmlFor={field.name}
																									>
																										Cost price
																									</FieldLabel>
																									<InputGroup>
																										<InputGroupAddon align="inline-start">
																											<InputGroupText>
																												$
																											</InputGroupText>
																										</InputGroupAddon>
																										<InputGroupInput
																											aria-invalid={
																												invalid || undefined
																											}
																											id={field.name}
																											inputMode="decimal"
																											nativeInput
																											onBlur={field.handleBlur}
																											onChange={(e) =>
																												field.handleChange(
																													e.target.value
																												)
																											}
																											placeholder="0.00"
																											type="text"
																											value={field.state.value}
																										/>
																										<InputGroupAddon align="inline-end">
																											<InputGroupText>
																												AUD
																											</InputGroupText>
																										</InputGroupAddon>
																									</InputGroup>
																									{invalid ? (
																										<FieldError>
																											{inclusionFormFieldError(
																												field.state.meta.errors
																											)}
																										</FieldError>
																									) : null}
																								</Field>
																							);
																						}}
																					</form.Field>
																					<form.Field name="salePrice">
																						{(field) => {
																							const invalid =
																								field.state.meta.isTouched &&
																								!field.state.meta.isValid;
																							return (
																								<Field data-invalid={invalid}>
																									<FieldLabel
																										htmlFor={field.name}
																									>
																										Sale price
																									</FieldLabel>
																									<InputGroup>
																										<InputGroupAddon align="inline-start">
																											<InputGroupText>
																												$
																											</InputGroupText>
																										</InputGroupAddon>
																										<InputGroupInput
																											aria-invalid={
																												invalid || undefined
																											}
																											id={field.name}
																											inputMode="decimal"
																											nativeInput
																											onBlur={field.handleBlur}
																											onChange={(e) =>
																												field.handleChange(
																													e.target.value
																												)
																											}
																											placeholder="0.00"
																											type="text"
																											value={field.state.value}
																										/>
																										<InputGroupAddon align="inline-end">
																											<InputGroupText>
																												AUD
																											</InputGroupText>
																										</InputGroupAddon>
																									</InputGroup>
																									{invalid ? (
																										<FieldError>
																											{inclusionFormFieldError(
																												field.state.meta.errors
																											)}
																										</FieldError>
																									) : null}
																								</Field>
																							);
																						}}
																					</form.Field>
																				</div>
																			) : null}
																		</CardPanel>
																	</Card>
																</div>
															);
														})}
													</RadioGroup>
													{classInvalid ? (
														<FieldError>
															{inclusionFormFieldError(
																classField.state.meta.errors
															)}
														</FieldError>
													) : null}
												</Field>
											);
										}}
									</form.Field>
								</CardPanel>
							</Card>
						</CardFrame>

						<CardFrame>
							<CardFrameHeader>
								<CardFrameTitle>Variant details</CardFrameTitle>
							</CardFrameHeader>
							<Card>
								<CardPanel className="space-y-4">
									<form.Field name="vendor">
										{(field) => {
											const invalid =
												field.state.meta.isTouched && !field.state.meta.isValid;
											return (
												<Field data-invalid={invalid}>
													<FieldLabel htmlFor={field.name}>Vendor</FieldLabel>
													<Input
														aria-invalid={invalid || undefined}
														id={field.name}
														nativeInput
														onBlur={field.handleBlur}
														onChange={(e) => field.handleChange(e.target.value)}
														placeholder="Vendor name"
														value={field.state.value}
													/>
													{invalid ? (
														<FieldError>
															{inclusionFormFieldError(field.state.meta.errors)}
														</FieldError>
													) : null}
												</Field>
											);
										}}
									</form.Field>

									<form.Field name="models">
										{(field) => {
											const invalid =
												field.state.meta.isTouched && !field.state.meta.isValid;
											const addModel = () => {
												const normalized = modelDraft.trim();
												if (!normalized) {
													return;
												}
												if (field.state.value.includes(normalized)) {
													setModelDraft('');
													return;
												}
												field.handleChange([...field.state.value, normalized]);
												setModelDraft('');
											};
											return (
												<Field data-invalid={invalid}>
													<FieldLabel htmlFor="variant-models-input">
														Models
													</FieldLabel>
													<div className="flex w-full min-w-0 items-stretch gap-2">
														<Input
															className="min-w-0 flex-1"
															id="variant-models-input"
															nativeInput
															onChange={(e) => setModelDraft(e.target.value)}
															onKeyDown={(event) => {
																if (event.key !== 'Enter') {
																	return;
																}
																event.preventDefault();
																addModel();
															}}
															placeholder="Type a model, then Enter or tap add"
															value={modelDraft}
														/>
														<Button
															aria-label="Add model"
															onClick={addModel}
															size="icon"
															type="button"
															variant="outline"
														>
															<Plus />
														</Button>
													</div>
													{field.state.value.length > 0 ? (
														<div className="flex flex-wrap gap-2">
															{field.state.value.map((model) => (
																<Badge
																	key={model}
																	render={
																		<div className="flex items-center gap-1.5" />
																	}
																	variant="outline"
																>
																	{model}
																	<button
																		aria-label={`Remove ${model}`}
																		className="inline-flex"
																		onClick={(event) => {
																			event.preventDefault();
																			field.handleChange(
																				field.state.value.filter(
																					(current) => current !== model
																				)
																			);
																		}}
																		type="button"
																	>
																		<X className="size-3.5" />
																	</button>
																</Badge>
															))}
														</div>
													) : null}
													{invalid ? (
														<FieldError>
															{inclusionFormFieldError(field.state.meta.errors)}
														</FieldError>
													) : (
														<FieldDescription>
															Add one or more models for this variant.
														</FieldDescription>
													)}
												</Field>
											);
										}}
									</form.Field>

									<form.Field name="color">
										{(field) => (
											<Field>
												<FieldLabel htmlFor={field.name}>Color</FieldLabel>
												<Input
													id={field.name}
													nativeInput
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Color or finish"
													value={field.state.value ?? ''}
												/>
											</Field>
										)}
									</form.Field>

									<form.Field name="details">
										{(field) => (
											<Field>
												<FieldLabel htmlFor={field.name}>Details</FieldLabel>
												<Textarea
													id={field.name}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Additional details"
													value={field.state.value ?? ''}
												/>
											</Field>
										)}
									</form.Field>

									<form.Field name="link">
										{(field) => (
											<Field>
												<FieldLabel htmlFor={field.name}>Link</FieldLabel>
												<Input
													id={field.name}
													nativeInput
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="https://"
													type="url"
													value={field.state.value ?? ''}
												/>
											</Field>
										)}
									</form.Field>

									<form.Subscribe
										selector={(state) => ({
											imageUrl: state.values.image,
										})}
									>
										{({ imageUrl }) => (
											<SingleImageUpload
												description="Upload 1 image for this variant."
												disabled={form.state.isSubmitting}
												id="variant-image"
												imageUrl={imageUrl}
												key={uploadFieldKey}
												label="Image"
												onClear={() => removeVariantImage()}
												onFileSelected={(file) => {
													uploadImage(file).catch(() => {
														/* Error handled in uploadImage */
													});
												}}
												uploading={isUploadingImage}
											/>
										)}
									</form.Subscribe>
								</CardPanel>
							</Card>
						</CardFrame>
					</SheetPanel>
				</form>
				<SheetFooter>
					<SheetClose render={<Button type="button" variant="outline" />}>
						Cancel
					</SheetClose>
					<form.Subscribe
						selector={(state) => ({
							isValid: state.isValid,
							isValidating: state.isValidating,
							isSubmitting: state.isSubmitting,
						})}
					>
						{({ isValid, isValidating, isSubmitting }) => (
							<Button
								disabled={
									!(
										isValid &&
										!isValidating &&
										!isSubmitting &&
										!isUploadingImage
									)
								}
								form={FORM_ID}
								loading={isSubmitting}
								type="submit"
								variant="default"
							>
								Add variant
							</Button>
						)}
					</form.Subscribe>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
