'use client';

import type {
	CollisionDetection,
	DragEndEvent,
	DragOverEvent,
	DragStartEvent,
} from '@dnd-kit/core';
import {
	closestCenter,
	DndContext,
	DragOverlay,
	KeyboardSensor,
	MeasuringStrategy,
	PointerSensor,
	pointerWithin,
	useDroppable,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import {
	Accordion,
	AccordionItem,
	AccordionPanel,
	AccordionPrimitive,
} from '@workspace/ui/components/accordion';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Label } from '@workspace/ui/components/label';
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import {
	ChevronDownIcon,
	EllipsisVertical,
	GripVertical,
	Pencil,
	Plus,
	Trash2,
} from 'lucide-react';
import {
	type ReactNode,
	type Ref,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	DragHandle,
	InlineAddRow,
} from '@/components/quote-lists/list-primitives';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import AddQuoteSection from './add-quote-section';
import DeleteQuoteItem from './delete-quote-item';
import DeleteQuoteSection from './delete-quote-section';
import DeleteQuoteStage from './delete-quote-stage';
import EditQuoteItem from './edit-quote-item';
import EditQuoteSection from './edit-quote-section';
import EditQuoteStage from './edit-quote-stage';

export interface SectionNode {
	items: Doc<'quoteItems'>[];
	section: Doc<'quoteSections'>;
}

export interface StageNode {
	sections: SectionNode[];
	stage: Doc<'quoteStages'>;
}

export interface QuoteCatalogueTreeHandle {
	collapseAll: () => void;
	expandAll: () => void;
}

// Draggable/droppable ids are namespaced so a single DndContext can host all
// three levels and classify what is being dragged from the id alone.
const STAGE_PREFIX = 'stage:';
const SECTION_PREFIX = 'section:';
const ITEM_PREFIX = 'item:';
const SECTION_BOX_PREFIX = 'sectionbox:';
const ITEM_BOX_PREFIX = 'itembox:';

type DragKind = 'item' | 'itembox' | 'section' | 'sectionbox' | 'stage';

function classify(id: string): DragKind {
	if (id.startsWith(STAGE_PREFIX)) {
		return 'stage';
	}
	if (id.startsWith(SECTION_BOX_PREFIX)) {
		return 'sectionbox';
	}
	if (id.startsWith(SECTION_PREFIX)) {
		return 'section';
	}
	if (id.startsWith(ITEM_BOX_PREFIX)) {
		return 'itembox';
	}
	return 'item';
}

function rawId(id: string): string {
	return id.slice(id.indexOf(':') + 1);
}

// Stable module-level reference — a fresh object each render makes dnd-kit
// re-run its measuring effects, which with `Always` loops on setState.
const MEASURING_CONFIG = {
	droppable: { strategy: MeasuringStrategy.Always },
};

// Standalone accordion toggle rendered after the action buttons so the chevron
// sits at the far right of the header instead of beside the name.
function AccordionChevronTrigger({ label }: { label: string }) {
	return (
		<AccordionPrimitive.Trigger
			aria-label={label}
			className="flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring data-panel-open:[&>svg]:rotate-180"
		>
			<ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 ease-in-out" />
		</AccordionPrimitive.Trigger>
	);
}

function InlineAddItem({ sectionId }: { sectionId: Id<'quoteSections'> }) {
	const addItem = useMutation(api.quoteItems.add.add);
	return (
		<InlineAddRow
			noun="item"
			// New items are included on quotations by default, matching the dialog.
			onAdd={(name) => addItem({ name, sectionId, isDefault: true })}
			placeholder="Add an item and press Enter…"
		/>
	);
}

function InlineAddSection({ stageId }: { stageId: Id<'quoteStages'> }) {
	const addSection = useMutation(api.quoteSections.add.add);
	return (
		<InlineAddRow
			noun="section"
			onAdd={(name) => addSection({ name, stageId })}
			placeholder="Add a section and press Enter…"
		/>
	);
}

function InlineAddStage() {
	const addStage = useMutation(api.quoteStages.add.add);
	return (
		<InlineAddRow
			noun="stage"
			// Starts at 0% so the stage counts toward the percentage total right away
			// instead of reading as "not set".
			onAdd={(name) => addStage({ defaultPercent: 0, name })}
			placeholder="Add a stage and press Enter…"
		/>
	);
}

