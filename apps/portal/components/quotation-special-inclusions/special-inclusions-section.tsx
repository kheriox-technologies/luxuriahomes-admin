'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import {
	Frame,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from '@workspace/ui/components/frame';
import { SearchInput } from '@workspace/ui/components/search-input';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { FilePlus2, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import AddToQuotationSheet from './add-to-quotation-sheet';
import type { SpecialInclusionEntry } from './special-inclusion-entry';
import SpecialInclusionRow from './special-inclusion-row';
import SpecialInclusionsInlineAdd from './special-inclusions-inline-add';

const SEARCH_DEBOUNCE_MS = 300;

type InclusionRow = Doc<'quotationSpecialInclusions'>;
type InclusionId = Id<'quotationSpecialInclusions'>;

function toastFailure(title: string, error: unknown) {
	toastManager.add({
		description: getConvexErrorMessage(error, 'Please try again in a moment.'),
		title,
		type: 'error',
	});
}

/**
 * The standard list of special inclusions, kept alongside the quotation
 * templates because it is the same kind of thing: reusable content a quotation
 * is composed from. Everything here is inline — there is no add or edit dialog.
 */
export default function SpecialInclusionsSection() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [selected, setSelected] = useState<Set<InclusionId>>(new Set());
	const [pendingDelete, setPendingDelete] = useState<InclusionRow | null>(null);
	const [sheetEntries, setSheetEntries] = useState<
		SpecialInclusionEntry[] | null
	>(null);
	const trimmedSearch = debouncedSearch.trim();

	const addInclusion = useMutation(api.quotationSpecialInclusions.add.add);
	const updateInclusion = useMutation(
		api.quotationSpecialInclusions.update.update
	);
	const removeInclusion = useMutation(
		api.quotationSpecialInclusions.remove.remove
	);

	useEffect(() => {
		const id = window.setTimeout(
			() => setDebouncedSearch(search),
			SEARCH_DEBOUNCE_MS
		);
		return () => window.clearTimeout(id);
	}, [search]);

	const listResults = useQuery(
		api.quotationSpecialInclusions.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.quotationSpecialInclusions.search.search,
		trimmedSearch === '' ? 'skip' : { query: trimmedSearch }
	);
	const inclusions = trimmedSearch === '' ? listResults : searchResults;

	// A row that has scrolled out of the current filter must not stay selected
	// behind the scenes — the Add to Quotation button has to mean what it shows.
	const visibleIds = useMemo(
		() => new Set((inclusions ?? []).map((row: InclusionRow) => row._id)),
		[inclusions]
	);
	useEffect(() => {
		setSelected((current) => {
			const next = new Set([...current].filter((id) => visibleIds.has(id)));
			return next.size === current.size ? current : next;
		});
	}, [visibleIds]);

	const rows = inclusions ?? [];
	const selectedRows = rows.filter((row: InclusionRow) =>
		selected.has(row._id)
	);
	const allSelected = rows.length > 0 && selectedRows.length === rows.length;
	const someSelected = selectedRows.length > 0;

	const toggleSelectAll = () => {
		setSelected(
			allSelected
				? new Set()
				: new Set(rows.map((row: InclusionRow) => row._id))
		);
	};

	const setRowSelected = (inclusionId: InclusionId, isSelected: boolean) => {
		setSelected((current) => {
			const next = new Set(current);
			if (isSelected) {
				next.add(inclusionId);
			} else {
				next.delete(inclusionId);
			}
			return next;
		});
	};

	const toEntries = (source: InclusionRow[]): SpecialInclusionEntry[] =>
		source.map((row) => ({ amount: row.amount, text: row.text }));

	const confirmDelete = () => {
		if (!pendingDelete) {
			return;
		}
		const inclusionId = pendingDelete._id;
		setPendingDelete(null);
		removeInclusion({ inclusionId })
			.then(() => {
				setRowSelected(inclusionId, false);
				toastManager.add({
					title: 'Special inclusion deleted',
					type: 'success',
				});
			})
			.catch((error: unknown) =>
				toastFailure('Could not delete special inclusion', error)
			);
	};

	let body: React.ReactNode;
	if (inclusions === undefined) {
		body = (
			<p className="text-muted-foreground text-sm">
				Loading special inclusions…
			</p>
		);
	} else if (rows.length === 0) {
		body = (
			<p className="rounded-md border border-dashed px-3 py-4 text-center text-muted-foreground text-sm">
				{trimmedSearch === ''
					? 'No standard special inclusions yet. Add the first one above.'
					: 'No matching special inclusions.'}
			</p>
		);
	} else {
		body = (
			<div className="divide-y overflow-hidden rounded-md border">
				<div className="flex items-center gap-2 bg-muted/40 px-3 py-2">
					<Checkbox
						aria-label="Select all special inclusions"
						checked={allSelected}
						indeterminate={someSelected && !allSelected}
						onCheckedChange={toggleSelectAll}
					/>
					<span className="text-muted-foreground text-xs">
						{someSelected
							? `${selectedRows.length} selected`
							: `${rows.length} in the list`}
					</span>
				</div>
				{rows.map((inclusion: InclusionRow, index: number) => (
					<SpecialInclusionRow
						inclusion={inclusion}
						key={inclusion._id}
						number={index + 1}
						onAddToQuotation={() => setSheetEntries(toEntries([inclusion]))}
						onDelete={() => setPendingDelete(inclusion)}
						onSelectedChange={(next) => setRowSelected(inclusion._id, next)}
						onUpdateAmount={(amount) => {
							updateInclusion({ amount, inclusionId: inclusion._id }).catch(
								(error: unknown) =>
									toastFailure('Could not update the price', error)
							);
						}}
						onUpdateText={(text) => {
							updateInclusion({ inclusionId: inclusion._id, text }).catch(
								(error: unknown) =>
									toastFailure('Could not update the special inclusion', error)
							);
						}}
						selected={selected.has(inclusion._id)}
					/>
				))}
			</div>
		);
	}

	return (
		<>
			<Frame>
				<FrameHeader className="flex-row flex-wrap items-center justify-between gap-3">
					<FrameTitle>Special Inclusions</FrameTitle>
					<div className="flex flex-wrap items-center gap-2">
						<SearchInput
							aria-label="Search special inclusions"
							className="w-full sm:w-64"
							onValueChange={setSearch}
							placeholder="Search special inclusions…"
							value={search}
						/>
						<Button
							disabled={!someSelected}
							onClick={() => setSheetEntries(toEntries(selectedRows))}
							type="button"
							variant="outline"
						>
							<FilePlus2 aria-hidden />
							{someSelected
								? `Add to Quotation (${selectedRows.length})`
								: 'Add to Quotation'}
						</Button>
					</div>
				</FrameHeader>
				<FramePanel>
					<div className="flex flex-col gap-3">
						<SpecialInclusionsInlineAdd
							onAdd={(entry) =>
								addInclusion(entry).catch((error: unknown) => {
									toastFailure('Could not add special inclusion', error);
									throw error;
								})
							}
						/>
						{body}
					</div>
				</FramePanel>
			</Frame>
			<AddToQuotationSheet
				entries={sheetEntries ?? []}
				onAdded={() => setSelected(new Set())}
				onOpenChange={(next) => {
					if (!next) {
						setSheetEntries(null);
					}
				}}
				open={sheetEntries !== null}
			/>
			<AlertDialog
				onOpenChange={(next) => {
					if (!next) {
						setPendingDelete(null);
					}
				}}
				open={pendingDelete !== null}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete special inclusion?</AlertDialogTitle>
						<AlertDialogDescription>
							{`"${pendingDelete?.text ?? ''}" is removed from the standard list. Quotations that already carry it are unaffected.`}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogClose
							render={<Button type="button" variant="outline" />}
						>
							Cancel
						</AlertDialogClose>
						<Button
							onClick={confirmDelete}
							type="button"
							variant="destructive-outline"
						>
							<Trash2 aria-hidden /> Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
