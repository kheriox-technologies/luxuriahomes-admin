import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
	ArrowLeft,
	EllipsisVertical,
	Pencil,
	Plus,
	Sofa,
	Trash2,
} from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
	AddVariantToProjectSheet,
	type AddVariantToProjectSheetHandle,
} from '@/components/inclusions/add-variant-to-project-sheet';
import { CatalogueVariantCard } from '@/components/inclusions/catalogue-variant-card';
import {
	InclusionFormSheet,
	type InclusionFormSheetHandle,
} from '@/components/inclusions/inclusion-form-sheet';
import { CLASS_FILTERS, type ClassFilter } from '@/components/inclusions/types';
import {
	VariantFormSheet,
	type VariantFormSheetHandle,
} from '@/components/inclusions/variant-form-sheet';
import { useThemeColors } from '@/components/theme';
import { ActionSheet } from '@/components/ui/action-sheet';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchBar } from '@/components/ui/search-bar';
import { Select, type SelectOption } from '@/components/ui/select';
import { ListSkeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/format';

type InclusionVariant = Doc<'inclusionVariants'>;

const CLASS_OPTIONS: readonly SelectOption<ClassFilter>[] = CLASS_FILTERS.map(
	(value) => ({ value, label: value === 'All' ? 'All classes' : value })
);

function variantLabel(count: number): string {
	return `${count} ${count === 1 ? 'Variant' : 'Variants'}`;
}

function matchesSearch(variant: InclusionVariant, needle: string): boolean {
	const haystack = [
		variant.class,
		variant.code,
		variant.vendor,
		variant.models.join(' '),
		variant.color ?? '',
		variant.details ?? '',
		variant.link ?? '',
	]
		.join(' ')
		.toLowerCase();
	return haystack.includes(needle);
}

export default function InclusionDetailScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();
	const { inclusionId } = useLocalSearchParams<{ inclusionId: string }>();

	const data = useQuery(api.inclusions.get.get, {
		inclusionId: inclusionId as Id<'inclusions'>,
	});
	const removeInclusion = useMutation(api.inclusions.remove.remove);

	const [search, setSearch] = useState('');
	const [classFilter, setClassFilter] = useState<ClassFilter>('All');
	const addSheetRef = useRef<AddVariantToProjectSheetHandle>(null);
	const inclusionFormRef = useRef<InclusionFormSheetHandle>(null);
	const variantFormRef = useRef<VariantFormSheetHandle>(null);
	const menuRef = useRef<BottomSheetModal>(null);

	const handleDeleteInclusion = () => {
		if (!data) {
			return;
		}
		const { inclusion } = data;
		Alert.alert(
			'Delete inclusion',
			`Delete "${inclusion.title}" and all its variants? This cannot be undone.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						removeInclusion({ inclusionId: inclusion._id })
							.then(() => router.back())
							.catch(() => {
								Alert.alert('Could not delete inclusion', 'Please try again.');
							});
					},
				},
			]
		);
	};

	const filteredVariants = useMemo<InclusionVariant[]>(() => {
		if (!data) {
			return [];
		}
		const needle = search.trim().toLowerCase();
		return data.variants.filter((variant) => {
			if (classFilter !== 'All' && variant.class !== classFilter) {
				return false;
			}
			return needle === '' ? true : matchesSearch(variant, needle);
		});
	}, [data, classFilter, search]);

	const header = (
		<View
			className="flex-row items-center gap-3 bg-background px-4 pb-3"
			style={{ paddingTop: insets.top + 8 }}
		>
			<Pressable
				accessibilityLabel="Back"
				accessibilityRole="button"
				className="h-10 w-10 items-center justify-center rounded-lg border border-border bg-card"
				hitSlop={4}
				onPress={() => router.back()}
			>
				<ArrowLeft color={colors.foreground} size={20} strokeWidth={2} />
			</Pressable>
			<View className="flex-1">
				<Text
					className="font-sans-bold text-2xl text-foreground"
					numberOfLines={1}
				>
					{data ? data.inclusion.title : 'Inclusion'}
				</Text>
				{data ? (
					<Text
						className="font-sans text-muted-foreground text-sm"
						numberOfLines={1}
					>
						{data.categoryName}
					</Text>
				) : null}
			</View>
		</View>
	);

	if (data === undefined) {
		return (
			<View className="flex-1 bg-background">
				{header}
				<ListSkeleton />
			</View>
		);
	}

	if (data === null) {
		return (
			<View className="flex-1 bg-background">
				{header}
				<EmptyState
					description="This inclusion could not be found."
					icon={Sofa}
					title="Not found"
				/>
			</View>
		);
	}

	const { inclusion } = data;

	return (
		<View className="flex-1 bg-background">
			{header}
			<View className="flex-row flex-wrap items-center gap-1.5 px-4 pb-3">
				{inclusion.variantCount > 0 ? (
					<Badge variant="info">{variantLabel(inclusion.variantCount)}</Badge>
				) : null}
				{inclusion.standardPrice === undefined ? (
					<Badge variant="yellow">No standard price set</Badge>
				) : (
					<Badge variant="purple">
						Base {formatCurrency(inclusion.standardPrice)}
					</Badge>
				)}
				{inclusion.standardLabourPrice !== undefined ? (
					<Badge variant="gold">
						Labour {formatCurrency(inclusion.standardLabourPrice)}
					</Badge>
				) : null}
			</View>
			<View className="flex-row items-center gap-2 px-4 pb-3">
				<View className="flex-1">
					<SearchBar
						onChangeText={setSearch}
						placeholder="Search variants"
						value={search}
					/>
				</View>
				<Select
					onChange={setClassFilter}
					options={CLASS_OPTIONS}
					title="Filter by class"
					value={classFilter}
				/>
				<Pressable
					accessibilityLabel="Inclusion actions"
					accessibilityRole="button"
					className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
					hitSlop={4}
					onPress={() => menuRef.current?.present()}
				>
					<EllipsisVertical
						color={colors.foreground}
						size={18}
						strokeWidth={2}
					/>
				</Pressable>
			</View>
			<FlatList
				contentContainerClassName="pb-6"
				data={filteredVariants}
				keyExtractor={(item) => item._id}
				ListEmptyComponent={
					<EmptyState
						description={
							search || classFilter !== 'All'
								? 'No variants match your filters.'
								: 'Variants added in the web portal will appear here.'
						}
						icon={Sofa}
						title="No variants"
					/>
				}
				renderItem={({ item }) => (
					<CatalogueVariantCard
						inclusion={inclusion}
						onAddToProject={(variant) => addSheetRef.current?.present(variant)}
						onEdit={(variant) =>
							variantFormRef.current?.present(inclusion._id, variant)
						}
						variant={item}
					/>
				)}
			/>
			<AddVariantToProjectSheet ref={addSheetRef} />
			<InclusionFormSheet ref={inclusionFormRef} />
			<VariantFormSheet ref={variantFormRef} />
			<ActionSheet
				items={[
					{
						key: 'edit',
						label: 'Edit inclusion',
						icon: Pencil,
						onPress: () => {
							menuRef.current?.dismiss();
							inclusionFormRef.current?.present(inclusion);
						},
					},
					{
						key: 'add-variant',
						label: 'Add variant',
						icon: Plus,
						onPress: () => {
							menuRef.current?.dismiss();
							variantFormRef.current?.present(inclusion._id);
						},
					},
					{
						key: 'delete',
						label: 'Delete inclusion',
						icon: Trash2,
						destructive: true,
						onPress: () => {
							menuRef.current?.dismiss();
							handleDeleteInclusion();
						},
					},
				]}
				ref={menuRef}
				title={inclusion.title}
			/>
		</View>
	);
}