function ItemRow({
	item,
	number,
	stageId,
	dndEnabled,
}: {
	item: Doc<'quoteItems'>;
	number: string;
	stageId: Id<'quoteStages'>;
	dndEnabled: boolean;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: `${ITEM_PREFIX}${item._id}`,
		disabled: !dndEnabled,
	});
	const toggleDefault = useMutation(api.quoteItems.toggleDefault.toggleDefault);
	const checkboxId = `default-${item._id}`;
	// The menu closes on click, so its dialogs are controlled from here rather
	// than mounted inside a MenuItem.
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		<div
			className="flex items-center gap-2 bg-card px-3 py-2"
			ref={setNodeRef}
			style={{
				transform: CSS.Translate.toString(transform),
				transition,
				opacity: isDragging ? 0.4 : 1,
			}}
		>
			{dndEnabled ? (
				<DragHandle
					attributes={attributes}
					label={`Reorder ${item.name}`}
					listeners={listeners}
				/>
			) : (
				<span aria-hidden className="w-4 shrink-0" />
			)}
			<span className="shrink-0 text-muted-foreground text-xs tabular-nums">
				{number}
			</span>
			<p className="min-w-0 flex-1 text-foreground text-sm">{item.name}</p>
			<div className="flex shrink-0 items-center gap-2">
				<Checkbox
					checked={item.isDefault}
					id={checkboxId}
					onCheckedChange={(checked) => {
						toggleDefault({ itemId: item._id, isDefault: checked }).catch(
							(error) => {
								toastManager.add({
									description: getConvexErrorMessage(
										error,
										'Could not update this item. Please try again in a moment.'
									),
									title: 'Could not update default',
									type: 'error',
								});
							}
						);
					}}
				/>
				<Label className="text-muted-foreground text-xs" htmlFor={checkboxId}>
					Default
				</Label>
			</div>
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label={`${item.name} actions`}
							size="icon"
							type="button"
							variant="ghost"
						/>
					}
				>
					<EllipsisVertical className="size-4" />
				</MenuTrigger>
				<MenuPopup align="end">
					<MenuItem onClick={() => setEditOpen(true)}>
						<Pencil />
						Edit Item
					</MenuItem>
					<MenuSeparator />
					<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
						<Trash2 />
						Delete Item
					</MenuItem>
				</MenuPopup>
			</Menu>
			<EditQuoteItem
				initialIsDefault={item.isDefault}
				initialName={item.name}
				initialSectionId={item.sectionId}
				initialStageId={stageId}
				itemId={item._id}
				onOpenChange={setEditOpen}
				open={editOpen}
			/>
			<DeleteQuoteItem
				itemId={item._id}
				itemName={item.name}
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
			/>
		</div>
	);
}

function ItemList({
	node,
	stageId,
	dndEnabled,
	numberOf,
}: {
	node: SectionNode;
	stageId: Id<'quoteStages'>;
	dndEnabled: boolean;
	numberOf: (id: string) => string;
}) {
	// Droppable so an empty section still accepts drops.
	const { setNodeRef } = useDroppable({
		id: `${ITEM_BOX_PREFIX}${node.section._id}`,
	});
	const itemIds = useMemo(
		() => node.items.map((item) => `${ITEM_PREFIX}${item._id}`),
		[node.items]
	);

	return (
		<div className="flex flex-col gap-2" ref={setNodeRef}>
			<InlineAddItem sectionId={node.section._id} />
			<SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
				{node.items.length === 0 ? (
					<div className="rounded-md border border-dashed px-3 py-4 text-center text-muted-foreground text-xs">
						No items in this section yet.
					</div>
				) : (
					<div className="divide-y overflow-hidden rounded-md border">
						{node.items.map((item) => (
							<ItemRow
								dndEnabled={dndEnabled}
								item={item}
								key={item._id}
								number={numberOf(item._id)}
								stageId={stageId}
							/>
						))}
					</div>
				)}
			</SortableContext>
		</div>
	);
}

