import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import {
	ArrowLeft,
	Copy,
	Plus,
	SquarePen,
	Trash2,
	Wallet,
} from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
	type BudgetTemplate,
	BudgetTemplateCard,
} from '@/components/budgets/budget-template-card';
import {
	BudgetTemplateFormSheet,
	type BudgetTemplateFormSheetHandle,
} from '@/components/budgets/budget-template-form-sheet';
import {
	CopyBudgetTemplateSheet,
	type CopyBudgetTemplateSheetHandle,
} from '@/components/budgets/copy-budget-template-sheet';
import { useThemeColors } from '@/components/theme';
import {
	ActionSheet,
	type ActionSheetItem,
} from '@/components/ui/action-sheet';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchBar } from '@/components/ui/search-bar';
import { ListSkeleton } from '@/components/ui/skeleton';

export default function BudgetsScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();
	const templates = useQuery(api.budgetTemplates.list.list, {}) as
		| Doc<'budgetTemplates'>[]
		| undefined;
	const removeTemplate = useMutation(api.budgetTemplates.remove.remove);

	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<BudgetTemplate | null>(null);

	const formSheetRef = useRef<BudgetTemplateFormSheetHandle>(null);
	const copySheetRef = useRef<CopyBudgetTemplateSheetHandle>(null);
	const menuRef = useRef<BottomSheetModal>(null);

	const trimmedSearch = search.trim().toLowerCase();

	const filtered = useMemo(() => {
		if (!templates) {
			return [];
		}
		if (!trimmedSearch) {
			return templates;
		}
		return templates.filter(
			(template) =>
				template.title.toLowerCase().includes(trimmedSearch) ||
				(template.description ?? '').toLowerCase().includes(trimmedSearch)
		);
	}, [templates, trimmedSearch]);

	const handleDelete = (template: BudgetTemplate) => {
		Alert.alert(
			'Delete template?',
			`This permanently deletes ${template.title} and all of its trade prices.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						removeTemplate({ budgetTemplateId: template._id }).catch(() =>
							Alert.alert('Could not delete', 'Please try again.')
						);
					},
				},
			]
		);
	};

	const menuItems: ActionSheetItem[] = selected
		? [
				{
					key: 'edit',
					label: 'Edit template',
					icon: SquarePen,
					onPress: () => {
						menuRef.current?.dismiss();
						formSheetRef.current?.present({
							budgetTemplateId: selected._id,
							title: selected.title,
							description: selected.description ?? null,
						});
					},
				},
				{
					key: 'copy',
					label: 'Copy template',
					icon: Copy,
					onPress: () => {
						menuRef.current?.dismiss();
						copySheetRef.current?.present({
							sourceBudgetTemplateId: selected._id,
							title: selected.title,
						});
					},
				},
				{
					key: 'delete',
					label: 'Delete template',
					icon: Trash2,
					destructive: true,
					onPress: () => {
						menuRef.current?.dismiss();
						handleDelete(selected);
					},
				},
			]
		: [];

	const openMenu = (template: BudgetTemplate) => {
		setSelected(template);
		menuRef.current?.present();
	};

	return (
		<View className="flex-1 bg-background">
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
				<Text className="flex-1 font-sans-bold text-2xl text-foreground">
					Budgets
				</Text>
				<Pressable
					accessibilityLabel="Add template"
					accessibilityRole="button"
					className="h-10 w-10 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
					hitSlop={4}
					onPress={() => formSheetRef.current?.present()}
				>
					<Plus color={colors.foreground} size={20} strokeWidth={2} />
				</Pressable>
			</View>

			<View className="px-4 pb-3">
				<SearchBar
					onChangeText={setSearch}
					placeholder="Search by title or description"
					value={search}
				/>
			</View>

			{templates === undefined ? (
				<ListSkeleton />
			) : (
				<FlatList
					contentContainerClassName="pb-6"
					data={filtered}
					keyExtractor={(item) => item._id}
					ListEmptyComponent={
						<EmptyState
							description={
								trimmedSearch
									? 'Try a different title or description.'
									: 'Create your first template with the + button.'
							}
							icon={Wallet}
							title={
								trimmedSearch ? 'No matching templates' : 'No budget templates'
							}
						/>
					}
					renderItem={({ item }) => (
						<BudgetTemplateCard onOpenMenu={openMenu} template={item} />
					)}
				/>
			)}

			<ActionSheet items={menuItems} ref={menuRef} title={selected?.title} />
			<BudgetTemplateFormSheet ref={formSheetRef} />
			<CopyBudgetTemplateSheet ref={copySheetRef} />
		</View>
	);
}
