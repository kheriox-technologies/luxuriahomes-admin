'use client';

import { useForm, useStore } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import {
	Frame,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from '@workspace/ui/components/frame';
import { Input } from '@workspace/ui/components/input';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useAction, useMutation, useQuery } from 'convex/react';
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import PdfBlobPreview from '@/components/documents/pdf-blob-preview';
import PageHeading from '@/components/page-heading';
import {
	buildClientQuotationPdfBlob,
	type QuotationPdfInput,
} from '@/lib/client/pdf/client-quotation-pdf';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	applyMargin,
	COVER_DESCRIPTION_MAX_LENGTH,
	clientQuotationFormSchema,
	computeStageAmounts,
	emptyClientQuotationFormValues,
	formatIssueDate,
	PERCENT_EPSILON,
	parseMoney,
	QUOTATION_FOLDER_NAME,
	quotationFieldError,
	REQUIRED_PERCENT_TOTAL,
	round2,
	splitGst,
} from './client-quotation-form-shared';
import QuotationAddressField from './quotation-address-field';
import QuotationClientsField from './quotation-clients-field';
import QuotationInclusionsPicker from './quotation-inclusions-picker';
import QuotationPricingField from './quotation-pricing-field';
import QuotationStagePercentages, {
	type QuotationStageRow,
} from './quotation-stage-percentages';

const PREVIEW_DEBOUNCE_MS = 500;
const PDF_CONTENT_TYPE = 'application/pdf';
const LIST_HREF = '/client-quotations';

