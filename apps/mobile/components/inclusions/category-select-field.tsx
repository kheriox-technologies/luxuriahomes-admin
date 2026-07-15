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
import { Check, ChevronDown, Plus, X } from 'lucide-react-native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/search-bar';
import { cn } from '@/lib/cn';

type InclusionCategory = Doc<'inclusionCategories'>;

/**
 * The single source of truth for picking an inclusion category on mobile. A
 * pressable field that opens a stacked bottom-sheet picker with search and —
 * when `allowCreate` is set — an inline "New category" flow (name + code) that
 * saves to the shared catalog immediately and selects it. Mirrors the portal
 * `InclusionCategorySelect` component. Self-contained: owns its own data query
 * and create mutation.
 */
export function CategorySelectField({
	value,
	onValueChange,
	allowCreate,
	excludeCategoryIds,
	disabled,
	invalid,
	placeholder = 'Select a category',
}: {
	value: Id<'inclusionCategories'> | '';
	onValueChange: (next: Id<'inclusionCategories'> | '') => void;
	allowCreate?: boolean;
	excludeCategoryIds?: Id<'inclusionCategories'>[];
	disabled?: boolean;
	invalid?: boolean;
	placeholder?: string;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const categories = useQuery(api.inclusionCategories.list.list, {}) as
		| InclusionCategory[]
		| undefined;
	const addCategory = useMutation(api.inclusionCategories.add.add);

	const [search, setSearch] = useState('');
	const [creating, setCreating] = useState(false);
	const [newName, setNewName] = useState('');
	const [newCode, setNewCode] = useState('');
	const [isSaving, setIsSaving] = useState(false);

	const excludeSet = useMemo(
		() => new Set(excludeCategoryIds ?? []),
		[excludeCategoryIds]
	);

	const selectedName = useMemo(
		() =>
			(categories ?? []).find((category) => category._id === value)?.name ?? '',
		[categories, value]
	);

	const trimmedSearch = search.trim().toLowerCase();

	const candidates = useMemo(() => {
		return (categories ?? [])
			.filter((category) => {
				if (excludeSet.has(category._id)) {
					return false;
				}
				if (!trimmedSearch) {
					return true;
				}
				return (
					category.name.toLowerCase().includes(trimmedSearch) ||
					category.code.toLowerCase().includes(trimmedSearch)
				);
			})
			.sort((a, b) =>
				a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
			);
	}, [categories, excludeSet, trimmedSearch]);

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
		setNewName('');
		setNewCode('');
	};

	const open = () => {
		setSearch('');
		resetCreate();
		sheetRef.current?.present();
	};

	const handleSelect = (category: InclusionCategory) => {
		onValueChange(category._id);
		sheetRef.current?.dismiss();
	};

	const handleCreate = async () => {
		const name = newName.trim();
		const code = newCode.trim();
		if (name === '' || code === '') {
			Alert.alert('Enter a name and code', 'Both fields are required.');
			return;
		}
		setIsSaving(true);
		try {
			const categoryId = await addCategory({ name, code });
			onValueChange(categoryId);
			resetCreate();
			sheetRef.current?.dismiss();
		} catch {
			Alert.alert('Could not create category', 'Please try again.');
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<>
			<Pressable
				accessibilityLabel={selectedName || placeholder}
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
						selectedName ? 'text-foreground' : 'text-muted-foreground'
					)}
					numberOfLines={1}
				>
					{selectedName || placeholder}
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
						{creating ? 'New category' : 'Select category'}
					</Text>

					{creating ? (
						<View className="gap-2 rounded-lg border border-border p-3">
							<Text className="font-sans-medium text-foreground text-sm">
								Category name
							</Text>
							<BottomSheetTextInput
								autoFocus
								className="min-h-[44px] rounded-lg border border-border bg-background px-3 py-2.5 font-sans text-base text-foreground"
								onChangeText={setNewName}
								placeholder="e.g. Tiling"
								placeholderTextColor={colors.mutedForeground}
								value={newName}
							/>
							<Text className="font-sans-medium text-foreground text-sm">
								Category code
							</Text>
							<BottomSheetTextInput
								autoCapitalize="characters"
								className="min-h-[44px] rounded-lg border border-border bg-background px-3 py-2.5 font-sans text-base text-foreground"
								onChangeText={setNewCode}
								placeholder="e.g. TIL"
								placeholderTextColor={colors.mutedForeground}
								value={newCode}
							/>
							<View className="flex-row gap-2 pt-1">
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
									loading={isSaving}
									onPress={handleCreate}
								>
									Create
								</Button>
							</View>
						</View>
					) : (
						<>
							<View className="pb-2">
								<SearchBar
									onChangeText={setSearch}
									placeholder="Search categories"
									value={search}
								/>
							</View>
							{allowCreate ? (
								<Button
									className="mb-2"
									icon={
										<Plus color={colors.foreground} size={18} strokeWidth={2} />
									}
									onPress={() => setCreating(true)}
								>
									New category
								</Button>
							) : null}
							{categories === undefined ? (
								<Text className="py-3 font-sans text-muted-foreground text-sm">
									Loading…
								</Text>
							) : null}
							{categories !== undefined && candidates.length === 0 ? (
								<Text className="py-3 font-sans text-muted-foreground text-sm">
									No categories found.
								</Text>
							) : null}
							{candidates.map((category) => {
								const selected = category._id === value;
								return (
									<Pressable
										accessibilityLabel={category.name}
										accessibilityRole="button"
										accessibilityState={{ selected }}
										className={cn(
											'min-h-[48px] flex-row items-center justify-between gap-3 rounded-lg px-3 active:bg-muted',
											selected && 'bg-muted'
										)}
										key={category._id}
										onPress={() => handleSelect(category)}
									>
										<Text
											className="flex-1 font-sans-medium text-foreground text-xs"
											numberOfLines={1}
										>
											{category.name}
										</Text>
										{selected ? (
											<Check
												color={colors.foreground}
												size={18}
												strokeWidth={2}
											/>
										) : null}
									</Pressable>
								);
							})}
						</>
					)}
				</BottomSheetScrollView>
			</BottomSheetModal>
		</>
	);
}
