import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { Check } from 'lucide-react-native';
import {
	type Ref,
	useCallback,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Alert, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/ui/multi-select';
import { TextField } from '@/components/ui/text-field';

type Trade = Doc<'trades'>;

export interface CreateServiceProviderResult {
	id: Id<'serviceProviders'>;
	tradeIds: Id<'trades'>[];
}

export interface CreateServiceProviderSheetHandle {
	present: (opts?: { initialTradeIds?: Id<'trades'>[] }) => void;
}

/**
 * The single source of truth for creating a NEW service provider on mobile.
 * A stacked bottom sheet with the provider form (company, contact, optional
 * details, trades). Distinct from `AddServiceProviderSheet`, which only links
 * existing providers to a project. Mirrors the portal `AddServiceProvider`
 * form: exposes `present({ initialTradeIds })` and reports the created provider
 * via `onCreated`.
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

	const trades = useQuery(api.trades.list.list, {}) as Trade[] | undefined;
	const addServiceProvider = useMutation(api.serviceProviders.add.add);

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
	const [saving, setSaving] = useState(false);
	const [showErrors, setShowErrors] = useState(false);

	const reset = () => {
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
		setShowErrors(false);
	};

	useImperativeHandle(ref, () => ({
		present: (opts) => {
			reset();
			setTradeIds(opts?.initialTradeIds ?? []);
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

	const tradeOptions = useMemo(
		() =>
			(trades ?? []).map((trade) => ({
				value: trade._id as string,
				label: trade.name,
			})),
		[trades]
	);

	const toggleTrade = (value: string) =>
		setTradeIds((prev) =>
			prev.includes(value as Id<'trades'>)
				? prev.filter((id) => id !== value)
				: [...prev, value as Id<'trades'>]
		);

	const handleSave = async () => {
		if (company.trim() === '' || name.trim() === '') {
			setShowErrors(true);
			return;
		}
		setSaving(true);
		try {
			const id = await addServiceProvider({
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
				contacts: [],
			});
			onCreated?.({ id, tradeIds });
			sheetRef.current?.dismiss();
		} catch {
			Alert.alert('Could not create service provider', 'Please try again.');
		} finally {
			setSaving(false);
		}
	};

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
					New service provider
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
					<MultiSelect
						className="w-full"
						onToggle={toggleTrade}
						options={tradeOptions}
						placeholder="Select trades"
						title="Select trades"
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

				<Button
					className="mt-1"
					icon={<Check color={colors.foreground} size={18} strokeWidth={2} />}
					loading={saving}
					onPress={handleSave}
				>
					Create service provider
				</Button>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
