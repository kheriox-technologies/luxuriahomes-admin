import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import { MessageSquareText, Sofa } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { SectionList, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ChipBar } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import { ListSkeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/format';

type ProjectInclusion = Doc<'projectInclusions'> & {
	hasNotes: boolean;
	unitAbbr?: string;
};

const CLASS_FILTERS = ['All', 'Standard', 'Gold', 'Platinum'] as const;
type ClassFilter = (typeof CLASS_FILTERS)[number];

const classVariants: Record<string, BadgeVariant> = {
	Standard: 'default',
	Gold: 'gold',
	Platinum: 'info',
};

function InclusionRow({ inclusion }: { inclusion: ProjectInclusion }) {
	const colors = useThemeColors();
	return (
		<Card className="mx-4 mb-2 gap-2 p-3.5">
			<View className="flex-row items-start justify-between gap-2">
				<Text className="flex-1 font-sans-semibold text-foreground text-sm">
					{inclusion.title}
				</Text>
				<Text className="font-sans-semibold text-foreground text-sm">
					{formatCurrency(inclusion.salePrice)}
				</Text>
			</View>
			<Text
				className="font-sans text-muted-foreground text-xs"
				numberOfLines={1}
			>
				{inclusion.code} · {inclusion.vendor}
				{inclusion.models.length > 0 ? ` · ${inclusion.models.join(', ')}` : ''}
			</Text>
			<View className="flex-row flex-wrap items-center gap-1.5">
				<Badge variant={classVariants[inclusion.class] ?? 'default'}>
					{inclusion.class}
				</Badge>
				{inclusion.status ? (
					<Badge
						variant={inclusion.status === 'Approved' ? 'success' : 'warning'}
					>
						{inclusion.status}
					</Badge>
				) : null}
				{inclusion.orderStatus ? (
					<Badge variant="info">{inclusion.orderStatus}</Badge>
				) : null}
				{(inclusion.locations ?? []).map((location) => (
					<Badge key={location.name} variant="outline">
						{location.name}
						{location.quantity
							? ` × ${location.quantity}${inclusion.unitAbbr ? ` ${inclusion.unitAbbr}` : ''}`
							: ''}
					</Badge>
				))}
				{inclusion.hasNotes ? (
					<MessageSquareText
						color={colors.mutedForeground}
						size={14}
						strokeWidth={2}
					/>
				) : null}
			</View>
		</Card>
	);
}

export default function InclusionsScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	const inclusions = useQuery(api.projectInclusions.list.list, {
		projectId: projectId as Id<'projects'>,
	}) as ProjectInclusion[] | undefined;
	const categories = useQuery(api.inclusionCategories.list.list, {});
	const [classFilter, setClassFilter] = useState<ClassFilter>('All');

	const sections = useMemo(() => {
		if (!inclusions) {
			return [];
		}
		const filtered =
			classFilter === 'All'
				? inclusions
				: inclusions.filter((inclusion) => inclusion.class === classFilter);
		const nameById = new Map<string, string>(
			(categories ?? []).map((category: Doc<'inclusionCategories'>) => [
				category._id,
				category.name,
			])
		);
		const byCategory = new Map<string, ProjectInclusion[]>();
		for (const inclusion of filtered) {
			const name = nameById.get(inclusion.categoryId) ?? 'Other';
			const list = byCategory.get(name) ?? [];
			list.push(inclusion);
			byCategory.set(name, list);
		}
		return [...byCategory.entries()]
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([title, data]) => ({ title, data }));
	}, [categories, classFilter, inclusions]);

	if (inclusions === undefined) {
		return <ListSkeleton />;
	}

	return (
		<View className="flex-1">
			<View className="pb-3">
				<ChipBar
					onSelect={setClassFilter}
					options={CLASS_FILTERS}
					selected={classFilter}
				/>
			</View>
			<SectionList
				contentContainerClassName="pb-6"
				keyExtractor={(item) => item._id}
				ListEmptyComponent={
					<EmptyState
						description="Inclusions added in the web portal will appear here."
						icon={Sofa}
						title="No inclusions"
					/>
				}
				renderItem={({ item }) => <InclusionRow inclusion={item} />}
				renderSectionHeader={({ section }) => (
					<SectionHeader title={`${section.title} · ${section.data.length}`} />
				)}
				sections={sections}
				stickySectionHeadersEnabled={false}
			/>
		</View>
	);
}
