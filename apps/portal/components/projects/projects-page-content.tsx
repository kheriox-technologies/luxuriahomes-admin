'use client';

import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import { SearchInput } from '@workspace/ui/components/search-input';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import { Building2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddProjectForm from '@/components/projects/add-project';
import ProjectsKpiBar from '@/components/projects/projects-kpi-bar';
import ProjectsList from '@/components/projects/projects-list';

type Project = Doc<'projects'>;
type StatusFilter = 'all' | Project['status'];

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
	{ value: 'all', label: 'All' },
	{ value: 'not_started', label: 'Not started' },
	{ value: 'in_progress', label: 'In progress' },
	{ value: 'completed', label: 'Completed' },
];

function countByStatus(
	projects: Project[] | undefined,
	status: StatusFilter
): number | undefined {
	if (projects === undefined) {
		return undefined;
	}
	if (status === 'all') {
		return projects.length;
	}
	return projects.filter((project) => project.status === status).length;
}

export default function ProjectsPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const trimmedSearch = debouncedSearch.trim();
	const isSearching = trimmedSearch !== '';

	// Full portfolio — always loaded so the summary tiles and filter counts stay
	// stable regardless of the active search or status filter.
	const allProjects = useQuery(api.projects.list.list, {});
	const searchResults = useQuery(
		api.projects.search.search,
		isSearching ? { query: trimmedSearch } : 'skip'
	);

	const baseProjects = isSearching ? searchResults : allProjects;

	const visibleProjects = useMemo(() => {
		if (baseProjects === undefined) {
			return undefined;
		}
		if (statusFilter === 'all') {
			return baseProjects;
		}
		return baseProjects.filter((project) => project.status === statusFilter);
	}, [baseProjects, statusFilter]);

	return (
		<div className={cn('flex h-full min-h-0 w-full flex-col gap-4')}>
			<PageHeading
				heading="Projects"
				icon={Building2}
				rightSlot={
					<>
						<SearchInput
							aria-label="Search projects"
							onValueChange={setSearch}
							placeholder="Search by name, address, client…"
							value={search}
						/>
						<AddProjectForm />
					</>
				}
			/>

			<ProjectsKpiBar projects={allProjects} />

			<div className="-mx-1 flex items-center gap-1 overflow-x-auto px-1 pb-1">
				{STATUS_FILTERS.map((filter) => {
					const isActive = statusFilter === filter.value;
					const count = countByStatus(allProjects, filter.value);
					return (
						<Button
							aria-pressed={isActive}
							className="shrink-0"
							key={filter.value}
							onClick={() => setStatusFilter(filter.value)}
							size="sm"
							variant={isActive ? 'secondary' : 'ghost'}
						>
							{filter.label}
							{count === undefined ? null : (
								<span
									className={cn(
										'tabular-nums',
										isActive
											? 'text-secondary-foreground/70'
											: 'text-muted-foreground'
									)}
								>
									{count}
								</span>
							)}
						</Button>
					);
				})}
			</div>

			<div className="flex min-h-0 flex-1 flex-col">
				<ProjectsList
					isFiltered={isSearching || statusFilter !== 'all'}
					projects={visibleProjects}
					resetKey={`${trimmedSearch}|${statusFilter}`}
				/>
			</div>
		</div>
	);
}
