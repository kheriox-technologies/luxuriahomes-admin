'use client';

import { api } from '@workspace/backend/api';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxCollection,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxGroupLabel,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import { Input } from '@workspace/ui/components/input';
import { useQuery } from 'convex/react';
import { Plus, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { LetterDestination } from './letter-location-field';

export interface LetterRecipientValue {
	company?: string;
	email?: string;
	id: string;
	name: string;
}

interface OptionGroup {
	items: string[];
	key: string;
	value: string;
}

const MANUAL_PREFIX = 'manual:';

function recipientLabel(recipient: LetterRecipientValue): string {
	const company = recipient.company?.trim();
	return company ? `${recipient.name} — ${company}` : recipient.name;
}

export default function LetterRecipientsField({
	value,
	onChange,
	destination,
}: {
	destination: LetterDestination;
	onChange: (next: LetterRecipientValue[]) => void;
	value: LetterRecipientValue[];
}) {
	const isProject = destination.scope === 'project';
	const projectId =
		destination.scope === 'project' ? destination.projectId : undefined;

	// Company scope: all projects' clients + all service providers.
	const allProjects = useQuery(api.projects.list.list, isProject ? 'skip' : {});
	const allProviders = useQuery(
		api.serviceProviders.list.list,
		isProject ? 'skip' : {}
	);
	// Project scope: just the selected project's clients + its linked providers.
	const project = useQuery(
		api.projects.get.get,
		projectId ? { projectId } : 'skip'
	);
	const projectProviders = useQuery(
		api.projectServiceProviders.listByProject.list,
		projectId ? { projectId } : 'skip'
	);

	const [manualName, setManualName] = useState('');
	const [manualCompany, setManualCompany] = useState('');
	const [manualEmail, setManualEmail] = useState('');

	// Build the selectable options (clients + service providers) keyed by a
	// synthetic id. Clients have no stable id, so they are keyed by project + index.
	const { optionById, groups } = useMemo(() => {
		const byId = new Map<string, LetterRecipientValue>();
		const clientIds: string[] = [];
		const providerIds: string[] = [];

		const scopedProject = project ? [project] : [];
		const clientProjects = isProject ? scopedProject : (allProjects ?? []);
		const providers = isProject
			? (projectProviders ?? [])
			: (allProviders ?? []);

		for (const clientProject of clientProjects) {
			clientProject.clients.forEach((client, index) => {
				const name = `${client.firstName} ${client.lastName}`.trim();
				if (!name) {
					return;
				}
				const id = `client:${clientProject._id}:${index}`;
				byId.set(id, {
					id,
					name,
					company: client.company,
					email: client.email,
				});
				clientIds.push(id);
			});
		}

		for (const provider of providers) {
			const id = `sp:${provider._id}`;
			byId.set(id, {
				id,
				name: provider.name,
				company: provider.company,
				email: provider.email,
			});
			providerIds.push(id);
		}

		const nextGroups: OptionGroup[] = [];
		if (clientIds.length > 0) {
			nextGroups.push({ key: 'clients', value: 'Clients', items: clientIds });
		}
		if (providerIds.length > 0) {
			nextGroups.push({
				key: 'service-providers',
				value: 'Service Providers',
				items: providerIds,
			});
		}
		return { optionById: byId, groups: nextGroups };
	}, [isProject, project, allProjects, projectProviders, allProviders]);

	const selectedKnownIds = value
		.filter((recipient) => !recipient.id.startsWith(MANUAL_PREFIX))
		.map((recipient) => recipient.id);
	const manualRecipients = value.filter((recipient) =>
		recipient.id.startsWith(MANUAL_PREFIX)
	);

	const busy = isProject
		? project === undefined || projectProviders === undefined
		: allProjects === undefined || allProviders === undefined;

	// When the location changes, drop any selected client/provider that isn't
	// part of the newly scoped options. Manual recipients are always kept. Guard
	// on `busy` so we don't wipe valid selections while the new data loads.
	useEffect(() => {
		if (busy) {
			return;
		}
		const kept = value.filter(
			(recipient) =>
				recipient.id.startsWith(MANUAL_PREFIX) || optionById.has(recipient.id)
		);
		if (kept.length !== value.length) {
			onChange(kept);
		}
	}, [busy, optionById, value, onChange]);

	const handleKnownChange = (nextIds: string[]) => {
		const known = nextIds
			.map((id) => optionById.get(id))
			.filter((recipient): recipient is LetterRecipientValue =>
				Boolean(recipient)
			);
		onChange([...known, ...manualRecipients]);
	};

	const addManual = () => {
		const name = manualName.trim();
		if (!name) {
			return;
		}
		const company = manualCompany.trim();
		const email = manualEmail.trim();
		const known = selectedKnownIds
			.map((id) => optionById.get(id))
			.filter((recipient): recipient is LetterRecipientValue =>
				Boolean(recipient)
			);
		const manual: LetterRecipientValue = {
			id: `${MANUAL_PREFIX}${name}:${company}:${manualRecipients.length}`,
			name,
			company: company || undefined,
			email: email || undefined,
		};
		onChange([...known, ...manualRecipients, manual]);
		setManualName('');
		setManualCompany('');
		setManualEmail('');
	};

	const removeManual = (id: string) => {
		onChange(value.filter((recipient) => recipient.id !== id));
	};

	return (
		<div className="flex w-full flex-col gap-2">
			<Combobox<string, true>
				disabled={busy}
				items={groups}
				itemToStringLabel={(item) => {
					const recipient = optionById.get(item);
					return recipient ? recipientLabel(recipient) : '';
				}}
				multiple
				onValueChange={(next) =>
					handleKnownChange((next as string[] | null) ?? [])
				}
				value={selectedKnownIds}
			>
				<ComboboxChips>
					{selectedKnownIds.map((id) => (
						<ComboboxChip key={id}>
							{optionById.get(id)?.name ?? id}
						</ComboboxChip>
					))}
					<ComboboxChipsInput
						placeholder={
							busy
								? 'Loading recipients…'
								: 'Search clients & service providers…'
						}
					/>
				</ComboboxChips>
				<ComboboxPopup>
					<ComboboxEmpty>No recipient found.</ComboboxEmpty>
					<ComboboxList>
						{(group: OptionGroup) => (
							<ComboboxGroup items={group.items} key={group.key}>
								<ComboboxGroupLabel>{group.value}</ComboboxGroupLabel>
								<ComboboxCollection>
									{(item: string) => (
										<ComboboxItemContent
											key={item}
											recipient={optionById.get(item)}
											value={item}
										/>
									)}
								</ComboboxCollection>
							</ComboboxGroup>
						)}
					</ComboboxList>
				</ComboboxPopup>
			</Combobox>

			{manualRecipients.length > 0 ? (
				<div className="flex flex-wrap gap-1.5">
					{manualRecipients.map((recipient) => (
						<span
							className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-1 font-medium text-accent-foreground text-xs"
							key={recipient.id}
						>
							{recipientLabel(recipient)}
							<button
								aria-label={`Remove ${recipient.name}`}
								className="opacity-70 hover:opacity-100"
								onClick={() => removeManual(recipient.id)}
								type="button"
							>
								<X className="size-3.5" />
							</button>
						</span>
					))}
				</div>
			) : null}

			<div className="flex flex-wrap items-end gap-2">
				<Input
					aria-label="Recipient name"
					className="min-w-40 flex-1"
					nativeInput
					onChange={(event) => setManualName(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === 'Enter') {
							event.preventDefault();
							addManual();
						}
					}}
					placeholder="Add recipient name"
					size="sm"
					value={manualName}
				/>
				<Input
					aria-label="Recipient company"
					className="min-w-40 flex-1"
					nativeInput
					onChange={(event) => setManualCompany(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === 'Enter') {
							event.preventDefault();
							addManual();
						}
					}}
					placeholder="Company (optional)"
					size="sm"
					value={manualCompany}
				/>
				<Input
					aria-label="Recipient email"
					className="min-w-40 flex-1"
					nativeInput
					onChange={(event) => setManualEmail(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === 'Enter') {
							event.preventDefault();
							addManual();
						}
					}}
					placeholder="Email (optional)"
					size="sm"
					type="email"
					value={manualEmail}
				/>
				<Button
					disabled={manualName.trim() === ''}
					onClick={addManual}
					size="sm"
					type="button"
					variant="outline"
				>
					<Plus aria-hidden /> Add
				</Button>
			</div>
		</div>
	);
}

// Renders a recipient option with the name on top and company beneath, while the
// combobox still filters on the full "name — company" label.
function ComboboxItemContent({
	value,
	recipient,
}: {
	recipient: LetterRecipientValue | undefined;
	value: string;
}) {
	if (!recipient) {
		return null;
	}
	return (
		<ComboboxItem value={value}>
			<div className="flex flex-col">
				<span>{recipient.name}</span>
				{recipient.company?.trim() ? (
					<span className="text-muted-foreground text-xs">
						{recipient.company}
					</span>
				) : null}
			</div>
		</ComboboxItem>
	);
}
