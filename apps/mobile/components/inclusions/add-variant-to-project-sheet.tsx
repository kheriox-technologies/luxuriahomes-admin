import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
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

type InclusionVariant = Doc<'inclusionVariants'>;
type Project = Doc<'projects'>;

interface PendingLocation {
	name: string;
	quantity?: number;
	unit?: string;
}

export interface AddVariantToProjectSheetHandle {
	present: (variant: InclusionVariant) => void;
}

const ELIGIBLE_PROJECT_STATUSES: readonly Project['status'][] = [
	'not_started',
	'in_progress',
];

function statusLabel(status: Project['status']): string {
	if (status === 'not_started') {
		return 'Not started';
	}
	if (status === 'in_progress') {
		return 'In progress';
	}
	return 'Completed';
}

export function AddVariantToProjectSheet({
	ref,
}: {
	ref?: Ref<AddVariantToProjectSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const [variant, setVariant] = useState<InclusionVariant | null>(null);
	const [selectedProjectId, setSelectedProjectId] = useState('');
	const [selectedLocationId, setSelectedLocationId] = useState('');
	const [pendingQuantity, setPendingQuantity] = useState('');
	const [pendingLocations, setPendingLocations] = useState<PendingLocation[]>(
		[]
	);
	const [submitting, setSubmitting] = useState(false);

	const projects = useQuery(api.projects.list.list, {});
	const locations = useQuery(api.locations.list.list, {});
	const inclusionUnit = useQuery(
		api.inclusionVariants.getUnit.getUnit,
		variant ? { inclusionVariantId: variant._id } : 'skip'
	);
	const addProjectInclusion = useMutation(api.projectInclusions.add.add);

	const hasUnit = inclusionUnit != null;
	const unitAbbr = inclusionUnit?.abbr ?? '';

	const eligibleProjects = useMemo(
		() =>
			(projects ?? []).filter((project) =>
				ELIGIBLE_PROJECT_STATUSES.includes(project.status)
			),
		[projects]
	);

	const projectOptions = useMemo<SelectOption<string>[]>(
		() =>
			eligibleProjects.map((project) => ({
				value: project._id,
				label: `${project.name} (${statusLabel(project.status)})`,
			})),
		[eligibleProjects]
	);

	const locationOptions = useMemo<SelectOption<string>[]>(
		() =>
			(locations ?? []).map((location) => ({
				value: location._id,
				label: location.name,
			})),
		[locations]
	);

	const resetState = useCallback(() => {
		setSelectedProjectId('');
		setSelectedLocationId('');
		setPendingQuantity('');
		setPendingLocations([]);
		setSubmitting(false);
	}, []);

	useImperativeHandle(ref, () => ({
		present: (next) => {
			setVariant(next);
			resetState();
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
		setPendingLocations((prev) => [
			...prev,
			{
				name,
				quantity: Number.isNaN(qty) ? undefined : qty,
				unit: unitAbbr || undefined,
			},
		]);
		setSelectedLocationId('');
		setPendingQuantity('');
	};

	const handleSubmit = async () => {
		if (!variant || selectedProjectId === '') {
			return;
		}
		setSubmitting(true);
		try {
			await addProjectInclusion({
				projectId: selectedProjectId as Id<'projects'>,
				inclusionVariantId: variant._id,
				locations: pendingLocations.length > 0 ? pendingLocations : undefined,
			});
			sheetRef.current?.dismiss();
			Alert.alert('Added to project', `${variant.code} was added.`);
		} catch {
			Alert.alert('Unable to add', 'Please try again.');
		} finally {
			setSubmitting(false);
		}
	};

	const canSubmit = selectedProjectId !== '' && !submitting;
	const noEligibleProjects =
		projects !== undefined && eligibleProjects.length === 0;

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
					Add to project{variant ? ` · ${variant.code}` : ''}
				</Text>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Project
					</Text>
					{noEligibleProjects ? (
						<Text className="font-sans text-muted-foreground text-sm">
							No not-started or in-progress projects available.
						</Text>
					) : (
						<Select
							onChange={setSelectedProjectId}
							options={projectOptions}
							placeholder="Select a project"
							title="Choose a project"
							value={selectedProjectId}
						/>
					)}
				</View>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Locations (optional)
					</Text>
					{hasUnit ? null : (
						<Text className="font-sans text-muted-foreground text-xs">
							Set a unit for this inclusion in the web portal to add locations.
						</Text>
					)}
					{hasUnit ? (
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
					) : null}
					{pendingLocations.length > 0 ? (
						<View className="gap-1.5 pt-1">
							{pendingLocations.map((entry, index) => (
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
											setPendingLocations((prev) =>
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
					) : null}
				</View>

				<Button
					disabled={!canSubmit}
					loading={submitting}
					onPress={handleSubmit}
				>
					Add to project
				</Button>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
