import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { Plus } from 'lucide-react-native';
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
import { PressableCard } from '@/components/ui/card';
import { SearchBar } from '@/components/ui/search-bar';
import type { ServiceProvider } from './types';

export interface AddServiceProviderSheetHandle {
	present: () => void;
}

export function AddServiceProviderSheet({
	projectId,
	linkedIds,
	ref,
}: {
	projectId: Id<'projects'>;
	linkedIds: Set<string>;
	ref?: Ref<AddServiceProviderSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);
	const [search, setSearch] = useState('');

	const providers = useQuery(api.serviceProviders.list.list, {}) as
		| ServiceProvider[]
		| undefined;
	const addProvider = useMutation(api.projectServiceProviders.add.add);

	useImperativeHandle(ref, () => ({
		present: () => {
			setSearch('');
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

	const trimmedSearch = search.trim().toLowerCase();

	const candidates = useMemo(() => {
		return (providers ?? []).filter((provider) => {
			if (linkedIds.has(provider._id)) {
				return false;
			}
			if (!trimmedSearch) {
				return true;
			}
			return (
				provider.company.toLowerCase().includes(trimmedSearch) ||
				provider.name.toLowerCase().includes(trimmedSearch)
			);
		});
	}, [providers, linkedIds, trimmedSearch]);

	const handleAdd = (serviceProviderId: Id<'serviceProviders'>) => {
		addProvider({ projectId, serviceProviderId })
			.then(() => sheetRef.current?.dismiss())
			.catch(() => Alert.alert('Unable to add', 'Please try again.'));
	};

	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			backgroundStyle={{ backgroundColor: colors.card }}
			enableDynamicSizing
			handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
			maxDynamicContentSize={560}
			ref={sheetRef}
		>
			<BottomSheetScrollView
				className="px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
			>
				<Text className="px-1 pb-3 font-sans-semibold text-base text-foreground">
					Add service provider
				</Text>
				<View className="pb-3">
					<SearchBar
						onChangeText={setSearch}
						placeholder="Search by company or contact"
						value={search}
					/>
				</View>
				{candidates.length === 0 ? (
					<Text className="py-3 font-sans text-muted-foreground text-sm">
						{providers === undefined
							? 'Loading…'
							: 'No service providers to add.'}
					</Text>
				) : null}
				{candidates.map((provider) => (
					<PressableCard
						accessibilityLabel={`Add ${provider.company}`}
						className="mb-2 flex-row items-center gap-3 p-3"
						key={provider._id}
						onPress={() => handleAdd(provider._id)}
					>
						<View className="flex-1 gap-0.5">
							<Text
								className="font-sans-semibold text-foreground text-sm"
								numberOfLines={1}
							>
								{provider.company}
							</Text>
							{provider.qbccLicense ? (
								<Text
									className="font-sans text-muted-foreground text-xs"
									numberOfLines={1}
								>
									QBCC {provider.qbccLicense}
								</Text>
							) : null}
						</View>
						<Plus color={colors.mutedForeground} size={18} strokeWidth={2} />
					</PressableCard>
				))}
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
