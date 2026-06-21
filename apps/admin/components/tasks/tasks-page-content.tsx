'use client';

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { cn } from '@workspace/ui/lib/utils';
import { ListTodo, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddTask from '@/components/tasks/add-task';
import TasksBoard from '@/components/tasks/tasks-board';

export default function TasksPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	return (
		<div className={cn('flex h-full min-h-0 w-full flex-col')}>
			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
				<PageHeading className="mb-0" heading="Tasks" icon={ListTodo} />
				<div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row sm:items-center sm:justify-end">
					<InputGroup className="w-full sm:min-w-80 sm:max-w-2xl">
						<InputGroupAddon align="inline-start">
							<InputGroupText>
								<SearchIcon aria-hidden />
							</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							aria-label="Search tasks"
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by title, project, assignee…"
							type="search"
							value={search}
						/>
					</InputGroup>
					<AddTask />
				</div>
			</div>
			<div className="flex min-h-0 flex-1 flex-col">
				<TasksBoard searchQuery={debouncedSearch} />
			</div>
		</div>
	);
}
