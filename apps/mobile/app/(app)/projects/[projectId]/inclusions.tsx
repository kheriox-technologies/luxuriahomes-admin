import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import {
	Download,
	ImageOff,
	Mail,
	MessageSquareText,
	Sofa,
} from 'lucide-react-native';
import { memo, type ReactNode, useMemo, useState } from 'react';
import {
	ActivityIndicator,
	Pressable,
	SectionList,
	Text,
	View,
} from 'react-native';
import {
	InclusionActionsProvider,
	useInclusionActions,
} from '@/components/inclusions/inclusion-actions-provider';
import { InclusionCardMenu } from '@/components/inclusions/inclusion-card-menu';
import { InclusionSectionHeader } from '@/components/inclusions/inclusion-section-header';
import {
	CLASS_FILTERS,
	type ClassFilter,
	type GroupBy,
	type InclusionSection,
	type ProjectInclusion,
} from '@/components/inclusions/types';
import { useThemeColors } from '@/components/theme';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { SearchBar } from '@/components/ui/search-bar';
import { Select, type SelectOption } from '@/components/ui/select';
import { ListSkeleton, Skeleton } from '@/components/ui/skeleton';
import { OrderStatusPill } from '@/components/ui/status-pill';
import { useSignedUrl } from '@/lib/use-signed-url';

const classVariants: Record<string, BadgeVariant> = {
	Standard: 'info',
	Gold: 'yellow',
	Platinum: 'purple',
};

const CLASS_OPTIONS: readonly SelectOption<ClassFilter>[] = CLASS_FILTERS.map(
	(value) => ({ value, label: value === 'All' ? 'All classes' : value })
);

const GROUP_OPTIONS: readonly SelectOption<GroupBy>[] = [
	{ value: 'category', label: 'By category' },
	{ value: 'location', label: 'By location' },
	{ value: 'vendor', label: 'By vendor' },
];

const NO_LOCATION = 'No Location';
const OTHER_CATEGORY = 'Other';

function locationsSummary(inclusion: ProjectInclusion): string {
	return (inclusion.locations ?? [])
		.map((location) => {
			if (!location.quantity) {
				return location.name;
			}
			const unit = inclusion.unitAbbr ? ` ${inclusion.unitAbbr}` : '';
			return `${location.name} × ${location.quantity}${unit}`;
		})
		.join(', ');
}

function matchesSearch(inclusion: ProjectInclusion, needle: string): boolean {
	const haystack = [
		inclusion.title,
		inclusion.code,
		inclusion.vendor,
		inclusion.color ?? '',
		inclusion.models.join(' '),
		(inclusion.locations ?? []).map((l) => l.name).join(' '),
	]
		.join(' ')
		.toLowerCase();
	return haystack.includes(needle);
}

function groupKeysFor(
	inclusion: ProjectInclusion,
	groupBy: GroupBy,
	categoryName: string
): string[] {
	if (groupBy === 'vendor') {
		return [inclusion.vendor || 'No Vendor'];
	}
	if (groupBy === 'location') {
		const names = (inclusion.locations ?? [])
			.map((l) => l.name)
			.filter((name) => name.trim() !== '');
		return names.length > 0 ? names : [NO_LOCATION];
	}
	return [categoryName];
}

function variationTotalFor(inclusions: ProjectInclusion[]): number {
	return inclusions.reduce(
		(sum, i) => (i.class === 'Standard' ? sum : sum + (i.variationPrice ?? 0)),
		0
	);
}

