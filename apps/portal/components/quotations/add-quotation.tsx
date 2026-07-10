'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import {
	Frame,
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
import { SingleFileUpload } from '@workspace/ui/components/single-file-upload';
import { toastManager } from '@workspace/ui/components/toast';
import { useAction, useMutation } from 'convex/react';
import { Check, Plus } from 'lucide-react';
import { type ReactElement, useState } from 'react';
import ServiceProviderSelect from '@/components/service-providers/service-provider-select';
import TradeSelect from '@/components/trades/trade-select';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyQuotationFormValues,
	formatFieldErrors,
	parseMoneyString,
	type QuotationFormValues,
	quotationFormSchema,
	quotationStatusValues,
} from './quotation-form-shared';

const FORM_ID = 'add-quotation-form';

export default function AddQuotation({
	projectId,
	defaultStatus,
	open: openProp,
	onOpenChange: onOpenChangeProp,
	trigger,
}: {
	projectId: Id<'projects'>;
	defaultStatus?: QuotationFormValues['status'];
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	trigger?: ReactElement;
}) {
	const [openInternal, setOpenInternal] = useState(false);
	const isControlled = openProp !== undefined;
	const open = isControlled ? (openProp ?? false) : openInternal;
	const setOpen = (next: boolean) => {
		if (isControlled) {
			onOpenChangeProp?.(next);
		} else {
			setOpenInternal(next);
		}
	};

	const [isUploadingDoc, setIsUploadingDoc] = useState(false);
	const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
	const [selectedTradeId, setSelectedTradeId] = useState<string>('');

	const addQuotation = useMutation(api.projectQuotations.add.add);
	const generateUploadUrl = useAction(
		api.projectQuotations.generateUploadUrl.generateUploadUrl
	);

	const defaultValues: QuotationFormValues = {
		...emptyQuotationFormValues,
		status: defaultStatus ?? 'Under Review',
	};

	const form = useForm({
		defaultValues,
		validators: { onChange: quotationFormSchema as never },
		onSubmit: async ({ value }) => {
			const parsed = quotationFormSchema.parse(value);
			try {
				await addQuotation({
					projectId,
					title: parsed.title,
					tradeId: parsed.tradeId as Id<'trades'>,
					serviceProviderId: parsed.serviceProviderId as Id<'serviceProviders'>,
					s3Key: parsed.s3Key,
					price: parseMoneyString(parsed.price),
					status: parsed.status,
				});
				toastManager.add({ title: 'Quotation added', type: 'success' });
				resetAll();
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not add quotation. Please try again.'
					),
					title: 'Could not add quotation',
					type: 'error',
				});
			}
		},
	});

	const resetAll = () => {
		form.reset();
		setUploadedFileName(null);
		setSelectedTradeId('');
	};

	const handleFileChange = async (file: File | null) => {
		if (!file) {
			return;
		}
		setIsUploadingDoc(true);
		try {
			const ext = file.name.split('.').pop() ?? 'pdf';
			const { uploadUrl, s3Key } = await generateUploadUrl({
				projectId,
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
			form.setFieldValue('s3Key', s3Key);
			setUploadedFileName(file.name);
		} catch {
			toastManager.add({
				title: 'Upload failed. Please try again.',
				type: 'error',
			});
		} finally {
			setIsUploadingDoc(false);
		}
	};

	return (
		<Sheet
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) {
					resetAll();
				}
			}}
			open={open}
		>
			<SheetTrigger
				render={
					trigger ?? (
						<Button variant="outline">
							<Plus aria-hidden /> Add Quotation
						</Button>
					)
				}
			/>
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0"
				side="right"
			>
				<SheetHeader>
					<SheetTitle>Add Quotation</SheetTitle>
				</SheetHeader>
				<form
					className="flex min-h-0 min-w-0 flex-1 flex-col"
					id={FORM_ID}
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit().catch(() => {
							/* TanStack Form handles validation errors */
						});
					}}
				>
					<SheetPanel className="flex flex-col gap-6">
						<Frame>
							<FrameHeader className="flex flex-row items-center py-3">
								<FrameTitle className="min-w-0 truncate leading-none">
									Quotation details
								</FrameTitle>
							</FrameHeader>
							<FramePanel className="space-y-4">
								<form.Field name="title">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Title</FieldLabel>
												<Input
													aria-invalid={invalid || undefined}
													id={field.name}
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Quotation title"
													value={field.state.value}
												/>
												{invalid ? (
													<FieldError>
														{formatFieldErrors(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>

								<form.Field name="tradeId">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Trade</FieldLabel>
												<TradeSelect
													allowCreate
													id={field.name}
													invalid={invalid}
													onBlur={field.handleBlur}
													onValueChange={(next) => {
														field.handleChange(next);
														setSelectedTradeId(next);
														form.setFieldValue('serviceProviderId', '');
													}}
													value={field.state.value as Id<'trades'> | ''}
												/>
												{invalid ? (
													<FieldError>
														{formatFieldErrors(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>

								<form.Field name="serviceProviderId">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>
													Service Provider
												</FieldLabel>
												<ServiceProviderSelect
													allowCreate
													emptyMessage={
														selectedTradeId
															? 'No service providers for this trade.'
															: 'Select a trade to filter providers.'
													}
													filterTradeId={selectedTradeId as Id<'trades'> | ''}
													id={field.name}
													invalid={invalid}
													onBlur={field.handleBlur}
													onProviderTradesChange={(tradeIds) => {
														if (tradeIds.length === 0) {
															return;
														}
														const current = form.state.values.tradeId as
															| Id<'trades'>
															| '';
														if (current && tradeIds.includes(current)) {
															return;
														}
														const [first] = tradeIds;
														form.setFieldValue('tradeId', first);
														setSelectedTradeId(first);
													}}
													onValueChange={(next) =>
														field.handleChange(next ?? '')
													}
													placeholder={
														selectedTradeId
															? 'Select a service provider'
															: 'Select a trade first'
													}
													value={
														(field.state.value as Id<'serviceProviders'>) || ''
													}
												/>
												{invalid ? (
													<FieldError>
														{formatFieldErrors(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>

								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<form.Field name="price">
										{(field) => {
											const invalid =
												field.state.meta.isTouched && !field.state.meta.isValid;
											return (
												<Field data-invalid={invalid}>
													<FieldLabel htmlFor={field.name}>Price</FieldLabel>
													<InputGroup>
														<InputGroupAddon align="inline-start">
															<InputGroupText>$</InputGroupText>
														</InputGroupAddon>
														<InputGroupInput
															aria-invalid={invalid || undefined}
															id={field.name}
															inputMode="decimal"
															nativeInput
															onBlur={field.handleBlur}
															onChange={(e) =>
																field.handleChange(e.target.value)
															}
															placeholder="0.00"
															type="text"
															value={field.state.value}
														/>
														<InputGroupAddon align="inline-end">
															<InputGroupText>AUD</InputGroupText>
														</InputGroupAddon>
													</InputGroup>
													{invalid ? (
														<FieldError>
															{formatFieldErrors(field.state.meta.errors)}
														</FieldError>
													) : null}
												</Field>
											);
										}}
									</form.Field>

									<form.Field name="status">
										{(field) => {
											const items = [...quotationStatusValues];
											return (
												<Field>
													<FieldLabel htmlFor={field.name}>Status</FieldLabel>
													<Combobox<string>
														items={items}
														itemToStringLabel={(item) => item ?? ''}
														onValueChange={(next) =>
															field.handleChange(
																(next ??
																	'Under Review') as QuotationFormValues['status']
															)
														}
														value={field.state.value}
													>
														<ComboboxInput
															id={field.name}
															onBlur={field.handleBlur}
															placeholder="Select status"
														/>
														<ComboboxPopup>
															<ComboboxList>
																{(item: string) => (
																	<ComboboxItem key={item} value={item}>
																		{item}
																	</ComboboxItem>
																)}
															</ComboboxList>
														</ComboboxPopup>
													</Combobox>
												</Field>
											);
										}}
									</form.Field>
								</div>

								<SingleFileUpload
									description="PDF, Word, Excel or image files."
									disabled={form.state.isSubmitting}
									id="quotation-doc"
									label="Quotation Document"
									onClear={() => {
										form.setFieldValue('s3Key', undefined);
										setUploadedFileName(null);
									}}
									onFileSelected={(file) => {
										handleFileChange(file).catch(() => {
											/* Error handled in handleFileChange */
										});
									}}
									uploadedFileName={uploadedFileName ?? undefined}
									uploading={isUploadingDoc}
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
						selector={(state) => [state.canSubmit, state.isSubmitting] as const}
					>
						{([canSubmit, isSubmitting]) => (
							<Button
								disabled={isUploadingDoc || !canSubmit}
								form={FORM_ID}
								loading={isSubmitting}
								type="submit"
								variant="outline"
							>
								<Check aria-hidden /> Save
							</Button>
						)}
					</form.Subscribe>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
