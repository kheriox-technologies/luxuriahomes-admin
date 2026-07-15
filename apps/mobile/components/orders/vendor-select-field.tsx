import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import { useMutation, useQuery } from 'convex/react';
import { Check, ChevronDown, Plus, X } from 'lucide-react-native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/search-bar';
import { cn } from '@/lib/cn';

/**
 * The single source of truth for picking a vendor on mobile. Vendors are stored
 * by name string on the parent records, so this field works with vendor name
 * strings. A pressable field opens a stacked bottom-sheet picker with search
 * and — when `allowCreate` is set — an inline "New vendor" flow that saves the
 * vendor to the shared catalog immediately and selects it. Mirrors the portal
 * `VendorSelect` component. Self-contained: owns its own data query and create
 * flow.
 */
export function VendorSelectField({
	value,
	onValueChange,
	allowCreate,
	excludeVendors,
	disabled,
	invalid,
	placeholder = 'Select a vendor',
}: {
	value: string;
	onValueChange: (next: string) => void;
	allowCreate?: boolean;
	/** Vendor names to hide from the list (e.g. ones already added). */
	excludeVendors?: string[];
	disabled?: boolean;
	invalid?: boolean;
	placeholder?: string;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const vendors = useQuery(api.vendors.list.list, {});
	const addVendor = useMutation(api.vendors.add.add);

	const [search, setSearch] = useState('');
	const [creating, setCreating] = useState(false);
	const [newVendorName, setNewVendorName] = useState('');
	const [savingVendor, setSavingVendor] = useState(false);

	const excludeSet = useMemo(
		() => new Set(excludeVendors ?? []),
		[excludeVendors]
	);

	const trimmedSearch = search.trim().toLowerCase();

	const candidates = useMemo(() => {
		return (vendors ?? [])
			.map((vendor) => vendor.name)
			.filter((name) => {
				if (excludeSet.has(name)) {
					return false;
				}
				if (!trimmedSearch) {
					return true;
				}
				return name.toLowerCase().includes(trimmedSearch);
			})
			.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
	}, [vendors, excludeSet, trimmedSearch]);

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

	const resetCreate = () => {
		setCreating(false);
		setNewVendorName('');
	};

	const open = () => {
		setSearch('');
		resetCreate();
		sheetRef.current?.present();
	};

	const handleSelect = (name: string) => {
		onValueChange(name);
		sheetRef.current?.dismiss();
	};

	const handleCreate = async () => {
		const name = newVendorName.trim();
		if (name === '') {
			Alert.alert('Enter a vendor name', 'The vendor name cannot be empty.');
			return;
		}
		setSavingVendor(true);
		try {
			await addVendor({ name });
			onValueChange(name);
			resetCreate();
			sheetRef.current?.dismiss();
		} catch {
			Alert.alert('Could not create vendor', 'Please try again.');
		} finally {
			setSavingVendor(false);
		}
	};

	return (
		<>
			<Pressable
				accessibilityLabel={value || placeholder}
				accessibilityRole="button"
				accessibilityState={{ disabled }}
				className={cn(
					'h-9 flex-row items-center justify-between gap-1.5 rounded-lg border bg-card px-3 active:bg-muted',
					invalid ? 'border-destructive' : 'border-border',
					disabled && 'opacity-50'
				)}
				disabled={disabled}
				hitSlop={4}
				onPress={open}
			>
				<Text
					className={cn(
						'flex-1 font-sans text-xs',
						value ? 'text-foreground' : 'text-muted-foreground'
					)}
					numberOfLines={1}
				>
					{value || placeholder}
				</Text>
				<ChevronDown color={colors.mutedForeground} size={16} strokeWidth={2} />
			</Pressable>

			<BottomSheetModal
				backdropComponent={renderBackdrop}
				backgroundStyle={{ backgroundColor: colors.card }}
				enableDynamicSizing
				handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
				keyboardBehavior="interactive"
				maxDynamicContentSize={640}
				ref={sheetRef}
				stackBehavior="push"
				topInset={insets.top}
			>
				<BottomSheetScrollView
					className="px-4 pt-1"
					contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
					keyboardShouldPersistTaps="handled"
				>
					<Text className="px-1 pb-3 font-sans-semibold text-base text-foreground">
						Select vendor
					</Text>
					<View className="pb-2">
						<SearchBar
							onChangeText={setSearch}
							placeholder="Search vendors"
							value={search}
						/>
					</View>

					{allowCreate && !creating ? (
						<Button
							className="mb-2"
							icon={
								<Plus color={colors.foreground} size={18} strokeWidth={2} />
							}
							onPress={() => setCreating(true)}
						>
							New vendor
						</Button>
					) : null}

					{allowCreate && creating ? (
						<View className="mb-2 gap-2 rounded-lg border border-border p-3">
							<Text className="font-sans-medium text-foreground text-sm">
								Vendor name
							</Text>
							<BottomSheetTextInput
								autoFocus
								className="min-h-[44px] rounded-lg border border-border bg-background px-3 py-2.5 font-sans text-base text-foreground"
								onChangeText={setNewVendorName}
								placeholder="e.g. Reece Plumbing"
								placeholderTextColor={colors.mutedForeground}
								value={newVendorName}
							/>
							<View className="flex-row gap-2">
								<Button
									className="flex-1"
									icon={
										<X color={colors.foreground} size={18} strokeWidth={2} />
									}
									onPress={resetCreate}
								>
									Cancel
								</Button>
								<Button
									className="flex-1"
									icon={
										<Check
											color={colors.foreground}
											size={18}
											strokeWidth={2}
										/>
									}
									loading={savingVendor}
									onPress={handleCreate}
								>
									Create
								</Button>
							</View>
						</View>
					) : null}

					{vendors === undefined ? (
						<Text className="py-3 font-sans text-muted-foreground text-sm">
							Loading…
						</Text>
					) : null}
					{vendors !== undefined && candidates.length === 0 ? (
						<Text className="py-3 font-sans text-muted-foreground text-sm">
							No vendors found.
						</Text>
					) : null}
					{candidates.map((name) => {
						const selected = name === value;
						return (
							<Pressable
								accessibilityLabel={name}
								accessibilityRole="button"
								accessibilityState={{ selected }}
								className={cn(
									'min-h-[48px] flex-row items-center justify-between gap-3 rounded-lg px-3 active:bg-muted',
									selected && 'bg-muted'
								)}
								key={name}
								onPress={() => handleSelect(name)}
							>
								<Text
									className="flex-1 font-sans-medium text-foreground text-xs"
									numberOfLines={1}
								>
									{name}
								</Text>
								{selected ? (
									<Check color={colors.foreground} size={18} strokeWidth={2} />
								) : null}
							</Pressable>
						);
					})}
				</BottomSheetScrollView>
			</BottomSheetModal>
		</>
	);
}
