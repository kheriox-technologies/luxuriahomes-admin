import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import {
	Slot,
	useLocalSearchParams,
	usePathname,
	useRouter,
} from 'expo-router';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Chip } from '@/components/ui/chip';
import { Skeleton } from '@/components/ui/skeleton';

// The portal shows these as six tabs across the top of the template; on a phone
// they are the same horizontal chip bar the project detail uses.
const SECTIONS = [
	{ key: 'items', label: 'Items' },
	{ key: 'terms', label: 'Terms' },
	{ key: 'exclusions', label: 'Exclusions' },
	{ key: 'notes', label: 'Notes' },
	{ key: 'disclaimer', label: 'Disclaimer' },
	{ key: 'acknowledgement', label: 'Acknowledgement' },
] as const;

type SectionKey = (typeof SECTIONS)[number]['key'];

export default function QuotationTemplateLayout() {
	const { templateId } = useLocalSearchParams<{ templateId: string }>();
	const router = useRouter();
	const pathname = usePathname();
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();

	const template = useQuery(api.quoteTemplates.get.get, {
		templateId: templateId as Id<'quoteTemplates'>,
	});

	const activeSection: SectionKey =
		SECTIONS.find((section) => pathname.endsWith(`/${section.key}`))?.key ??
		'items';

	return (
		<View className="flex-1 bg-background">
			<View
				className="gap-3 bg-background px-4 pb-3"
				style={{ paddingTop: insets.top + 8 }}
			>
				<View className="flex-row items-center gap-3">
					<Pressable
						accessibilityLabel="Back to quotation templates"
						accessibilityRole="button"
						className="h-10 w-10 items-center justify-center rounded-lg border border-border bg-card"
						hitSlop={4}
						onPress={() => router.back()}
					>
						<ArrowLeft color={colors.foreground} size={20} strokeWidth={2} />
					</Pressable>
					<View className="flex-1">
						{template ? (
							<>
								<Text
									className="font-sans-bold text-foreground text-lg"
									numberOfLines={1}
								>
									{template.name}
								</Text>
								<Text
									className="font-sans text-muted-foreground text-xs"
									numberOfLines={1}
								>
									{template.description ??
										'The content a quotation is built from.'}
								</Text>
							</>
						) : (
							<Skeleton className="h-10 w-3/4" />
						)}
					</View>
					<Pressable
						accessibilityLabel="Create quotation from this template"
						accessibilityRole="button"
						className="h-10 w-10 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
						hitSlop={4}
						onPress={() =>
							router.push({
								pathname: '/(app)/quotations/new',
								params: { templateId },
							})
						}
					>
						<Plus color={colors.foreground} size={20} strokeWidth={2} />
					</Pressable>
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
									pathname: `/(app)/quotation-templates/[templateId]/${section.key}`,
									params: { templateId },
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
