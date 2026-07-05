import { api } from '@workspace/backend/api';
import { useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { ArrowLeft, Wallet } from 'lucide-react-native';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BudgetTemplateCard } from '@/components/budgets/budget-template-card';
import { useThemeColors } from '@/components/theme';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/skeleton';

export default function BudgetsScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();
	const templates = useQuery(api.budgetTemplates.list.list, {});

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
							description="Budget templates created in the web portal will appear here."
							icon={Wallet}
							title="No budget templates"
						/>
					}
					renderItem={({ item }) => <BudgetTemplateCard template={item} />}
				/>
			)}
		</View>
	);
}
