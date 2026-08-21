import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { generateQuotationReference } from '@workspace/backend/quotationReference';
import { useAction, useMutation, useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { FileText, Save } from 'lucide-react-native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenFormHeader } from '@/components/screen-form-header';
import { useThemeColors } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { TextField } from '@/components/ui/text-field';
import {
	applyMargin,
	type ClientQuotationFormValues,
	COVER_DESCRIPTION_MAX_LENGTH,
	computeStageAmounts,
	emptyClientQuotationFormValues,
	emptyQuotationClient,
	formValuesFromQuotation,
	parsedAddress,
	parseMoney,
	percentsAreValid,
	round2,
	specialInclusionsTotal,
	splitGst,
	validateClientQuotationForm,
} from '@/lib/client-quotation-form';
import { formatCurrency } from '@/lib/format';
import {
	AUSTRALIAN_STATES,
	convexErrorMessage,
	STATE_LABELS,
} from '@/lib/project-form';
import { shareRemotePdf } from '@/lib/share-file';
import { ComposerSection } from './composer-section';
import { DraftClientsEditor } from './draft-clients-editor';
import { DraftEntriesEditor } from './draft-entries-editor';
import { DraftInclusionsEditor } from './draft-inclusions-editor';
import { DraftSpecialInclusionsEditor } from './draft-special-inclusions-editor';
import { DraftStagePercentages } from './draft-stage-percentages';
import { DraftTermsEditor } from './draft-terms-editor';
import {
	QuotationVersionSheet,
	type QuotationVersionSheetHandle,
} from './quotation-version-sheet';
import {
	SelectSpecialInclusionsSheet,
	type SelectSpecialInclusionsSheetHandle,
} from './select-special-inclusions-sheet';
import { useQuotationDraft } from './use-quotation-draft';

const FIRST_VERSION = 1;
// Statuses a new version sends back to Under Review: the clients agreed to
// figures the revision replaces, so their decision cannot carry over to it.
const REAPPROVAL_STATUSES = ['Approved', 'Awaiting Signatures', 'Signed'];

const STATE_OPTIONS = AUSTRALIAN_STATES.map((value) => ({
	value: value as string,
	label: STATE_LABELS[value],
}));

type SectionKey =
	| 'clients'
	| 'exclusions'
	| 'inclusions'
	| 'notes'
	| 'payments'
	| 'price'
	| 'project'
	| 'special'
	| 'terms';

/**
 * Builds and revises a client quotation.
 *
 * The portal lays this out as one long page of cards. Here the same ten
 * sections collapse, with the headline figure kept in each header so a closed
 * section still says something. The body of the quotation — stages, sections,
 * items, terms — lives in `useQuotationDraft` rather than in form state, for
 * the reason set out there.
 *
 * The document is rendered by the server (`clientQuotations.pdf.generate`), so
 * saving is: confirm the reference, render and file the PDF, then write the
 * snapshot pointing at it.
 */
export function ClientQuotationComposer({
	quotationId,
	editVersion,
	templateId,
}: {
	editVersion?: number;
	quotationId?: Id<'clientQuotations'>;
	templateId?: Id<'quoteTemplates'>;
}) {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();

	const editing = Boolean(quotationId);
	const quotation = useQuery(
		api.clientQuotations.get.get,
		quotationId ? { quotationId } : 'skip'
	);
	const versionHistory = useQuery(
		api.clientQuotations.listVersions.listVersions,
		quotationId ? { quotationId } : 'skip'
	);

	// On a new quotation the template comes from the route; on an edit it comes
	// off the issued row, so it stays unknown for the round trip that loads it.
	const resolvedTemplateId = quotation?.templateId ?? templateId;
	const catalogueArgs = resolvedTemplateId
		? { templateId: resolvedTemplateId }
		: ('skip' as const);
	const tree = useQuery(api.quoteCatalogue.tree.tree, catalogueArgs);
	const terms = useQuery(api.quoteTerms.get.get, catalogueArgs);
	const catalogueExclusions = useQuery(
		api.quoteExclusions.list.list,
		catalogueArgs
	);
	const catalogueNotes = useQuery(api.quoteNotes.list.list, catalogueArgs);
	const budgetTemplates = useQuery(api.budgetTemplates.list.list, {});

	// References are opaque codes rather than a running number, so there is
	// nothing to look up — generate the candidate here and confirm it on save.
	const [candidateReference] = useState(generateQuotationReference);

	const reserveReference = useMutation(
		api.clientQuotations.reserveReference.reserveReference
	);
	const generatePdf = useAction(
		api.clientQuotations.pdf.generate.generateQuotationPdf
	);
	const createQuotation = useMutation(api.clientQuotations.create.create);
	const updateQuotation = useMutation(api.clientQuotations.update.update);
	const saveQuotationVersion = useMutation(
		api.clientQuotations.saveVersion.saveVersion
	);
	const sendVersionToClients = useAction(
		api.clientQuotations.sendVersionToClients.sendVersionToClients
	);

	const [values, setValues] = useState<ClientQuotationFormValues>(
		emptyClientQuotationFormValues
	);
	const [hydratedId, setHydratedId] = useState<string | null>(null);
	const [percents, setPercents] = useState<Record<string, string>>({});
	const [showErrors, setShowErrors] = useState(false);
	const [saving, setSaving] = useState(false);
	const [previewing, setPreviewing] = useState(false);
	const [open, setOpen] = useState<Set<SectionKey>>(new Set(['project']));

	const versionSheetRef = useRef<QuotationVersionSheetHandle>(null);
	const specialSheetRef = useRef<SelectSpecialInclusionsSheetHandle>(null);

	// Hydrate the scalar fields from the issued row exactly once per quotation.
	if (quotation && hydratedId !== quotation._id) {
		setHydratedId(quotation._id);
		setValues(formValuesFromQuotation(quotation));
	}

	const draft = useQuotationDraft({
		editing,
		exclusions: catalogueExclusions,
		notes: catalogueNotes,
		snapshot: quotation ?? undefined,
		terms,
		tree,
	});

	const revisions = useMemo(
		() =>
			[...(versionHistory ?? [])]
				.filter((row) => row.changeType === 'Revision')
				.sort((a, b) => a.version - b.version || a.updatedAt - b.updatedAt),
		[versionHistory]
	);
	const currentVersion = quotation?.version ?? FIRST_VERSION;
	const amending = Boolean(quotation) && editVersion === currentVersion;
	// Amending rewrites the current revision; anything else issues the next one.
	let targetVersion = FIRST_VERSION;
	if (quotation) {
		targetVersion = amending ? currentVersion : currentVersion + 1;
	}
	const amendedVersion = amending
		? revisions.find((row) => row.version === targetVersion)
		: undefined;
	const reopening =
		Boolean(quotation) &&
		!amending &&
		REAPPROVAL_STATUSES.includes(quotation?.status ?? '');

	const reference = quotation?.reference ?? candidateReference;
	const issuedAt = quotation ? new Date(quotation.issuedAt) : new Date();

	// --- Figures -----------------------------------------------------------

	const budgetAmount = parseMoney(values.budgetAmount);
	const specialInclusionsAmount = specialInclusionsTotal(
		draft.specialInclusions
	);
	const totalInclGst = round2(
		applyMargin(budgetAmount, parseMoney(values.marginPercent)) +
			specialInclusionsAmount
	);
	const { contractSumExclGst, gstAmount } = splitGst(totalInclGst);

	// A typed override wins over the catalogue default, and clearing a field is
	// itself an override — hence a separate map rather than seeding the draft.
	const percentOf = useCallback(
		(key: string, fallback: number | undefined) =>
			percents[key] ?? (fallback === undefined ? '' : String(fallback)),
		[percents]
	);

	const stageRows = useMemo(
		() =>
			draft.stages.map((stage) => {
				const seeded = quotation?.stages.find(
					(row) => row.name === stage.name
				)?.percent;
				const catalogueDefault = tree?.find(
					(node) => node.stage._id === stage.stageId
				)?.stage.defaultPercent;
				return {
					key: stage.key,
					name: stage.name,
					percent: percentOf(stage.key, seeded ?? catalogueDefault),
				};
			}),
		[draft.stages, percentOf, quotation, tree]
	);

	// The resolved percentage per stage — typed override, else the issued value,
	// else the catalogue default. Everything downstream reads this rather than
	// `percents`, which only holds what the user has actually typed.
	const percentByKey = new Map(stageRows.map((row) => [row.key, row.percent]));
	const percentNumbers = stageRows.map((row) => Number(row.percent) || 0);
	const percentTotal = round2(
		percentNumbers.reduce((sum, value) => sum + value, 0)
	);
	const percentsValid = percentsAreValid(percentNumbers);
	const stageAmounts = computeStageAmounts(totalInclGst, percentNumbers);
	const stagePercentRows = stageRows.map((row, index) => ({
		...row,
		amount: stageAmounts[index] ?? 0,
	}));
	const stageAmountByKey = new Map(
		stageRows.map((row, index) => [row.key, stageAmounts[index] ?? 0])
	);

	// --- Validation --------------------------------------------------------

	const errors = validateClientQuotationForm(values);
	const formIsValid = Object.keys(errors).length === 0;
	const renderable = Boolean(terms && draft.hydrated);
	const canSave =
		formIsValid &&
		percentsValid &&
		draft.itemCount > 0 &&
		renderable &&
		!saving;

	const error = (key: string) => (showErrors ? (errors[key] ?? '') : '');

	const toggle = (key: SectionKey) =>
		setOpen((current) => {
			const next = new Set(current);
			if (next.has(key)) {
				next.delete(key);
			} else {
				next.add(key);
			}
			return next;
		});

	// --- Snapshot ----------------------------------------------------------

	const buildSnapshotBody = () => {
		if (!terms) {
			return null;
		}
		const selectedTemplate = budgetTemplates?.find(
			(template) => template._id === values.budgetTemplateId
		);
		const templateUnchanged =
			quotation?.budgetTemplateId === values.budgetTemplateId;

		return {
			projectName: values.projectName.trim(),
			description: values.description.trim() || undefined,
			clients: values.clients.map((client) => ({
				name: client.name.trim(),
				email: client.email.trim(),
				phone: client.phone.trim(),
			})),
			address: parsedAddress(values),
			budgetTemplateId: selectedTemplate?._id,
			// A template deleted since the quotation was issued must not erase the
			// provenance it was priced from.
			budgetTemplateTitle:
				selectedTemplate?.title ??
				(templateUnchanged ? quotation?.budgetTemplateTitle : undefined),
			budgetTemplateTotal:
				selectedTemplate?.totalPrice ??
				(templateUnchanged ? quotation?.budgetTemplateTotal : undefined),
			budgetAmount,
			marginPercent: values.marginPercent
				? Number(values.marginPercent)
				: undefined,
			totalInclGst,
			stages: draft.stages.map((stage, index) => ({
				stageId: stage.stageId,
				name: stage.name,
				order: index,
				percent: Number(percentByKey.get(stage.key) ?? '') || 0,
				amount: stageAmountByKey.get(stage.key) ?? 0,
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
			specialInclusions: draft.specialInclusions.map((entry, index) => ({
				text: entry.text,
				amount: parseMoney(entry.amount) || undefined,
				order: index,
			})),
			templateId: resolvedTemplateId,
			exclusions: draft.exclusions.map((entry, index) => ({
				text: entry.text,
				order: index,
			})),
			notes: draft.notes.map((entry, index) => ({
				text: entry.text,
				order: index,
			})),
		};
	};

	const issuedVersions = revisions.map((row) => ({
		changeType: 'Revision' as const,
		description: row.description,
		updatedAt: row.updatedAt,
		updatedBy: row.updatedBy,
		version: row.version,
	}));

	const renderArgs = (savedReference: string, versionDescription?: string) => ({
		amending,
		issuedAt: issuedAt.getTime(),
		issuedVersions,
		pendingDescription:
			versionDescription ?? (editing ? 'This revision' : 'Initial version'),
		reference: savedReference,
		version: targetVersion,
	});

	// --- Actions -----------------------------------------------------------

	const handlePreview = async () => {
		const snapshot = buildSnapshotBody();
		if (!snapshot) {
			return;
		}
		setPreviewing(true);
		try {
			const rendered = await generatePdf({
				...snapshot,
				...renderArgs(reference),
				preview: true,
			});
			await shareRemotePdf(rendered.url, rendered.fileName);
		} catch (err) {
			Alert.alert(
				'Could not open preview',
				convexErrorMessage(err, 'Please try again in a moment.')
			);
		} finally {
			setPreviewing(false);
		}
	};

	const handleSave = async (
		versionDescription?: string,
		emailClients = false
	) => {
		const snapshotBody = buildSnapshotBody();
		if (!(canSave && snapshotBody)) {
			setShowErrors(true);
			return;
		}
		// A revision is only ever saved through the version sheet — without a
		// description there is nothing to record it as.
		if (editing && !(quotation && versionDescription)) {
			return;
		}
		setSaving(true);
		try {
			// Confirm the code first so the reference printed on the PDF is the one
			// stored. A revision already has its reference and keeps it.
			const savedReference = quotation
				? quotation.reference
				: (await reserveReference({ preferred: candidateReference })).reference;

			const rendered = await generatePdf({
				...snapshotBody,
				...renderArgs(savedReference, versionDescription),
				preview: false,
			});

			const snapshot = {
				...snapshotBody,
				documentId: rendered.documentId,
				s3Key: rendered.s3Key,
				fileName: rendered.fileName,
				folderPath: rendered.folderPath,
			};

			if (quotationId && versionDescription && amending) {
				await saveQuotationVersion({
					quotationId,
					version: targetVersion,
					versionDescription,
					...snapshot,
				});
			} else if (quotationId && versionDescription) {
				const saved = await updateQuotation({
					quotationId,
					versionDescription,
					...snapshot,
				});
				if (saved.reopened) {
					Alert.alert(
						'Back under review',
						'The clients approve this version again.'
					);
				}
				if (emailClients) {
					// Reported but never rethrown: the revision is already saved, so
					// failing the whole save over the email would be misleading.
					try {
						await sendVersionToClients({ quotationId });
					} catch {
						Alert.alert(
							'Version saved',
							'The email could not be sent. You can resend it from the quotations list.'
						);
					}
				}
			} else {
				await createQuotation({
					reference: savedReference,
					issuedAt: issuedAt.getTime(),
					...snapshot,
				});
			}

			router.back();
		} catch (err) {
			Alert.alert(
				'Could not save quotation',
				convexErrorMessage(err, 'Please try again in a moment.')
			);
			setSaving(false);
		}
	};

	// A new quotation is always built from a template — without one there is
	// nothing to seed from, so this only shows on a hand-typed route.
	if (!(editing || resolvedTemplateId)) {
		return (
			<View className="flex-1 bg-background">
				<ScreenFormHeader title="New quotation" />
				<Text className="px-4 font-sans text-muted-foreground text-sm">
					Pick a quotation template first — a quotation is always built from
					one.
				</Text>
			</View>
		);
	}

	if (editing && quotation === undefined) {
		return (
			<View className="flex-1 gap-3 bg-background p-4">
				<Skeleton className="h-10 w-2/3" />
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-24 w-full" />
			</View>
		);
	}

	let heading = 'Add Quotation';
	if (amending) {
		heading = `Edit Version ${targetVersion}`;
	} else if (editing) {
		heading = 'Edit Quotation';
	}

	let saveLabel = 'Save';
	if (amending) {
		saveLabel = `Update version ${targetVersion}`;
	} else if (editing) {
		saveLabel = 'Save version';
	}

	return (
		<View className="flex-1 bg-background">
			<ScreenFormHeader title={heading} />

			<KeyboardAwareScrollView
				bottomOffset={16}
				className="flex-1"
				contentContainerStyle={{
					gap: 10,
					paddingHorizontal: 16,
					paddingBottom: insets.bottom + 24,
				}}
				keyboardShouldPersistTaps="handled"
			>
				<View className="flex-row items-center gap-2 pb-1">
					<Badge variant="outline">{reference}</Badge>
					<View className="flex-1" />
					<Badge variant="purple">{formatCurrency(totalInclGst)}</Badge>
				</View>

				<ComposerSection
					invalid={showErrors && Boolean(errors.projectName)}
					onToggle={() => toggle('project')}
					open={open.has('project')}
					subtitle={values.projectName || 'Untitled project'}
					title="Project"
				>
					<TextField
						error={error('projectName')}
						label="Project name"
						onChangeText={(projectName) =>
							setValues((current) => ({ ...current, projectName }))
						}
						placeholder="e.g. A residence at Hamilton Hill"
						value={values.projectName}
					/>
					<TextField
						error={error('description')}
						label={`Description (${values.description.length}/${COVER_DESCRIPTION_MAX_LENGTH})`}
						multiline
						onChangeText={(description) =>
							setValues((current) => ({ ...current, description }))
						}
						placeholder="Prepared for the construction of a new two-storey custom residence…"
						value={values.description}
					/>
				</ComposerSection>

				<ComposerSection
					invalid={
						showErrors &&
						Object.keys(errors).some((key) => key.startsWith('address.'))
					}
					onToggle={() => toggle('clients')}
					open={open.has('clients')}
					subtitle={`${values.clients.length} client${values.clients.length === 1 ? '' : 's'}`}
					title="Clients & address"
				>
					<DraftClientsEditor
						clients={values.clients}
						errors={errors}
						onAdd={() =>
							setValues((current) => ({
								...current,
								clients: [...current.clients, { ...emptyQuotationClient }],
							}))
						}
						onChange={(index, patch) =>
							setValues((current) => ({
								...current,
								clients: current.clients.map((client, i) =>
									i === index ? { ...client, ...patch } : client
								),
							}))
						}
						onRemove={(index) =>
							setValues((current) => ({
								...current,
								clients: current.clients.filter((_, i) => i !== index),
							}))
						}
						showErrors={showErrors}
					/>

					<View className="gap-2 border-border border-t pt-3">
						<TextField
							error={error('address.street')}
							label="Street"
							onChangeText={(street) =>
								setValues((current) => ({
									...current,
									address: { ...current.address, street },
								}))
							}
							placeholder="12 Example Road"
							value={values.address.street}
						/>
						<TextField
							error={error('address.suburb')}
							label="Suburb"
							onChangeText={(suburb) =>
								setValues((current) => ({
									...current,
									address: { ...current.address, suburb },
								}))
							}
							placeholder="Hamilton Hill"
							value={values.address.suburb}
						/>
						<View className="gap-1.5">
							<Text className="font-sans-medium text-foreground text-sm">
								State
							</Text>
							<Select
								onChange={(state) =>
									setValues((current) => ({
										...current,
										address: { ...current.address, state },
									}))
								}
								options={STATE_OPTIONS}
								placeholder="Select a state"
								title="State"
								value={values.address.state}
							/>
							{error('address.state') ? (
								<Text className="font-sans text-destructive text-xs">
									{error('address.state')}
								</Text>
							) : null}
						</View>
						<TextField
							error={error('address.postcode')}
							keyboardType="number-pad"
							label="Postcode"
							onChangeText={(postcode) =>
								setValues((current) => ({
									...current,
									address: { ...current.address, postcode },
								}))
							}
							placeholder="4007"
							value={values.address.postcode}
						/>
					</View>
				</ComposerSection>

				<ComposerSection
					invalid={
						showErrors && Boolean(errors.budgetAmount || errors.marginPercent)
					}
					onToggle={() => toggle('price')}
					open={open.has('price')}
					rightSlot={
						<Badge variant="purple">{formatCurrency(totalInclGst)}</Badge>
					}
					title="Price"
				>
					<View className="gap-1.5">
						<Text className="font-sans-medium text-foreground text-sm">
							Budget template
						</Text>
						<Select
							onChange={(budgetTemplateId) => {
								const template = budgetTemplates?.find(
									(row) => row._id === budgetTemplateId
								);
								setValues((current) => ({
									...current,
									budgetTemplateId,
									// Picking a template seeds the budget; it stays editable.
									budgetAmount: template
										? String(template.totalPrice)
										: current.budgetAmount,
								}));
							}}
							options={(budgetTemplates ?? []).map((template) => ({
								value: template._id as string,
								label: template.title,
							}))}
							placeholder="Optional — seeds the budget"
							title="Budget template"
							value={values.budgetTemplateId}
						/>
					</View>
					<TextField
						error={error('budgetAmount')}
						keyboardType="decimal-pad"
						label="Budget"
						onChangeText={(budgetAmount) =>
							setValues((current) => ({ ...current, budgetAmount }))
						}
						placeholder="0"
						value={values.budgetAmount}
					/>
					<TextField
						error={error('marginPercent')}
						keyboardType="decimal-pad"
						label="Margin %"
						onChangeText={(marginPercent) =>
							setValues((current) => ({ ...current, marginPercent }))
						}
						placeholder="0"
						value={values.marginPercent}
					/>
					<View className="gap-1 border-border border-t pt-3">
						<Row
							label="Contract sum"
							value={formatCurrency(contractSumExclGst)}
						/>
						<Row label="GST 10%" value={formatCurrency(gstAmount)} />
						{specialInclusionsAmount > 0 ? (
							<Row
								label="Special inclusions"
								value={formatCurrency(specialInclusionsAmount)}
							/>
						) : null}
						<Row
							emphasis
							label="Total incl. GST"
							value={formatCurrency(totalInclGst)}
						/>
					</View>
				</ComposerSection>

				<ComposerSection
					invalid={!percentsValid}
					onToggle={() => toggle('payments')}
					open={open.has('payments')}
					rightSlot={
						<Badge variant={percentsValid ? 'success' : 'destructive'}>
							{`${percentTotal}%`}
						</Badge>
					}
					title="Progress payments"
				>
					<DraftStagePercentages
						onPercentChange={(key, percent) =>
							setPercents((current) => ({ ...current, [key]: percent }))
						}
						percentTotal={percentTotal}
						rows={stagePercentRows}
						totalAmount={totalInclGst}
						valid={percentsValid}
					/>
				</ComposerSection>

				<ComposerSection
					invalid={draft.hydrated && draft.itemCount === 0}
					onToggle={() => toggle('inclusions')}
					open={open.has('inclusions')}
					rightSlot={<Badge variant="outline">{String(draft.itemCount)}</Badge>}
					title="What each stage includes"
				>
					{draft.hydrated ? (
						<DraftInclusionsEditor
							onAddItem={draft.addItem}
							onAddSection={draft.addSection}
							onRemoveItem={draft.removeItem}
							onRemoveSection={draft.removeSection}
							onRenameSection={draft.renameSection}
							onUpdateItem={draft.updateItem}
							percentOf={(stage) => percentByKey.get(stage.key) ?? ''}
							stages={draft.stages}
						/>
					) : (
						<Text className="font-sans text-muted-foreground text-xs">
							Loading quote items…
						</Text>
					)}
					{draft.hydrated && draft.itemCount === 0 ? (
						<Text className="font-sans text-destructive text-xs">
							Add at least one item to include in the quotation.
						</Text>
					) : null}
				</ComposerSection>

				<ComposerSection
					onToggle={() => toggle('terms')}
					open={open.has('terms')}
					rightSlot={
						<Badge variant="outline">{String(draft.termSections.length)}</Badge>
					}
					title="Terms & conditions"
				>
					<DraftTermsEditor
						onAddClause={draft.addTermItem}
						onAddSection={draft.addTermSection}
						onRemoveClause={draft.removeTermItem}
						onRemoveSection={draft.removeTermSection}
						onRenameSection={draft.renameTermSection}
						onUpdateClause={draft.updateTermItem}
						sections={draft.termSections}
					/>
				</ComposerSection>

				<ComposerSection
					onToggle={() => toggle('special')}
					open={open.has('special')}
					rightSlot={
						<Badge variant="purple">
							{formatCurrency(specialInclusionsAmount)}
						</Badge>
					}
					title="Special inclusions"
				>
					<DraftSpecialInclusionsEditor
						entries={draft.specialInclusions}
						onAdd={(text) => draft.specialInclusionsHandlers.add(text)}
						onAddFromList={() => specialSheetRef.current?.present()}
						onRemove={draft.specialInclusionsHandlers.remove}
						onUpdate={draft.specialInclusionsHandlers.update}
					/>
				</ComposerSection>

				<ComposerSection
					onToggle={() => toggle('exclusions')}
					open={open.has('exclusions')}
					rightSlot={
						<Badge variant="outline">{String(draft.exclusions.length)}</Badge>
					}
					title="Exclusions"
				>
					<DraftEntriesEditor
						addPlaceholder="Add an exclusion…"
						entries={draft.exclusions}
						noun="exclusion"
						onAdd={draft.exclusionHandlers.add}
						onRemove={draft.exclusionHandlers.remove}
						onUpdate={draft.exclusionHandlers.update}
					/>
				</ComposerSection>

				<ComposerSection
					onToggle={() => toggle('notes')}
					open={open.has('notes')}
					rightSlot={
						<Badge variant="outline">{String(draft.notes.length)}</Badge>
					}
					title="Important notes"
				>
					<DraftEntriesEditor
						addPlaceholder="Add a note…"
						entries={draft.notes}
						noun="note"
						onAdd={draft.noteHandlers.add}
						onRemove={draft.noteHandlers.remove}
						onUpdate={draft.noteHandlers.update}
					/>
				</ComposerSection>

				<View className="gap-2 pt-2">
					<Button
						disabled={!renderable || previewing}
						icon={
							<FileText color={colors.foreground} size={16} strokeWidth={2} />
						}
						loading={previewing}
						onPress={() => {
							handlePreview().catch(() => {
								/* reported in handlePreview */
							});
						}}
					>
						Preview
					</Button>
					<Button
						disabled={!canSave}
						icon={<Save color={colors.foreground} size={16} strokeWidth={2} />}
						loading={saving}
						onPress={() => {
							if (!canSave) {
								setShowErrors(true);
								return;
							}
							if (editing) {
								versionSheetRef.current?.present();
								return;
							}
							handleSave().catch(() => {
								/* reported in handleSave */
							});
						}}
						variant="primary"
					>
						{saveLabel}
					</Button>
				</View>
			</KeyboardAwareScrollView>

			<QuotationVersionSheet
				amending={amending}
				initialDescription={amending ? (amendedVersion?.description ?? '') : ''}
				onConfirm={(description, emailClients) => {
					handleSave(description, emailClients).catch(() => {
						/* reported in handleSave */
					});
				}}
				recipients={
					reopening || !editing
						? []
						: values.clients
								.map((client) => client.name)
								.filter((name) => name.length > 0)
				}
				ref={versionSheetRef}
				reopening={reopening}
				saving={saving}
				version={targetVersion}
			/>
			<SelectSpecialInclusionsSheet
				onConfirm={draft.specialInclusionsHandlers.addMany}
				ref={specialSheetRef}
			/>
		</View>
	);
}

function Row({
	emphasis = false,
	label,
	value,
}: {
	emphasis?: boolean;
	label: string;
	value: string;
}) {
	return (
		<View className="flex-row items-center gap-2">
			<Text
				className={
					emphasis
						? 'flex-1 font-sans-medium text-foreground text-sm'
						: 'flex-1 font-sans text-muted-foreground text-xs'
				}
			>
				{label}
			</Text>
			<Text
				className={
					emphasis
						? 'font-sans-medium text-foreground text-sm tabular-nums'
						: 'font-sans text-muted-foreground text-xs tabular-nums'
				}
			>
				{value}
			</Text>
		</View>
	);
}
