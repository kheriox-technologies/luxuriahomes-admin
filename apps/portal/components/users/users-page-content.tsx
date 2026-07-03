'use client';

import { api } from '@workspace/backend/api';
import { DataTable } from '@workspace/ui/components/data-table';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { cn } from '@workspace/ui/lib/utils';
import { useAction } from 'convex/react';
import { SearchIcon, Users } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddUser from './add-user';
import type { UserRow } from './types';
import { getUserColumns } from './user-columns';

function matchesSearch(user: UserRow, query: string): boolean {
	const haystack = [user.fullName, user.email, user.phoneNumber]
		.join(' ')
		.toLowerCase();
	return haystack.includes(query);
}

export default function UsersPageContent() {
	const listUsers = useAction(api.users.list.list);
	const [users, setUsers] = useState<UserRow[] | undefined>(undefined);
	const [loadFailed, setLoadFailed] = useState(false);
	const [search, setSearch] = useState('');

	const reload = useCallback(() => {
		setLoadFailed(false);
		listUsers({})
			.then(setUsers)
			.catch(() => setLoadFailed(true));
	}, [listUsers]);

	useEffect(() => {
		reload();
	}, [reload]);

	const columns = useMemo(() => getUserColumns(reload), [reload]);

	const trimmedSearch = search.trim().toLowerCase();
	const filteredUsers = useMemo(() => {
		if (!users) {
			return [];
		}
		if (trimmedSearch === '') {
			return users;
		}
		return users.filter((user) => matchesSearch(user, trimmedSearch));
	}, [users, trimmedSearch]);

	let content: React.ReactNode;
	if (loadFailed) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Users aria-hidden />
					</EmptyMedia>
					<EmptyTitle>Could not load users</EmptyTitle>
					<EmptyDescription>
						Something went wrong fetching users from Clerk. Try again shortly.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else if (users === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">Loading users…</div>
		);
	} else if (trimmedSearch !== '' && filteredUsers.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Users aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching users</EmptyTitle>
					<EmptyDescription>
						Try a different name, email, or phone number.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else {
		content = (
			<DataTable
				columns={columns}
				data={filteredUsers}
				emptyMessage="No users found."
				initialPageSize={20}
				key={trimmedSearch}
			/>
		);
	}

	return (
		<div className={cn('flex min-h-0 flex-1 flex-col gap-4')}>
			<PageHeading
				heading="Users"
				icon={Users}
				rightSlot={
					<>
						<InputGroup className="w-full sm:min-w-80 sm:max-w-2xl">
							<InputGroupAddon align="inline-start">
								<InputGroupText>
									<SearchIcon aria-hidden />
								</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								aria-label="Search users"
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search by name, email, or phone…"
								type="search"
								value={search}
							/>
						</InputGroup>
						<AddUser onCreated={reload} />
					</>
				}
			/>
			{content}
		</div>
	);
}
