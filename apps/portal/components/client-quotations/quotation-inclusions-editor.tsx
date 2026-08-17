'use client';

import {
	Accordion,
	AccordionItem,
	AccordionPanel,
	AccordionPrimitive,
} from '@workspace/ui/components/accordion';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import {
	ChevronDownIcon,
	EllipsisVertical,
	Pencil,
	Trash2,
} from 'lucide-react';
import { useState } from 'react';
import {
	DraftDeleteDialog,
	DraftInlineAdd,
	DraftRenameDialog,
	DraftTextRow,
} from './quotation-draft-primitives';
import type { DraftSection, DraftStage } from './use-quotation-draft';

// Standalone toggle rendered after the actions so the chevron sits at the far
// right of the header, matching the catalogue tree.
function ChevronTrigger({ label }: { label: string }) {
	return (
		<AccordionPrimitive.Trigger
			aria-label={label}
			className="flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring data-panel-open:[&>svg]:rotate-180"
		>
			<ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 ease-in-out" />
		</AccordionPrimitive.Trigger>
	);
}

function SectionAccordionItem({
	number,
	onAddItem,
	onRemove,
	onRemoveItem,
	onRename,
	onUpdateItem,
	section,
}: {
	number: string;
	onAddItem: (name: string) => void;
	onRemove: () => void;
	onRemoveItem: (itemKey: string) => void;
	onRename: (name: string) => void;
	onUpdateItem: (itemKey: string, name: string) => void;
	section: DraftSection;
}) {
	// The menu closes on click, so its dialogs are controlled from here rather
	// than mounted inside a MenuItem.
	const [renameOpen, setRenameOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		<div className="rounded-md border bg-card">
			<AccordionItem className="border-b-0" value={section.key}>
				<AccordionPrimitive.Header className="flex items-center gap-2 px-3">
					<AccordionPrimitive.Trigger className="flex flex-1 cursor-pointer items-center gap-2 rounded-md py-3 text-left text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring">
						<span className="text-muted-foreground tabular-nums">{number}</span>
						<span className="font-medium">{section.name}</span>
						<Badge variant="secondary">{section.items.length}</Badge>
					</AccordionPrimitive.Trigger>
					<Menu>
						<MenuTrigger
							render={
								<Button
									aria-label={`${section.name} actions`}
									size="icon"
									type="button"
									variant="ghost"
								/>
							}
						>
							<EllipsisVertical className="size-4" />
						</MenuTrigger>
						<MenuPopup align="end">
							<MenuItem onClick={() => setRenameOpen(true)}>
								<Pencil />
								Rename Section
							</MenuItem>
							<MenuSeparator />
							<MenuItem
								onClick={() => setDeleteOpen(true)}
								variant="destructive"
							>
								<Trash2 />
								Remove Section
							</MenuItem>
						</MenuPopup>
					</Menu>
					<ChevronTrigger label={`Toggle ${section.name}`} />
				</AccordionPrimitive.Header>
				<AccordionPanel className="px-3">
					<div className="flex flex-col gap-3 pb-3">
						<DraftInlineAdd
							noun="item"
							onAdd={onAddItem}
							placeholder="Add an item and press Enter…"
						/>
						{section.items.length > 0 ? (
							<div className="divide-y overflow-hidden rounded-md border">
								{section.items.map((item, index) => (
									<DraftTextRow
										key={item.key}
										label={`item ${number}.${index + 1}`}
										number={`${number}.${index + 1}`}
										onChange={(name) => onUpdateItem(item.key, name)}
										onRemove={() => onRemoveItem(item.key)}
										value={item.name}
									/>
								))}
							</div>
						) : (
							<p className="rounded-md border border-dashed px-3 py-4 text-center text-muted-foreground text-sm">
								No items in this section yet.
							</p>
						)}
					</div>
				</AccordionPanel>
			</AccordionItem>
			<DraftRenameDialog
				initialValue={section.name}
				label="Section name"
				onOpenChange={setRenameOpen}
				onSave={onRename}
				open={renameOpen}
				title="Rename Section"
			/>
			<DraftDeleteDialog
				description={`This removes "${section.name}" and its ${section.items.length} item(s) from this quotation. The catalogue is not changed.`}
				noun="section"
				onConfirm={onRemove}
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
			/>
		</div>
	);
}