function SectionAccordionItem({
	node,
	stageId,
	dndEnabled,
	numberOf,
}: {
	node: SectionNode;
	stageId: Id<'quoteStages'>;
	dndEnabled: boolean;
	numberOf: (id: string) => string;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: `${SECTION_PREFIX}${node.section._id}`,
		disabled: !dndEnabled,
	});
	// The menu closes on click, so its dialogs are controlled from here rather
	// than mounted inside a MenuItem.
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		<div
			className="rounded-md border bg-card"
			ref={setNodeRef}
			style={{
				transform: CSS.Translate.toString(transform),
				transition,
				opacity: isDragging ? 0.4 : 1,
			}}
		>
			<AccordionItem
				className="border-b-0"
				value={`${SECTION_PREFIX}${node.section._id}`}
			>
				<AccordionPrimitive.Header className="flex items-center gap-2 px-3">
					{dndEnabled ? (
						<DragHandle
							attributes={attributes}
							label={`Reorder ${node.section.name}`}
							listeners={listeners}
						/>
					) : (
						<span aria-hidden className="w-4 shrink-0" />
					)}
					<AccordionPrimitive.Trigger className="flex flex-1 cursor-pointer items-center gap-2 rounded-md py-3 text-left text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring">
						<span className="text-muted-foreground tabular-nums">
							{numberOf(node.section._id)}
						</span>
						<span className="font-medium">{node.section.name}</span>
						<Badge variant="secondary">{node.items.length}</Badge>
					</AccordionPrimitive.Trigger>
					<Menu>
						<MenuTrigger
							render={
								<Button
									aria-label={`${node.section.name} actions`}
									size="icon"
									type="button"
									variant="ghost"
								/>
							}
						>
							<EllipsisVertical className="size-4" />
						</MenuTrigger>
						<MenuPopup align="end">
							<MenuItem onClick={() => setEditOpen(true)}>
								<Pencil />
								Edit Section
							</MenuItem>
							<MenuSeparator />
							<MenuItem
								onClick={() => setDeleteOpen(true)}
								variant="destructive"
							>
								<Trash2 />
								Delete Section
							</MenuItem>
						</MenuPopup>
					</Menu>
					<AccordionChevronTrigger label={`Toggle ${node.section.name}`} />
				</AccordionPrimitive.Header>
				<AccordionPanel className="px-3">
					<ItemList
						dndEnabled={dndEnabled}
						node={node}
						numberOf={numberOf}
						stageId={stageId}
					/>
				</AccordionPanel>
			</AccordionItem>
			<EditQuoteSection
				initialName={node.section.name}
				initialStageId={stageId}
				onOpenChange={setEditOpen}
				open={editOpen}
				sectionId={node.section._id}
			/>
			<DeleteQuoteSection
				itemCount={node.items.length}
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				sectionId={node.section._id}
				sectionName={node.section.name}
			/>
		</div>
	);
}

function SectionList({
	node,
	dndEnabled,
	openKeys,
	onOpenKeysChange,
	numberOf,
}: {
	node: StageNode;
	dndEnabled: boolean;
	openKeys: string[];
	onOpenKeysChange: (next: string[]) => void;
	numberOf: (id: string) => string;
}) {
	// Droppable so a stage with no sections still accepts drops.
	const { setNodeRef } = useDroppable({
		id: `${SECTION_BOX_PREFIX}${node.stage._id}`,
	});
	const sectionIds = useMemo(
		() => node.sections.map((s) => `${SECTION_PREFIX}${s.section._id}`),
		[node.sections]
	);

	return (
		<div className="flex flex-col gap-2" ref={setNodeRef}>
			<InlineAddSection stageId={node.stage._id} />
			<SortableContext
				items={sectionIds}
				strategy={verticalListSortingStrategy}
			>
				{node.sections.length === 0 ? (
					<div className="rounded-md border border-dashed px-3 py-4 text-center text-muted-foreground text-xs">
						No sections in this stage yet.
					</div>
				) : (
					<Accordion
						className="flex flex-col gap-2"
						multiple
						onValueChange={(value) => onOpenKeysChange(value as string[])}
						value={openKeys}
					>
						{node.sections.map((sectionNode) => (
							<SectionAccordionItem
								dndEnabled={dndEnabled}
								key={sectionNode.section._id}
								node={sectionNode}
								numberOf={numberOf}
								stageId={node.stage._id}
							/>
						))}
					</Accordion>
				)}
			</SortableContext>
		</div>
	);
}

