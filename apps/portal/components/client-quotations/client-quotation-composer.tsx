'use client';

import { useForm, useStore } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { generateQuotationReference } from '@workspace/backend/quotationReference';
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
import { FileText, Plus, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
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
	emptyQuotationClient,
	formatIssueDate,
	MAX_QUOTATION_CLIENTS,
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
import QuotationEntriesEditor from './quotation-entries-editor';
import QuotationInclusionsEditor from './quotation-inclusions-editor';
import QuotationPricingField from './quotation-pricing-field';
import QuotationResetButton from './quotation-reset-button';
import QuotationStagePercentages, {
	type QuotationStageRow,
} from './quotation-stage-percentages';
import QuotationTermsEditor from './quotation-terms-editor';
import { useQuotationDraft } from './use-quotation-draft';

// Long enough for the new tab to fetch the blob before the URL is released.
const PREVIEW_URL_TTL_MS = 60_000;
const PDF_CONTENT_TYPE = 'application/pdf';
const LIST_HREF = '/client-quotations';

export default function ClientQuotationComposer() {
	const router = useRouter();

	const tree = useQuery(api.quoteCatalogue.tree.tree, {});
	const terms = useQuery(api.quoteTerms.get.get, {});
	const catalogueExclusions = useQuery(api.quoteExclusions.list.list, {});
	const catalogueNotes = useQuery(api.quoteNotes.list.list, {});
	const budgetTemplates = useQuery(api.budgetTemplates.list.list, {});

	// References are opaque codes rather than a running number, so there is
	// nothing to look up — generate the candidate here so the form and any
	// preview show the real code, and confirm it against the index on save.
	const [candidateReference] = useState(generateQuotationReference);

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

	// Stage percentages and the editable body of the quotation are seeded from the
	// catalogue once it loads, so they live outside the form — a three-level
	// TanStack array field would re-render the whole page on every keystroke.
	const [percents, setPercents] = useState<Record<string, string>>({});
	const [seededKey, setSeededKey] = useState<string | null>(null);
	const draft = useQuotationDraft({
		exclusions: catalogueExclusions,
		notes: catalogueNotes,
		terms,
		tree,
	});

	const [issuedAt] = useState(() => new Date());
	const [saving, setSaving] = useState(false);
	const [previewing, setPreviewing] = useState(false);

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

	// The draft seeds from the same tree, but look rows up by stage id rather than
	// position so the two can never silently drift apart.
	const stageRowById = useMemo(
		() => new Map(stageRows.map((row) => [row.stageId, row])),
		[stageRows]
	);

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
			exclusions: draft.exclusions.map((entry) => entry.text),
			gstAmount,
			issuedAtLabel: formatIssueDate(issuedAt),
			notes: draft.notes.map((entry) => entry.text),
			projectName: values.projectName || 'Untitled project',
			reference: candidateReference,
			stages: draft.stages.map((stage) => ({
				amount: stageRowById.get(stage.stageId)?.amount ?? 0,
				name: stage.name,
				percent: Number(stageRowById.get(stage.stageId)?.percent ?? '0') || 0,
				scopeSummary: stage.scopeSummary,
				sections: stage.sections
					.filter((section) => section.items.length > 0)
					.map((section) => ({
						name: section.name,
						items: section.items.map((item) => ({ name: item.name })),
					})),
			})),
			termSections: draft.termSections.map((section) => ({
				name: section.name,
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
		candidateReference,
		stageRowById,
		draft.exclusions,
		draft.notes,
		draft.stages,
		draft.termSections,
		totalInclGst,
	]);

	const canSave =
		formIsValid && percentsValid && draft.itemCount > 0 && !saving;

	const handlePreview = async () => {
		if (!pdfInput) {
			return;
		}
		// Open the tab synchronously — popup blockers reject a `window.open` that
		// happens after an await, however short the render takes.
		const tab = window.open('', '_blank');
		setPreviewing(true);
		try {
			const blob = await buildClientQuotationPdfBlob(pdfInput);
			const url = URL.createObjectURL(blob);
			if (tab) {
				tab.location.href = url;
			} else {
				window.open(url, '_blank', 'noopener');
			}
			// The tab holds its own reference to the blob, so the object URL can be
			// released once it has had a chance to load.
			setTimeout(() => URL.revokeObjectURL(url), PREVIEW_URL_TTL_MS);
		} catch (error) {
			tab?.close();
			toastManager.add({
				description:
					error instanceof Error
						? error.message
						: 'Could not render the preview. Please try again in a moment.',
				title: 'Could not open preview',
				type: 'error',
			});
		} finally {
			setPreviewing(false);
		}
	};

	const handleSave = async () => {
		const parsed = clientQuotationFormSchema.safeParse(values);
		if (!(canSave && parsed.success && pdfInput && tree && terms)) {
			return;
		}
		setSaving(true);
		try {
			// Confirm the code first so the reference printed on the PDF is the one
			// stored. Only a collision changes it, and the blob is built afterwards.
			const reserved = await reserveReference({
				preferred: candidateReference,
			});
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
				stages: draft.stages.map((stage, index) => ({
					stageId: stage.stageId,
					name: stage.name,
					order: index,
					percent: Number(stageRowById.get(stage.stageId)?.percent ?? '0') || 0,
					amount: stageRowById.get(stage.stageId)?.amount ?? 0,
					scopeSummary: stage.scopeSummary,
					sections: stage.sections
						.filter((section) => section.items.length > 0)
						.map((section, sectionIndex) => ({
							// Provenance where the row came from the catalogue; absent for
							// sections and items added on this quotation.
							sectionId: section.sectionId,
							name: section.name,
							order: sectionIndex,
							items: section.items.map((item, itemIndex) => ({
								itemId: item.itemId,
								name: item.name,
								order: itemIndex,
							})),
						})),
				})),
				terms: {
					disclaimerHtml: terms.settings.disclaimerHtml,
					acknowledgementHtml: terms.settings.acknowledgementHtml,
					sections: draft.termSections.map((section, index) => ({
						name: section.name,
						order: index,
						items: section.items.map((item) => item.text),
					})),
				},
				exclusions: draft.exclusions.map((entry, index) => ({
					text: entry.text,
					order: index,
				})),
				notes: draft.notes.map((entry, index) => ({
					text: entry.text,
					order: index,
				})),
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
					<div className="flex items-center gap-2">
						<Button
							disabled={!pdfInput || previewing}
							loading={previewing}
							onClick={() => {
								handlePreview().catch(() => {
									/* handled in handlePreview */
								});
							}}
							type="button"
							variant="outline"
						>
							<FileText aria-hidden /> Preview
						</Button>
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
							<Save aria-hidden /> Save
						</Button>
					</div>
				}
			/>

			<div className="flex min-h-0 flex-1 flex-col">
				<ScrollArea className="min-h-0">
					<div className="flex w-full flex-col gap-5 pe-3 pb-4">
						<div className="grid items-stretch gap-5 lg:grid-cols-2">
							<Frame className="h-full">
								<FrameHeader>
									<FrameTitle>Project</FrameTitle>
								</FrameHeader>
								<FramePanel className="flex flex-1 flex-col gap-4">
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

							<Frame className="h-full">
								<FrameHeader>
									<FrameTitle>Project address</FrameTitle>
								</FrameHeader>
								<FramePanel className="flex-1">
									<QuotationAddressField
										onChange={(next) => form.setFieldValue('address', next)}
										value={values.address}
									/>
								</FramePanel>
							</Frame>
						</div>

						<Frame>
							<FrameHeader className="flex-row items-center justify-between">
								<FrameTitle>Clients</FrameTitle>
								{values.clients.length < MAX_QUOTATION_CLIENTS ? (
									<Button
										onClick={() =>
											form.setFieldValue('clients', [
												...values.clients,
												{ ...emptyQuotationClient },
											])
										}
										size="sm"
										type="button"
										variant="outline"
									>
										<Plus aria-hidden /> Add client
									</Button>
								) : null}
							</FrameHeader>
							<FramePanel>
								<QuotationClientsField
									onChange={(next) => form.setFieldValue('clients', next)}
									value={values.clients}
								/>
							</FramePanel>
						</Frame>

						<div className="grid items-stretch gap-5 lg:grid-cols-2">
							<Frame className="h-full">
								<FrameHeader>
									<FrameTitle>Quote reference</FrameTitle>
								</FrameHeader>
								<FramePanel className="flex flex-1 flex-col gap-4">
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
												value={candidateReference}
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
									<p className="mt-auto text-muted-foreground text-sm">
										Issued {formatIssueDate(issuedAt)}. The reference is
										confirmed when you save.
									</p>
								</FramePanel>
							</Frame>

							<Frame className="h-full">
								<FrameHeader>
									<FrameTitle>Price</FrameTitle>
								</FrameHeader>
								<FramePanel className="flex-1">
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
						</div>

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
							<FrameHeader className="flex-row items-center justify-between">
								<FrameTitle>What each stage includes</FrameTitle>
								<QuotationResetButton
									label="the inclusions"
									onReset={draft.resetStages}
								/>
							</FrameHeader>
							<FramePanel>
								{tree === undefined ? (
									<p className="text-muted-foreground text-sm">
										Loading quote items…
									</p>
								) : (
									<QuotationInclusionsEditor
										onAddItem={draft.addItem}
										onAddSection={draft.addSection}
										onRemoveItem={draft.removeItem}
										onRemoveSection={draft.removeSection}
										onRenameSection={draft.renameSection}
										onUpdateItem={draft.updateItem}
										percentOf={(stage) =>
											stageRowById.get(stage.stageId)?.percent ?? ''
										}
										stages={draft.stages}
									/>
								)}
								{tree !== undefined && draft.itemCount === 0 ? (
									<p className="mt-3 text-destructive text-sm">
										Add at least one item to include in the quotation.
									</p>
								) : null}
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader className="flex-row items-center justify-between">
								<FrameTitle>Terms &amp; conditions</FrameTitle>
								<QuotationResetButton
									label="the terms"
									onReset={draft.resetTermSections}
								/>
							</FrameHeader>
							<FramePanel>
								<QuotationTermsEditor
									loading={terms === undefined}
									onAddClause={draft.addTermItem}
									onAddSection={draft.addTermSection}
									onRemoveClause={draft.removeTermItem}
									onRemoveSection={draft.removeTermSection}
									onRenameSection={draft.renameTermSection}
									onUpdateClause={draft.updateTermItem}
									sections={draft.termSections}
								/>
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader className="flex-row items-center justify-between">
								<FrameTitle>Exclusions</FrameTitle>
								<QuotationResetButton
									label="the exclusions"
									onReset={draft.resetExclusions}
								/>
							</FrameHeader>
							<FramePanel>
								<QuotationEntriesEditor
									addPlaceholder="Add an exclusion and press Enter…"
									entries={draft.exclusions}
									loading={catalogueExclusions === undefined}
									noun="exclusion"
									onAdd={draft.exclusionHandlers.add}
									onRemove={draft.exclusionHandlers.remove}
									onUpdate={draft.exclusionHandlers.update}
								/>
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader className="flex-row items-center justify-between">
								<FrameTitle>Important notes</FrameTitle>
								<QuotationResetButton
									label="the notes"
									onReset={draft.resetNotes}
								/>
							</FrameHeader>
							<FramePanel>
								<QuotationEntriesEditor
									addPlaceholder="Add a note and press Enter…"
									entries={draft.notes}
									loading={catalogueNotes === undefined}
									noun="note"
									onAdd={draft.noteHandlers.add}
									onRemove={draft.noteHandlers.remove}
									onUpdate={draft.noteHandlers.update}
								/>
							</FramePanel>
						</Frame>
					</div>
				</ScrollArea>
			</div>
		</div>
	);
}
