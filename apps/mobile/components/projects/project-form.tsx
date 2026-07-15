import { api } from '@workspace/backend/api';
import { useAction } from 'convex/react';
import { Check, Pencil, Plus, Trash2 } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { DateField } from '@/components/ui/date-field';
import { Select, type SelectOption } from '@/components/ui/select';
import { TextField } from '@/components/ui/text-field';
import {
	AUSTRALIAN_STATES,
	type ClientDraft,
	clientAddressesEqual,
	clientAddressLine,
	clientDisplayName,
	clientDraftFromStored,
	cloneClientAddress,
	emptyAddressDraft,
	emptyClientDraft,
	PROJECT_STATUS_LABELS,
	PROJECT_STATUSES,
	type ProjectFormValues,
	type ProjectStatus,
	type ProjectStoredClient,
	validateClientDraft,
	validateProjectForm,
} from '@/lib/project-form';

const STATUS_OPTIONS: SelectOption<ProjectStatus>[] = PROJECT_STATUSES.map(
	(status) => ({ value: status, label: PROJECT_STATUS_LABELS[status] })
);

const STATE_OPTIONS: SelectOption<string>[] = AUSTRALIAN_STATES.map((code) => ({
	value: code,
	label: code,
}));

interface XeroOption {
	id: string;
	name: string;
}

function ClientCard({
	client,
	onEdit,
	onDelete,
}: {
	client: ProjectStoredClient;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const colors = useThemeColors();
	const addressLine = clientAddressLine(client);
	return (
		<View className="gap-2 rounded-xl border border-border bg-card p-3">
			<View className="flex-row items-center justify-between gap-3">
				<Text
					className="flex-1 font-sans-semibold text-foreground text-sm"
					numberOfLines={1}
				>
					{clientDisplayName(client)}
				</Text>
				<View className="flex-row overflow-hidden rounded-lg border border-border">
					<Pressable
						accessibilityLabel="Edit client"
						accessibilityRole="button"
						className="h-9 w-9 items-center justify-center active:bg-muted"
						onPress={onEdit}
					>
						<Pencil color={colors.foreground} size={16} strokeWidth={2} />
					</Pressable>
					<View className="w-px bg-border" />
					<Pressable
						accessibilityLabel="Delete client"
						accessibilityRole="button"
						className="h-9 w-9 items-center justify-center active:bg-muted"
						onPress={onDelete}
					>
						<Trash2 color={colors.destructive} size={16} strokeWidth={2} />
					</Pressable>
				</View>
			</View>
			<Text className="font-sans text-muted-foreground text-sm">
				{`${client.email} | ${client.phone}`}
			</Text>
			<Text className="font-sans text-muted-foreground text-sm">
				{addressLine || 'No address'}
			</Text>
		</View>
	);
}

function XeroProjectField({
	value,
	onChange,
}: {
	value: string | undefined;
	onChange: (next: string | undefined) => void;
}) {
	const listOptions = useAction(
		api.xero.listTrackingOptions.listTrackingOptions
	);
	const [options, setOptions] = useState<XeroOption[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		setLoading(true);
		listOptions({})
			.then((result) => {
				if (active) {
					setOptions(result.options);
				}
			})
			.catch(() => {
				// Leave empty on failure; the field stays usable (None selectable).
			})
			.finally(() => {
				if (active) {
					setLoading(false);
				}
			});
		return () => {
			active = false;
		};
	}, [listOptions]);

	const selectOptions = useMemo<SelectOption<string>[]>(() => {
		const base: SelectOption<string>[] = [
			{ value: '', label: 'None' },
			...options.map((option) => ({ value: option.id, label: option.name })),
		];
		if (value && !options.some((option) => option.id === value)) {
			base.push({ value, label: value });
		}
		return base;
	}, [options, value]);

	return (
		<View className="gap-1.5">
			<Text className="font-sans-medium text-foreground text-sm">
				Xero project (for Expenses & Received sync)
			</Text>
			<Select
				onChange={(next) => onChange(next === '' ? undefined : next)}
				options={selectOptions}
				placeholder={loading ? 'Loading Xero projects…' : 'Select Xero project'}
				title="Xero project"
				value={value ?? ''}
			/>
		</View>
	);
}

