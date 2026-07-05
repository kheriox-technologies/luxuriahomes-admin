import { api } from '@workspace/backend/api';
import { useAction } from 'convex/react';
import type { FunctionReturnType } from 'convex/server';
import { useRouter } from 'expo-router';
import { ArrowLeft, Users } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchBar } from '@/components/ui/search-bar';
import { ListSkeleton } from '@/components/ui/skeleton';
import { UserCard } from '@/components/users/user-card';

type UserRow = FunctionReturnType<typeof api.users.list.list>[number];

export default function UsersScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();
	const listUsers = useAction(api.users.list.list);

	const [users, setUsers] = useState<UserRow[] | undefined>(undefined);
	const [loadFailed, setLoadFailed] = useState(false);
	const [search, setSearch] = useState('');

	useEffect(() => {
		let active = true;
		listUsers({})
			.then((result) => {
				if (active) {
					setUsers(result);
				}
			})
			.catch(() => {
				if (active) {
					setLoadFailed(true);
					setUsers([]);
				}
			});
		return () => {
			active = false;
		};
	}, [listUsers]);

	const filteredUsers = useMemo(() => {
		if (!users) {
			return [];
		}
		const query = search.trim().toLowerCase();
		if (!query) {
			return users;
		}
		return users.filter((user) => {
			const haystack = [
				user.fullName,
				user.email,
				user.phoneNumber,
				user.roles.join(' '),
			]
				.join(' ')
				.toLowerCase();
			return haystack.includes(query);
		});
	}, [users, search]);

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
					Users
				</Text>
			</View>

			{users !== undefined && !loadFailed ? (
				<View className="px-4 pb-3">
					<SearchBar
						onChangeText={setSearch}
						placeholder="Search users"
						value={search}
					/>
				</View>
			) : null}

			{users === undefined ? (
				<ListSkeleton />
			) : (
				<FlatList
					contentContainerClassName="pb-6"
					data={filteredUsers}
					keyExtractor={(item) => item.userId}
					ListEmptyComponent={
						loadFailed ? (
							<EmptyState
								description="You may not have permission to view users, or something went wrong. Please try again."
								icon={Users}
								title="Couldn't load users"
							/>
						) : (
							<EmptyState
								description="No users match your search."
								icon={Users}
								title="No users found"
							/>
						)
					}
					renderItem={({ item }) => <UserCard user={item} />}
				/>
			)}
		</View>
	);
}
