import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
	ArrowLeft,
	FolderPlus,
	MoreVertical,
	Pencil,
	Trash2,
} from 'lucide-react-native';
import { useRef } from 'react';
import {
	Alert,
	Linking,
	Pressable,
	ScrollView,
	Text,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
	AddServiceProviderToProjectSheet,
	type AddServiceProviderToProjectSheetHandle,
} from '@/components/service-providers/add-service-provider-to-project-sheet';
import {
	CreateServiceProviderSheet,
	type CreateServiceProviderSheetHandle,
} from '@/components/service-providers/create-service-provider-sheet';
import { useThemeColors } from '@/components/theme';
import { ActionSheet } from '@/components/ui/action-sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ListSkeleton } from '@/components/ui/skeleton';

type ServiceProvider = Doc<'serviceProviders'>;
type ServiceProviderContact = ServiceProvider['contacts'][number];

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
			className="-mx-1 min-h-[24px] flex-row items-center rounded-md px-1 active:bg-muted"
			disabled={!onPress}
			onPress={onPress}
		>
			<Text className="flex-1 font-sans text-muted-foreground text-sm">
				{label}
			</Text>
		</Pressable>
	);
}

function ContactDetails({
	name,
	position,
	email,
	phone,
	landline,
}: {
	name: string;
	position?: string;
	email?: string;
	phone?: string;
	landline?: string;
}) {
	return (
		<View className="gap-0.5">
			<Text className="font-sans-semibold text-base text-foreground">
				{name}
			</Text>
			{position ? (
				<Text className="font-sans text-muted-foreground text-xs">
					{position}
				</Text>
			) : null}
			{email ? (
				<ContactRow
					label={email}
					onPress={() => Linking.openURL(`mailto:${email}`)}
				/>
			) : null}
			{phone ? (
				<ContactRow
					label={phone}
					onPress={() => Linking.openURL(`tel:${phone}`)}
				/>
			) : null}
			{landline ? (
				<ContactRow
					label={landline}
					onPress={() => Linking.openURL(`tel:${landline}`)}
				/>
			) : null}
		</View>
	);
}

