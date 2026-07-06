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
import { SearchInput } from '@workspace/ui/components/search-input';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import { FolderOpen, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddDocumentFolder from './add-document-folder';
import DeleteDocumentFolder from './delete-document-folder';
import EditDocumentFolder from './edit-document-folder';

type DocumentFolder = Doc<'documentFolders'>;

const columns: ColumnDef<DocumentFolder>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
	},
	{
		id: 'actions',
		header: '',
		size: 100,
		cell: ({ row }) => (
			<div className="flex justify-end">
				<Group>
					<EditDocumentFolder
						documentFolderId={row.original._id}
						initialName={row.original.name}
						trigger={
							<Button
								aria-label="Edit document folder"
								size="icon"
								type="button"
								variant="outline"
							>
								<Pencil />
							</Button>
						}
					/>
					<GroupSeparator />
					<DeleteDocumentFolder
						documentFolderId={row.original._id}
						folderName={row.original.name}
						trigger={
							<Button
								aria-label="Delete document folder"
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

function EmptyDocumentFoldersState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<FolderOpen aria-hidden />
				</EmptyMedia>
				<EmptyTitle>No document folders yet</EmptyTitle>
				<EmptyDescription>
					Create your first document folder using the Add Document Folder
					button.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}

export default function DocumentFoldersPageContent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const trimmedSearch = debouncedSearch.trim();

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(search), 300);
		return () => window.clearTimeout(id);
	}, [search]);

	const listResults = useQuery(
		api.documentFolders.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.documentFolders.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);
	const documentFolders = trimmedSearch === '' ? listResults : searchResults;

	let content: React.ReactNode;

	if (documentFolders === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">
				Loading document folders…
			</div>
		);
	} else if (trimmedSearch !== '' && documentFolders.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<FolderOpen aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching document folders</EmptyTitle>
					<EmptyDescription>Try a different name.</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else if (documentFolders.length === 0) {
		content = <EmptyDocumentFoldersState />;
	} else {
		content = (
			<DataTable
				columns={columns}
				data={documentFolders}
				emptyMessage="No matching document folders."
				key={trimmedSearch}
			/>
		);
	}

	return (
		<div className={cn('flex min-h-0 flex-1 flex-col gap-4')}>
			<PageHeading
				heading="Document Folders"
				icon={FolderOpen}
				rightSlot={
					<>
						<SearchInput
							aria-label="Search document folders"
							onValueChange={setSearch}
							placeholder="Search by name…"
							value={search}
						/>
						<AddDocumentFolder />
					</>
				}
			/>
			{content}
		</div>
	);
}
