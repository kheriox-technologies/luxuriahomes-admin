'use client';

import type { Doc, Id } from '@workspace/backend/dataModel';
import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';

export interface QuoteCatalogueSectionNode {
	items: Doc<'quoteItems'>[];
	section: Doc<'quoteSections'>;
}

export interface QuoteCatalogueStageNode {
	sections: QuoteCatalogueSectionNode[];
	stage: Doc<'quoteStages'>;
}

export interface QuoteTermsData {
	sections: {
		items: Doc<'quoteTermItems'>[];
		section: Doc<'quoteTermSections'>;
	}[];
	settings: { acknowledgementHtml: string; disclaimerHtml: string };
}

export interface DraftItem {
	itemId?: Id<'quoteItems'>;
	key: string;
	name: string;
}

export interface DraftSection {
	items: DraftItem[];
	key: string;
	name: string;
	sectionId?: Id<'quoteSections'>;
}

export interface DraftStage {
	key: string;
	name: string;
	scopeSummary?: string;
	sections: DraftSection[];
	stageId: Id<'quoteStages'>;
}

export interface DraftTermItem {
	key: string;
	text: string;
}

export interface DraftTermSection {
	items: DraftTermItem[];
	key: string;
	name: string;
}

export interface DraftEntry {
	key: string;
	text: string;
}

// Rows the user adds have no Convex id, so React needs a local one. A counter
// rather than a random id keeps renders deterministic.
let keySeq = 0;
function nextKey(): string {
	keySeq += 1;
	return `d${keySeq}`;
}

function seedStages(tree: QuoteCatalogueStageNode[]): DraftStage[] {
	return tree.map((node) => ({
		key: nextKey(),
		name: node.stage.name,
		scopeSummary: node.stage.scopeSummary,
		stageId: node.stage._id,
		sections: node.sections.map((sectionNode) => ({
			key: nextKey(),
			name: sectionNode.section.name,
			sectionId: sectionNode.section._id,
			items: sectionNode.items
				.filter((item) => item.isDefault)
				.map((item) => ({ key: nextKey(), itemId: item._id, name: item.name })),
		})),
	}));
}

function seedTermSections(terms: QuoteTermsData): DraftTermSection[] {
	return terms.sections.map((node) => ({
		key: nextKey(),
		name: node.section.name,
		items: node.items.map((item) => ({ key: nextKey(), text: item.text })),
	}));
}

function seedEntries(rows: { text: string }[]): DraftEntry[] {
	return rows.map((row) => ({ key: nextKey(), text: row.text }));
}

/**
 * Add/update/remove bound to one flat list's setter. Module-level so it is a
 * stable reference the hook can memoise against an empty dependency list.
 */
function entryHandlers(setEntries: Dispatch<SetStateAction<DraftEntry[]>>): {
	add: (text: string) => void;
	remove: (key: string) => void;
	update: (key: string, text: string) => void;
} {
	return {
		add: (text) =>
			setEntries((current) => [...current, { key: nextKey(), text }]),
		remove: (key) =>
			setEntries((current) => current.filter((entry) => entry.key !== key)),
		update: (key, text) =>
			setEntries((current) =>
				current.map((entry) => (entry.key === key ? { ...entry, text } : entry))
			),
	};
}

/**
 * The editable body of one client quotation.
 *
 * The catalogue only seeds the draft — from then on every edit is local to this
 * quotation, and saving snapshots whatever is here. Kept outside TanStack Form
 * (like the stage percentages) because a three-level array field would re-render
 * the debounced PDF preview on every keystroke.
 *
 * Stages themselves are fixed: they drive the progress-payment table, so only
 * their sections and items can be added, edited or removed.
 */
