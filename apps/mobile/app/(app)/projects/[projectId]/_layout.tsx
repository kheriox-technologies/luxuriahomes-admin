import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import {
	Slot,
	useLocalSearchParams,
	usePathname,
	useRouter,
} from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Chip } from '@/components/ui/chip';
import { Skeleton } from '@/components/ui/skeleton';

const SECTIONS = [
	{ key: 'schedule', label: 'Schedule' },
	{ key: 'inclusions', label: 'Inclusions' },
	{ key: 'documents', label: 'Documents' },
	{ key: 'takeoffs', label: 'Take Offs' },
	{ key: 'orders', label: 'Orders' },
	{ key: 'clients', label: 'Clients' },
] as const;

type SectionKey = (typeof SECTIONS)[number]['key'];

export default function ProjectDetailLayout() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	const router = useRouter();
	const pathname = usePathname();
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();

	const project = useQuery(api.projects.get.get, {
		projectId: projectId as Id<'projects'>,
	});

	const activeSection: SectionKey =
		SECTIONS.find((section) => pathname.endsWith(`/${section.key}`))?.key ??
		'schedule';

	return (
		<View className="flex-1 bg-background">
			<View
				className="gap-3 bg-background px-4 pb-3"
				style={{ paddingTop: insets.top + 8 }}
			>
				<View className="flex-row items-center gap-3">
					<Pressable
						accessibilityLabel="Back to projects"
						accessibilityRole="button"
						className="h-10 w-10 items-center justify-center rounded-full border border-border bg-card"
						hitSlop={4}
						onPress={() => router.back()}
					>
						<ArrowLeft color={colors.foreground} size={20} strokeWidth={2} />
					</Pressable>
					<View className="flex-1">
						{project ? (
							<>
								<Text
									className="font-sans-bold text-foreground text-lg"
									numberOfLines={1}
								>
									{project.name}
								</Text>
								<Text
									className="font-sans text-muted-foreground text-xs"
									numberOfLines={1}
								>
									{project.address.street}, {project.address.suburb}
								</Text>
							</>
						) : (
							<Skeleton className="h-10 w-3/4" />
						)}
					</View>
				</View>
			</View>

			<ScrollView
				className="max-h-[52px] flex-none"
				contentContainerClassName="gap-2 px-4 pb-3"
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				{SECTIONS.map((section) => (
					<Chip
						key={section.key}
						label={section.label}
						onPress={() => {
							if (section.key !== activeSection) {
								router.replace({
									pathname: `/(app)/projects/[projectId]/${section.key}`,
									params: { projectId },
								});
							}
						}}
						selected={section.key === activeSection}
					/>
				))}
			</ScrollView>

			<Slot />
		</View>
	);
}
