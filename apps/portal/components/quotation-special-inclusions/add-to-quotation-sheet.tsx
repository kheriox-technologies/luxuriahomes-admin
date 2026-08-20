'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
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
import { toastManager } from '@workspace/ui/components/toast';
import { cn } from '@workspace/ui/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { formatAudWhole } from '@/lib/currency';
import type { SpecialInclusionEntry } from './special-inclusion-entry';

const SEARCH_DEBOUNCE_MS = 300;

/**
 * Only a quotation that has not been approved can take inclusions this way —
 * appending skips the revision machinery, so anything a client has approved or
 * signed has to be revised in the composer instead. Kept in step with the
 * status guard in `clientQuotations/addSpecialInclusions`.
 */
const EDITABLE_STATUSES = new Set(['Draft', 'Under Review']);

type QuotationRow = Doc<'clientQuotations'>;

export default function AddToQuotationSheet({
	entries,
	onAdded,
	onOpenChange,
	open,
}: {
	entries: SpecialInclusionEntry[];
	onAdded?: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
}) {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [selectedId, setSelectedId] = useState<Id<'clientQuotations'> | null>(
		null
	);
	const [saving, setSaving] = useState(false);
	const trimmedSearch = debouncedSearch.trim();

	const addSpecialInclusions = useMutation(
		api.clientQuotations.addSpecialInclusions.addSpecialInclusions
	);

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
			setSelectedId(null);
		}
	}, [open]);

	const listResults = useQuery(
		api.clientQuotations.list.list,
		open && trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.clientQuotations.search.search,
		open && trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);
	const results = trimmedSearch === '' ? listResults : searchResults;
	const quotations = results?.filter((row) =>
		EDITABLE_STATUSES.has(row.status)
	);

	const submit = async () => {
		if (!selectedId) {
			return;
		}
		setSaving(true);
		try {
			await addSpecialInclusions({ entries, quotationId: selectedId });
			toastManager.add({
				description:
					'Open the quotation and save it to reissue the PDF with the new lines.',
				title:
					entries.length === 1
						? 'Special inclusion added'
						: `${entries.length} special inclusions added`,
				type: 'success',
			});
			onOpenChange(false);
			onAdded?.();
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not add to that quotation. Please try again in a moment.'
				),
				title: 'Could not add to quotation',
				type: 'error',
			});
		} finally {
			setSaving(false);
		}
	};

	let body: React.ReactNode;
	if (quotations === undefined) {
		body = <p className="text-muted-foreground text-sm">Loading quotations…</p>;
	} else if (quotations.length === 0) {
		body = (
			<p className="rounded-md border border-dashed px-3 py-6 text-center text-muted-foreground text-sm">
				{trimmedSearch === ''
					? 'No draft quotations to add to. A quotation that is already approved or signed has to be revised in the quotation editor.'
					: 'No matching draft quotations. Try a project name or a quotation reference.'}
			</p>
		);
	} else {
		body = (
			<div className="divide-y overflow-hidden rounded-md border">
				{quotations.map((quotation: QuotationRow) => {
					const isSelected = quotation._id === selectedId;
					return (
						<button
							className={cn(
								'flex w-full items-center gap-3 bg-card px-3 py-2.5 text-left transition-colors hover:bg-accent/50',
								isSelected && 'bg-accent'
							)}
							key={quotation._id}
							onClick={() => setSelectedId(quotation._id)}
							type="button"
						>
							<div className="min-w-0 flex-1">
								<p className="truncate font-medium text-sm">
									{quotation.projectName}
								</p>
								<p className="truncate text-muted-foreground text-xs">
									{quotation.reference}
								</p>
							</div>
							<Badge variant="secondary">{quotation.status}</Badge>
							<span className="shrink-0 text-muted-foreground text-sm tabular-nums">
								{formatAudWhole(quotation.totalInclGst)}
							</span>
							{isSelected ? (
								<Check aria-hidden className="size-4 shrink-0" />
							) : (
								<span className="size-4 shrink-0" />
							)}
						</button>
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
					<SheetTitle>Add to quotation</SheetTitle>
					<SheetDescription>
						{entries.length === 1
							? 'Adds 1 special inclusion to the quotation you pick.'
							: `Adds ${entries.length} special inclusions to the quotation you pick.`}
					</SheetDescription>
				</SheetHeader>
				<SheetPanel>
					<div className="flex flex-col gap-3">
						<SearchInput
							aria-label="Search quotations"
							className="sm:max-w-none"
							onValueChange={setSearch}
							placeholder="Search by project name or quotation ID…"
							value={search}
						/>
						{body}
						{selectedId ? (
							<p className="text-muted-foreground text-xs">
								The quotation keeps its current version and status.{' '}
								<Link
									className="underline"
									href={`/quotations/${selectedId}/edit`}
								>
									Open it
								</Link>{' '}
								and save to reissue the PDF.
							</p>
						) : null}
					</div>
				</SheetPanel>
				<SheetFooter variant="bare">
					<SheetClose render={<Button type="button" variant="outline" />}>
						Cancel
					</SheetClose>
					<Button
						disabled={!selectedId}
						loading={saving}
						onClick={() => {
							submit().catch(() => {
								/* Error is handled in submit */
							});
						}}
						type="button"
						variant="outline"
					>
						<Check aria-hidden /> Add to quotation
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
