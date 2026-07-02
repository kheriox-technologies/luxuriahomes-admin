'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardPanel } from '@workspace/ui/components/card';
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from '@workspace/ui/components/field';
import {
	Frame,
	FrameDescription,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from '@workspace/ui/components/frame';
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
import { useAction, useMutation, useQuery } from 'convex/react';
import { Plus, X } from 'lucide-react';
import { type ReactElement, useState } from 'react';
import { signCdnUrl } from '@/actions/cdn';
import {
	addInclusionVariantFormSchema,
	type InclusionVariantClass,
	inclusionFormFieldError,
	inclusionVariantClasses,
	normalizeOptionalText,
	parseMoneyString,
} from '@/components/inclusions/inclusion-form-shared';
import MaterialColorCombobox from '@/components/inclusions/material-color-combobox';
import VendorCombobox from '@/components/inclusions/vendor-combobox';
import { getConvexErrorMessage } from '@/lib/convex-errors';

function toDefaultValues(variant: Doc<'inclusionVariants'>) {
	return {
		class: variant.class as InclusionVariantClass,
		vendor: variant.vendor,
		newVendorName: '',
		models: variant.models,
		color: variant.color ?? '',
		newColorName: '',
		costPrice: String(variant.costPrice),
		salePrice: String(variant.salePrice),
		labourPrice:
			variant.labourPrice !== undefined ? String(variant.labourPrice) : '',
		details: variant.details ?? '',
		link: variant.link ?? '',
		image: variant.image ?? '',
	};
}

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

export default function EditInclusionVariant({
	variant,
	trigger,
	open: openProp,
	onOpenChange: onOpenChangeProp,
}: {
	variant: Doc<'inclusionVariants'>;
	trigger?: ReactElement;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const formId = `edit-inclusion-variant-form-${variant._id}`;
	const [openInternal, setOpenInternal] = useState(false);
	const open = openProp ?? openInternal;
	const setOpen = (nextOpen: boolean) => {
		if (openProp === undefined) {
			setOpenInternal(nextOpen);
		}
		onOpenChangeProp?.(nextOpen);
	};
	const [uploadFieldKey, setUploadFieldKey] = useState(0);
	const [modelDraft, setModelDraft] = useState('');
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	const [previewUrl, setPreviewUrl] = useState('');

	const updateVariant = useMutation(api.inclusionVariants.update.update);
	const addVendor = useMutation(api.vendors.add.add);
	const addMaterialColor = useMutation(api.materialColors.add.add);
	const vendors = useQuery(api.vendors.list.list, {});
	const materialColors = useQuery(api.materialColors.list.list, {});
	const generateS3UploadUrl = useAction(
		api.fileStorage.generateS3UploadUrl.generateS3UploadUrl
	);

	const form = useForm({
		defaultValues: toDefaultValues(variant),
		validators: {
			onMount: addInclusionVariantFormSchema as never,
			onChange: addInclusionVariantFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = addInclusionVariantFormSchema.parse(value);

				const newVendorTrimmed = normalizeOptionalText(parsed.newVendorName);
				const resolvedVendor = newVendorTrimmed ?? parsed.vendor.trim();
				if (newVendorTrimmed) {
					await addVendor({ name: newVendorTrimmed });
				}

				const newColorTrimmed = normalizeOptionalText(parsed.newColorName);
				const resolvedColor =
					newColorTrimmed ?? normalizeOptionalText(parsed.color);
				if (newColorTrimmed) {
					await addMaterialColor({ name: newColorTrimmed });
				}

				const labourPriceStr = parsed.labourPrice?.trim();
				await updateVariant({
					variantId: variant._id,
					class: parsed.class,
					costPrice: parseMoneyString(parsed.costPrice),
					salePrice: parseMoneyString(parsed.salePrice),
					labourPrice: labourPriceStr ? parseMoneyString(labourPriceStr) : null,
					vendor: resolvedVendor,
					models: parsed.models,
					color: resolvedColor ?? null,
					details: normalizeOptionalText(parsed.details) ?? null,
					link: normalizeOptionalText(parsed.link) ?? null,
					image: normalizeOptionalText(parsed.image) ?? null,
				});
				toastManager.add({
					title: 'Variant updated',
					type: 'success',
				});
				setPreviewUrl('');
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update variant. Please try again in a moment.'
					),
					title: 'Could not update variant',
					type: 'error',
				});
			}
		},
	});

	const removeVariantImage = () => {
		if (previewUrl.startsWith('blob:')) {
			URL.revokeObjectURL(previewUrl);
		}
		form.setFieldValue('image', '');
		setPreviewUrl('');
	};

	const uploadImage = async (file: File) => {
		setIsUploadingImage(true);
		const localPreview = URL.createObjectURL(file);
		setPreviewUrl(localPreview);
		try {
			const ext = file.name.split('.').pop() ?? 'jpg';
			const { uploadUrl, s3Key } = await generateS3UploadUrl({
				contentType: file.type || 'application/octet-stream',
				ext,
			});
			const response = await fetch(uploadUrl, {
				method: 'PUT',
				headers: { 'Content-Type': file.type || 'application/octet-stream' },
				body: file,
			});
			if (!response.ok) {
				throw new Error('Upload failed');
			}
			form.setFieldValue('image', s3Key);
			toastManager.add({ title: 'Image uploaded', type: 'success' });
		} catch (error) {
			URL.revokeObjectURL(localPreview);
			setPreviewUrl('');
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
					const defaults = toDefaultValues(variant);
					form.reset(defaults, { keepDefaultValues: true });
					setUploadFieldKey((key) => key + 1);
					setModelDraft('');
					setPreviewUrl('');
					if (variant.image) {
						signCdnUrl(variant.image)
							.then((url) => setPreviewUrl(url))
							.catch(() => {
								/* preview unavailable — image key still saved in form */
							});
					}
					Promise.resolve(form.validate('change')).catch(() => {
						/* validation errors are reflected in form state */
					});
				}
				if (!nextOpen) {
					if (previewUrl.startsWith('blob:')) {
						URL.revokeObjectURL(previewUrl);
					}
					setPreviewUrl('');
					setIsUploadingImage(false);
				}
			}}
			open={open}
		>
			{trigger && <SheetTrigger render={trigger} />}
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0"
				side="right"
			>
				<SheetHeader>
					<SheetTitle>Edit variant</SheetTitle>
				</SheetHeader>
				<form
					className="flex min-h-0 min-w-0 flex-1 flex-col"
					id={formId}
					onSubmit={(event) => {
						event.preventDefault();
						form.handleSubmit().catch(() => {
							/* TanStack Form handles validation */
						});
					}}
				>
					<SheetPanel className="flex flex-col gap-6">
						<Frame>
							<FrameHeader>
								<FrameTitle>Class and pricing</FrameTitle>
								<FrameDescription>
									Select class and update the prices in AUD.
								</FrameDescription>
							</FrameHeader>
							<FramePanel className="space-y-3">
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
																				<form.Field name="labourPrice">
																					{(field) => {
																						const invalid =
																							field.state.meta.isTouched &&
																							!field.state.meta.isValid;
																						return (
																							<Field data-invalid={invalid}>
																								<FieldLabel
																									htmlFor={field.name}
																								>
																									Labour price
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
																										value={
																											field.state.value ?? ''
																										}
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
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader>
								<FrameTitle>Variant details</FrameTitle>
							</FrameHeader>
							<FramePanel className="space-y-4">
								<form.Field name="vendor">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Vendor</FieldLabel>
												<VendorCombobox
													id={field.name}
													invalid={invalid || undefined}
													onBlur={field.handleBlur}
													onChange={(next) => {
														field.handleChange(next);
														if (next) {
															form.setFieldValue('newVendorName', '');
														}
													}}
													value={field.state.value}
													vendors={vendors}
												/>
												<form.Field name="newVendorName">
													{(newField) => (
														<Input
															nativeInput
															onChange={(e) => {
																newField.handleChange(e.target.value);
																if (e.target.value.trim()) {
																	field.handleChange('');
																}
															}}
															placeholder="Or type a new vendor name"
															value={newField.state.value ?? ''}
														/>
													)}
												</form.Field>
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
																size="lg"
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
											<MaterialColorCombobox
												colors={materialColors}
												id={field.name}
												onBlur={field.handleBlur}
												onChange={(next) => {
													field.handleChange(next);
													if (next) {
														form.setFieldValue('newColorName', '');
													}
												}}
												value={field.state.value ?? ''}
											/>
											<form.Field name="newColorName">
												{(newField) => (
													<Input
														nativeInput
														onChange={(e) => {
															newField.handleChange(e.target.value);
															if (e.target.value.trim()) {
																field.handleChange('');
															}
														}}
														placeholder="Or type a new color name"
														value={newField.state.value ?? ''}
													/>
												)}
											</form.Field>
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

								<SingleImageUpload
									description="Upload 1 image for this variant."
									disabled={form.state.isSubmitting}
									id="variant-image"
									imageUrl={previewUrl}
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
							</FramePanel>
						</Frame>
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
								form={formId}
								loading={isSubmitting}
								type="submit"
								variant="default"
							>
								Save changes
							</Button>
						)}
					</form.Subscribe>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