export default function ClientQuotationComposer() {
	const router = useRouter();

	const tree = useQuery(api.quoteCatalogue.tree.tree, {});
	const terms = useQuery(api.quoteTerms.get.get, {});
	const budgetTemplates = useQuery(api.budgetTemplates.list.list, {});
	const provisionalReference = useQuery(
		api.clientQuotations.nextReference.nextReference,
		{}
	);

	const reserveReference = useMutation(
		api.clientQuotations.reserveReference.reserveReference
	);
	const ensureFolder = useMutation(
		api.companyDocuments.ensureFolder.ensureFolder
	);
	const generateUploadUrl = useAction(
		api.companyDocuments.generateUploadUrl.generateUploadUrl
	);
	const createDocument = useMutation(api.companyDocuments.create.create);
	const createQuotation = useMutation(api.clientQuotations.create.create);

	// Stage percentages and item selection are seeded from the catalogue once it
	// loads, so they live outside the form — a three-level TanStack array field
	// would re-render (and re-render the preview) on every checkbox tick.
	const [percents, setPercents] = useState<Record<string, string>>({});
	const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
	const [seededKey, setSeededKey] = useState<string | null>(null);

	const [issuedAt] = useState(() => new Date());
	const [saving, setSaving] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [previewError, setPreviewError] = useState<string | null>(null);
	const [previewLoading, setPreviewLoading] = useState(false);

	const form = useForm({
		defaultValues: emptyClientQuotationFormValues,
		validators: { onChange: clientQuotationFormSchema as never },
	});
	const values = useStore(form.store, (state) => state.values);
	const fieldMeta = useStore(form.store, (state) => state.fieldMeta);
	const formIsValid = useStore(form.store, (state) => state.isValid);

	// Seed once per catalogue shape. Keying on the stage/item ids rather than the
	// object identity means an unrelated catalogue edit in another tab doesn't
	// wipe percentages the user has already adjusted.
	const treeKey = tree
		?.map(
			(node) =>
				`${node.stage._id}:${node.sections.map((s) => s.items.length).join(',')}`
		)
		.join('|');
	useEffect(() => {
		if (!tree || treeKey === undefined || seededKey === treeKey) {
			return;
		}
		setSeededKey(treeKey);
		setPercents(
			Object.fromEntries(
				tree.map((node) => [
					node.stage._id,
					node.stage.defaultPercent === undefined
						? ''
						: String(node.stage.defaultPercent),
				])
			)
		);
		setSelectedItems(
			new Set(
				tree.flatMap((node) =>
					node.sections.flatMap((section) =>
						section.items
							.filter((item) => item.isDefault)
							.map((item) => item._id as string)
					)
				)
			)
		);
	}, [tree, treeKey, seededKey]);

	const totalInclGst = parseMoney(values.totalInclGst);

	const stageRows: QuotationStageRow[] = useMemo(() => {
		if (!tree) {
			return [];
		}
		const parsed = tree.map((node) => Number(percents[node.stage._id] ?? '0'));
		const safe = parsed.map((percent) =>
			Number.isFinite(percent) ? percent : 0
		);
		const amounts = computeStageAmounts(totalInclGst, safe);
		return tree.map((node, index) => ({
			amount: amounts[index] ?? 0,
			name: node.stage.name,
			percent: percents[node.stage._id] ?? '',
			stageId: node.stage._id,
		}));
	}, [tree, percents, totalInclGst]);

	const percentTotal = round2(
		stageRows.reduce((sum, row) => {
			const parsed = Number(row.percent);
			return sum + (Number.isFinite(parsed) ? parsed : 0);
		}, 0)
	);
	const percentsValid =
		stageRows.length > 0 &&
		Math.abs(percentTotal - REQUIRED_PERCENT_TOTAL) <= PERCENT_EPSILON;

	const pdfInput: QuotationPdfInput | null = useMemo(() => {
		if (!(tree && terms)) {
			return null;
		}
		const { contractSumExclGst, gstAmount } = splitGst(totalInclGst);
		return {
			acknowledgementHtml: terms.settings.acknowledgementHtml,
			address: values.address,
			clients: values.clients,
			contractSumExclGst,
			description: values.description || undefined,
			disclaimerHtml: terms.settings.disclaimerHtml,
			gstAmount,
			issuedAtLabel: formatIssueDate(issuedAt),
			projectName: values.projectName || 'Untitled project',
			reference: provisionalReference?.reference ?? '',
			stages: tree.map((node, index) => ({
				amount: stageRows[index]?.amount ?? 0,
				name: node.stage.name,
				percent: Number(stageRows[index]?.percent ?? '0') || 0,
				scopeSummary: node.stage.scopeSummary,
				sections: node.sections
					.map((section) => ({
						name: section.section.name,
						items: section.items
							.filter((item) => selectedItems.has(item._id))
							.map((item) => ({
								name: item.name,
							})),
					}))
					.filter((section) => section.items.length > 0),
			})),
			termSections: terms.sections.map((section) => ({
				name: section.section.name,
				items: section.items.map((item) => item.text),
			})),
			totalInclGst,
			validityDays: Number(values.validityDays) || 0,
		};
	}, [
		tree,
		terms,
		values,
		issuedAt,
		provisionalReference,
		stageRows,
		selectedItems,
		totalInclGst,
	]);

	// Rebuild the preview (debounced) whenever the document's inputs change.
	useEffect(() => {
		if (!pdfInput) {
			return;
		}
		let cancelled = false;
		const handle = setTimeout(() => {
			setPreviewLoading(true);
			buildClientQuotationPdfBlob(pdfInput)
				.then((blob) => {
					if (cancelled) {
						return;
					}
					setPreviewUrl(URL.createObjectURL(blob));
					setPreviewError(null);
				})
				.catch((error: unknown) => {
					if (cancelled) {
						return;
					}
					setPreviewError(
						error instanceof Error ? error.message : 'Could not render preview.'
					);
				})
				.finally(() => {
					if (!cancelled) {
						setPreviewLoading(false);
					}
				});
		}, PREVIEW_DEBOUNCE_MS);
		return () => {
			cancelled = true;
			clearTimeout(handle);
		};
	}, [pdfInput]);

	// Revoke the previous blob URL when it is replaced or on unmount.
	useEffect(() => {
		if (!previewUrl) {
			return;
		}
		return () => URL.revokeObjectURL(previewUrl);
	}, [previewUrl]);

	const selectedItemCount = selectedItems.size;
	const canSave =
		formIsValid && percentsValid && selectedItemCount > 0 && !saving;

	const handleSave = async () => {
		const parsed = clientQuotationFormSchema.safeParse(values);
		if (!(canSave && parsed.success && pdfInput && tree && terms)) {
			return;
		}
		setSaving(true);
		try {
			// Reserve first so the number printed on the PDF is the number stored.
			const reserved = await reserveReference({});
			const folderPath = await ensureFolder({
				parentPath: '',
				segments: [QUOTATION_FOLDER_NAME],
			});

			const blob = await buildClientQuotationPdfBlob({
				...pdfInput,
				reference: reserved.reference,
			});
			const fileName = `${reserved.reference} - ${parsed.data.projectName}.pdf`;
			const generated = await generateUploadUrl({
				folderPath,
				fileName,
				contentType: PDF_CONTENT_TYPE,
			});
			const putResponse = await fetch(generated.uploadUrl, {
				method: 'PUT',
				body: blob,
				headers: { 'Content-Type': PDF_CONTENT_TYPE },
			});
			if (!putResponse.ok) {
				throw new Error('Upload failed. Please try again.');
			}
			const documentId = await createDocument({
				folderPath,
				kebabName: generated.kebabName,
				name: fileName,
				s3Key: generated.s3Key,
				size: blob.size,
				mimeType: PDF_CONTENT_TYPE,
			});

			const selectedTemplate = budgetTemplates?.find(
				(template) => template._id === parsed.data.budgetTemplateId
			);

			await createQuotation({
				reference: reserved.reference,
				referenceYear: reserved.year,
				referenceSeq: reserved.seq,
				projectName: parsed.data.projectName,
				description: parsed.data.description || undefined,
				clients: parsed.data.clients,
				address: parsed.data.address as {
					postcode: string;
					state: 'ACT' | 'NSW' | 'NT' | 'QLD' | 'SA' | 'TAS' | 'VIC' | 'WA';
					street: string;
					suburb: string;
				},
				issuedAt: issuedAt.getTime(),
				validityDays: Number(parsed.data.validityDays),
				budgetTemplateId: selectedTemplate?._id as
					| Id<'budgetTemplates'>
					| undefined,
				budgetTemplateTitle: selectedTemplate?.title,
				budgetTemplateTotal: selectedTemplate?.totalPrice,
				marginPercent: parsed.data.marginPercent
					? Number(parsed.data.marginPercent)
					: undefined,
				totalInclGst,
				stages: tree.map((node, index) => ({
					stageId: node.stage._id,
					name: node.stage.name,
					order: index,
					percent: Number(stageRows[index]?.percent ?? '0') || 0,
					amount: stageRows[index]?.amount ?? 0,
					scopeSummary: node.stage.scopeSummary,
					sections: node.sections
						.map((section, sectionIndex) => ({
							sectionId: section.section._id,
							name: section.section.name,
							order: sectionIndex,
							items: section.items
								.filter((item) => selectedItems.has(item._id))
								.map((item, itemIndex) => ({
									itemId: item._id,
									name: item.name,
									order: itemIndex,
								})),
						}))
						.filter((section) => section.items.length > 0),
				})),
				terms: {
					disclaimerHtml: terms.settings.disclaimerHtml,
					acknowledgementHtml: terms.settings.acknowledgementHtml,
					sections: terms.sections.map((section, index) => ({
						name: section.section.name,
						order: index,
						items: section.items.map((item) => item.text),
					})),
				},
				documentId,
				s3Key: generated.s3Key,
				fileName,
				folderPath,
			});

			toastManager.add({ title: 'Quotation saved', type: 'success' });
			router.push(LIST_HREF);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not save the quotation. Please try again in a moment.'
				),
				title: 'Could not save quotation',
				type: 'error',
			});
			setSaving(false);
		}
	};

	const projectNameError = quotationFieldError(
		fieldMeta.projectName?.isTouched ? fieldMeta.projectName.errors : undefined
	);
	const descriptionError = quotationFieldError(
		fieldMeta.description?.isTouched ? fieldMeta.description.errors : undefined
	);
	const validityError = quotationFieldError(
		fieldMeta.validityDays?.isTouched
			? fieldMeta.validityDays.errors
			: undefined
	);

	const applyTemplatePrice = (templateId: string, margin: string) => {
		const template = budgetTemplates?.find((item) => item._id === templateId);
		if (!template) {
			return;
		}
		const marginValue = margin === '' ? 0 : Number(margin);
		form.setFieldValue(
			'totalInclGst',
			String(applyMargin(template.totalPrice, marginValue || 0))
		);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<PageHeading
				backLink={LIST_HREF}
				heading="Add Quotation"
				rightSlot={
					<Button
						disabled={!canSave}
						loading={saving}
						onClick={() => {
							handleSave().catch(() => {
								/* handled in handleSave */
							});
						}}
						type="button"
						variant="outline"
					>
						<Save aria-hidden /> Save quotation
					</Button>
				}
			/>

			<div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-2">
				<ScrollArea className="min-h-0">
					<div className="flex flex-col gap-5 pe-3 pb-4">
						<Frame>
							<FrameHeader>
								<FrameTitle>Project</FrameTitle>
							</FrameHeader>
							<FramePanel className="flex flex-col gap-4">
								<Field data-invalid={Boolean(projectNameError)}>
									<FieldLabel htmlFor="quotation-project-name">
										Project name
									</FieldLabel>
									<Input
										aria-invalid={Boolean(projectNameError)}
										id="quotation-project-name"
										nativeInput
										onBlur={() =>
											form.setFieldMeta('projectName', (meta) => ({
												...meta,
												isTouched: true,
											}))
										}
										onChange={(event) =>
											form.setFieldValue('projectName', event.target.value)
										}
										placeholder="e.g. A residence at Hamilton Hill"
										value={values.projectName}
									/>
									{projectNameError ? (
										<FieldError>{projectNameError}</FieldError>
									) : null}
								</Field>

								<Field data-invalid={Boolean(descriptionError)}>
									<FieldLabel htmlFor="quotation-description">
										Description
									</FieldLabel>
									<Textarea
										aria-invalid={Boolean(descriptionError)}
										id="quotation-description"
										maxLength={COVER_DESCRIPTION_MAX_LENGTH}
										onBlur={() =>
											form.setFieldMeta('description', (meta) => ({
												...meta,
												isTouched: true,
											}))
										}
										onChange={(event) =>
											form.setFieldValue('description', event.target.value)
										}
										placeholder="Prepared for the construction of a new two-storey custom residence…"
										rows={3}
										value={values.description}
									/>
									{descriptionError ? (
										<FieldError>{descriptionError}</FieldError>
									) : null}
								</Field>
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader>
								<FrameTitle>Clients</FrameTitle>
							</FrameHeader>
							<FramePanel>
								<QuotationClientsField
									onChange={(next) => form.setFieldValue('clients', next)}
									value={values.clients}
								/>
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader>
								<FrameTitle>Project address</FrameTitle>
							</FrameHeader>
							<FramePanel>
								<QuotationAddressField
									onChange={(next) => form.setFieldValue('address', next)}
									value={values.address}
								/>
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader>
								<FrameTitle>Quote reference</FrameTitle>
							</FrameHeader>
							<FramePanel className="flex flex-col gap-4">
								<div className="grid gap-4 sm:grid-cols-2">
									<Field>
										<FieldLabel htmlFor="quotation-reference">
											Reference
										</FieldLabel>
										<Input
											disabled
											id="quotation-reference"
											nativeInput
											readOnly
											value={provisionalReference?.reference ?? '—'}
										/>
									</Field>
									<Field data-invalid={Boolean(validityError)}>
										<FieldLabel htmlFor="quotation-validity">
											Valid for (days)
										</FieldLabel>
										<Input
											aria-invalid={Boolean(validityError)}
											id="quotation-validity"
											inputMode="numeric"
											nativeInput
											onBlur={() =>
												form.setFieldMeta('validityDays', (meta) => ({
													...meta,
													isTouched: true,
												}))
											}
											onChange={(event) =>
												form.setFieldValue('validityDays', event.target.value)
											}
											value={values.validityDays}
										/>
										{validityError ? (
											<FieldError>{validityError}</FieldError>
										) : null}
									</Field>
								</div>
								<p className="text-muted-foreground text-sm">
									Issued {formatIssueDate(issuedAt)}. The reference is assigned
									when you save.
								</p>
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader>
								<FrameTitle>Price</FrameTitle>
							</FrameHeader>
							<FramePanel>
								<QuotationPricingField
									budgetTemplateId={values.budgetTemplateId}
									budgetTemplates={budgetTemplates}
									marginPercent={values.marginPercent}
									onBudgetTemplateChange={(templateId) => {
										form.setFieldValue('budgetTemplateId', templateId);
										applyTemplatePrice(templateId, values.marginPercent);
									}}
									onMarginChange={(margin) => {
										form.setFieldValue('marginPercent', margin);
										applyTemplatePrice(values.budgetTemplateId, margin);
									}}
									onTotalChange={(total) =>
										form.setFieldValue('totalInclGst', total)
									}
									totalInclGst={values.totalInclGst}
								/>
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader>
								<FrameTitle>Progress payments</FrameTitle>
							</FrameHeader>
							<FramePanel>
								<QuotationStagePercentages
									onPercentChange={(stageId, percent) =>
										setPercents((current) => ({
											...current,
											[stageId]: percent,
										}))
									}
									percentTotal={percentTotal}
									rows={stageRows}
									valid={percentsValid}
								/>
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader>
								<FrameTitle>What each stage includes</FrameTitle>
							</FrameHeader>
							<FramePanel>
								<QuotationInclusionsPicker
									onChange={setSelectedItems}
									selected={selectedItems}
									tree={tree}
								/>
								{selectedItemCount === 0 ? (
									<p className="mt-3 text-destructive text-sm">
										Select at least one item to include in the quotation.
									</p>
								) : null}
							</FramePanel>
						</Frame>
					</div>
				</ScrollArea>

				<PdfBlobPreview
					error={previewError}
					loading={previewLoading}
					url={previewUrl}
				/>
			</div>
		</div>
	);
}
