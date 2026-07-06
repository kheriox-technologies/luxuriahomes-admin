'use client';

import { SearchInput } from '@workspace/ui/components/search-input';
import { cn } from '@workspace/ui/lib/utils';
import { Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/client/page-heading';
import ProjectsList from '@/components/client/projects/projects-list';

export default function ProjectsPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	return (
		<div className={cn('flex h-full min-h-0 w-full flex-col')}>
			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
				<PageHeading className="mb-0" heading="Projects" icon={Building2} />
				<div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row sm:items-center sm:justify-end">
					<SearchInput
						aria-label="Search projects"
						onValueChange={setSearch}
						placeholder="Search by name, address, client…"
						value={search}
					/>
				</div>
			</div>
			<div className="flex min-h-0 flex-1 flex-col">
				<ProjectsList searchQuery={debouncedSearch} />
			</div>
		</div>
	);
}