function InclusionThumbnail({ inclusion }: { inclusion: ProjectInclusion }) {
	const colors = useThemeColors();
	const { uri, failed } = useSignedUrl(inclusion.image);
	const [lightbox, setLightbox] = useState(false);

	const showImage = Boolean(inclusion.image) && !failed;

	let content: ReactNode;
	if (!showImage) {
		content = (
			<ImageOff color={colors.mutedForeground} size={22} strokeWidth={1.75} />
		);
	} else if (uri) {
		content = (
			<Image
				cachePolicy="memory-disk"
				contentFit="cover"
				source={{ uri }}
				style={{ width: '100%', height: '100%' }}
			/>
		);
	} else {
		content = <Skeleton className="h-full w-full" />;
	}

	return (
		<>
			<Pressable
				accessibilityLabel={
					showImage ? `View image of ${inclusion.title}` : undefined
				}
				accessibilityRole={showImage ? 'imagebutton' : 'image'}
				className="h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-lg bg-muted"
				disabled={!uri}
				onPress={() => setLightbox(true)}
			>
				{content}
			</Pressable>
			<ImageLightbox
				onClose={() => setLightbox(false)}
				title={inclusion.title}
				uri={uri}
				visible={lightbox}
			/>
		</>
	);
}

const InclusionRow = memo(function InclusionRow({
	inclusion,
}: {
	inclusion: ProjectInclusion;
}) {
	const colors = useThemeColors();
	const { openNotes } = useInclusionActions();
	const locations = locationsSummary(inclusion);
	const modelsSuffix =
		inclusion.models.length > 0 ? ` · ${inclusion.models.join(', ')}` : '';

	return (
		<Card className="mx-4 mb-2 flex-row gap-3 p-3">
			<InclusionThumbnail inclusion={inclusion} />
			<View className="flex-1 gap-1">
				<View className="flex-row items-start gap-1">
					<Text className="flex-1 font-sans-semibold text-foreground text-sm">
						{inclusion.title}
					</Text>
					<InclusionCardMenu inclusion={inclusion} />
				</View>
				<Text
					className="font-sans text-muted-foreground text-xs"
					numberOfLines={1}
				>
					{inclusion.code} · {inclusion.vendor}
					{modelsSuffix}
				</Text>
				{inclusion.color ? (
					<Text className="font-sans text-muted-foreground text-xs">
						{inclusion.color}
					</Text>
				) : null}
				{locations ? (
					<Text
						className="font-sans text-muted-foreground text-xs"
						numberOfLines={2}
					>
						{locations}
					</Text>
				) : null}
				<View className="flex-row flex-wrap items-center gap-1.5 pt-0.5">
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
						<OrderStatusPill status={inclusion.orderStatus} />
					) : null}
					{inclusion.hasNotes ? (
						<Pressable
							accessibilityLabel="View or edit notes"
							accessibilityRole="button"
							hitSlop={8}
							onPress={() => openNotes(inclusion)}
						>
							<MessageSquareText
								color={colors.mutedForeground}
								size={15}
								strokeWidth={2}
							/>
						</Pressable>
					) : null}
				</View>
			</View>
		</Card>
	);
});

function TopBarActionButton({
	icon: Icon,
	label,
	onPress,
}: {
	icon: typeof Download;
	label: string;
	onPress: () => Promise<void>;
}) {
	const colors = useThemeColors();
	const [busy, setBusy] = useState(false);
	const handlePress = async () => {
		setBusy(true);
		await onPress();
		setBusy(false);
	};
	return (
		<Pressable
			accessibilityLabel={label}
			accessibilityRole="button"
			className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
			disabled={busy}
			hitSlop={4}
			onPress={handlePress}
		>
			{busy ? (
				<ActivityIndicator color={colors.mutedForeground} size="small" />
			) : (
				<Icon color={colors.foreground} size={18} strokeWidth={2} />
			)}
		</Pressable>
	);
}

