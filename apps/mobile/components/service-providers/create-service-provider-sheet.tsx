import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useMutation } from 'convex/react';
import { Check, Pencil, Plus, Trash2 } from 'lucide-react-native';
import {
	type Ref,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { TradeMultiSelectField } from '@/components/trades/trade-multi-select-field';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TextField } from '@/components/ui/text-field';

interface ContactDraft {
	email: string;
	landline: string;
	name: string;
	phone: string;
	position: string;
}

const emptyContactDraft: ContactDraft = {
	name: '',
	email: '',
	phone: '',
	landline: '',
	position: '',
};

export interface CreateServiceProviderResult {
	id: Id<'serviceProviders'>;
	tradeIds: Id<'trades'>[];
}

export interface CreateServiceProviderSheetHandle {
	present: (opts?: {
		initialTradeIds?: Id<'trades'>[];
		provider?: Doc<'serviceProviders'>;
	}) => void;
}

/**
 * The single source of truth for creating OR editing a service provider on
 * mobile. A stacked bottom sheet with the provider form (company, contact,
 * optional details, trades). Distinct from `AddServiceProviderSheet`, which
 * only links existing providers to a project. Mirrors the portal
 * `AddServiceProvider` / `EditServiceProvider` forms: exposes
 * `present({ initialTradeIds, provider })` — pass `provider` to edit — and
 * reports the created provider via `onCreated` (create mode only).
 */