/**
 * The quotation's own copy of "what each stage includes".
 *
 * Seeded from the catalogue's default items, then edited freely for this one
 * project. Stages are fixed — they carry the progress payments — so only their
 * sections and items can be added, reworded or removed. Ordering comes from the
 * catalogue and new rows append, which is why there is no drag-and-drop here.
 */
export default function QuotationInclusionsEditor({
	onAddItem,
	onAddSection,
	onRemoveItem,
	onRemoveSection,
	onRenameSection,
	onUpdateItem,
	percentOf,
	stages,
}: {
	onAddItem: (stageKey: string, sectionKey: string, name: string) => void;
	onAddSection: (stageKey: string, name: string) => void;
	onRemoveItem: (stageKey: string, sectionKey: string, itemKey: string) => void;
	onRemoveSection: (stageKey: string, sectionKey: string) => void;
	onRenameSection: (stageKey: string, sectionKey: string, name: string) => void;
	onUpdateItem: (
		stageKey: string,
		sectionKey: string,
		itemKey: string,
		name: string
	) => void;
	percentOf: (stage: DraftStage) => string;
	stages: DraftStage[];
}) {
	if (stages.length === 0) {
		return (
			<p className="text-muted-foreground text-sm">
				No quote stages yet. Add them on the Quotations page.
			</p>
		);
	}

	return (
		<Accordion className="flex flex-col gap-2">
			{stages.map((stage, stageIndex) => {
				const itemCount = stage.sections.reduce(
					(sum, section) => sum + section.items.length,
					0
				);
				const stageNumber = stageIndex + 1;
				const percent = percentOf(stage);

				return (
					<div className="rounded-lg border bg-card" key={stage.key}>
						<AccordionItem className="border-b-0" value={stage.key}>
							<AccordionPrimitive.Header className="flex items-center gap-2 px-3">
								<AccordionPrimitive.Trigger className="flex flex-1 cursor-pointer items-center gap-2 rounded-md py-4 text-left text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring">
									<span className="text-muted-foreground tabular-nums">
										{stageNumber}
									</span>
									<span className="font-medium">{stage.name}</span>
									<Badge size="lg" variant="secondary">
										{stage.sections.length} sections
									</Badge>
									<Badge size="lg" variant="secondary">
										{itemCount} items
									</Badge>
									{percent ? (
										<Badge size="lg" variant="outline">
											{percent}%
										</Badge>
									) : null}
								</AccordionPrimitive.Trigger>
								<ChevronTrigger label={`Toggle ${stage.name}`} />
							</AccordionPrimitive.Header>
							<AccordionPanel className="px-3">
								<div className="flex flex-col gap-2 pb-3">
									<DraftInlineAdd
										noun="section"
										onAdd={(name) => onAddSection(stage.key, name)}
										placeholder="Add a section and press Enter…"
									/>
									{stage.sections.length > 0 ? (
										<Accordion className="flex flex-col gap-2">
											{stage.sections.map((section, sectionIndex) => (
												<SectionAccordionItem
													key={section.key}
													number={`${stageNumber}.${sectionIndex + 1}`}
													onAddItem={(name) =>
														onAddItem(stage.key, section.key, name)
													}
													onRemove={() =>
														onRemoveSection(stage.key, section.key)
													}
													onRemoveItem={(itemKey) =>
														onRemoveItem(stage.key, section.key, itemKey)
													}
													onRename={(name) =>
														onRenameSection(stage.key, section.key, name)
													}
													onUpdateItem={(itemKey, name) =>
														onUpdateItem(stage.key, section.key, itemKey, name)
													}
													section={section}
												/>
											))}
										</Accordion>
									) : (
										<p className="rounded-md border border-dashed px-3 py-4 text-center text-muted-foreground text-sm">
											No sections in this stage yet.
										</p>
									)}
								</div>
							</AccordionPanel>
						</AccordionItem>
					</div>
				);
			})}
		</Accordion>
	);
}