function InclusionsBody({
	sections,
	classFilter,
	setClassFilter,
	groupBy,
	setGroupBy,
	search,
	setSearch,
}: {
	sections: InclusionSection[];
	classFilter: ClassFilter;
	setClassFilter: (value: ClassFilter) => void;
	groupBy: GroupBy;
	setGroupBy: (value: GroupBy) => void;
	search: string;
	setSearch: (value: string) => void;
}) {
	const { downloadPdf, emailPdf } = useInclusionActions();

	return (
		<View className="flex-1">
			<View className="gap-2 px-4 pt-2 pb-3">
				<View className="flex-row items-center gap-2">
					<Select
						className="flex-1"
						onChange={setClassFilter}
						options={CLASS_OPTIONS}
						title="Filter by class"
						value={classFilter}
					/>
					<Select
						className="flex-1"
						onChange={setGroupBy}
						options={GROUP_OPTIONS}
						title="Group inclusions by"
						value={groupBy}
					/>
					<TopBarActionButton
						icon={Download}
						label="Download inclusions PDF"
						onPress={() => downloadPdf()}
					/>
					<TopBarActionButton
						icon={Mail}
						label="Email inclusions PDF"
						onPress={() => emailPdf()}
					/>
				</View>
				<SearchBar
					onChangeText={setSearch}
					placeholder="Search inclusions"
					value={search}
				/>
			</View>
			<SectionList
				contentContainerClassName="pb-6"
				keyExtractor={(item) => item._id}
				ListEmptyComponent={
					<EmptyState
						description={
							search
								? 'No inclusions match your search.'
								: 'Inclusions added in the web portal will appear here.'
						}
						icon={Sofa}
						title="No inclusions"
					/>
				}
				renderItem={({ item }) => <InclusionRow inclusion={item} />}
				renderSectionHeader={({ section }) => (
					<InclusionSectionHeader section={section as InclusionSection} />
				)}
				sections={sections}
				stickySectionHeadersEnabled={false}
			/>
		</View>
	);
}

export default function InclusionsScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	const inclusions = useQuery(api.projectInclusions.list.list, {
		projectId: projectId as Id<'projects'>,
	}) as ProjectInclusion[] | undefined;
	const categories = useQuery(api.inclusionCategories.list.list, {});

	const [classFilter, setClassFilter] = useState<ClassFilter>('All');
	const [groupBy, setGroupBy] = useState<GroupBy>('category');
	const [search, setSearch] = useState('');

	const sections = useMemo<InclusionSection[]>(() => {
		if (!inclusions) {
			return [];
		}
		const nameById = new Map<string, string>(
			(categories ?? []).map((category: Doc<'inclusionCategories'>) => [
				category._id,
				category.name,
			])
		);
		const needle = search.trim().toLowerCase();
		const filtered = inclusions.filter((inclusion) => {
			if (classFilter !== 'All' && inclusion.class !== classFilter) {
				return false;
			}
			return needle === '' ? true : matchesSearch(inclusion, needle);
		});

		const buckets = new Map<string, ProjectInclusion[]>();
		for (const inclusion of filtered) {
			const categoryName = nameById.get(inclusion.categoryId) ?? OTHER_CATEGORY;
			for (const key of groupKeysFor(inclusion, groupBy, categoryName)) {
				const list = buckets.get(key) ?? [];
				list.push(inclusion);
				buckets.set(key, list);
			}
		}
		return [...buckets.entries()]
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([title, rows]) => {
				const data = [...rows].sort((a, b) => a.title.localeCompare(b.title));
				return {
					key: title,
					title,
					data,
					variationTotal: variationTotalFor(data),
				};
			});
	}, [categories, classFilter, groupBy, inclusions, search]);

	if (inclusions === undefined) {
		return <ListSkeleton />;
	}

	return (
		<InclusionActionsProvider
			classFilter={classFilter}
			groupBy={groupBy}
			projectId={projectId as Id<'projects'>}
			search={search}
		>
			<InclusionsBody
				classFilter={classFilter}
				groupBy={groupBy}
				search={search}
				sections={sections}
				setClassFilter={setClassFilter}
				setGroupBy={setGroupBy}
				setSearch={setSearch}
			/>
		</InclusionActionsProvider>
	);
}
