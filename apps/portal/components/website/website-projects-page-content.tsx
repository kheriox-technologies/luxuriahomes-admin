'use client';

import { api } from '@workspace/backend/api';
import { SearchInput } from '@workspace/ui/components/search-input';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import { Globe } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddWebsiteProjectForm from './add-website-project';
import WebsiteProjectsList from './website-projects-list';

export default function WebsiteProjectsPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const trimmedSearch = debouncedSearch.trim();
	const isSearching = trimmedSearch !== '';

	const allProjects = useQuery(api.websiteProjects.list.list, {});

	const visibleProjects = useMemo(() => {
		if (allProjects === undefined) {
			return undefined;
		}
		if (!isSearching) {
			return allProjects;
		}
		const needle = trimmedSearch.toLowerCase();
		return allProjects.filter((project) =>
			project.name.toLowerCase().includes(needle)
		);
	}, [allProjects, isSearching, trimmedSearch]);

	return (
		<div className={cn('flex h-full min-h-0 w-full flex-col gap-4')}>
			<PageHeading
				heading="Website"
				icon={Globe}
				rightSlot={
					<>
						<SearchInput
							aria-label="Search website projects"
							onValueChange={setSearch}
							placeholder="Search by name…"
							value={search}
						/>
						<AddWebsiteProjectForm />
					</>
				}
			/>

			<div className="flex min-h-0 flex-1 flex-col">
				<WebsiteProjectsList
					isFiltered={isSearching}
					projects={visibleProjects}
					resetKey={trimmedSearch}
				/>
			</div>
		</div>
	);
}