function StageAccordionItem({
	node,
	dndEnabled,
	openKeys,
	onOpenKeysChange,
	numberOf,
}: {
	node: StageNode;
	dndEnabled: boolean;
	openKeys: string[];
	onOpenKeysChange: (next: string[]) => void;
	numberOf: (id: string) => string;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: `${STAGE_PREFIX}${node.stage._id}`,
		disabled: !dndEnabled,
	});
	const itemCount = node.sections.reduce((sum, s) => sum + s.items.length, 0);
	// The menu closes on click, so its dialogs are controlled from here rather
	// than mounted inside a MenuItem.
	const [addSectionOpen, setAddSectionOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		<div
			className="rounded-lg border bg-card"
			ref={setNodeRef}
			style={{
				transform: CSS.Translate.toString(transform),
				transition,
				opacity: isDragging ? 0.4 : 1,
			}}
		>
			<AccordionItem
				className="border-b-0"
				value={`${STAGE_PREFIX}${node.stage._id}`}
			>
				<AccordionPrimitive.Header className="flex items-center gap-2 px-3">
					{dndEnabled ? (
						<DragHandle
							attributes={attributes}
							label={`Reorder ${node.stage.name}`}
							listeners={listeners}
						/>
					) : (
						<span aria-hidden className="w-4 shrink-0" />
					)}
					<AccordionPrimitive.Trigger className="flex flex-1 cursor-pointer items-center gap-2 rounded-md py-4 text-left text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring">
						<span className="text-muted-foreground tabular-nums">
							{numberOf(node.stage._id)}
						</span>
						<span className="font-medium">{node.stage.name}</span>
						<Badge size="lg" variant="secondary">
							{node.sections.length} sections
						</Badge>
						<Badge size="lg" variant="secondary">
							{itemCount} items
						</Badge>
						{node.stage.defaultPercent === undefined ? null : (
							<Badge size="lg" variant="outline">
								{node.stage.defaultPercent}%
							</Badge>
						)}
					</AccordionPrimitive.Trigger>
					<Menu>
						<MenuTrigger
							render={
								<Button
									aria-label={`${node.stage.name} actions`}
									size="icon"
									type="button"
									variant="ghost"
								/>
							}
						>
							<EllipsisVertical className="size-4" />
						</MenuTrigger>
						<MenuPopup align="end">
							<MenuItem onClick={() => setAddSectionOpen(true)}>
								<Plus />
								Add Section
							</MenuItem>
							<MenuSeparator />
							<MenuItem onClick={() => setEditOpen(true)}>
								<Pencil />
								Edit Stage
							</MenuItem>
							<MenuItem
								onClick={() => setDeleteOpen(true)}
								variant="destructive"
							>
								<Trash2 />
								Delete Stage
							</MenuItem>
						</MenuPopup>
					</Menu>
					<AccordionChevronTrigger label={`Toggle ${node.stage.name}`} />
				</AccordionPrimitive.Header>
				<AccordionPanel className="px-3">
					<SectionList
						dndEnabled={dndEnabled}
						node={node}
						numberOf={numberOf}
						onOpenKeysChange={onOpenKeysChange}
						openKeys={openKeys}
					/>
				</AccordionPanel>
			</AccordionItem>
			<AddQuoteSection
				initialStageId={node.stage._id}
				onOpenChange={setAddSectionOpen}
				open={addSectionOpen}
			/>
			<EditQuoteStage
				initialDefaultPercent={node.stage.defaultPercent}
				initialName={node.stage.name}
				initialScopeSummary={node.stage.scopeSummary}
				onOpenChange={setEditOpen}
				open={editOpen}
				stageId={node.stage._id}
			/>
			<DeleteQuoteStage
				itemCount={itemCount}
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				sectionCount={node.sections.length}
				stageId={node.stage._id}
				stageName={node.stage.name}
			/>
		</div>
	);
}

function matchesText(value: string | undefined, needle: string): boolean {
	return (value ?? '').toLowerCase().includes(needle);
}

/**
 * Filters the tree to stages/sections/items matching `needle`. A match at any
 * level keeps that node's whole subtree, so searching a stage name shows all of
 * its sections and items.
 */
function filterTree(tree: StageNode[], needle: string): StageNode[] {
	const filtered: StageNode[] = [];
	for (const stageNode of tree) {
		if (matchesText(stageNode.stage.name, needle)) {
			filtered.push(stageNode);
			continue;
		}
		const sections: SectionNode[] = [];
		for (const sectionNode of stageNode.sections) {
			if (matchesText(sectionNode.section.name, needle)) {
				sections.push(sectionNode);
				continue;
			}
			const items = sectionNode.items.filter((item) =>
				matchesText(item.name, needle)
			);
			if (items.length > 0) {
				sections.push({ ...sectionNode, items });
			}
		}
		if (sections.length > 0) {
			filtered.push({ ...stageNode, sections });
		}
	}
	return filtered;
}

/**
 * Outline numbers keyed by document id — `1` for the first stage, `1.1` for its
 * first section, `1.1.1` for that section's first item. Always computed from the
 * unfiltered tree so numbers stay stable while a search narrows what is shown.
 */
