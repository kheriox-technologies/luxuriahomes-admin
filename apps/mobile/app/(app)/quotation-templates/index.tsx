import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import {
	ArrowLeft,
	Copy,
	Plus,
	ScrollText,
	SquarePen,
	Trash2,
} from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
	type QuotationTemplate,
	QuotationTemplateCard,
} from '@/components/quotation-templates/quotation-template-card';
import {
	QuotationTemplateFormSheet,
	type QuotationTemplateFormSheetHandle,
} from '@/components/quotation-templates/quotation-template-form-sheet';
import { SpecialInclusionsSection } from '@/components/quotation-templates/special-inclusions-section';
import { useThemeColors } from '@/components/theme';
import {
	ActionSheet,
	type ActionSheetItem,
} from '@/components/ui/action-sheet';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchBar } from '@/components/ui/search-bar';
import { ListSkeleton } from '@/components/ui/skeleton';
import { convexErrorMessage } from '@/lib/project-form';

export default function QuotationTemplatesScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();

	const [search, setSearch] = useState('');
	const trimmedSearch = search.trim();

	// The backend owns the search index, so a query goes to `search` and an empty
	// box goes to `list` — the same split the portal makes.
	const listed = useQuery(
		api.quoteTemplates.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const found = useQuery(
		api.quoteTemplates.search.search,
		trimmedSearch === '' ? 'skip' : { query: trimmedSearch }
	);
	const templates = trimmedSearch === '' ? listed : found;

	const removeTemplate = useMutation(api.quoteTemplates.remove.remove);

	const [selected, setSelected] = useState<QuotationTemplate | null>(null);
	const formSheetRef = useRef<QuotationTemplateFormSheetHandle>(null);
	const menuRef = useRef<BottomSheetModal>(null);

	const openMenu = (template: QuotationTemplate) => {
		setSelected(template);
		menuRef.current?.present();
	};

	const handleDelete = (template: QuotationTemplate) => {
		Alert.alert(
			'Delete template?',
			`This permanently deletes ${template.name} and all of its items, terms, exclusions, notes, disclaimer and acknowledgement. Quotations already issued from it are unaffected.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						removeTemplate({ templateId: template._id }).catch((error) =>
							Alert.alert(
								'Could not delete template',
								convexErrorMessage(error, 'Please try again.')
							)
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
					label: 'Edit',
					icon: SquarePen,
					onPress: () =>
						formSheetRef.current?.present('edit', {
							templateId: selected._id,
							name: selected.name,
							description: selected.description ?? null,
						}),
				},
				{
					key: 'duplicate',
					label: 'Duplicate',
					icon: Copy,
					onPress: () =>
						formSheetRef.current?.present('duplicate', {
							templateId: selected._id,
							name: selected.name,
							description: selected.description ?? null,
						}),
				},
				{
					key: 'delete',
					label: 'Delete',
					icon: Trash2,
					destructive: true,
					onPress: () => handleDelete(selected),
				},
			]
		: [];

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
					Quotation Templates
				</Text>
				<Pressable
					accessibilityLabel="Add template"
					accessibilityRole="button"
					className="h-10 w-10 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
					hitSlop={4}
					onPress={() => formSheetRef.current?.present('add')}
				>
					<Plus color={colors.foreground} size={20} strokeWidth={2} />
				</Pressable>
			</View>

			<View className="px-4 pb-3">
				<SearchBar
					onChangeText={setSearch}
					placeholder="Search by name or description"
					value={search}
				/>
			</View>

			{templates === undefined ? (
				<ListSkeleton />
			) : (
				<FlatList
					contentContainerClassName="pb-6"
					data={templates}
					keyExtractor={(item) => item._id}
					ListEmptyComponent={
						<EmptyState
							description={
								trimmedSearch
									? 'Try a different name or description.'
									: 'Create your first template with the + button, then fill in its items, terms, exclusions and notes.'
							}
							icon={ScrollText}
							title={
								trimmedSearch
									? 'No matching templates'
									: 'No quotation templates'
							}
						/>
					}
					// The standard special inclusions are global rather than per
					// template — the same extras get quoted across every kind of build —
					// so they sit under the list, as they do in the portal.
					ListFooterComponent={<SpecialInclusionsSection />}
					renderItem={({ item }) => (
						<QuotationTemplateCard onOpenMenu={openMenu} template={item} />
					)}
				/>
			)}

			<ActionSheet items={menuItems} ref={menuRef} title={selected?.name} />
			<QuotationTemplateFormSheet ref={formSheetRef} />
		</View>
	);
}
