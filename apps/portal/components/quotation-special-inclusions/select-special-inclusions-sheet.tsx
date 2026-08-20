'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { SearchInput } from '@workspace/ui/components/search-input';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetPanel,
	SheetTitle,
} from '@workspace/ui/components/sheet';
import { useQuery } from 'convex/react';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatAud } from '@/lib/currency';
import type { SpecialInclusionEntry } from './special-inclusion-entry';

const SEARCH_DEBOUNCE_MS = 300;

type InclusionRow = Doc<'quotationSpecialInclusions'>;

/**
 * Picks lines out of the standard list and hands them back as plain values.
 * Writes nothing — on the composer the picked lines join the draft and are
 * saved with the rest of the quotation.
 */
export default function SelectSpecialInclusionsSheet({
	onConfirm,
	onOpenChange,
	open,
}: {
	onConfirm: (entries: SpecialInclusionEntry[]) => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
}) {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [selected, setSelected] = useState<
		Set<Id<'quotationSpecialInclusions'>>
	>(new Set());
	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(
			() => setDebouncedSearch(search),
			SEARCH_DEBOUNCE_MS
		);
		return () => window.clearTimeout(id);
	}, [search]);

	useEffect(() => {
		if (!open) {
			setSearch('');
			setDebouncedSearch('');
			setSelected(new Set());
		}
	}, [open]);

	const listResults = useQuery(
		api.quotationSpecialInclusions.list.list,
		open && trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.quotationSpecialInclusions.search.search,
		open && trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);
	const inclusions = trimmedSearch === '' ? listResults : searchResults;

	const toggle = (inclusionId: Id<'quotationSpecialInclusions'>) => {
		setSelected((current) => {
			const next = new Set(current);
			if (next.has(inclusionId)) {
				next.delete(inclusionId);
			} else {
				next.add(inclusionId);
			}
			return next;
		});
	};

	const confirm = () => {
		const chosen = (inclusions ?? []).filter((row: InclusionRow) =>
			selected.has(row._id)
		);
		if (chosen.length === 0) {
			return;
		}
		onConfirm(
			chosen.map((row: InclusionRow) => ({
				amount: row.amount,
				text: row.text,
			}))
		);
		onOpenChange(false);
	};

	let body: React.ReactNode;
	if (inclusions === undefined) {
		body = (
			<p className="text-muted-foreground text-sm">
				Loading special inclusions…
			</p>
		);
	} else if (inclusions.length === 0) {
		body = (
			<p className="rounded-md border border-dashed px-3 py-6 text-center text-muted-foreground text-sm">
				{trimmedSearch === '' ? (
					<>
						The standard list is empty. Build it under{' '}
						<Link className="underline" href="/quotation-templates">
							Quotation Templates
						</Link>
						.
					</>
				) : (
					'No matching special inclusions.'
				)}
			</p>
		);
	} else {
		body = (
			<div className="divide-y overflow-hidden rounded-md border">
				{inclusions.map((inclusion: InclusionRow) => {
					const checkboxId = `special-inclusion-${inclusion._id}`;
					return (
						<div
							className="flex w-full items-center gap-3 bg-card px-3 py-2.5 transition-colors hover:bg-accent/50"
							key={inclusion._id}
						>
							<Checkbox
								checked={selected.has(inclusion._id)}
								id={checkboxId}
								onCheckedChange={() => toggle(inclusion._id)}
							/>
							<label
								className="min-w-0 flex-1 cursor-pointer truncate text-sm"
								htmlFor={checkboxId}
							>
								{inclusion.text}
							</label>
							<span className="shrink-0 text-muted-foreground text-sm tabular-nums">
								{inclusion.amount === undefined
									? '—'
									: formatAud(inclusion.amount)}
							</span>
						</div>
					);
				})}
			</div>
		);
	}

	return (
		<Sheet onOpenChange={onOpenChange} open={open}>
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0"
				side="right"
			>
				<SheetHeader>
					<SheetTitle>Add from list</SheetTitle>
					<SheetDescription>
						Pick from the standard special inclusions. Prices come across and
						stay editable on the quotation.
					</SheetDescription>
				</SheetHeader>
				<SheetPanel>
					<div className="flex flex-col gap-3">
						<SearchInput
							aria-label="Search special inclusions"
							className="sm:max-w-none"
							onValueChange={setSearch}
							placeholder="Search special inclusions…"
							value={search}
						/>
						{body}
					</div>
				</SheetPanel>
				<SheetFooter variant="bare">
					<SheetClose render={<Button type="button" variant="outline" />}>
						Cancel
					</SheetClose>
					<Button
						disabled={selected.size === 0}
						onClick={confirm}
						type="button"
						variant="outline"
					>
						<Check aria-hidden />
						{selected.size === 1
							? 'Add 1 inclusion'
							: `Add ${selected.size} inclusions`}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
