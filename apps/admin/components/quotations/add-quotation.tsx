'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxEmpty,
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
import { useAction, useMutation, useQuery } from 'convex/react';
import { type ReactElement, useState } from 'react';
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
	defaultProjectId,
	defaultStatus,
	open: openProp,
	onOpenChange: onOpenChangeProp,
	trigger,
}: {
	defaultProjectId?: Id<'projects'>;
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

	const projects = useQuery(api.projects.list.list, {});
	const trades = useQuery(api.trades.list.list, {});
	const serviceProviders = useQuery(api.serviceProviders.list.list, {});

	const filteredServiceProviders = selectedTradeId
		? (serviceProviders ?? []).filter((sp) =>
				sp.tradeIds.includes(selectedTradeId as Id<'trades'>)
			)
		: (serviceProviders ?? []);

	const addQuotation = useMutation(api.quotations.add.add);
	const generateUploadUrl = useAction(
		api.quotations.generateUploadUrl.generateUploadUrl
	);

	const defaultValues: QuotationFormValues = {
		...emptyQuotationFormValues,
		projectId: defaultProjectId ?? '',
		status: defaultStatus ?? 'Under Review',
	};

	const form = useForm({
		defaultValues,
		validators: { onChange: quotationFormSchema as never },
		onSubmit: async ({ value }) => {
			const parsed = quotationFormSchema.parse(value);
			try {
				await addQuotation({
					projectId: parsed.projectId as Id<'projects'>,
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
		const projectId = form.getFieldValue('projectId');
		if (!projectId) {
			toastManager.add({
				title: 'Select a project first',
				type: 'error',
			});
			return;
		}
		setIsUploadingDoc(true);
		try {
			const ext = file.name.split('.').pop() ?? 'pdf';
			const { uploadUrl, s3Key } = await generateUploadUrl({
				projectId: projectId as Id<'projects'>,
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
				render={trigger ?? <Button variant="default">Add Quotation</Button>}
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
								<form.Field name="projectId">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										const items = (projects ?? []).map((p) => p._id);
										const labelById = new Map(
											(projects ?? []).map((p) => [p._id, p.name])
										);
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Project</FieldLabel>
												<Combobox<Id<'projects'>>
													disabled={!!defaultProjectId}
													items={items}
													itemToStringLabel={(item) =>
														labelById.get(item) ?? ''
													}
													onValueChange={(next) =>
														field.handleChange(next ?? '')
													}
													value={
														field.state.value
															? (field.state.value as Id<'projects'>)
															: null
													}
												>
													<ComboboxInput
														aria-invalid={invalid}
														id={field.name}
														onBlur={field.handleBlur}
														placeholder="Select a project"
													/>
													<ComboboxPopup>
														<ComboboxEmpty>No projects found.</ComboboxEmpty>
														<ComboboxList>
															{(item: Id<'projects'>) => (
																<ComboboxItem key={item} value={item}>
																	{labelById.get(item) ?? item}
																</ComboboxItem>
															)}
														</ComboboxList>
													</ComboboxPopup>
												</Combobox>
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
										const items = (trades ?? []).map((t) => t._id);
										const labelById = new Map(
											(trades ?? []).map((t) => [t._id, t.name])
										);
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Trade</FieldLabel>
												<Combobox<Id<'trades'>>
													items={items}
													itemToStringLabel={(item) =>
														labelById.get(item) ?? ''
													}
													onValueChange={(next) => {
														field.handleChange(next ?? '');
														setSelectedTradeId(next ?? '');
														form.setFieldValue('serviceProviderId', '');
													}}
													value={
														field.state.value
															? (field.state.value as Id<'trades'>)
															: null
													}
												>
													<ComboboxInput
														aria-invalid={invalid}
														id={field.name}
														onBlur={field.handleBlur}
														placeholder="Select a trade"
													/>
													<ComboboxPopup>
														<ComboboxEmpty>No trades found.</ComboboxEmpty>
														<ComboboxList>
															{(item: Id<'trades'>) => (
																<ComboboxItem key={item} value={item}>
																	{labelById.get(item) ?? item}
																</ComboboxItem>
															)}
														</ComboboxList>
													</ComboboxPopup>
												</Combobox>
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
										const items = filteredServiceProviders.map((sp) => sp._id);
										const labelById = new Map(
											filteredServiceProviders.map((sp) => [sp._id, sp.company])
										);
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>
													Service Provider
												</FieldLabel>
												<Combobox<Id<'serviceProviders'>>
													items={items}
													itemToStringLabel={(item) =>
														labelById.get(item) ?? ''
													}
													onValueChange={(next) =>
														field.handleChange(next ?? '')
													}
													value={
														field.state.value
															? (field.state.value as Id<'serviceProviders'>)
															: null
													}
												>
													<ComboboxInput
														aria-invalid={invalid}
														id={field.name}
														onBlur={field.handleBlur}
														placeholder={
															selectedTradeId
																? 'Select a service provider'
																: 'Select a trade first'
														}
													/>
													<ComboboxPopup>
														<ComboboxEmpty>
															{selectedTradeId
																? 'No service providers for this trade.'
																: 'Select a trade to filter providers.'}
														</ComboboxEmpty>
														<ComboboxList>
															{(item: Id<'serviceProviders'>) => (
																<ComboboxItem key={item} value={item}>
																	{labelById.get(item) ?? item}
																</ComboboxItem>
															)}
														</ComboboxList>
													</ComboboxPopup>
												</Combobox>
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
								variant="default"
							>
								Save
							</Button>
						)}
					</form.Subscribe>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
