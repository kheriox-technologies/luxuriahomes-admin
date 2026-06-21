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
import { ListTodo, SearchIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddTask from '@/components/tasks/add-task';
import TaskMultiSelectFilter from '@/components/tasks/task-multi-select-filter';
import TasksBoard from '@/components/tasks/tasks-board';

export default function TasksPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [projectIds, setProjectIds] = useState<string[]>([]);
	const [assigneeIds, setAssigneeIds] = useState<string[]>([]);

	const projects = useQuery(api.projects.list.list, {});
	const admins = useQuery(api.adminUsers.list.list, {});

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const projectOptions = useMemo(
		() => (projects ?? []).map((p) => ({ label: p.name, value: p._id })),
		[projects]
	);
	const assigneeOptions = useMemo(
		() => (admins ?? []).map((a) => ({ label: a.fullName, value: a.userId })),
		[admins]
	);

	return (
		<div className={cn('flex h-full min-h-0 w-full flex-col')}>
			<PageHeading heading="Tasks" icon={ListTodo} rightSlot={<AddTask />} />
			<div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-start">
				<InputGroup className="w-full sm:w-[30%] sm:shrink-0">
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
				<div className="w-full sm:flex-1">
					<TaskMultiSelectFilter
						id="task-filter-project"
						onChange={setProjectIds}
						options={projectOptions}
						placeholder="Filter by project"
						value={projectIds}
					/>
				</div>
				<div className="w-full sm:flex-1">
					<TaskMultiSelectFilter
						id="task-filter-assignee"
						onChange={setAssigneeIds}
						options={assigneeOptions}
						placeholder="Filter by assignee"
						value={assigneeIds}
					/>
				</div>
			</div>
			<div className="flex min-h-0 flex-1 flex-col">
				<TasksBoard
					assigneeIds={assigneeIds}
					projectIds={projectIds}
					searchQuery={debouncedSearch}
				/>
			</div>
		</div>
	);
}
