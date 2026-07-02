'use client';

import { api } from '@workspace/backend/api';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import { Globe, SearchIcon } from 'lucide-react';
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
						<InputGroup className="w-full sm:min-w-80 sm:max-w-2xl">
							<InputGroupAddon align="inline-start">
								<InputGroupText>
									<SearchIcon aria-hidden />
								</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								aria-label="Search website projects"
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search by name…"
								type="search"
								value={search}
							/>
						</InputGroup>
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