export function useQuotationDraft({
	exclusions: catalogueExclusions,
	notes: catalogueNotes,
	terms,
	tree,
}: {
	exclusions: { text: string }[] | undefined;
	notes: { text: string }[] | undefined;
	terms: QuoteTermsData | undefined;
	tree: QuoteCatalogueStageNode[] | undefined;
}) {
	const [stages, setStages] = useState<DraftStage[]>([]);
	const [termSections, setTermSections] = useState<DraftTermSection[]>([]);
	const [exclusions, setExclusions] = useState<DraftEntry[]>([]);
	const [notes, setNotes] = useState<DraftEntry[]>([]);

	// Seed once per catalogue shape. Keying on ids and counts rather than object
	// identity means an unrelated catalogue edit in another tab can't wipe a draft
	// that is already being worked on.
	const treeKey = tree
		?.map(
			(node) =>
				`${node.stage._id}:${node.sections.map((s) => s.items.length).join(',')}`
		)
		.join('|');
	const termsKey = terms?.sections
		.map((node) => `${node.section._id}:${node.items.length}`)
		.join('|');
	const exclusionsKey = catalogueExclusions?.length;
	const notesKey = catalogueNotes?.length;

	const [seededTreeKey, setSeededTreeKey] = useState<string | null>(null);
	const [seededTermsKey, setSeededTermsKey] = useState<string | null>(null);
	const [seededExclusionsKey, setSeededExclusionsKey] = useState<number | null>(
		null
	);
	const [seededNotesKey, setSeededNotesKey] = useState<number | null>(null);

	useEffect(() => {
		if (!tree || treeKey === undefined || seededTreeKey === treeKey) {
			return;
		}
		setSeededTreeKey(treeKey);
		setStages(seedStages(tree));
	}, [tree, treeKey, seededTreeKey]);

	useEffect(() => {
		if (!terms || termsKey === undefined || seededTermsKey === termsKey) {
			return;
		}
		setSeededTermsKey(termsKey);
		setTermSections(seedTermSections(terms));
	}, [terms, termsKey, seededTermsKey]);

	useEffect(() => {
		if (
			!catalogueExclusions ||
			exclusionsKey === undefined ||
			seededExclusionsKey === exclusionsKey
		) {
			return;
		}
		setSeededExclusionsKey(exclusionsKey);
		setExclusions(seedEntries(catalogueExclusions));
	}, [catalogueExclusions, exclusionsKey, seededExclusionsKey]);

	useEffect(() => {
		if (
			!catalogueNotes ||
			notesKey === undefined ||
			seededNotesKey === notesKey
		) {
			return;
		}
		setSeededNotesKey(notesKey);
		setNotes(seedEntries(catalogueNotes));
	}, [catalogueNotes, notesKey, seededNotesKey]);

	// --- Inclusions -----------------------------------------------------------

	const addSection = useCallback((stageKey: string, name: string) => {
		setStages((current) =>
			current.map((stage) =>
				stage.key === stageKey
					? {
							...stage,
							sections: [
								...stage.sections,
								{ key: nextKey(), name, items: [] },
							],
						}
					: stage
			)
		);
	}, []);

	const renameSection = useCallback(
		(stageKey: string, sectionKey: string, name: string) => {
			setStages((current) =>
				current.map((stage) =>
					stage.key === stageKey
						? {
								...stage,
								sections: stage.sections.map((section) =>
									section.key === sectionKey ? { ...section, name } : section
								),
							}
						: stage
				)
			);
		},
		[]
	);

	const removeSection = useCallback((stageKey: string, sectionKey: string) => {
		setStages((current) =>
			current.map((stage) =>
				stage.key === stageKey
					? {
							...stage,
							sections: stage.sections.filter(
								(section) => section.key !== sectionKey
							),
						}
					: stage
			)
		);
	}, []);

	const addItem = useCallback(
		(stageKey: string, sectionKey: string, name: string) => {
			setStages((current) =>
				current.map((stage) =>
					stage.key === stageKey
						? {
								...stage,
								sections: stage.sections.map((section) =>
									section.key === sectionKey
										? {
												...section,
												items: [...section.items, { key: nextKey(), name }],
											}
										: section
								),
							}
						: stage
				)
			);
		},
		[]
	);

	const updateItem = useCallback(
		(stageKey: string, sectionKey: string, itemKey: string, name: string) => {
			setStages((current) =>
				current.map((stage) =>
					stage.key === stageKey
						? {
								...stage,
								sections: stage.sections.map((section) =>
									section.key === sectionKey
										? {
												...section,
												items: section.items.map((item) =>
													item.key === itemKey ? { ...item, name } : item
												),
											}
										: section
								),
							}
						: stage
				)
			);
		},
		[]
	);

	const removeItem = useCallback(
		(stageKey: string, sectionKey: string, itemKey: string) => {
			setStages((current) =>
				current.map((stage) =>
					stage.key === stageKey
						? {
								...stage,
								sections: stage.sections.map((section) =>
									section.key === sectionKey
										? {
												...section,
												items: section.items.filter(
													(item) => item.key !== itemKey
												),
											}
										: section
								),
							}
						: stage
				)
			);
		},
		[]
	);

	// --- Terms ----------------------------------------------------------------

	const addTermSection = useCallback((name: string) => {
		setTermSections((current) => [
			...current,
			{ key: nextKey(), name, items: [] },
		]);
	}, []);

	const renameTermSection = useCallback((sectionKey: string, name: string) => {
		setTermSections((current) =>
			current.map((section) =>
				section.key === sectionKey ? { ...section, name } : section
			)
		);
	}, []);

	const removeTermSection = useCallback((sectionKey: string) => {
		setTermSections((current) =>
			current.filter((section) => section.key !== sectionKey)
		);
	}, []);

	const addTermItem = useCallback((sectionKey: string, text: string) => {
		setTermSections((current) =>
			current.map((section) =>
				section.key === sectionKey
					? { ...section, items: [...section.items, { key: nextKey(), text }] }
					: section
			)
		);
	}, []);

	const updateTermItem = useCallback(
		(sectionKey: string, itemKey: string, text: string) => {
			setTermSections((current) =>
				current.map((section) =>
					section.key === sectionKey
						? {
								...section,
								items: section.items.map((item) =>
									item.key === itemKey ? { ...item, text } : item
								),
							}
						: section
				)
			);
		},
		[]
	);

	const removeTermItem = useCallback((sectionKey: string, itemKey: string) => {
		setTermSections((current) =>
			current.map((section) =>
				section.key === sectionKey
					? {
							...section,
							items: section.items.filter((item) => item.key !== itemKey),
						}
					: section
			)
		);
	}, []);

	// --- Flat lists -----------------------------------------------------------

	const exclusionHandlers = useMemo(() => entryHandlers(setExclusions), []);
	const noteHandlers = useMemo(() => entryHandlers(setNotes), []);

	// --- Resets ---------------------------------------------------------------

	const resetStages = useCallback(() => {
		if (tree) {
			setStages(seedStages(tree));
		}
	}, [tree]);

	const resetTermSections = useCallback(() => {
		if (terms) {
			setTermSections(seedTermSections(terms));
		}
	}, [terms]);

	const resetExclusions = useCallback(() => {
		if (catalogueExclusions) {
			setExclusions(seedEntries(catalogueExclusions));
		}
	}, [catalogueExclusions]);

	const resetNotes = useCallback(() => {
		if (catalogueNotes) {
			setNotes(seedEntries(catalogueNotes));
		}
	}, [catalogueNotes]);

	const itemCount = useMemo(
		() =>
			stages.reduce(
				(sum, stage) =>
					sum +
					stage.sections.reduce(
						(sectionSum, section) => sectionSum + section.items.length,
						0
					),
				0
			),
		[stages]
	);

	return {
		addItem,
		addSection,
		addTermItem,
		addTermSection,
		exclusionHandlers,
		exclusions,
		itemCount,
		noteHandlers,
		notes,
		removeItem,
		removeSection,
		removeTermItem,
		removeTermSection,
		renameSection,
		renameTermSection,
		resetExclusions,
		resetNotes,
		resetStages,
		resetTermSections,
		stages,
		termSections,
		updateItem,
		updateTermItem,
	};
}
