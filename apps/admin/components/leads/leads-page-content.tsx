'use client';
// React Compiler can't track mutations on the TanStack Table instance (setOptions during render).
'use no memo';

import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
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
import { toastManager } from '@workspace/ui/components/toast';
import { cn } from '@workspace/ui/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { Inbox, SearchIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import PageHeading from '@/components/page-heading';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { getLeadColumns } from './lead-columns';

type Lead = Doc<'leads'>;

function matchesSearch(lead: Lead, query: string): boolean {
	const haystack = [
		lead.firstName,
		lead.lastName,
		lead.email,
		lead.phone,
		lead.message,
	]
		.join(' ')
		.toLowerCase();
	return haystack.includes(query);
}

export default function LeadsPageContent() {
	const leads = useQuery(api.leads.list.list, {});
	const updateReadStatus = useMutation(
		api.leads.updateReadStatus.updateReadStatus
	);
	const [search, setSearch] = useState('');

	const onToggleRead = async (lead: Lead, read: boolean) => {
		try {
			await updateReadStatus({ leadId: lead._id, read });
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not update the lead. Please try again in a moment.'
				),
				title: read ? 'Could not mark as read' : 'Could not mark as unread',
				type: 'error',
			});
		}
	};

	const columns = getLeadColumns(onToggleRead);

	const trimmedSearch = search.trim().toLowerCase();
	const filteredLeads = useMemo(() => {
		if (!leads) {
			return [];
		}
		if (trimmedSearch === '') {
			return leads;
		}
		return leads.filter((lead) => matchesSearch(lead, trimmedSearch));
	}, [leads, trimmedSearch]);

	let content: React.ReactNode;
	if (leads === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">Loading leads…</div>
		);
	} else if (leads.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Inbox aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No leads yet</EmptyTitle>
					<EmptyDescription>
						Enquiries submitted through the website contact form will appear
						here.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else if (trimmedSearch !== '' && filteredLeads.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Inbox aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching leads</EmptyTitle>
					<EmptyDescription>
						Try a different name, email, phone, or message.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else {
		content = (
			<DataTable
				columns={columns}
				data={filteredLeads}
				emptyMessage="No leads found."
				initialPageSize={20}
				key={trimmedSearch}
			/>
		);
	}

	return (
		<div className={cn('flex min-h-0 flex-1 flex-col gap-4')}>
			<PageHeading
				heading="Leads"
				icon={Inbox}
				rightSlot={
					<InputGroup className="w-full sm:min-w-80 sm:max-w-2xl">
						<InputGroupAddon align="inline-start">
							<InputGroupText>
								<SearchIcon aria-hidden />
							</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							aria-label="Search leads"
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by name, email, phone, or message…"
							type="search"
							value={search}
						/>
					</InputGroup>
				}
			/>
			{content}
		</div>
	);
}
