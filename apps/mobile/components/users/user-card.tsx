import type { api } from '@workspace/backend/api';
import type { FunctionReturnType } from 'convex/server';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { Avatar } from '@/components/ui/avatar';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatRelativeTime } from '@/lib/format';
import { formatRoleLabel } from '@/lib/roles';

type UserRow = FunctionReturnType<typeof api.users.list.list>[number];

function roleVariant(role: string): BadgeVariant {
	if (role === 'super-admin') {
		return 'purple';
	}
	if (role === 'admin') {
		return 'info';
	}
	return 'outline';
}

function ContactRow({
	label,
	onPress,
}: {
	label: string;
	onPress?: () => void;
}) {
	return (
		<Pressable
			accessibilityLabel={label}
			accessibilityRole={onPress ? 'button' : 'text'}
			className="-mx-1 min-h-[22px] flex-row items-center rounded-md px-1 active:bg-muted"
			disabled={!onPress}
			onPress={onPress}
		>
			<Text className="flex-1 font-sans text-muted-foreground text-xs">
				{label}
			</Text>
		</Pressable>
	);
}

function UserCardComponent({ user }: { user: UserRow }) {
	const fullName = user.fullName || `${user.firstName} ${user.lastName}`.trim();
	const lastActive = formatRelativeTime(user.lastActiveAt ?? user.lastSignInAt);

	return (
		<Card className="mx-4 mb-3 flex-row items-start gap-3 p-3">
			{user.imageUrl ? (
				<Image
					accessibilityLabel={`${fullName} profile photo`}
					contentFit="cover"
					source={{ uri: user.imageUrl }}
					style={{ width: 40, height: 40, borderRadius: 20 }}
				/>
			) : (
				<Avatar name={fullName} size="md" />
			)}
			<View className="flex-1 gap-0.5">
				<Text className="font-sans-semibold text-base text-foreground">
					{fullName || 'Unnamed user'}
				</Text>
				<ContactRow
					label={user.email}
					onPress={() => Linking.openURL(`mailto:${user.email}`)}
				/>
				{user.phoneNumber ? (
					<ContactRow
						label={user.phoneNumber}
						onPress={() => Linking.openURL(`tel:${user.phoneNumber}`)}
					/>
				) : null}
				<ContactRow label={`Last active ${lastActive}`} />
				{user.roles.length > 0 ? (
					<View className="mt-1 flex-row flex-wrap gap-1">
						{user.roles.map((role) => (
							<Badge key={role} variant={roleVariant(role)}>
								{formatRoleLabel(role)}
							</Badge>
						))}
					</View>
				) : null}
			</View>
		</Card>
	);
}

export const UserCard = memo(UserCardComponent);
