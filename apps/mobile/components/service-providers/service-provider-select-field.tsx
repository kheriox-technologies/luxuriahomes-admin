import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import { Check, ChevronDown, Plus } from 'lucide-react-native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/search-bar';
import { cn } from '@/lib/cn';
import {
	CreateServiceProviderSheet,
	type CreateServiceProviderSheetHandle,
} from './create-service-provider-sheet';
import type { ServiceProvider } from './types';

/**
 * The single source of truth for picking a service provider on mobile. A
 * pressable field that opens a stacked bottom-sheet picker with search,
 * optional filtering by trade, and — when `allowCreate` is set — a "New service
 * provider" flow that opens the full create sheet and selects the result.
 * Mirrors the portal `ServiceProviderSelect` component. Self-contained: owns
 * its own data query and create flow.
 */
export function ServiceProviderSelectField({
	value,
	onValueChange,
	allowCreate,
	filterTradeId,
	excludeServiceProviderIds,
	disabled,
	invalid,
	placeholder = 'Select a service provider',
	emptyMessage,
	onProviderTradesChange,
}: {
	value: Id<'serviceProviders'> | '';
	onValueChange: (next: Id<'serviceProviders'> | '') => void;
	allowCreate?: boolean;
	/** Only list providers offering this trade; also pre-selected on create. */
	filterTradeId?: Id<'trades'> | '';
	excludeServiceProviderIds?: Id<'serviceProviders'>[];
	disabled?: boolean;
	invalid?: boolean;
	placeholder?: string;
	emptyMessage?: string;
	/**
	 * Fires with the chosen (or newly created) provider's trade ids whenever the
	 * selection changes, so a parent form can keep a linked trade field in sync.
	 */
	onProviderTradesChange?: (tradeIds: Id<'trades'>[]) => void;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);
	const createSheetRef = useRef<CreateServiceProviderSheetHandle>(null);

	const providers = useQuery(api.serviceProviders.list.list, {}) as
		| ServiceProvider[]
		| undefined;

	const [search, setSearch] = useState('');

	const excludeSet = useMemo(
		() => new Set(excludeServiceProviderIds ?? []),
		[excludeServiceProviderIds]
	);

	const selectedLabel = useMemo(
		() => (providers ?? []).find((p) => p._id === value)?.company ?? '',
		[providers, value]
	);

	const trimmedSearch = search.trim().toLowerCase();

	const candidates = useMemo(() => {
		return (providers ?? [])
			.filter((provider) => {
				if (excludeSet.has(provider._id)) {
					return false;
				}
				if (filterTradeId && !provider.tradeIds.includes(filterTradeId)) {
					return false;
				}
				if (!trimmedSearch) {
					return true;
				}
				return (
					provider.company.toLowerCase().includes(trimmedSearch) ||
					provider.name.toLowerCase().includes(trimmedSearch)
				);
			})
			.sort((a, b) =>
				a.company.localeCompare(b.company, undefined, { sensitivity: 'base' })
			);
	}, [providers, excludeSet, filterTradeId, trimmedSearch]);

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

	const open = () => {
		setSearch('');
		sheetRef.current?.present();
	};

	const handleSelect = (provider: ServiceProvider) => {
		onValueChange(provider._id);
		onProviderTradesChange?.(provider.tradeIds);
		sheetRef.current?.dismiss();
	};

	const resolvedEmpty =
		emptyMessage ??
		(filterTradeId
			? 'No service providers for this trade.'
			: 'No service providers found.');

	return (
		<>
			<Pressable
				accessibilityLabel={selectedLabel || placeholder}
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
						selectedLabel ? 'text-foreground' : 'text-muted-foreground'
					)}
					numberOfLines={1}
				>
					{selectedLabel || placeholder}
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
						Select service provider
					</Text>
					<View className="pb-2">
						<SearchBar
							onChangeText={setSearch}
							placeholder="Search by company or contact"
							value={search}
						/>
					</View>
					{allowCreate ? (
						<Button
							className="mb-2"
							icon={
								<Plus color={colors.foreground} size={18} strokeWidth={2} />
							}
							onPress={() =>
								createSheetRef.current?.present({
									initialTradeIds: filterTradeId ? [filterTradeId] : undefined,
								})
							}
						>
							New service provider
						</Button>
					) : null}
					{providers === undefined ? (
						<Text className="py-3 font-sans text-muted-foreground text-sm">
							Loading…
						</Text>
					) : null}
					{providers !== undefined && candidates.length === 0 ? (
						<Text className="py-3 font-sans text-muted-foreground text-sm">
							{resolvedEmpty}
						</Text>
					) : null}
					{candidates.map((provider) => {
						const selected = provider._id === value;
						return (
							<Pressable
								accessibilityLabel={provider.company}
								accessibilityRole="button"
								accessibilityState={{ selected }}
								className={cn(
									'min-h-[48px] flex-row items-center justify-between gap-3 rounded-lg px-3 active:bg-muted',
									selected && 'bg-muted'
								)}
								key={provider._id}
								onPress={() => handleSelect(provider)}
							>
								<View className="flex-1 gap-0.5">
									<Text
										className="font-sans-medium text-foreground text-xs"
										numberOfLines={1}
									>
										{provider.company}
									</Text>
									<Text
										className="font-sans text-muted-foreground text-xs"
										numberOfLines={1}
									>
										{provider.name}
									</Text>
								</View>
								{selected ? (
									<Check color={colors.foreground} size={18} strokeWidth={2} />
								) : null}
							</Pressable>
						);
					})}
				</BottomSheetScrollView>
			</BottomSheetModal>

			<CreateServiceProviderSheet
				onCreated={(result) => {
					onValueChange(result.id);
					onProviderTradesChange?.(result.tradeIds);
					sheetRef.current?.dismiss();
				}}
				ref={createSheetRef}
			/>
		</>
	);
}
