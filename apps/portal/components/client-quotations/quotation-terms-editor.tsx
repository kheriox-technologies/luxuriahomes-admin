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
import type { DraftTermSection } from './use-quotation-draft';

function TermSectionItem({
	number,
	onAddClause,
	onRemove,
	onRemoveClause,
	onRename,
	onUpdateClause,
	section,
}: {
	number: number;
	onAddClause: (text: string) => void;
	onRemove: () => void;
	onRemoveClause: (itemKey: string) => void;
	onRename: (name: string) => void;
	onUpdateClause: (itemKey: string, text: string) => void;
	section: DraftTermSection;
}) {
	const [renameOpen, setRenameOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		<div className="rounded-lg border bg-card">
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
					<AccordionPrimitive.Trigger
						aria-label={`Toggle ${section.name}`}
						className="flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring data-panel-open:[&>svg]:rotate-180"
					>
						<ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 ease-in-out" />
					</AccordionPrimitive.Trigger>
				</AccordionPrimitive.Header>
				<AccordionPanel className="px-3">
					<div className="flex flex-col gap-3 pb-3">
						<DraftInlineAdd
							noun="clause"
							onAdd={onAddClause}
							placeholder="Add a clause and press Enter…"
						/>
						{section.items.length > 0 ? (
							<div className="divide-y overflow-hidden rounded-md border">
								{section.items.map((item, index) => (
									<DraftTextRow
										key={item.key}
										label={`clause ${number}.${index + 1}`}
										number={`${number}.${index + 1}`}
										onChange={(text) => onUpdateClause(item.key, text)}
										onRemove={() => onRemoveClause(item.key)}
										value={item.text}
									/>
								))}
							</div>
						) : (
							<p className="rounded-md border border-dashed px-3 py-4 text-center text-muted-foreground text-sm">
								No clauses in this section yet.
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
				description={`This removes "${section.name}" and its ${section.items.length} clause(s) from this quotation. The catalogue is not changed.`}
				noun="section"
				onConfirm={onRemove}
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
			/>
		</div>
	);
}

/**
 * The quotation's own copy of the terms & conditions — the same shape as the
 * inclusions editor, one level shallower. The disclaimer and acknowledgement
 * are rich text and stay as authored on the Quotations page.
 */
export default function QuotationTermsEditor({
	loading,
	onAddClause,
	onAddSection,
	onRemoveClause,
	onRemoveSection,
	onRenameSection,
	onUpdateClause,
	sections,
}: {
	loading: boolean;
	onAddClause: (sectionKey: string, text: string) => void;
	onAddSection: (name: string) => void;
	onRemoveClause: (sectionKey: string, itemKey: string) => void;
	onRemoveSection: (sectionKey: string) => void;
	onRenameSection: (sectionKey: string, name: string) => void;
	onUpdateClause: (sectionKey: string, itemKey: string, text: string) => void;
	sections: DraftTermSection[];
}) {
	if (loading) {
		return <p className="text-muted-foreground text-sm">Loading terms…</p>;
	}

	return (
		<div className="flex flex-col gap-3">
			<DraftInlineAdd
				noun="section"
				onAdd={onAddSection}
				placeholder="Add a terms section and press Enter…"
			/>
			{sections.length > 0 ? (
				<Accordion className="flex flex-col gap-2">
					{sections.map((section, index) => (
						<TermSectionItem
							key={section.key}
							number={index + 1}
							onAddClause={(text) => onAddClause(section.key, text)}
							onRemove={() => onRemoveSection(section.key)}
							onRemoveClause={(itemKey) => onRemoveClause(section.key, itemKey)}
							onRename={(name) => onRenameSection(section.key, name)}
							onUpdateClause={(itemKey, text) =>
								onUpdateClause(section.key, itemKey, text)
							}
							section={section}
						/>
					))}
				</Accordion>
			) : (
				<p className="rounded-md border border-dashed px-3 py-4 text-center text-muted-foreground text-sm">
					No terms sections on this quotation.
				</p>
			)}
		</div>
	);
}
