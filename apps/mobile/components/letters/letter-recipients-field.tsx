import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import { Plus, X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import {
	MultiSelect,
	type MultiSelectOption,
} from '@/components/ui/multi-select';
import { TextField } from '@/components/ui/text-field';

export interface LetterRecipient {
	company?: string;
	email?: string;
	id: string;
	name: string;
}

const MANUAL_PREFIX = 'manual:';

function recipientLabel(recipient: LetterRecipient): string {
	const company = recipient.company?.trim();
	return company ? `${recipient.name} — ${company}` : recipient.name;
}

/**
 * Mobile port of the portal's `LetterRecipientsField`. Recipients are scoped to
 * the letter's destination: at project scope the picker offers that project's
 * clients + its linked service providers; at company scope it offers all
 * projects' clients + all service providers. A manual-add row covers anyone not
 * in those lists. When the scope changes, selected known recipients that no
 * longer belong to the scope are dropped; manual recipients are always kept.
 */
export function LetterRecipientsField({
	scope,
	projectId,
	values,
	onChange,
}: {
	scope: 'company' | 'project';
	projectId?: Id<'projects'>;
	values: LetterRecipient[];
	onChange: (next: LetterRecipient[]) => void;
}) {
	const colors = useThemeColors();
	const isProject = scope === 'project';

	// Company scope: all projects' clients + all service providers.
	const allProjects = useQuery(api.projects.list.list, isProject ? 'skip' : {});
	const allProviders = useQuery(
		api.serviceProviders.list.list,
		isProject ? 'skip' : {}
	);
	// Project scope: just the selected project's clients + its linked providers.
	const project = useQuery(
		api.projects.get.get,
		isProject && projectId ? { projectId } : 'skip'
	);
	const projectProviders = useQuery(
		api.projectServiceProviders.listByProject.list,
		isProject && projectId ? { projectId } : 'skip'
	);

	const [manualName, setManualName] = useState('');
	const [manualCompany, setManualCompany] = useState('');
	const [manualEmail, setManualEmail] = useState('');

	// Build the selectable options (clients + service providers) keyed by a
	// synthetic id. Clients have no stable id, so they are keyed by project + index.
	const { optionById, options } = useMemo(() => {
		const byId = new Map<string, LetterRecipient>();
		const nextOptions: MultiSelectOption<string>[] = [];

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
				const recipient: LetterRecipient = {
					id,
					name,
					company: client.company,
					email: client.email,
				};
				byId.set(id, recipient);
				nextOptions.push({ value: id, label: recipientLabel(recipient) });
			});
		}

		for (const provider of providers) {
			const id = `sp:${provider._id}`;
			const recipient: LetterRecipient = {
				id,
				name: provider.name,
				company: provider.company,
				email: provider.email,
			};
			byId.set(id, recipient);
			nextOptions.push({ value: id, label: recipientLabel(recipient) });
		}

		return { optionById: byId, options: nextOptions };
	}, [isProject, project, allProjects, projectProviders, allProviders]);

	const selectedKnownIds = values
		.filter((recipient) => !recipient.id.startsWith(MANUAL_PREFIX))
		.map((recipient) => recipient.id);
	const manualRecipients = values.filter((recipient) =>
		recipient.id.startsWith(MANUAL_PREFIX)
	);

	const busy = isProject
		? project === undefined || projectProviders === undefined
		: allProjects === undefined || allProviders === undefined;

	// When the scope changes, drop any selected client/provider that isn't part of
	// the newly scoped options. Manual recipients are always kept. Guard on `busy`
	// so valid selections aren't wiped while the new data loads.
	useEffect(() => {
		if (busy) {
			return;
		}
		const kept = values.filter(
			(recipient) =>
				recipient.id.startsWith(MANUAL_PREFIX) || optionById.has(recipient.id)
		);
		if (kept.length !== values.length) {
			onChange(kept);
		}
	}, [busy, optionById, values, onChange]);

	const toggleKnown = (id: string) => {
		const isSelected = selectedKnownIds.includes(id);
		const nextKnownIds = isSelected
			? selectedKnownIds.filter((value) => value !== id)
			: [...selectedKnownIds, id];
		const known = nextKnownIds
			.map((value) => optionById.get(value))
			.filter((recipient): recipient is LetterRecipient => Boolean(recipient));
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
			.filter((recipient): recipient is LetterRecipient => Boolean(recipient));
		const manual: LetterRecipient = {
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
		onChange(values.filter((recipient) => recipient.id !== id));
	};

	return (
		<View className="gap-2">
			<MultiSelect
				onToggle={toggleKnown}
				options={options}
				placeholder={
					busy ? 'Loading recipients…' : 'Select clients & providers'
				}
				title="Recipients"
				values={selectedKnownIds}
			/>

			{manualRecipients.length > 0 ? (
				<View className="flex-row flex-wrap gap-1.5">
					{manualRecipients.map((recipient) => (
						<View
							className="flex-row items-center gap-1 rounded-md bg-accent px-2 py-1"
							key={recipient.id}
						>
							<Text className="font-sans-medium text-accent-foreground text-xs">
								{recipientLabel(recipient)}
							</Text>
							<Pressable
								accessibilityLabel={`Remove ${recipient.name}`}
								accessibilityRole="button"
								hitSlop={6}
								onPress={() => removeManual(recipient.id)}
							>
								<X color={colors.mutedForeground} size={14} strokeWidth={2} />
							</Pressable>
						</View>
					))}
				</View>
			) : null}

			<View className="gap-2 rounded-lg border border-border border-dashed p-2.5">
				<Text className="font-sans-medium text-muted-foreground text-xs">
					Add a recipient manually
				</Text>
				<TextField
					label="Name"
					onChangeText={setManualName}
					placeholder="Recipient name"
					value={manualName}
				/>
				<TextField
					label="Company (optional)"
					onChangeText={setManualCompany}
					placeholder="Company"
					value={manualCompany}
				/>
				<TextField
					autoCapitalize="none"
					keyboardType="email-address"
					label="Email (optional)"
					onChangeText={setManualEmail}
					placeholder="name@example.com"
					value={manualEmail}
				/>
				<Pressable
					accessibilityLabel="Add recipient"
					accessibilityRole="button"
					className="h-9 flex-row items-center justify-center gap-2 self-start rounded-lg border border-border bg-card px-4 active:bg-muted"
					disabled={manualName.trim() === ''}
					onPress={addManual}
					style={manualName.trim() === '' ? { opacity: 0.5 } : undefined}
				>
					<Plus color={colors.foreground} size={16} strokeWidth={2} />
					<Text className="font-sans-medium text-foreground text-sm">Add</Text>
				</Pressable>
			</View>
		</View>
	);
}
