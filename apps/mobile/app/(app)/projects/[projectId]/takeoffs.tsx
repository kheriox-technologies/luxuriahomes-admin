import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import { ChevronsDown, ChevronsUp, PencilRuler } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { CategoryAccordion } from '@/components/takeoffs/category-accordion';
import { GroupCard } from '@/components/takeoffs/group-card';
import { useThemeColors } from '@/components/theme';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchBar } from '@/components/ui/search-bar';
import { SectionHeader } from '@/components/ui/section-header';
import { ListSkeleton } from '@/components/ui/skeleton';
import {
	DEFAULT_WASTAGE,
	type Measurement,
	type TakeoffCategory,
	type TakeoffGroup,
} from '@/lib/takeoffs/math';

export default function TakeoffsScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	const takeoffs = useQuery(api.takeoffs.list.list, {
		projectId: projectId as Id<'projects'>,
	});
	const [selectedTakeoffId, setSelectedTakeoffId] = useState<string | null>(
		null
	);
	const [search, setSearch] = useState('');
	const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(
		new Set()
	);
	const colors = useThemeColors();

	// Auto-select the first takeoff once loaded.
	useEffect(() => {
		if (takeoffs && takeoffs.length > 0 && !selectedTakeoffId) {
			setSelectedTakeoffId(takeoffs[0]._id);
		}
	}, [takeoffs, selectedTakeoffId]);

	const takeoff = useQuery(
		api.takeoffs.get.get,
		selectedTakeoffId
			? { takeoffId: selectedTakeoffId as Id<'takeoffs'> }
			: 'skip'
	);

	const measurements = (takeoff?.measurements ?? []) as Measurement[];
	const groups = (takeoff?.groups ?? []) as TakeoffGroup[];
	const categories = (takeoff?.categories ?? []) as TakeoffCategory[];
	const globalWastage = takeoff?.globalWastage ?? DEFAULT_WASTAGE;

	const pageTitleByPage = useMemo(() => {
		const map = new Map<number, string>();
		for (const entry of takeoff?.pageTitles ?? []) {
			map.set(entry.page, entry.title);
		}
		return map;
	}, [takeoff?.pageTitles]);

	// Groups by category; groups without a category go to the "Uncategorised"
	// bucket, mirroring the portal's measurements panel hierarchy.
	const groupsByCategory = useMemo(() => {
		const map = new Map<string, TakeoffGroup[]>();
		for (const group of groups) {
			const key = group.categoryId ?? 'uncategorised';
			const list = map.get(key) ?? [];
			list.push(group);
			map.set(key, list);
		}
		return map;
	}, [groups]);

	if (takeoffs === undefined) {
		return <ListSkeleton />;
	}

	if (takeoffs.length === 0) {
		return (
			<EmptyState
				description="Add plans to take-offs from the Documents tab in the web portal, then measurements taken there will appear here."
				icon={PencilRuler}
				title="No take offs yet"
			/>
		);
	}

	const q = search.trim().toLowerCase();

	// Top-level measurements (excluding deductions) for a group.
	const topLevelInGroup = (groupId: string) =>
		measurements.filter((m) => m.groupId === groupId && !m.parentId);

	// A group shows when there's no query, its name matches, or a measurement
	// name matches — mirroring the portal's measurements panel.
	const groupIsVisible = (group: TakeoffGroup) =>
		q === '' ||
		group.name.toLowerCase().includes(q) ||
		topLevelInGroup(group.id).some((m) => m.label.toLowerCase().includes(q));

	// Count of measurements shown for a group under the current query.
	const displayedCount = (group: TakeoffGroup) => {
		const members = topLevelInGroup(group.id);
		if (q === '' || group.name.toLowerCase().includes(q)) {
			return members.length;
		}
		return members.filter((m) => m.label.toLowerCase().includes(q)).length;
	};

	const uncategorised = (groupsByCategory.get('uncategorised') ?? []).filter(
		groupIsVisible
	);
	// Categories that have at least one visible group under the current query.
	const visibleCategories = categories
		.map((category) => ({
			category,
			visibleGroups: (groupsByCategory.get(category.id) ?? []).filter(
				groupIsVisible
			),
		}))
		.filter((entry) => entry.visibleGroups.length > 0);

	const expandAll = () =>
		setExpandedCategoryIds(
			new Set(visibleCategories.map((e) => e.category.id))
		);
	const collapseAll = () => setExpandedCategoryIds(new Set());

	const hasResults = visibleCategories.length > 0 || uncategorised.length > 0;

	return (
		<ScrollView className="flex-1" contentContainerClassName="pb-6">
			{takeoffs.length > 1 ? (
				<ScrollView
					contentContainerClassName="gap-2 px-4 pb-3"
					horizontal
					showsHorizontalScrollIndicator={false}
				>
					{takeoffs.map((item) => (
						<Chip
							key={item._id}
							label={item.name}
							onPress={() => setSelectedTakeoffId(item._id)}
							selected={selectedTakeoffId === item._id}
						/>
					))}
				</ScrollView>
			) : null}

			{takeoff === undefined ? (
				<ListSkeleton rows={3} />
			) : (
				<>
					<View className="flex-row items-center gap-2 px-4 pt-1 pb-2">
						<View className="flex-1">
							<SearchBar
								onChangeText={setSearch}
								placeholder="Search measurements"
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
							<ChevronsDown
								color={colors.foreground}
								size={18}
								strokeWidth={2}
							/>
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

					{visibleCategories.map(({ category, visibleGroups }) => (
						<CategoryAccordion
							category={category}
							expanded={q !== '' ? true : expandedCategoryIds.has(category.id)}
							globalWastage={globalWastage}
							groups={visibleGroups}
							key={category.id}
							measurementCount={visibleGroups.reduce(
								(sum, group) => sum + displayedCount(group),
								0
							)}
							measurements={measurements}
							onToggle={() =>
								setExpandedCategoryIds((prev) => {
									const next = new Set(prev);
									if (next.has(category.id)) {
										next.delete(category.id);
									} else {
										next.add(category.id);
									}
									return next;
								})
							}
							pageTitleByPage={pageTitleByPage}
							searchText={search}
						/>
					))}

					{uncategorised.length > 0 ? (
						<View>
							<SectionHeader title="Uncategorised" />
							{uncategorised.map((group) => (
								<GroupCard
									globalWastage={globalWastage}
									group={group}
									key={group.id}
									measurements={measurements}
									pageTitleByPage={pageTitleByPage}
									searchText={search}
								/>
							))}
						</View>
					) : null}

					{groups.length === 0 ? (
						<EmptyState
							description="Measurements taken in the web portal will appear here."
							icon={PencilRuler}
							title="No measurements yet"
						/>
					) : null}

					{groups.length > 0 && !hasResults ? (
						<EmptyState
							description="No measurements match your search."
							icon={PencilRuler}
							title="No results"
						/>
					) : null}
				</>
			)}
		</ScrollView>
	);
}