export default function ServiceProviderDetailsScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();
	const { serviceProviderId, projectId } = useLocalSearchParams<{
		serviceProviderId: Id<'serviceProviders'>;
		projectId: Id<'projects'>;
	}>();

	const provider = useQuery(api.serviceProviders.get.get, {
		serviceProviderId,
	}) as ServiceProvider | null | undefined;
	const trades = useQuery(api.trades.list.list, {});
	const removeFromProject = useMutation(
		api.projectServiceProviders.remove.remove
	);
	const removeProvider = useMutation(api.serviceProviders.remove.remove);

	const actionsRef = useRef<BottomSheetModal>(null);
	const editRef = useRef<CreateServiceProviderSheetHandle>(null);
	const addToProjectRef = useRef<AddServiceProviderToProjectSheetHandle>(null);

	const tradeNames = (() => {
		if (!(provider && trades)) {
			return [];
		}
		const map = new Map(trades.map((trade) => [trade._id, trade.name]));
		return provider.tradeIds
			.map((id) => map.get(id))
			.filter((name): name is string => Boolean(name));
	})();

	const handleRemove = () => {
		if (!provider) {
			return;
		}
		Alert.alert(
			'Remove service provider?',
			`Remove ${provider.company} from this project?`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Remove',
					style: 'destructive',
					onPress: () => {
						removeFromProject({ projectId, serviceProviderId })
							.then(() => router.back())
							.catch(() =>
								Alert.alert('Unable to remove', 'Please try again.')
							);
					},
				},
			]
		);
	};

	const handleDelete = () => {
		if (!provider) {
			return;
		}
		Alert.alert(
			'Delete service provider?',
			`Delete ${provider.company}? This removes it from all projects and cannot be undone.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						removeProvider({ serviceProviderId })
							.then(() => router.back())
							.catch(() =>
								Alert.alert('Unable to delete', 'Please try again.')
							);
					},
				},
			]
		);
	};

	const actionItems = provider
		? [
				{
					key: 'edit',
					label: 'Edit',
					icon: Pencil,
					onPress: () => {
						actionsRef.current?.dismiss();
						editRef.current?.present({ provider });
					},
				},
				{
					key: 'add-to-project',
					label: 'Add to project',
					icon: FolderPlus,
					onPress: () => {
						actionsRef.current?.dismiss();
						addToProjectRef.current?.present();
					},
				},
				{
					key: 'delete',
					label: 'Delete',
					icon: Trash2,
					destructive: true,
					onPress: () => {
						actionsRef.current?.dismiss();
						handleDelete();
					},
				},
			]
		: [];

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
				<View className="flex-1">
					<Text
						className="font-sans-bold text-2xl text-foreground"
						numberOfLines={1}
					>
						{provider?.company ?? 'Service Provider'}
					</Text>
					{provider?.name ? (
						<Text
							className="font-sans text-muted-foreground text-sm"
							numberOfLines={1}
						>
							{provider.name}
						</Text>
					) : null}
				</View>
				{provider ? (
					<Pressable
						accessibilityLabel="Service provider actions"
						accessibilityRole="button"
						className="h-10 w-10 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
						hitSlop={4}
						onPress={() => actionsRef.current?.present()}
					>
						<MoreVertical color={colors.foreground} size={20} strokeWidth={2} />
					</Pressable>
				) : null}
			</View>

			{provider === undefined ? <ListSkeleton /> : null}
			{provider === null ? (
				<View className="flex-1 items-center justify-center px-8">
					<Text className="text-center font-sans text-muted-foreground text-sm">
						This service provider no longer exists.
					</Text>
				</View>
			) : null}
			{provider ? (
				<ScrollView
					contentContainerClassName="gap-4 px-4"
					contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
				>
					{tradeNames.length > 0 ? (
						<View className="flex-row flex-wrap gap-1.5">
							{tradeNames.map((name) => (
								<Badge key={name} variant="outline">
									{name}
								</Badge>
							))}
						</View>
					) : null}

					<Card className="gap-1.5 p-3.5">
						<Text className="font-sans-semibold text-muted-foreground text-xs uppercase tracking-wide">
							Main contact
						</Text>
						<ContactDetails
							email={provider.email}
							landline={provider.landline}
							name={provider.name}
							phone={provider.phone}
							position={provider.position}
						/>
						{provider.website ? (
							<ContactRow
								label={provider.website}
								onPress={() => Linking.openURL(provider.website as string)}
							/>
						) : null}
						{provider.qbccLicense ? (
							<ContactRow label={`QBCC ${provider.qbccLicense}`} />
						) : null}
						{provider.address ? <ContactRow label={provider.address} /> : null}
					</Card>

					{provider.contacts.length > 0 ? (
						<View className="gap-2">
							<Text className="px-1 font-sans-semibold text-muted-foreground text-xs uppercase tracking-wide">
								Additional contacts
							</Text>
							{provider.contacts.map(
								(contact: ServiceProviderContact, index: number) => (
									<Card className="p-3.5" key={`${contact.name}-${index}`}>
										<ContactDetails
											email={contact.email}
											landline={contact.landline}
											name={contact.name}
											phone={contact.phone}
											position={contact.position}
										/>
									</Card>
								)
							)}
						</View>
					) : null}

					{projectId ? (
						<Button onPress={handleRemove} variant="destructive-outline">
							Remove from project
						</Button>
					) : null}
				</ScrollView>
			) : null}

			<ActionSheet
				items={actionItems}
				ref={actionsRef}
				title={provider?.company}
			/>
			<CreateServiceProviderSheet ref={editRef} />
			<AddServiceProviderToProjectSheet
				ref={addToProjectRef}
				serviceProviderId={serviceProviderId}
			/>
		</View>
	);
}
