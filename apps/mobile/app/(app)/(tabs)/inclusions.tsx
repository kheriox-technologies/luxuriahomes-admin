import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import { ChevronsDown, ChevronsUp, Sofa } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { CatalogueCategoryAccordion } from '@/components/inclusions/catalogue-category-accordion';
import { NotificationBell } from '@/components/notifications/notification-bell';
import { ScreenHeader } from '@/components/screen-header';
import { useThemeColors } from '@/components/theme';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchBar } from '@/components/ui/search-bar';
import { ListSkeleton } from '@/components/ui/skeleton';

type InclusionCategory = Doc<'inclusionCategories'>;
type Inclusion = Doc<'inclusions'>;

interface CatalogueSection {
	category: InclusionCategory;
	inclusions: Inclusion[];
}

export default function InclusionsCatalogueScreen() {
	const categories = useQuery(api.inclusionCategories.list.list, {});
	const inclusions = useQuery(api.inclusions.list.list, {});
	const [search, setSearch] = useState('');
	const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(
		new Set()
	);
	const colors = useThemeColors();

	const sections = useMemo<CatalogueSection[]>(() => {
		if (!(categories && inclusions)) {
			return [];
		}
		const needle = search.trim().toLowerCase();
		const byCategory = new Map<string, Inclusion[]>();
		for (const inclusion of inclusions) {
			const list = byCategory.get(inclusion.categoryId) ?? [];
			list.push(inclusion);
			byCategory.set(inclusion.categoryId, list);
		}

		return categories
			.map((category) => {
				const list = (byCategory.get(category._id) ?? []).filter(
					(inclusion) => {
						if (needle === '') {
							return true;
						}
						return (
							inclusion.title.toLowerCase().includes(needle) ||
							category.name.toLowerCase().includes(needle)
						);
					}
				);
				return { category, inclusions: list };
			})
			.filter((section) => section.inclusions.length > 0);
	}, [categories, inclusions, search]);

	const isSearching = search.trim() !== '';

	const expandAll = () =>
		setExpandedCategoryIds(new Set(sections.map((s) => s.category._id)));
	const collapseAll = () => setExpandedCategoryIds(new Set());

	const toggleCategory = (categoryId: string) =>
		setExpandedCategoryIds((prev) => {
			const next = new Set(prev);
			if (next.has(categoryId)) {
				next.delete(categoryId);
			} else {
				next.add(categoryId);
			}
			return next;
		});

	return (
		<View className="flex-1 bg-background">
			<ScreenHeader
				rightSlot={<NotificationBell />}
				subtitle={categories ? `${categories.length} categories` : undefined}
				title="Inclusions"
			/>
			<View className="flex-row items-center gap-2 px-4 pb-3">
				<View className="flex-1">
					<SearchBar
						onChangeText={setSearch}
						placeholder="Search inclusions"
						value={search}
					/>
				</View>
				<Pressable
					accessibilityLabel="Expand all categories"
					accessibilityRole="button"
					className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
					hitSlop={4}
					onPress={expandAll}
				>
					<ChevronsDown color={colors.foreground} size={18} strokeWidth={2} />
				</Pressable>
				<Pressable
					accessibilityLabel="Collapse all categories"
					accessibilityRole="button"
					className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
					hitSlop={4}
					onPress={collapseAll}
				>
					<ChevronsUp color={colors.foreground} size={18} strokeWidth={2} />
				</Pressable>
			</View>
			{categories === undefined || inclusions === undefined ? (
				<ListSkeleton />
			) : (
				<ScrollView contentContainerClassName="pb-6">
					{sections.length === 0 ? (
						<EmptyState
							description={
								isSearching
									? 'No inclusions match your search.'
									: 'Inclusions added in the web portal will appear here.'
							}
							icon={Sofa}
							title={isSearching ? 'No results' : 'No inclusions'}
						/>
					) : (
						sections.map((section) => (
							<CatalogueCategoryAccordion
								category={section.category}
								expanded={
									isSearching || expandedCategoryIds.has(section.category._id)
								}
								inclusions={section.inclusions}
								key={section.category._id}
								onToggle={() => toggleCategory(section.category._id)}
							/>
						))
					)}
				</ScrollView>
			)}
		</View>
	);
}