function buildNumbers(tree: StageNode[]): Map<string, string> {
	const numbers = new Map<string, string>();
	for (const [stageIndex, stageNode] of tree.entries()) {
		const stageNumber = String(stageIndex + 1);
		numbers.set(stageNode.stage._id, stageNumber);
		for (const [sectionIndex, sectionNode] of stageNode.sections.entries()) {
			const sectionNumber = `${stageNumber}.${sectionIndex + 1}`;
			numbers.set(sectionNode.section._id, sectionNumber);
			for (const [itemIndex, item] of sectionNode.items.entries()) {
				numbers.set(item._id, `${sectionNumber}.${itemIndex + 1}`);
			}
		}
	}
	return numbers;
}

function allKeys(tree: StageNode[]): {
	sectionKeys: string[];
	stageKeys: string[];
} {
	const stageKeys: string[] = [];
	const sectionKeys: string[] = [];
	for (const stageNode of tree) {
		stageKeys.push(`${STAGE_PREFIX}${stageNode.stage._id}`);
		for (const sectionNode of stageNode.sections) {
			sectionKeys.push(`${SECTION_PREFIX}${sectionNode.section._id}`);
		}
	}
	return { stageKeys, sectionKeys };
}

function findSectionStageId(
	tree: StageNode[],
	sectionId: string
): Id<'quoteStages'> | null {
	for (const stageNode of tree) {
		if (stageNode.sections.some((s) => s.section._id === sectionId)) {
			return stageNode.stage._id;
		}
	}
	return null;
}

function findItemSectionId(
	tree: StageNode[],
	itemId: string
): Id<'quoteSections'> | null {
	for (const stageNode of tree) {
		for (const sectionNode of stageNode.sections) {
			if (sectionNode.items.some((item) => item._id === itemId)) {
				return sectionNode.section._id;
			}
		}
	}
	return null;
}

