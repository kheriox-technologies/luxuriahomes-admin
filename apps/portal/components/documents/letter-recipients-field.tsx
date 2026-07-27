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
import { useMemo, useState } from 'react';

export interface LetterRecipientValue {
	company?: string;
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
}: {
	onChange: (next: LetterRecipientValue[]) => void;
	value: LetterRecipientValue[];
}) {
	const serviceProviders = useQuery(api.serviceProviders.list.list, {});
	const projects = useQuery(api.projects.list.list, {});

	const [manualName, setManualName] = useState('');
	const [manualCompany, setManualCompany] = useState('');

	// Build the selectable options (clients + service providers) keyed by a
	// synthetic id. Clients have no stable id, so they are keyed by project + index.
	const { optionById, groups } = useMemo(() => {
		const byId = new Map<string, LetterRecipientValue>();
		const clientIds: string[] = [];
		const providerIds: string[] = [];

		for (const project of projects ?? []) {
			project.clients.forEach((client, index) => {
				const name = `${client.firstName} ${client.lastName}`.trim();
				if (!name) {
					return;
				}
				const id = `client:${project._id}:${index}`;
				byId.set(id, { id, name, company: client.company });
				clientIds.push(id);
			});
		}

		for (const provider of serviceProviders ?? []) {
			const id = `sp:${provider._id}`;
			byId.set(id, { id, name: provider.name, company: provider.company });
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
	}, [projects, serviceProviders]);

	const selectedKnownIds = value
		.filter((recipient) => !recipient.id.startsWith(MANUAL_PREFIX))
		.map((recipient) => recipient.id);
	const manualRecipients = value.filter((recipient) =>
		recipient.id.startsWith(MANUAL_PREFIX)
	);

	const busy = projects === undefined || serviceProviders === undefined;

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
		const known = selectedKnownIds
			.map((id) => optionById.get(id))
			.filter((recipient): recipient is LetterRecipientValue =>
				Boolean(recipient)
			);
		const manual: LetterRecipientValue = {
			id: `${MANUAL_PREFIX}${name}:${company}:${manualRecipients.length}`,
			name,
			company: company || undefined,
		};
		onChange([...known, ...manualRecipients, manual]);
		setManualName('');
		setManualCompany('');
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
