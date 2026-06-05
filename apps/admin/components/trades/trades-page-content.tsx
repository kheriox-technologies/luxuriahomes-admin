'use client';

import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Card,
	CardAction,
	CardHeader,
	CardTitle,
} from '@workspace/ui/components/card';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import { Pencil, SearchIcon, Trash2, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddTrade from './add-trade';
import DeleteTrade from './delete-trade';
import EditTrade from './edit-trade';

type Trade = Doc<'trades'>;

function TradeCard({ trade }: { trade: Trade }) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-start justify-between gap-3">
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<CardTitle className="truncate leading-tight">{trade.name}</CardTitle>
					{trade.description ? (
						<p className="line-clamp-2 text-muted-foreground text-sm">
							{trade.description}
						</p>
					) : null}
				</div>
				<CardAction>
					<Group>
						<EditTrade
							initialDescription={trade.description}
							initialName={trade.name}
							tradeId={trade._id}
							trigger={
								<Button
									aria-label="Edit trade"
									size="icon"
									type="button"
									variant="outline"
								>
									<Pencil />
								</Button>
							}
						/>
						<GroupSeparator />
						<DeleteTrade
							tradeId={trade._id}
							tradeName={trade.name}
							trigger={
								<Button
									aria-label="Delete trade"
									size="icon"
									type="button"
									variant="destructive-outline"
								>
									<Trash2 />
								</Button>
							}
						/>
					</Group>
				</CardAction>
			</CardHeader>
		</Card>
	);
}

function EmptyTradesState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Wrench aria-hidden />
				</EmptyMedia>
				<EmptyTitle>No trades yet</EmptyTitle>
				<EmptyDescription>
					Create your first trade using the Add Trade button.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}

export default function TradesPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const listResults = useQuery(
		api.trades.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.trades.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);
	const trades = trimmedSearch === '' ? listResults : searchResults;

	let content: React.ReactNode;

	if (trades === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">Loading trades…</div>
		);
	} else if (trimmedSearch !== '' && trades.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Wrench aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching trades</EmptyTitle>
					<EmptyDescription>
						Try a different name or description.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else if (trades.length === 0) {
		content = <EmptyTradesState />;
	} else {
		content = (
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{trades.map((trade) => (
					<TradeCard key={trade._id} trade={trade} />
				))}
			</div>
		);
	}

	return (
		<div className={cn('flex min-h-0 flex-1 flex-col gap-4')}>
			<div className="mb-0 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
				<PageHeading className="mb-0" heading="Trades" icon={Wrench} />
				<div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row sm:items-center sm:justify-end">
					<InputGroup className="w-full sm:min-w-80 sm:max-w-2xl">
						<InputGroupAddon align="inline-start">
							<InputGroupText>
								<SearchIcon aria-hidden />
							</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							aria-label="Search trades"
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by name or description…"
							type="search"
							value={search}
						/>
					</InputGroup>
					<AddTrade />
				</div>
			</div>
			{content}
		</div>
	);
}
