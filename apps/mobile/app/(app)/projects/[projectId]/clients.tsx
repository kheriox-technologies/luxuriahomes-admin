import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import { Building, Mail, Phone, Users } from 'lucide-react-native';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/skeleton';

function ContactRow({
	icon: Icon,
	label,
	onPress,
}: {
	icon: typeof Phone;
	label: string;
	onPress?: () => void;
}) {
	const colors = useThemeColors();
	return (
		<Pressable
			accessibilityLabel={label}
			accessibilityRole={onPress ? 'button' : 'text'}
			className="min-h-[44px] flex-row items-center gap-3 rounded-lg px-2 active:bg-muted"
			disabled={!onPress}
			onPress={onPress}
		>
			<Icon color={colors.mutedForeground} size={16} strokeWidth={2} />
			<Text className="flex-1 font-sans text-foreground text-sm">{label}</Text>
		</Pressable>
	);
}

export default function ClientsScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	const project = useQuery(api.projects.get.get, {
		projectId: projectId as Id<'projects'>,
	});

	if (project === undefined) {
		return <ListSkeleton rows={2} />;
	}

	const clients = project?.clients ?? [];

	if (clients.length === 0) {
		return (
			<EmptyState
				description="Add clients to this project in the web portal."
				icon={Users}
				title="No clients"
			/>
		);
	}

	return (
		<ScrollView className="flex-1" contentContainerClassName="pb-6 pt-1">
			{clients.map((client) => {
				const fullName = `${client.firstName} ${client.lastName}`;
				return (
					<Card className="mx-4 mb-3 gap-3 p-4" key={client.email}>
						<View className="flex-row items-center gap-3">
							<Avatar name={fullName} size="md" />
							<View className="flex-1">
								<Text className="font-sans-semibold text-base text-foreground">
									{fullName}
								</Text>
								{client.portalUserId ? (
									<Text className="font-sans text-success text-xs">
										Portal access enabled
									</Text>
								) : null}
							</View>
						</View>
						<View>
							<ContactRow
								icon={Phone}
								label={client.phone}
								onPress={() => Linking.openURL(`tel:${client.phone}`)}
							/>
							<ContactRow
								icon={Mail}
								label={client.email}
								onPress={() => Linking.openURL(`mailto:${client.email}`)}
							/>
							{client.company ? (
								<ContactRow icon={Building} label={client.company} />
							) : null}
						</View>
					</Card>
				);
			})}
		</ScrollView>
	);
}