export function ProjectForm({
	mode,
	initialValues,
	initialClients,
	submitting,
	onSubmit,
	onDelete,
	deleting,
}: {
	mode: 'create' | 'edit';
	initialValues: ProjectFormValues;
	initialClients: ProjectStoredClient[];
	submitting: boolean;
	onSubmit: (values: ProjectFormValues, clients: ProjectStoredClient[]) => void;
	onDelete?: () => void;
	deleting?: boolean;
}) {
	const colors = useThemeColors();
	const [values, setValues] = useState<ProjectFormValues>(initialValues);
	const [quotePriceText, setQuotePriceText] = useState(
		initialValues.quotePrice?.toString() ?? ''
	);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const [clients, setClients] = useState<ProjectStoredClient[]>(initialClients);
	const [draft, setDraft] = useState<ClientDraft>(emptyClientDraft);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [sameAsFirstClient, setSameAsFirstClient] = useState(true);
	const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

	const showSameAsFirst = clients.length >= 1 && editingIndex !== 0;
	const showAddressInputs =
		clients.length === 0 || editingIndex === 0 || !sameAsFirstClient;

	const patchAddress = (patch: Partial<ProjectFormValues['address']>) => {
		setValues((prev) => ({ ...prev, address: { ...prev.address, ...patch } }));
	};

	const patchDraftAddress = (patch: Partial<ClientDraft['address']>) => {
		setDraft((prev) => ({ ...prev, address: { ...prev.address, ...patch } }));
	};

	const handleQuotePriceChange = (text: string) => {
		setQuotePriceText(text);
		const trimmed = text.trim();
		const parsed = trimmed === '' ? undefined : Number(trimmed);
		setValues((prev) => ({
			...prev,
			quotePrice:
				parsed === undefined || Number.isNaN(parsed) ? undefined : parsed,
		}));
	};

	const handleAddOrSaveClient = () => {
		const draftToValidate =
			showSameAsFirst && sameAsFirstClient
				? { ...draft, address: { ...emptyAddressDraft } }
				: draft;
		const result = validateClientDraft(draftToValidate);
		if (!result.ok) {
			setClientErrors(result.errors);
			return;
		}
		setClientErrors({});
		let next = result.client;
		if (showSameAsFirst && sameAsFirstClient) {
			const firstAddress = clients[0]?.address;
			if (firstAddress) {
				next = { ...next, address: cloneClientAddress(firstAddress) };
			}
		}
		if (editingIndex === null) {
			setClients((prev) => [...prev, next]);
		} else {
			setClients((prev) =>
				prev.map((client, index) => (index === editingIndex ? next : client))
			);
		}
		setDraft(emptyClientDraft);
		setEditingIndex(null);
		setSameAsFirstClient(true);
	};

	const handleEditClient = (index: number) => {
		const client = clients[index];
		if (!client) {
			return;
		}
		setDraft(clientDraftFromStored(client));
		setEditingIndex(index);
		setClientErrors({});
		if (index > 0) {
			setSameAsFirstClient(
				clientAddressesEqual(client.address, clients[0]?.address)
			);
		} else {
			setSameAsFirstClient(true);
		}
	};

	const confirmDeleteClient = (index: number) => {
		Alert.alert('Delete client?', 'Remove this client from the project?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Delete',
				style: 'destructive',
				onPress: () => {
					setClients((prev) => prev.filter((_, i) => i !== index));
					if (editingIndex === index) {
						setDraft(emptyClientDraft);
						setEditingIndex(null);
						setSameAsFirstClient(true);
					}
				},
			},
		]);
	};

	const handleSubmit = () => {
		const projectErrors = validateProjectForm(values);
		setErrors(projectErrors);
		if (Object.keys(projectErrors).length > 0) {
			return;
		}
		if (clients.length < 1) {
			Alert.alert('Clients required', 'Add at least one client before saving.');
			return;
		}
		onSubmit(values, clients);
	};

	const confirmDelete = () => {
		if (!onDelete) {
			return;
		}
		Alert.alert(
			'Delete project?',
			`Delete "${values.name || 'this project'}"? This cannot be undone.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Delete', style: 'destructive', onPress: onDelete },
			]
		);
	};

	return (
		<ScrollView
			contentContainerClassName="gap-6 px-4 pt-2 pb-10"
			keyboardShouldPersistTaps="handled"
		>
			{/* Project details */}
			<View className="gap-4">
				<Text className="font-sans-semibold text-base text-foreground">
					Project details
				</Text>
				<TextField
					error={errors.name}
					label="Name"
					onChangeText={(name) => setValues((prev) => ({ ...prev, name }))}
					placeholder="Project name"
					value={values.name}
				/>
				<DateField
					label="Start date"
					onChange={(startDate) =>
						setValues((prev) => ({ ...prev, startDate }))
					}
					placeholder="Select start date"
					value={values.startDate}
				/>
				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Status
					</Text>
					<Select
						onChange={(status) => setValues((prev) => ({ ...prev, status }))}
						options={STATUS_OPTIONS}
						title="Project status"
						value={values.status}
					/>
				</View>

				<Text className="font-sans-medium text-muted-foreground text-sm">
					Address
				</Text>
				<TextField
					error={errors['address.street']}
					label="Street"
					onChangeText={(street) => patchAddress({ street })}
					placeholder="Street"
					value={values.address.street}
				/>
				<TextField
					error={errors['address.suburb']}
					label="Suburb"
					onChangeText={(suburb) => patchAddress({ suburb })}
					placeholder="Suburb"
					value={values.address.suburb}
				/>
				<View className="flex-row gap-3">
					<View className="flex-1 gap-1.5">
						<Text className="font-sans-medium text-foreground text-sm">
							State
						</Text>
						<Select
							onChange={(state) => patchAddress({ state })}
							options={STATE_OPTIONS}
							placeholder="State"
							title="Select state"
							value={values.address.state}
						/>
						{errors['address.state'] ? (
							<Text className="font-sans text-destructive text-xs">
								{errors['address.state']}
							</Text>
						) : null}
					</View>
					<TextField
						className="flex-1"
						error={errors['address.postcode']}
						keyboardType="number-pad"
						label="Postcode"
						onChangeText={(postcode) => patchAddress({ postcode })}
						placeholder="0000"
						value={values.address.postcode}
					/>
				</View>
			</View>

			{/* Pricing */}
			<View className="gap-4">
				<Text className="font-sans-semibold text-base text-foreground">
					Pricing
				</Text>
				<TextField
					error={errors.quotePrice}
					keyboardType="decimal-pad"
					label="Quote price"
					onChangeText={handleQuotePriceChange}
					placeholder="0"
					value={quotePriceText}
				/>
				<XeroProjectField
					onChange={(xeroTrackingOptionId) =>
						setValues((prev) => ({ ...prev, xeroTrackingOptionId }))
					}
					value={values.xeroTrackingOptionId}
				/>
			</View>

			{/* Client details */}
			<View className="gap-4">
				<Text className="font-sans-semibold text-base text-foreground">
					Client details
				</Text>

				<View className="flex-row gap-3">
					<TextField
						autoCapitalize="words"
						className="flex-1"
						error={clientErrors.firstName}
						label="First name"
						onChangeText={(firstName) =>
							setDraft((prev) => ({ ...prev, firstName }))
						}
						placeholder="First name"
						value={draft.firstName}
					/>
					<TextField
						autoCapitalize="words"
						className="flex-1"
						error={clientErrors.lastName}
						label="Last name"
						onChangeText={(lastName) =>
							setDraft((prev) => ({ ...prev, lastName }))
						}
						placeholder="Last name"
						value={draft.lastName}
					/>
				</View>
				<TextField
					autoCapitalize="none"
					error={clientErrors.email}
					keyboardType="email-address"
					label="Email"
					onChangeText={(email) => setDraft((prev) => ({ ...prev, email }))}
					placeholder="Email"
					value={draft.email}
				/>
				<TextField
					error={clientErrors.phone}
					keyboardType="phone-pad"
					label="Phone"
					onChangeText={(phone) => setDraft((prev) => ({ ...prev, phone }))}
					placeholder="Phone"
					value={draft.phone}
				/>
				<TextField
					label="Company"
					onChangeText={(company) => setDraft((prev) => ({ ...prev, company }))}
					placeholder="Company (optional)"
					value={draft.company}
				/>

				<View className="flex-row items-center justify-between">
					<Text className="font-sans-medium text-muted-foreground text-sm">
						Client address
					</Text>
					{showSameAsFirst ? (
						<View className="flex-row items-center gap-2">
							<Text className="font-sans text-muted-foreground text-sm">
								Same as first
							</Text>
							<Switch
								onValueChange={setSameAsFirstClient}
								value={sameAsFirstClient}
							/>
						</View>
					) : null}
				</View>

				{showAddressInputs ? (
					<View className="gap-4">
						<TextField
							error={clientErrors['address.street']}
							label="Street"
							onChangeText={(street) => patchDraftAddress({ street })}
							placeholder="Street (optional)"
							value={draft.address.street}
						/>
						<TextField
							error={clientErrors['address.suburb']}
							label="Suburb"
							onChangeText={(suburb) => patchDraftAddress({ suburb })}
							placeholder="Suburb (optional)"
							value={draft.address.suburb}
						/>
						<View className="flex-row gap-3">
							<View className="flex-1 gap-1.5">
								<Text className="font-sans-medium text-foreground text-sm">
									State
								</Text>
								<Select
									onChange={(state) => patchDraftAddress({ state })}
									options={STATE_OPTIONS}
									placeholder="State"
									title="Select state"
									value={draft.address.state}
								/>
								{clientErrors['address.state'] ? (
									<Text className="font-sans text-destructive text-xs">
										{clientErrors['address.state']}
									</Text>
								) : null}
							</View>
							<TextField
								className="flex-1"
								error={clientErrors['address.postcode']}
								keyboardType="number-pad"
								label="Postcode"
								onChangeText={(postcode) => patchDraftAddress({ postcode })}
								placeholder="Postcode"
								value={draft.address.postcode}
							/>
						</View>
					</View>
				) : null}

				<Button
					icon={<Plus color={colors.foreground} size={18} strokeWidth={2} />}
					onPress={handleAddOrSaveClient}
				>
					{editingIndex === null ? 'Add client' : 'Save client'}
				</Button>

				{clients.length > 0 ? (
					<View className="gap-3">
						{clients.map((client, index) => (
							<ClientCard
								client={client}
								key={`${client.email}-${index}`}
								onDelete={() => confirmDeleteClient(index)}
								onEdit={() => handleEditClient(index)}
							/>
						))}
					</View>
				) : null}
			</View>

			<View className="gap-3">
				<Button
					icon={<Check color={colors.foreground} size={18} strokeWidth={2} />}
					loading={submitting}
					onPress={handleSubmit}
				>
					{mode === 'create' ? 'Create project' : 'Save changes'}
				</Button>
				{onDelete ? (
					<Button
						icon={
							<Trash2 color={colors.destructive} size={18} strokeWidth={2} />
						}
						loading={deleting}
						onPress={confirmDelete}
						variant="destructive-outline"
					>
						Delete project
					</Button>
				) : null}
			</View>
		</ScrollView>
	);
}
