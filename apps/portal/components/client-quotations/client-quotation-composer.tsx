'use client';

import { useUser } from '@clerk/nextjs';
import { useForm, useStore } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { generateQuotationReference } from '@workspace/backend/quotationReference';
import { Badge } from '@workspace/ui/components/badge';
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import PageHeading from '@/components/page-heading';
import {
	buildClientQuotationPdfBlob,
	type QuotationPdfInput,
	type QuotationPdfVersion,
} from '@/lib/client/pdf/client-quotation-pdf';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { formatAudWhole } from '@/lib/currency';
import {
	applyMargin,
	COVER_DESCRIPTION_MAX_LENGTH,
	clientQuotationFormSchema,
	computeStageAmounts,
	emptyClientQuotationFormValues,
	emptyQuotationClient,
	formatIssueDate,
	formValuesFromQuotation,
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
import QuotationVersionDialog from './quotation-version-dialog';
import { useQuotationDraft } from './use-quotation-draft';

// Long enough for the new tab to fetch the blob before the URL is released.
const PREVIEW_URL_TTL_MS = 60_000;
const PDF_CONTENT_TYPE = 'application/pdf';
const LIST_HREF = '/quotations';
const FIRST_VERSION = 1;

function editHeading(
	editing: boolean,
	amending: boolean,
	version: number
): string {
	if (!editing) {
		return 'Add Quotation';
	}
	return amending ? `Edit Version ${version}` : 'Edit Quotation';
}

/** Sits under the heading: when this was issued, and what saving will do. */
function issuedNote(
	editing: boolean,
	amending: boolean,
	issuedAt: Date,
	version: number
): string {
	const issued = `Issued ${formatIssueDate(issuedAt)}.`;
	if (!editing) {
		return `${issued} The reference is confirmed when you save.`;
	}
	const versioning = amending
		? `Saving rewrites version ${version}`
		: `Saving issues version ${version}`;
	return `${issued} ${versioning} under the same reference.`;
}

function saveLabel(
	editing: boolean,
	amending: boolean,
	version: number
): string {
	if (!editing) {
		return 'Save';
	}
	return amending ? `Update version ${version}` : 'Save version';
}

/**
 * Composes a client quotation — a new one, or the next version of an issued one
 * when `quotationId` is given.
 *
 * Editing keeps the quote reference and the original issue date: a revision is
 * the same quotation, described by its version. Its body seeds from what was
 * issued rather than from the catalogue (see `useQuotationDraft`), and saving
 * uploads a fresh PDF so every version stays viewable.
 *
 * `editVersion` comes from a row in the version history and asks for that
 * version to be rewritten in place instead — see `amending` below.
 */
export default function ClientQuotationComposer({
	editVersion,
	quotationId,
}: {
	editVersion?: number;
	quotationId?: Id<'clientQuotations'>;
}) {
	const router = useRouter();
	const editing = quotationId !== undefined;
	const { user } = useUser();

	const quotation = useQuery(
		api.clientQuotations.get.get,
		quotationId ? { quotationId } : 'skip'
	);
	const versionHistory = useQuery(
		api.clientQuotations.listVersions.listVersions,
		quotationId ? { quotationId } : 'skip'
	);
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
	const updateQuotation = useMutation(api.clientQuotations.update.update);
	const saveQuotationVersion = useMutation(
		api.clientQuotations.saveVersion.saveVersion
	);
	const removeDocument = useAction(api.companyDocuments.remove.remove);
	const sendVersionToClients = useAction(
		api.clientQuotations.sendVersionToClients.sendVersionToClients
	);

	// Stage percentages and the editable body of the quotation are seeded from the
	// catalogue (or the issued quotation) rather than held in the form — a
	// three-level TanStack array field would re-render the whole page on every
	// keystroke.
	const [percents, setPercents] = useState<Record<string, string>>({});
	const draft = useQuotationDraft({
		editing,
		exclusions: catalogueExclusions,
		notes: catalogueNotes,
		snapshot: quotation ?? undefined,
		terms,
		tree,
	});

	const [newIssuedAt] = useState(() => new Date());
	const [saving, setSaving] = useState(false);
	const [previewing, setPreviewing] = useState(false);
	const [versionDialogOpen, setVersionDialogOpen] = useState(false);

	const form = useForm({
		defaultValues: emptyClientQuotationFormValues,
		validators: { onChange: clientQuotationFormSchema as never },
	});
	const values = useStore(form.store, (state) => state.values);
	const fieldMeta = useStore(form.store, (state) => state.fieldMeta);
	const formIsValid = useStore(form.store, (state) => state.isValid);

	// Hydrate the scalar fields from the issued quotation once, keyed on its id so
	// a live update to the row can't clobber edits in progress.
	const [hydratedId, setHydratedId] = useState<string | null>(null);
	useEffect(() => {
		if (!quotation || hydratedId === quotation._id) {
			return;
		}
		setHydratedId(quotation._id);
		// `keepDefaultValues` is load-bearing: without it the reset also replaces the
		// form's defaults, and the next render's `form.update()` sees defaults that
		// differ on an untouched form and wipes the values back to empty.
		form.reset(formValuesFromQuotation(quotation), { keepDefaultValues: true });
	}, [quotation, hydratedId, form]);

	const reference = quotation?.reference ?? candidateReference;
	const issuedAt = quotation ? new Date(quotation.issuedAt) : newIssuedAt;
	const currentVersion = quotation?.version ?? FIRST_VERSION;
	// Opened from a version-history row to correct that version in place. Only the
	// current version holds a snapshot to load back, so anything else — including a
	// stale link to an older version — falls back to issuing the next version.
	const amending = Boolean(quotation) && editVersion === currentVersion;
	const targetVersion = quotation
		? currentVersion + (amending ? 0 : 1)
		: FIRST_VERSION;

	// The budget is what gets entered; the quoted total is the budget plus margin,
	// derived on every render rather than held as its own field.
	const budgetAmount = parseMoney(values.budgetAmount);
	const totalInclGst = applyMargin(
		budgetAmount,
		parseMoney(values.marginPercent)
	);

	/**
	 * Where each stage's percentage starts: the figure the quotation was issued
	 * with, else the catalogue default. `percents` only holds what the user has
	 * typed over the top, so clearing a field to '' still reads as an override.
	 */
	const initialPercents = useMemo(() => {
		const issued = new Map<string, number>();
		for (const stage of quotation?.stages ?? []) {
			if (stage.stageId) {
				issued.set(stage.stageId, stage.percent);
			}
		}
		const defaults = new Map<string, number | undefined>();
		for (const node of tree ?? []) {
			defaults.set(node.stage._id, node.stage.defaultPercent);
		}
		return Object.fromEntries(
			draft.stages.map((stage) => {
				const issuedPercent = stage.stageId
					? issued.get(stage.stageId)
					: undefined;
				if (issuedPercent !== undefined) {
					return [stage.key, String(issuedPercent)];
				}
				const defaultPercent = stage.stageId
					? defaults.get(stage.stageId)
					: undefined;
				return [
					stage.key,
					defaultPercent === undefined ? '' : String(defaultPercent),
				];
			})
		);
	}, [quotation, tree, draft.stages]);

	const percentOf = useCallback(
		(stageKey: string) => percents[stageKey] ?? initialPercents[stageKey] ?? '',
		[percents, initialPercents]
	);

	// Rows come from the draft, not the catalogue: a revised quotation keeps the
	// stages it was issued with even if the catalogue has moved on since.
	const stageRows: QuotationStageRow[] = useMemo(() => {
		const parsed = draft.stages.map((stage) => Number(percentOf(stage.key)));
		const safe = parsed.map((percent) =>
			Number.isFinite(percent) ? percent : 0
		);
		const amounts = computeStageAmounts(totalInclGst, safe);
		return draft.stages.map((stage, index) => ({
			amount: amounts[index] ?? 0,
			name: stage.name,
			percent: percentOf(stage.key),
			stageKey: stage.key,
		}));
	}, [draft.stages, percentOf, totalInclGst]);

	const stageRowByKey = useMemo(
		() => new Map(stageRows.map((row) => [row.stageKey, row])),
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

	// A revision keeps the disclaimer and acknowledgement it was issued with; only
	// a new quotation takes today's from the catalogue.
	const termsContent = useMemo(() => {
		if (quotation) {
			return {
				acknowledgementHtml: quotation.terms.acknowledgementHtml,
				disclaimerHtml: quotation.terms.disclaimerHtml,
			};
		}
		if (terms) {
			return {
				acknowledgementHtml: terms.settings.acknowledgementHtml,
				disclaimerHtml: terms.settings.disclaimerHtml,
			};
		}
		return null;
	}, [quotation, terms]);

	const savedBy =
		user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? 'Unknown';

	/**
	 * The revisions alone, oldest first.
	 *
	 * A status event — an approval, a send — shares its version number with the
	 * revision it happened against, so anything looking for "the row for version N"
	 * has to exclude them or it can land on the event instead of the snapshot.
	 */
	const revisions = useMemo(
		() =>
			[...(versionHistory ?? [])]
				.filter((row) => row.changeType === 'Revision')
				.sort((a, b) => a.version - b.version || a.updatedAt - b.updatedAt),
		[versionHistory]
	);

	// The history row being rewritten: its description prefills the dialog, and its
	// document is the PDF that the freshly generated one replaces.
	const amendedVersion = amending
		? revisions.find((row) => row.version === targetVersion)
		: undefined;
	const amendedVersionDescription = amendedVersion?.description ?? '';

	// Who a new version can be emailed to. A quotation still in Draft has never
	// been issued, so there is nobody expecting an update — the dialog leaves the
	// option out entirely rather than offering a send that would surprise them.
	const versionEmailRecipients =
		quotation && quotation.status !== 'Draft'
			? quotation.clients
					.filter((client) => client.email.trim() !== '')
					.map((client) => client.name)
			: [];

	/**
	 * The trail printed on page 2: the issued revisions, then the pending one.
	 * An amendment has no pending version — it replaces the row for the version
	 * being rewritten, so the trail still reads one row per version.
	 *
	 * Revisions only. A PDF is built once, when its version is saved, so any
	 * lifecycle event after that — an approval, a re-send — could never appear on
	 * it however it were ordered. Printing what the document has said over time is
	 * a promise the file can keep; the live history in the app is where the
	 * lifecycle is read.
	 */
	const pdfVersionHistory: QuotationPdfVersion[] = useMemo(() => {
		const pending = {
			description: editing ? 'This revision' : 'Initial version',
			updatedAtLabel: formatIssueDate(new Date()),
			updatedBy: savedBy,
			version: targetVersion,
		};
		const issued = revisions.map((row) =>
			amending && row.version === targetVersion
				? pending
				: {
						description: row.description,
						updatedAtLabel: formatIssueDate(new Date(row.updatedAt)),
						updatedBy: row.updatedBy,
						version: row.version,
					}
		);
		return amending ? issued : [...issued, pending];
	}, [revisions, amending, editing, targetVersion, savedBy]);

	const pdfInput: QuotationPdfInput | null = useMemo(() => {
		if (!(termsContent && draft.hydrated)) {
			return null;
		}
		const { contractSumExclGst, gstAmount } = splitGst(totalInclGst);
		return {
			acknowledgementHtml: termsContent.acknowledgementHtml,
			address: values.address,
			clients: values.clients,
			contractSumExclGst,
			description: values.description || undefined,
			disclaimerHtml: termsContent.disclaimerHtml,
			exclusions: draft.exclusions.map((entry) => entry.text),
			gstAmount,
			issuedAtLabel: formatIssueDate(issuedAt),
			notes: draft.notes.map((entry) => entry.text),
			projectName: values.projectName || 'Untitled project',
			reference,
			stages: draft.stages.map((stage) => ({
				amount: stageRowByKey.get(stage.key)?.amount ?? 0,
				name: stage.name,
				percent: Number(stageRowByKey.get(stage.key)?.percent ?? '0') || 0,
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
			version: targetVersion,
			versionHistory: pdfVersionHistory,
		};
	}, [
		termsContent,
		values,
		issuedAt,
		reference,
		stageRowByKey,
		draft.exclusions,
		draft.hydrated,
		draft.notes,
		draft.stages,
		draft.termSections,
		totalInclGst,
		targetVersion,
		pdfVersionHistory,
	]);

	const canSave =
		formIsValid &&
		percentsValid &&
		draft.itemCount > 0 &&
		draft.hydrated &&
		!saving;

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

	/**
	 * Emails the version just saved to the quotation's clients.
	 *
	 * Reported but never rethrown: the revision is already saved by this point, so
	 * failing the whole save over the email would be wrong — and misleading. The
	 * admin can re-send from the quotation list instead.
	 */
	const emailVersionToClients = async (id: Id<'clientQuotations'>) => {
		try {
			const result = await sendVersionToClients({ quotationId: id });
			toastManager.add({
				title:
					result.sent === 1
						? 'Version emailed to 1 client'
						: `Version emailed to ${result.sent} clients`,
				type: 'success',
			});
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'The version was saved, but the email could not be sent. You can send it from the quotations list.'
				),
				title: 'Could not email the new version',
				type: 'error',
			});
		}
	};

	/**
	 * Deletes the PDF an amended version used to point at. Best effort: the save
	 * has already succeeded by this point, so a stray file is not worth failing on
	 * — and reporting it would only be noise the user can't act on.
	 */
	const discardReplacedPdf = async (documentId?: Id<'companyDocuments'>) => {
		if (!documentId) {
			return;
		}
		try {
			await removeDocument({ documentId });
		} catch {
			// Left in company documents; the version still opens the current PDF.
		}
	};

	/**
	 * Saves version 1 of a new quotation, the next version of an existing one, or
	 * — when amending — rewrites the current version in place. Every path but the
	 * first carries the description the user gave for it.
	 */
	const handleSave = async (
		versionDescription?: string,
		emailClients = false
	) => {
		const parsed = clientQuotationFormSchema.safeParse(values);
		if (!(canSave && parsed.success && pdfInput && termsContent)) {
			return;
		}
		// A revision is only ever saved through the version dialog — without a
		// description there is nothing to record it as.
		if (editing && !(quotation && versionDescription)) {
			return;
		}
		setSaving(true);
		try {
			// Confirm the code first so the reference printed on the PDF is the one
			// stored. Only a collision changes it, and the blob is built afterwards.
			// A revision already has its reference and keeps it.
			const savedReference = quotation
				? quotation.reference
				: (await reserveReference({ preferred: candidateReference })).reference;
			const folderPath = await ensureFolder({
				parentPath: '',
				segments: [QUOTATION_FOLDER_NAME],
			});

			const blob = await buildClientQuotationPdfBlob({
				...pdfInput,
				reference: savedReference,
				// The trail in `pdfInput` carries a placeholder for the version being
				// written, because the description is only given in the dialog. By here
				// it is known, so the printed page 2 says what the history will say.
				versionHistory: versionDescription
					? pdfInput.versionHistory.map((row) =>
							row.version === targetVersion
								? { ...row, description: versionDescription }
								: row
						)
					: pdfInput.versionHistory,
			});
			// Every version keeps its own file, so the name carries the version from
			// the second one on — v1 files stay as they were named when issued.
			const fileName =
				targetVersion === FIRST_VERSION
					? `${savedReference} - ${parsed.data.projectName}.pdf`
					: `${savedReference} - ${parsed.data.projectName} - v${targetVersion}.pdf`;
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
			const templateUnchanged =
				quotation?.budgetTemplateId === parsed.data.budgetTemplateId;

			const snapshot = {
				projectName: parsed.data.projectName,
				description: parsed.data.description || undefined,
				clients: parsed.data.clients,
				address: parsed.data.address as {
					postcode: string;
					state: 'ACT' | 'NSW' | 'NT' | 'QLD' | 'SA' | 'TAS' | 'VIC' | 'WA';
					street: string;
					suburb: string;
				},
				budgetTemplateId: selectedTemplate?._id as
					| Id<'budgetTemplates'>
					| undefined,
				// A template deleted since the quotation was issued must not erase the
				// provenance it was priced from.
				budgetTemplateTitle:
					selectedTemplate?.title ??
					(templateUnchanged ? quotation?.budgetTemplateTitle : undefined),
				budgetTemplateTotal:
					selectedTemplate?.totalPrice ??
					(templateUnchanged ? quotation?.budgetTemplateTotal : undefined),
				budgetAmount,
				marginPercent: parsed.data.marginPercent
					? Number(parsed.data.marginPercent)
					: undefined,
				totalInclGst,
				stages: draft.stages.map((stage, index) => ({
					stageId: stage.stageId,
					name: stage.name,
					order: index,
					percent: Number(stageRowByKey.get(stage.key)?.percent ?? '0') || 0,
					amount: stageRowByKey.get(stage.key)?.amount ?? 0,
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
					disclaimerHtml: termsContent.disclaimerHtml,
					acknowledgementHtml: termsContent.acknowledgementHtml,
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
			};

			if (quotationId && versionDescription && amending) {
				await saveQuotationVersion({
					quotationId,
					version: targetVersion,
					versionDescription,
					...snapshot,
				});
				// Only once the version points at the new PDF, so a failed save can
				// never leave it with no document at all.
				await discardReplacedPdf(amendedVersion?.documentId);
				toastManager.add({
					title: `Version ${targetVersion} updated`,
					type: 'success',
				});
			} else if (quotationId && versionDescription) {
				await updateQuotation({ quotationId, versionDescription, ...snapshot });
				toastManager.add({
					title: `Version ${targetVersion} saved`,
					type: 'success',
				});
				if (emailClients) {
					await emailVersionToClients(quotationId);
				}
			} else {
				await createQuotation({
					reference: savedReference,
					issuedAt: issuedAt.getTime(),
					...snapshot,
				});
				toastManager.add({ title: 'Quotation saved', type: 'success' });
			}

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
	const marginError = quotationFieldError(
		fieldMeta.marginPercent?.isTouched
			? fieldMeta.marginPercent.errors
			: undefined
	);
	const budgetError = quotationFieldError(
		fieldMeta.budgetAmount?.isTouched
			? fieldMeta.budgetAmount.errors
			: undefined
	);

	/** Picking a template seeds the budget; it stays editable afterwards. */
	const applyTemplateBudget = (templateId: string) => {
		const template = budgetTemplates?.find((item) => item._id === templateId);
		if (!template) {
			return;
		}
		form.setFieldValue('budgetAmount', String(template.totalPrice));
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<PageHeading
				backLink={LIST_HREF}
				description={issuedNote(editing, amending, issuedAt, targetVersion)}
				heading={editHeading(editing, amending, targetVersion)}
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
							loading={saving && !editing}
							onClick={() => {
								// A revision has to be described before it is saved.
								if (editing) {
									setVersionDialogOpen(true);
									return;
								}
								handleSave().catch(() => {
									/* handled in handleSave */
								});
							}}
							type="button"
							variant="outline"
						>
							<Save aria-hidden />
							{saveLabel(editing, amending, targetVersion)}
						</Button>
					</div>
				}
				titleTrailing={
					<Badge className="tabular-nums" variant="secondary">
						{reference}
					</Badge>
				}
			/>

			<div className="flex min-h-0 flex-1 flex-col">
				<ScrollArea className="min-h-0">
					<div className="flex w-full flex-col gap-5 pe-3 pb-4">
						<div className="grid items-stretch gap-5 lg:grid-cols-3">
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

							<Frame className="h-full">
								<FrameHeader className="flex-row items-center justify-between gap-3">
									<FrameTitle>Price</FrameTitle>
									<Badge
										className="shrink-0 tabular-nums"
										size="lg"
										variant="purple"
									>
										{formatAudWhole(totalInclGst)}
									</Badge>
								</FrameHeader>
								<FramePanel className="flex-1">
									<QuotationPricingField
										budgetAmount={values.budgetAmount}
										budgetError={budgetError}
										budgetTemplateId={values.budgetTemplateId}
										budgetTemplates={budgetTemplates}
										marginError={marginError}
										marginPercent={values.marginPercent}
										onBudgetAmountChange={(budget) => {
											form.setFieldValue('budgetAmount', budget);
											form.setFieldMeta('budgetAmount', (meta) => ({
												...meta,
												isTouched: true,
											}));
										}}
										onBudgetTemplateChange={(templateId) => {
											form.setFieldValue('budgetTemplateId', templateId);
											applyTemplateBudget(templateId);
										}}
										onMarginChange={(margin) => {
											form.setFieldValue('marginPercent', margin);
											form.setFieldMeta('marginPercent', (meta) => ({
												...meta,
												isTouched: true,
											}));
										}}
										totalInclGst={totalInclGst}
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

						<Frame>
							<FrameHeader>
								<FrameTitle>Progress payments</FrameTitle>
							</FrameHeader>
							<FramePanel>
								<QuotationStagePercentages
									onPercentChange={(stageKey, percent) =>
										setPercents((current) => ({
											...current,
											[stageKey]: percent,
										}))
									}
									percentTotal={percentTotal}
									rows={stageRows}
									totalAmount={totalInclGst}
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
								{draft.hydrated ? (
									<QuotationInclusionsEditor
										onAddItem={draft.addItem}
										onAddSection={draft.addSection}
										onRemoveItem={draft.removeItem}
										onRemoveSection={draft.removeSection}
										onRenameSection={draft.renameSection}
										onUpdateItem={draft.updateItem}
										percentOf={(stage) => percentOf(stage.key)}
										stages={draft.stages}
									/>
								) : (
									<p className="text-muted-foreground text-sm">
										Loading quote items…
									</p>
								)}
								{draft.hydrated && draft.itemCount === 0 ? (
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
									loading={!draft.hydrated}
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
									loading={!draft.hydrated}
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
									loading={!draft.hydrated}
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

			<QuotationVersionDialog
				amending={amending}
				initialDescription={amending ? amendedVersionDescription : ''}
				onConfirm={(description, emailClients) => {
					handleSave(description, emailClients).catch(() => {
						/* handled in handleSave */
					});
				}}
				onOpenChange={setVersionDialogOpen}
				open={versionDialogOpen}
				recipients={versionEmailRecipients}
				saving={saving}
				version={targetVersion}
			/>
		</div>
	);
}
