import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useAction } from 'convex/react';
import type { FunctionReturnType } from 'convex/server';
import {
	EllipsisVertical,
	MonitorSmartphone,
	MonitorX,
} from 'lucide-react-native';
import { useRef } from 'react';
import { Alert, Linking, Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { ActionSheet } from '@/components/ui/action-sheet';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

type ProjectClient = NonNullable<
	FunctionReturnType<typeof api.projects.get.get>
>['clients'][number];

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

export function ClientCard({
	client,
	projectId,
}: {
	client: ProjectClient;
	projectId: Id<'projects'>;
}) {
	const colors = useThemeColors();
	const sheetRef = useRef<BottomSheetModal>(null);
	const fullName = `${client.firstName} ${client.lastName}`;
	const hasPortalAccess = Boolean(client.portalUserId);

	const grantAccess = useAction(api.clientPortal.grantAccess.grantAccess);
	const revokeAccess = useAction(api.clientPortal.revokeAccess.revokeAccess);

	const handleGrant = () => {
		grantAccess({ projectId, email: client.email }).catch(() => {
			Alert.alert('Unable to update', 'Please try again.');
		});
	};

	const handleRevoke = () => {
		Alert.alert(
			'Remove portal access?',
			`${fullName} will no longer be able to sign in to the client portal.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Remove',
					style: 'destructive',
					onPress: () => {
						revokeAccess({ projectId, email: client.email }).catch(() => {
							Alert.alert('Unable to update', 'Please try again.');
						});
					},
				},
			]
		);
	};

	return (
		<Card
			className="mx-4 mb-3 flex-row items-start gap-3 p-3"
			key={client.email}
		>
			<Avatar name={fullName} size="md" />
			<View className="flex-1 gap-0.5">
				<Text className="font-sans-semibold text-base text-foreground">
					{fullName}
				</Text>
				<ContactRow
					label={client.phone}
					onPress={() => Linking.openURL(`tel:${client.phone}`)}
				/>
				<ContactRow
					label={client.email}
					onPress={() => Linking.openURL(`mailto:${client.email}`)}
				/>
				{client.company ? <ContactRow label={client.company} /> : null}
			</View>
			<View className="flex-row items-center gap-1">
				{hasPortalAccess ? (
					<Badge variant="success">Portal Access</Badge>
				) : null}
				<Pressable
					accessibilityLabel="Client actions"
					accessibilityRole="button"
					className="h-8 w-8 items-center justify-center rounded-lg active:bg-muted"
					hitSlop={6}
					onPress={() => sheetRef.current?.present()}
				>
					<EllipsisVertical
						color={colors.mutedForeground}
						size={18}
						strokeWidth={2}
					/>
				</Pressable>
			</View>
			<ActionSheet
				items={[
					hasPortalAccess
						? {
								key: 'portal',
								label: 'Remove portal access',
								icon: MonitorX,
								destructive: true,
								onPress: () => {
									sheetRef.current?.dismiss();
									handleRevoke();
								},
							}
						: {
								key: 'portal',
								label: 'Grant portal access',
								icon: MonitorSmartphone,
								onPress: () => {
									sheetRef.current?.dismiss();
									handleGrant();
								},
							},
				]}
				ref={sheetRef}
				title={fullName}
			/>
		</Card>
	);
}