export function QuoteCatalogueTree({
	tree: serverTree,
	search = '',
	loadingLabel = 'Loading catalogue…',
	noResults,
	empty,
	banner,
	ref,
}: {
	tree: StageNode[] | undefined;
	search?: string;
	loadingLabel?: string;
	noResults?: ReactNode;
	// Shown below the inline add-stage box when the catalogue has no stages yet.
	empty?: ReactNode;
	// Persistent notice rendered directly under the inline add-stage box.
	banner?: ReactNode;
	ref?: Ref<QuoteCatalogueTreeHandle>;
}) {
	const reorderStages = useMutation(api.quoteStages.reorder.reorder);
	const reorderSections = useMutation(api.quoteSections.reorder.reorder);
	const reorderItems = useMutation(api.quoteItems.reorder.reorder);

	const [tree, setTree] = useState<StageNode[]>([]);
	// Stage and section open-state are tracked separately: each stage panel hosts
	// its own nested Accordion, whose onValueChange only ever reports that stage's
	// section keys, so a single shared list would be clobbered on every toggle.
	const [openStageKeys, setOpenStageKeys] = useState<string[]>([]);
	const [openSectionKeys, setOpenSectionKeys] = useState<string[]>([]);
	const [activeId, setActiveId] = useState<string | null>(null);
	const scrollerRef = useRef<HTMLDivElement>(null);
	// Signature of the last cross-container move applied in onDragOver; guards
	// against re-processing an identical hover and looping at a container boundary.
	const lastDragOverRef = useRef<string | null>(null);

	// Mirror server data into local state so drags can relocate nodes
	// optimistically. Never overwrite mid-drag or the dragged node would snap back.
	useEffect(() => {
		if (serverTree && !activeId) {
			setTree(serverTree);
		}
	}, [serverTree, activeId]);

	useImperativeHandle(
		ref,
		() => ({
			expandAll: () => {
				const { stageKeys: s, sectionKeys } = allKeys(tree);
				setOpenStageKeys(s);
				setOpenSectionKeys(sectionKeys);
			},
			collapseAll: () => {
				setOpenStageKeys([]);
				setOpenSectionKeys([]);
			},
		}),
		[tree]
	);

	const trimmedSearch = search.trim().toLowerCase();
	const displayTree = useMemo(
		() => (trimmedSearch ? filterTree(tree, trimmedSearch) : tree),
		[tree, trimmedSearch]
	);
	const dndEnabled = trimmedSearch === '';
	const numbers = useMemo(() => buildNumbers(tree), [tree]);
	const numberOf = useCallback(
		(id: string) => numbers.get(id) ?? '',
		[numbers]
	);
	// While searching, force every matching node open so hits are visible.
	const forcedKeys = useMemo(() => allKeys(displayTree), [displayTree]);
	const effectiveStageKeys = trimmedSearch
		? forcedKeys.stageKeys
		: openStageKeys;
	const effectiveSectionKeys = trimmedSearch
		? forcedKeys.sectionKeys
		: openSectionKeys;

	// Replace only the section keys belonging to `node`; the nested Accordion
	// reports its own values in isolation.
	const changeSectionKeys = (node: StageNode, next: string[]) => {
		const mine = new Set(
			node.sections.map((s) => `${SECTION_PREFIX}${s.section._id}`)
		);
		setOpenSectionKeys((prev) => [
			...prev.filter((key) => !mine.has(key)),
			...next,
		]);
	};

	const stageIds = useMemo(
		() => displayTree.map((n) => `${STAGE_PREFIX}${n.stage._id}`),
		[displayTree]
	);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	// Only allow autoscroll on our own scroller — dnd-kit would otherwise scroll an
	// ancestor, moving every droppable under a stationary pointer and flip-flopping
	// `over` until React throws "Maximum update depth exceeded".
	const autoScroll = useMemo(
		() => ({
			canScroll: (element: Element) => element === scrollerRef.current,
		}),
		[]
	);

	// Each level only collides with droppables of its own kind (plus that kind's
	// container), so a stage drag never targets an item row and vice versa.
	const collisionDetection: CollisionDetection = (args) => {
		const kind = classify(String(args.active.id));
		if (kind === 'stage') {
			return closestCenter({
				...args,
				droppableContainers: args.droppableContainers.filter(
					(c) => classify(String(c.id)) === 'stage'
				),
			});
		}
		const pointerHits = pointerWithin(args);
		const hits = pointerHits.length > 0 ? pointerHits : closestCenter(args);
		if (hits.length === 0) {
			return hits;
		}
		const own = kind === 'section' ? 'section' : 'item';
		const box = kind === 'section' ? 'sectionbox' : 'itembox';
		const direct = hits.find((c) => classify(String(c.id)) === own);
		if (direct) {
			return [direct];
		}
		const container = hits.find((c) => classify(String(c.id)) === box);
		return container ? [container] : [];
	};

	/** The section a section-level drop targets, from the hovered droppable id. */
	const resolveSectionParent = (
		source: StageNode[],
		overId: string
	): Id<'quoteStages'> | null => {
		const kind = classify(overId);
		if (kind === 'sectionbox') {
			return rawId(overId) as Id<'quoteStages'>;
		}
		if (kind === 'section') {
			return findSectionStageId(source, rawId(overId));
		}
		return null;
	};

	/** The section an item-level drop targets, from the hovered droppable id. */
	const resolveItemParent = (
		source: StageNode[],
		overId: string
	): Id<'quoteSections'> | null => {
		const kind = classify(overId);
		if (kind === 'itembox') {
			return rawId(overId) as Id<'quoteSections'>;
		}
		if (kind === 'item') {
			return findItemSectionId(source, rawId(overId));
		}
		return null;
	};

	const moveSection = (
		source: StageNode[],
		sectionId: string,
		targetStageId: Id<'quoteStages'>,
		overId: string
	): StageNode[] => {
		const moving = source
			.flatMap((n) => n.sections)
			.find((s) => s.section._id === sectionId);
		if (!moving) {
			return source;
		}
		return source.map((stageNode) => {
			const without = stageNode.sections.filter(
				(s) => s.section._id !== sectionId
			);
			if (stageNode.stage._id !== targetStageId) {
				return without.length === stageNode.sections.length
					? stageNode
					: { ...stageNode, sections: without };
			}
			const overIndex =
				classify(overId) === 'section'
					? without.findIndex((s) => s.section._id === rawId(overId))
					: -1;
			const next = [...without];
			next.splice(overIndex >= 0 ? overIndex : next.length, 0, moving);
			return { ...stageNode, sections: next };
		});
	};

	const moveItem = (
		source: StageNode[],
		itemId: string,
		targetSectionId: Id<'quoteSections'>,
		overId: string
	): StageNode[] => {
		let moving: Doc<'quoteItems'> | undefined;
		for (const stageNode of source) {
			for (const sectionNode of stageNode.sections) {
				const found = sectionNode.items.find((item) => item._id === itemId);
				if (found) {
					moving = found;
				}
			}
		}
		if (!moving) {
			return source;
		}
		const item = moving;
		return source.map((stageNode) => ({
			...stageNode,
			sections: stageNode.sections.map((sectionNode) => {
				const without = sectionNode.items.filter((i) => i._id !== itemId);
				if (sectionNode.section._id !== targetSectionId) {
					return without.length === sectionNode.items.length
						? sectionNode
						: { ...sectionNode, items: without };
				}
				const overIndex =
					classify(overId) === 'item'
						? without.findIndex((i) => i._id === rawId(overId))
						: -1;
				const next = [...without];
				next.splice(overIndex >= 0 ? overIndex : next.length, 0, item);
				return { ...sectionNode, items: next };
			}),
		}));
	};

	const persistSections = (source: StageNode[]) => {
		const updates = source.flatMap((stageNode) =>
			stageNode.sections.map((sectionNode, index) => ({
				sectionId: sectionNode.section._id,
				stageId: stageNode.stage._id,
				order: index,
			}))
		);
		if (updates.length > 0) {
			reorderSections({ updates }).catch(() => {
				/* Convex reactive queries revert the UI automatically */
			});
		}
	};

	const persistItems = (source: StageNode[]) => {
		const updates = source.flatMap((stageNode) =>
			stageNode.sections.flatMap((sectionNode) =>
				sectionNode.items.map((item, index) => ({
					itemId: item._id,
					sectionId: sectionNode.section._id,
					order: index,
				}))
			)
		);
		if (updates.length > 0) {
			reorderItems({ updates }).catch(() => {
				/* Convex reactive queries revert the UI automatically */
			});
		}
	};

	const onDragStart = (event: DragStartEvent) => {
		setActiveId(String(event.active.id));
		lastDragOverRef.current = null;
	};

	const onDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over) {
			return;
		}
		const activeDndId = String(active.id);
		const overDndId = String(over.id);
		const kind = classify(activeDndId);
		if (kind !== 'section' && kind !== 'item') {
			return;
		}
		// Skip if this exact hover was already applied — stops boundary flip-flop
		// from re-triggering setTree in a loop.
		const signature = `${activeDndId}:${overDndId}`;
		if (lastDragOverRef.current === signature) {
			return;
		}
		lastDragOverRef.current = signature;

		setTree((prev) => {
			if (kind === 'section') {
				const sectionId = rawId(activeDndId);
				const targetStageId = resolveSectionParent(prev, overDndId);
				const currentStageId = findSectionStageId(prev, sectionId);
				if (
					!(targetStageId && currentStageId) ||
					targetStageId === currentStageId
				) {
					return prev;
				}
				return moveSection(prev, sectionId, targetStageId, overDndId);
			}
			const itemId = rawId(activeDndId);
			const targetSectionId = resolveItemParent(prev, overDndId);
			const currentSectionId = findItemSectionId(prev, itemId);
			if (
				!(targetSectionId && currentSectionId) ||
				targetSectionId === currentSectionId
			) {
				return prev;
			}
			return moveItem(prev, itemId, targetSectionId, overDndId);
		});
	};

	const onDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		const activeDndId = String(active.id);
		const kind = classify(activeDndId);
		setActiveId(null);
		if (!over) {
			return;
		}
		const overDndId = String(over.id);

		if (kind === 'stage') {
			if (activeDndId === overDndId) {
				return;
			}
			const oldIndex = stageIds.indexOf(activeDndId);
			const newIndex = stageIds.indexOf(overDndId);
			if (oldIndex === -1 || newIndex === -1) {
				return;
			}
			const ordered = arrayMove(stageIds, oldIndex, newIndex);
			const byKey = new Map(
				tree.map((n) => [`${STAGE_PREFIX}${n.stage._id}`, n])
			);
			const next = ordered
				.map((key) => byKey.get(key))
				.filter((n): n is StageNode => Boolean(n));
			setTree(next);
			reorderStages({
				stageIds: next.map((n) => n.stage._id),
			}).catch(() => {
				/* Convex reactive queries revert the UI automatically */
			});
			return;
		}

		if (kind === 'section') {
			const sectionId = rawId(activeDndId);
			const targetStageId = resolveSectionParent(tree, overDndId);
			const currentStageId = findSectionStageId(tree, sectionId);
			if (!(targetStageId && currentStageId)) {
				return;
			}
			let next: StageNode[];
			if (
				targetStageId === currentStageId &&
				classify(overDndId) === 'section'
			) {
				next = tree.map((stageNode) => {
					if (stageNode.stage._id !== targetStageId) {
						return stageNode;
					}
					const oldIndex = stageNode.sections.findIndex(
						(s) => s.section._id === sectionId
					);
					const newIndex = stageNode.sections.findIndex(
						(s) => s.section._id === rawId(overDndId)
					);
					if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
						return stageNode;
					}
					return {
						...stageNode,
						sections: arrayMove(stageNode.sections, oldIndex, newIndex),
					};
				});
			} else {
				next = moveSection(tree, sectionId, targetStageId, overDndId);
				setOpenStageKeys((prev) => {
					const stageKey = `${STAGE_PREFIX}${targetStageId}`;
					return prev.includes(stageKey) ? prev : [...prev, stageKey];
				});
			}
			setTree(next);
			persistSections(next);
			return;
		}

		const itemId = rawId(activeDndId);
		const targetSectionId = resolveItemParent(tree, overDndId);
		const currentSectionId = findItemSectionId(tree, itemId);
		if (!(targetSectionId && currentSectionId)) {
			return;
		}
		let next: StageNode[];
		if (
			targetSectionId === currentSectionId &&
			classify(overDndId) === 'item'
		) {
			next = tree.map((stageNode) => ({
				...stageNode,
				sections: stageNode.sections.map((sectionNode) => {
					if (sectionNode.section._id !== targetSectionId) {
						return sectionNode;
					}
					const oldIndex = sectionNode.items.findIndex((i) => i._id === itemId);
					const newIndex = sectionNode.items.findIndex(
						(i) => i._id === rawId(overDndId)
					);
					if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
						return sectionNode;
					}
					return {
						...sectionNode,
						items: arrayMove(sectionNode.items, oldIndex, newIndex),
					};
				}),
			}));
		} else {
			next = moveItem(tree, itemId, targetSectionId, overDndId);
			setOpenSectionKeys((prev) => {
				const sectionKey = `${SECTION_PREFIX}${targetSectionId}`;
				return prev.includes(sectionKey) ? prev : [...prev, sectionKey];
			});
		}
		setTree(next);
		persistItems(next);
	};

	const activeLabel = useMemo(() => {
		if (!activeId) {
			return null;
		}
		const kind = classify(activeId);
		const id = rawId(activeId);
		for (const stageNode of tree) {
			if (kind === 'stage' && stageNode.stage._id === id) {
				return stageNode.stage.name;
			}
			for (const sectionNode of stageNode.sections) {
				if (kind === 'section' && sectionNode.section._id === id) {
					return sectionNode.section.name;
				}
				const item = sectionNode.items.find((i) => i._id === id);
				if (kind === 'item' && item) {
					return item.name;
				}
			}
		}
		return null;
	}, [activeId, tree]);

	if (!serverTree) {
		return <div className="text-muted-foreground text-sm">{loadingLabel}</div>;
	}

	if (trimmedSearch !== '' && displayTree.length === 0 && noResults) {
		return <>{noResults}</>;
	}

	return (
		<div className="min-h-0 flex-1 overflow-y-auto" ref={scrollerRef}>
			{/* Hidden while searching: the box would look like a filtered result. */}
			{dndEnabled ? (
				<div className="mb-3">
					<InlineAddStage />
				</div>
			) : null}
			{banner ? <div className="mb-3">{banner}</div> : null}
			{displayTree.length === 0 && !trimmedSearch ? empty : null}
			<DndContext
				autoScroll={autoScroll}
				collisionDetection={collisionDetection}
				measuring={MEASURING_CONFIG}
				onDragEnd={onDragEnd}
				onDragOver={onDragOver}
				onDragStart={onDragStart}
				sensors={sensors}
			>
				<Accordion
					className="flex flex-col gap-3"
					multiple
					onValueChange={(value) => setOpenStageKeys(value as string[])}
					value={effectiveStageKeys}
				>
					<SortableContext
						items={stageIds}
						strategy={verticalListSortingStrategy}
					>
						{displayTree.map((stageNode) => (
							<StageAccordionItem
								dndEnabled={dndEnabled}
								key={stageNode.stage._id}
								node={stageNode}
								numberOf={numberOf}
								onOpenKeysChange={(next) => changeSectionKeys(stageNode, next)}
								openKeys={effectiveSectionKeys}
							/>
						))}
					</SortableContext>
				</Accordion>
				<DragOverlay>
					{activeLabel ? (
						<div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 shadow-md">
							<GripVertical className="size-4 text-muted-foreground" />
							<span className="font-medium text-sm">{activeLabel}</span>
						</div>
					) : null}
				</DragOverlay>
			</DndContext>
		</div>
	);
}
