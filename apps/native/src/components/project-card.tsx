import type { Project } from '@workspace/shared/types';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

export function ProjectCard({
	project,
	onOpen,
}: {
	project: Project;
	onOpen: () => void;
}) {
	const { street, suburb, state, postcode } = project.address;

	return (
		<Pressable
			className="flex-row items-start justify-between gap-3 rounded-lg border border-border bg-card p-4 active:opacity-80"
			onPress={onOpen}
		>
			<View className="min-w-0 flex-1 gap-1">
				<Text
					className="font-medium text-base text-card-foreground"
					numberOfLines={1}
				>
					{project.name}
				</Text>
				<Text className="text-muted-foreground text-sm">{street}</Text>
				<Text className="text-muted-foreground text-xs">
					{suburb}, {state} {postcode}
				</Text>
			</View>
			<ChevronRight color="#737373" size={20} />
		</Pressable>
	);
}
