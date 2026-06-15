'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import { DataTable } from '@workspace/ui/components/data-table';
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
import { CalendarDays, Pencil, SearchIcon, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddScheduleTemplate from './add-schedule-template';
import DeleteScheduleTemplate from './delete-schedule-template';
import EditScheduleTemplate from './edit-schedule-template';

type ScheduleTemplate = Doc<'scheduleTemplates'>;

const columns: ColumnDef<ScheduleTemplate>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
	},
	{
		accessorKey: 'description',
		header: 'Description',
		cell: ({ row }) =>
			row.original.description ? (
				<span className="text-muted-foreground text-sm">
					{row.original.description}
				</span>
			) : null,
	},
	{
		id: 'actions',
		header: '',
		size: 100,
		cell: ({ row }) => (
			// biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation wrapper, not interactive
			// biome-ignore lint/a11y/noNoninteractiveElementInteractions: stopPropagation wrapper, not interactive
			// biome-ignore lint/a11y/noStaticElementInteractions: stopPropagation wrapper, not interactive
			<div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
				<Group>
					<EditScheduleTemplate
						initialDescription={row.original.description}
						initialName={row.original.name}
						scheduleTemplateId={row.original._id}
						trigger={
							<Button
								aria-label="Edit schedule template"
								size="icon"
								type="button"
								variant="outline"
							>
								<Pencil />
							</Button>
						}
					/>
					<GroupSeparator />
					<DeleteScheduleTemplate
						scheduleTemplateId={row.original._id}
						scheduleTemplateName={row.original.name}
						trigger={
							<Button
								aria-label="Delete schedule template"
								size="icon"
								type="button"
								variant="destructive-outline"
							>
								<Trash2 />
							</Button>
						}
					/>
				</Group>
			</div>
		),
	},
];

function EmptySchedulesState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<CalendarDays aria-hidden />
				</EmptyMedia>
				<EmptyTitle>No schedule templates yet</EmptyTitle>
				<EmptyDescription>
					Create your first schedule template using the Add Schedule button.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}

export default function SchedulesPageContent() {
	const router = useRouter();
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const listResults = useQuery(
		api.scheduleTemplates.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.scheduleTemplates.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);
	const scheduleTemplates = trimmedSearch === '' ? listResults : searchResults;

	let content: React.ReactNode;

	if (scheduleTemplates === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">
				Loading schedule templates…
			</div>
		);
	} else if (trimmedSearch !== '' && scheduleTemplates.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<CalendarDays aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching schedule templates</EmptyTitle>
					<EmptyDescription>
						Try a different name or description.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else if (scheduleTemplates.length === 0) {
		content = <EmptySchedulesState />;
	} else {
		content = (
			<DataTable
				columns={columns}
				data={scheduleTemplates}
				emptyMessage="No matching schedule templates."
				key={trimmedSearch}
				onRowClick={(row) => router.push(`/schedules/${row._id}`)}
			/>
		);
	}

	return (
		<div className={cn('flex min-h-0 flex-1 flex-col gap-4')}>
			<div className="mb-0 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
				<PageHeading className="mb-0" heading="Schedules" icon={CalendarDays} />
				<div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row sm:items-center sm:justify-end">
					<InputGroup className="w-full sm:min-w-80 sm:max-w-2xl">
						<InputGroupAddon align="inline-start">
							<InputGroupText>
								<SearchIcon aria-hidden />
							</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							aria-label="Search schedule templates"
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by name or description…"
							type="search"
							value={search}
						/>
					</InputGroup>
					<AddScheduleTemplate />
				</div>
			</div>
			{content}
		</div>
	);
}
