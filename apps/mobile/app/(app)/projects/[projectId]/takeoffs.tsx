import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import { PencilRuler } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { GroupCard } from '@/components/takeoffs/group-card';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
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

	const uncategorised = groupsByCategory.get('uncategorised') ?? [];

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
					<View className="flex-row items-center justify-between px-4 pb-1">
						<Text className="font-sans text-muted-foreground text-xs">
							{measurements.filter((m) => !m.parentId).length} measurements ·{' '}
							{globalWastage}% global wastage
						</Text>
					</View>

					{categories.map((category) => {
						const categoryGroups = groupsByCategory.get(category.id) ?? [];
						if (categoryGroups.length === 0) {
							return null;
						}
						return (
							<View key={category.id}>
								<SectionHeader title={category.name} />
								{categoryGroups.map((group) => (
									<GroupCard
										globalWastage={globalWastage}
										group={group}
										key={group.id}
										measurements={measurements}
										pageTitleByPage={pageTitleByPage}
									/>
								))}
							</View>
						);
					})}

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
				</>
			)}
		</ScrollView>
	);
}
