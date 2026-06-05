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
import { MapPin, Pencil, SearchIcon, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddLocation from './add-location';
import DeleteLocation from './delete-location';
import EditLocation from './edit-location';

type Location = Doc<'locations'>;

function LocationCard({ location }: { location: Location }) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-start justify-between gap-3">
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<CardTitle className="truncate leading-tight">
						{location.name}
					</CardTitle>
					{location.description ? (
						<p className="line-clamp-2 text-muted-foreground text-sm">
							{location.description}
						</p>
					) : null}
				</div>
				<CardAction>
					<Group>
						<EditLocation
							initialDescription={location.description}
							initialName={location.name}
							locationId={location._id}
							trigger={
								<Button
									aria-label="Edit location"
									size="icon"
									type="button"
									variant="outline"
								>
									<Pencil />
								</Button>
							}
						/>
						<GroupSeparator />
						<DeleteLocation
							locationId={location._id}
							locationName={location.name}
							trigger={
								<Button
									aria-label="Delete location"
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

function EmptyLocationsState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<MapPin aria-hidden />
				</EmptyMedia>
				<EmptyTitle>No locations yet</EmptyTitle>
				<EmptyDescription>
					Create your first location using the Add Location button.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}

export default function LocationsPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const listResults = useQuery(
		api.locations.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.locations.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);
	const locations = trimmedSearch === '' ? listResults : searchResults;

	let content: React.ReactNode;

	if (locations === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">Loading locations…</div>
		);
	} else if (trimmedSearch !== '' && locations.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<MapPin aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching locations</EmptyTitle>
					<EmptyDescription>
						Try a different name or description.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else if (locations.length === 0) {
		content = <EmptyLocationsState />;
	} else {
		content = (
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{locations.map((location) => (
					<LocationCard key={location._id} location={location} />
				))}
			</div>
		);
	}

	return (
		<div className={cn('flex min-h-0 flex-1 flex-col gap-4')}>
			<div className="mb-0 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
				<PageHeading className="mb-0" heading="Locations" icon={MapPin} />
				<div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row sm:items-center sm:justify-end">
					<InputGroup className="w-full sm:min-w-80 sm:max-w-2xl">
						<InputGroupAddon align="inline-start">
							<InputGroupText>
								<SearchIcon aria-hidden />
							</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							aria-label="Search locations"
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by name or description…"
							type="search"
							value={search}
						/>
					</InputGroup>
					<AddLocation />
				</div>
			</div>
			{content}
		</div>
	);
}
