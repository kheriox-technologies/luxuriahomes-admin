import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import { useMutation, useQuery } from 'convex/react';
import { Plus, Trash2 } from 'lucide-react-native';
import {
	type Ref,
	useCallback,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { Select, type SelectOption } from '@/components/ui/select';
import type { ProjectInclusion } from './types';

interface PendingLocation {
	name: string;
	quantity?: number;
	unit?: string;
}

export interface InclusionEditQuantitiesSheetHandle {
	present: (inclusion: ProjectInclusion) => void;
}

export function InclusionEditQuantitiesSheet({
	ref,
}: {
	ref?: Ref<InclusionEditQuantitiesSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const [inclusion, setInclusion] = useState<ProjectInclusion | null>(null);
	const [locationRows, setLocationRows] = useState<PendingLocation[]>([]);
	const [selectedLocationId, setSelectedLocationId] = useState('');
	const [pendingQuantity, setPendingQuantity] = useState('');
	const [saving, setSaving] = useState(false);

	const locations = useQuery(api.locations.list.list, {});
	const update = useMutation(api.projectInclusions.update.update);

	const unitAbbr = inclusion?.unitAbbr ?? inclusion?.locations?.[0]?.unit ?? '';

	const locationOptions = useMemo<SelectOption<string>[]>(
		() =>
			(locations ?? []).map((location) => ({
				value: location._id,
				label: location.name,
			})),
		[locations]
	);

	useImperativeHandle(ref, () => ({
		present: (next) => {
			setInclusion(next);
			setLocationRows(next.locations ?? []);
			setSelectedLocationId('');
			setPendingQuantity('');
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

	const handleAddLocation = () => {
		const name = locationOptions.find(
			(option) => option.value === selectedLocationId
		)?.label;
		if (!name) {
			return;
		}
		const qty =
			pendingQuantity !== '' ? Number.parseFloat(pendingQuantity) : undefined;
		setLocationRows((prev) => [
			...prev,
			{
				name,
				quantity: qty === undefined || Number.isNaN(qty) ? undefined : qty,
				unit: unitAbbr || undefined,
			},
		]);
		setSelectedLocationId('');
		setPendingQuantity('');
	};

	const handleSave = async () => {
		if (!inclusion) {
			return;
		}
		setSaving(true);
		try {
			await update({
				projectInclusionId: inclusion._id,
				locations: locationRows.length > 0 ? locationRows : null,
			});
			sheetRef.current?.dismiss();
		} catch {
			Alert.alert('Unable to update quantities', 'Please try again.');
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
			maxDynamicContentSize={620}
			ref={sheetRef}
		>
			<BottomSheetScrollView
				contentContainerClassName="gap-4 px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
			>
				<Text
					className="font-sans-semibold text-base text-foreground"
					numberOfLines={1}
				>
					Edit quantities{inclusion ? ` · ${inclusion.code}` : ''}
				</Text>

				<View className="flex-row items-center gap-2">
					<View className="flex-1">
						<Select
							onChange={setSelectedLocationId}
							options={locationOptions}
							placeholder="Select location"
							title="Choose a location"
							value={selectedLocationId}
						/>
					</View>
					<BottomSheetTextInput
						className="h-9 w-20 rounded-lg border border-border bg-background px-3 font-sans text-foreground text-sm"
						keyboardType="numeric"
						onChangeText={setPendingQuantity}
						placeholder={unitAbbr || 'Qty'}
						placeholderTextColor={colors.mutedForeground}
						value={pendingQuantity}
					/>
					<Pressable
						accessibilityLabel="Add location"
						accessibilityRole="button"
						className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
						disabled={selectedLocationId === ''}
						hitSlop={4}
						onPress={handleAddLocation}
					>
						<Plus color={colors.foreground} size={18} strokeWidth={2} />
					</Pressable>
				</View>

				{locationRows.length > 0 ? (
					<View className="gap-1.5">
						{locationRows.map((entry, index) => (
							<View
								className="flex-row items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2"
								key={`${entry.name}-${index}`}
							>
								<Text className="flex-1 font-sans-medium text-foreground text-sm">
									{entry.name}
								</Text>
								<Text className="font-sans text-muted-foreground text-sm">
									{entry.quantity == null
										? (entry.unit ?? '')
										: `${entry.quantity}${entry.unit ? ` ${entry.unit}` : ''}`}
								</Text>
								<Pressable
									accessibilityLabel={`Remove ${entry.name}`}
									accessibilityRole="button"
									hitSlop={8}
									onPress={() =>
										setLocationRows((prev) =>
											prev.filter((_, i) => i !== index)
										)
									}
								>
									<Trash2
										color={colors.destructive}
										size={16}
										strokeWidth={2}
									/>
								</Pressable>
							</View>
						))}
					</View>
				) : (
					<Text className="font-sans text-muted-foreground text-sm">
						No locations yet. Use the row above to add one.
					</Text>
				)}

				<Button disabled={saving} loading={saving} onPress={handleSave}>
					Save
				</Button>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
