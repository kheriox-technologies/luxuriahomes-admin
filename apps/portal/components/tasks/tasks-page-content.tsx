'use client';

import { api } from '@workspace/backend/api';
import { SearchInput } from '@workspace/ui/components/search-input';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import { ListTodo } from 'lucide-react';
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
		<div className={cn('flex h-full min-h-0 w-full flex-col gap-4')}>
			<PageHeading heading="Tasks" icon={ListTodo} rightSlot={<AddTask />} />
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-start">
				<SearchInput
					aria-label="Search tasks"
					onValueChange={setSearch}
					placeholder="Search by title, project, assignee…"
					value={search}
				/>
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