export function CreateServiceProviderSheet({
	onCreated,
	ref,
}: {
	onCreated?: (result: CreateServiceProviderResult) => void;
	ref?: Ref<CreateServiceProviderSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const addServiceProvider = useMutation(api.serviceProviders.add.add);
	const updateServiceProvider = useMutation(api.serviceProviders.update.update);

	const [editingId, setEditingId] = useState<Id<'serviceProviders'> | null>(
		null
	);
	const [company, setCompany] = useState('');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [landline, setLandline] = useState('');
	const [position, setPosition] = useState('');
	const [qbccLicense, setQbccLicense] = useState('');
	const [website, setWebsite] = useState('');
	const [address, setAddress] = useState('');
	const [tradeIds, setTradeIds] = useState<Id<'trades'>[]>([]);
	const [contacts, setContacts] = useState<ContactDraft[]>([]);
	const [draft, setDraft] = useState<ContactDraft>(emptyContactDraft);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [saving, setSaving] = useState(false);
	const [showErrors, setShowErrors] = useState(false);

	const reset = () => {
		setEditingId(null);
		setCompany('');
		setName('');
		setEmail('');
		setPhone('');
		setLandline('');
		setPosition('');
		setQbccLicense('');
		setWebsite('');
		setAddress('');
		setTradeIds([]);
		setContacts([]);
		setDraft(emptyContactDraft);
		setEditingIndex(null);
		setShowErrors(false);
	};

	useImperativeHandle(ref, () => ({
		present: (opts) => {
			reset();
			const provider = opts?.provider;
			if (provider) {
				setEditingId(provider._id);
				setCompany(provider.company);
				setName(provider.name);
				setEmail(provider.email ?? '');
				setPhone(provider.phone ?? '');
				setLandline(provider.landline ?? '');
				setPosition(provider.position ?? '');
				setQbccLicense(provider.qbccLicense ?? '');
				setWebsite(provider.website ?? '');
				setAddress(provider.address ?? '');
				setTradeIds(provider.tradeIds);
				setContacts(
					provider.contacts.map((contact) => ({
						name: contact.name,
						email: contact.email ?? '',
						phone: contact.phone ?? '',
						landline: contact.landline ?? '',
						position: contact.position ?? '',
					}))
				);
			} else {
				setTradeIds(opts?.initialTradeIds ?? []);
			}
			sheetRef.current?.present();
		},
	}));

	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				opacity={0.5}
			/>
		),
		[]
	);

	const updateDraft = (key: keyof ContactDraft, value: string) =>
		setDraft((prev) => ({ ...prev, [key]: value }));

	const handleAddOrSaveContact = () => {
		if (draft.name.trim() === '') {
			return;
		}
		const next: ContactDraft = {
			name: draft.name.trim(),
			email: draft.email.trim(),
			phone: draft.phone.trim(),
			landline: draft.landline.trim(),
			position: draft.position.trim(),
		};
		setContacts((prev) => {
			if (editingIndex === null) {
				return [...prev, next];
			}
			const copy = [...prev];
			copy[editingIndex] = next;
			return copy;
		});
		setDraft(emptyContactDraft);
		setEditingIndex(null);
	};

	const handleEditContact = (index: number) => {
		const contact = contacts[index];
		if (!contact) {
			return;
		}
		setDraft(contact);
		setEditingIndex(index);
	};

	const handleDeleteContact = (index: number) => {
		setContacts((prev) => prev.filter((_, i) => i !== index));
		if (editingIndex === index) {
			setDraft(emptyContactDraft);
			setEditingIndex(null);
		}
	};

	const handleSave = async () => {
		if (company.trim() === '' || name.trim() === '') {
			setShowErrors(true);
			return;
		}
		setSaving(true);
		const fields = {
			company: company.trim(),
			name: name.trim(),
			email: email.trim() || undefined,
			phone: phone.trim() || undefined,
			landline: landline.trim() || undefined,
			position: position.trim() || undefined,
			qbccLicense: qbccLicense.trim() || undefined,
			website: website.trim() || undefined,
			address: address.trim() || undefined,
			tradeIds,
			contacts: contacts.map((contact) => ({
				name: contact.name,
				email: contact.email || undefined,
				phone: contact.phone || undefined,
				landline: contact.landline || undefined,
				position: contact.position || undefined,
			})),
		};
		try {
			if (editingId) {
				await updateServiceProvider({
					serviceProviderId: editingId,
					...fields,
				});
			} else {
				const id = await addServiceProvider(fields);
				onCreated?.({ id, tradeIds });
			}
			sheetRef.current?.dismiss();
		} catch {
			Alert.alert(
				editingId
					? 'Could not update service provider'
					: 'Could not create service provider',
				'Please try again.'
			);
		} finally {
			setSaving(false);
		}
	};

	const isEditing = editingId !== null;

	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			backgroundStyle={{ backgroundColor: colors.card }}
			enableDynamicSizing
			handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
			keyboardBehavior="interactive"
			maxDynamicContentSize={720}
			ref={sheetRef}
			stackBehavior="push"
			topInset={insets.top}
		>
			<BottomSheetScrollView
				className="px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16, gap: 12 }}
				keyboardShouldPersistTaps="handled"
			>
				<Text className="px-1 font-sans-semibold text-base text-foreground">
					{isEditing ? 'Edit service provider' : 'New service provider'}
				</Text>

				<TextField
					error={
						showErrors && company.trim() === ''
							? 'Company is required'
							: undefined
					}
					label="Company"
					onChangeText={setCompany}
					placeholder="Company name"
					value={company}
				/>
				<TextField
					error={
						showErrors && name.trim() === ''
							? 'Contact name is required'
							: undefined
					}
					label="Main contact name"
					onChangeText={setName}
					placeholder="Contact name"
					value={name}
				/>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Trades
					</Text>
					<TradeMultiSelectField
						allowCreate
						onValuesChange={setTradeIds}
						values={tradeIds}
					/>
				</View>

				<TextField
					autoCapitalize="none"
					keyboardType="email-address"
					label="Email"
					onChangeText={setEmail}
					placeholder="Email (optional)"
					value={email}
				/>
				<TextField
					keyboardType="phone-pad"
					label="Phone"
					onChangeText={setPhone}
					placeholder="Phone (optional)"
					value={phone}
				/>
				<TextField
					keyboardType="phone-pad"
					label="Landline"
					onChangeText={setLandline}
					placeholder="Landline (optional)"
					value={landline}
				/>
				<TextField
					label="Position"
					onChangeText={setPosition}
					placeholder="Position (optional)"
					value={position}
				/>
				<TextField
					label="QBCC license"
					onChangeText={setQbccLicense}
					placeholder="QBCC license (optional)"
					value={qbccLicense}
				/>
				<TextField
					autoCapitalize="none"
					label="Website"
					onChangeText={setWebsite}
					placeholder="Website (optional)"
					value={website}
				/>
				<TextField
					label="Address"
					onChangeText={setAddress}
					placeholder="Address (optional)"
					value={address}
				/>

				<View className="mt-1 gap-2.5">
					<Text className="px-1 font-sans-semibold text-foreground text-sm">
						Additional contacts
					</Text>

					{contacts.map((contact, index) => (
						<Card
							className="flex-row items-start gap-2 p-3"
							key={`${contact.name}-${index}`}
						>
							<View className="flex-1 gap-0.5">
								<Text className="font-sans-semibold text-foreground text-sm">
									{contact.name}
								</Text>
								{contact.position ? (
									<Text className="font-sans text-muted-foreground text-xs">
										{contact.position}
									</Text>
								) : null}
								{contact.email ? (
									<Text className="font-sans text-muted-foreground text-xs">
										{contact.email}
									</Text>
								) : null}
								{[contact.phone, contact.landline].filter(Boolean).length >
								0 ? (
									<Text className="font-sans text-muted-foreground text-xs">
										{[contact.phone, contact.landline]
											.filter(Boolean)
											.join(' | ')}
									</Text>
								) : null}
							</View>
							<Pressable
								accessibilityLabel={`Edit contact ${contact.name}`}
								accessibilityRole="button"
								className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
								hitSlop={4}
								onPress={() => handleEditContact(index)}
							>
								<Pencil color={colors.foreground} size={16} strokeWidth={2} />
							</Pressable>
							<Pressable
								accessibilityLabel={`Delete contact ${contact.name}`}
								accessibilityRole="button"
								className="h-9 w-9 items-center justify-center rounded-lg border border-destructive/40 bg-card active:bg-muted"
								hitSlop={4}
								onPress={() => handleDeleteContact(index)}
							>
								<Trash2 color={colors.destructive} size={16} strokeWidth={2} />
							</Pressable>
						</Card>
					))}

					<Card className="gap-2.5 p-3">
						<TextField
							label="Name"
							onChangeText={(value) => updateDraft('name', value)}
							placeholder="Contact name"
							value={draft.name}
						/>
						<TextField
							label="Position"
							onChangeText={(value) => updateDraft('position', value)}
							placeholder="Position (optional)"
							value={draft.position}
						/>
						<TextField
							autoCapitalize="none"
							keyboardType="email-address"
							label="Email"
							onChangeText={(value) => updateDraft('email', value)}
							placeholder="Email (optional)"
							value={draft.email}
						/>
						<TextField
							keyboardType="phone-pad"
							label="Phone"
							onChangeText={(value) => updateDraft('phone', value)}
							placeholder="Phone (optional)"
							value={draft.phone}
						/>
						<TextField
							keyboardType="phone-pad"
							label="Landline"
							onChangeText={(value) => updateDraft('landline', value)}
							placeholder="Landline (optional)"
							value={draft.landline}
						/>
						<Button
							disabled={draft.name.trim() === ''}
							icon={
								editingIndex === null ? (
									<Plus color={colors.foreground} size={18} strokeWidth={2} />
								) : (
									<Check color={colors.foreground} size={18} strokeWidth={2} />
								)
							}
							onPress={handleAddOrSaveContact}
							variant="outline"
						>
							{editingIndex === null ? 'Add contact' : 'Save contact'}
						</Button>
					</Card>
				</View>

				<Button
					className="mt-1"
					icon={<Check color={colors.foreground} size={18} strokeWidth={2} />}
					loading={saving}
					onPress={handleSave}
				>
					{isEditing ? 'Save changes' : 'Create service provider'}
				</Button>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
