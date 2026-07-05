import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import {
	Download,
	ImageOff,
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
	ClientInclusionActionsProvider,
	useClientInclusionActions,
} from '@/components/client/inclusions/inclusion-actions-provider';
import { ClientInclusionCardMenu } from '@/components/client/inclusions/inclusion-card-menu';
import { ClientInclusionSectionHeader } from '@/components/client/inclusions/inclusion-section-header';
import type {
	ClientInclusion,
	ClientInclusionSection,
} from '@/components/client/inclusions/types';
import { classVariants } from '@/components/inclusions/types';
import { useThemeColors } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { SearchBar } from '@/components/ui/search-bar';
import { ListSkeleton, Skeleton } from '@/components/ui/skeleton';
import { useClientSignedUrl } from '@/lib/client/use-signed-url';

const OTHER_CATEGORY = 'Other';

function locationsSummary(inclusion: ClientInclusion): string {
	return (inclusion.locations ?? [])
		.map((location) => location.name)
		.join(', ');
}

function matchesSearch(inclusion: ClientInclusion, needle: string): boolean {
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

function variationTotalFor(inclusions: ClientInclusion[]): number {
	return inclusions.reduce(
		(sum, i) => (i.class === 'Standard' ? sum : sum + (i.variationPrice ?? 0)),
		0
	);
}

function InclusionThumbnail({
	projectId,
	inclusion,
}: {
	projectId: Id<'projects'>;
	inclusion: ClientInclusion;
}) {
	const colors = useThemeColors();
	const { uri, failed } = useClientSignedUrl(projectId, inclusion.image);
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
	projectId,
	inclusion,
}: {
	projectId: Id<'projects'>;
	inclusion: ClientInclusion;
}) {
	const colors = useThemeColors();
	const { openNotes } = useClientInclusionActions();
	const locations = locationsSummary(inclusion);
	const modelsSuffix =
		inclusion.models.length > 0 ? ` · ${inclusion.models.join(', ')}` : '';

	return (
		<Card className="mx-4 mb-2 flex-row gap-3 p-3">
			<InclusionThumbnail inclusion={inclusion} projectId={projectId} />
			<View className="flex-1 gap-1">
				<View className="flex-row items-start gap-1">
					<Text className="flex-1 font-sans-semibold text-foreground text-sm">
						{inclusion.title}
					</Text>
					<ClientInclusionCardMenu inclusion={inclusion} />
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

function InclusionsBody({
	projectId,
	sections,
	search,
	setSearch,
}: {
	projectId: Id<'projects'>;
	sections: ClientInclusionSection[];
	search: string;
	setSearch: (value: string) => void;
}) {
	const { downloadPdf } = useClientInclusionActions();
	const colors = useThemeColors();
	const [downloading, setDownloading] = useState(false);

	const handleDownload = async () => {
		setDownloading(true);
		await downloadPdf();
		setDownloading(false);
	};

	return (
		<View className="flex-1">
			<View className="gap-2 px-4 pt-2 pb-3">
				<View className="flex-row items-center gap-2">
					<View className="flex-1">
						<SearchBar
							onChangeText={setSearch}
							placeholder="Search inclusions"
							value={search}
						/>
					</View>
					<Pressable
						accessibilityLabel="Download inclusions PDF"
						accessibilityRole="button"
						className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
						disabled={downloading}
						hitSlop={4}
						onPress={handleDownload}
					>
						{downloading ? (
							<ActivityIndicator color={colors.mutedForeground} size="small" />
						) : (
							<Download color={colors.foreground} size={18} strokeWidth={2} />
						)}
					</Pressable>
				</View>
			</View>
			<SectionList
				contentContainerClassName="pb-6"
				keyExtractor={(item) => item._id}
				ListEmptyComponent={
					<EmptyState
						description={
							search
								? 'No inclusions match your search.'
								: 'Your selections will appear here once added.'
						}
						icon={Sofa}
						title="No inclusions"
					/>
				}
				renderItem={({ item }) => (
					<InclusionRow inclusion={item} projectId={projectId} />
				)}
				renderSectionHeader={({ section }) => (
					<ClientInclusionSectionHeader
						section={section as ClientInclusionSection}
					/>
				)}
				sections={sections}
				stickySectionHeadersEnabled={false}
			/>
		</View>
	);
}

export default function ClientInclusionsScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	const inclusions = useQuery(api.clientPortal.inclusions.list.list, {
		projectId: projectId as Id<'projects'>,
	}) as ClientInclusion[] | undefined;

	const [search, setSearch] = useState('');

	const sections = useMemo<ClientInclusionSection[]>(() => {
		if (!inclusions) {
			return [];
		}
		const needle = search.trim().toLowerCase();
		const filtered =
			needle === ''
				? inclusions
				: inclusions.filter((inclusion) => matchesSearch(inclusion, needle));

		const buckets = new Map<string, ClientInclusion[]>();
		for (const inclusion of filtered) {
			const key = inclusion.categoryName || OTHER_CATEGORY;
			const list = buckets.get(key) ?? [];
			list.push(inclusion);
			buckets.set(key, list);
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
	}, [inclusions, search]);

	if (inclusions === undefined) {
		return <ListSkeleton />;
	}

	return (
		<ClientInclusionActionsProvider
			projectId={projectId as Id<'projects'>}
			search={search}
		>
			<InclusionsBody
				projectId={projectId as Id<'projects'>}
				search={search}
				sections={sections}
				setSearch={setSearch}
			/>
		</ClientInclusionActionsProvider>
	);
}
