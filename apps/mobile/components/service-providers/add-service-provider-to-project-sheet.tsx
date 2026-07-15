import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { ConvexError } from 'convex/values';
import { Check, Plus } from 'lucide-react-native';
import {
	type Ref,
	useCallback,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Alert, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { PressableCard } from '@/components/ui/card';
import { SearchBar } from '@/components/ui/search-bar';
import { cn } from '@/lib/cn';

export interface AddServiceProviderToProjectSheetHandle {
	present: () => void;
}

/**
 * Links a service provider to one or more projects from the global service
 * provider detail screen. Mirrors the portal `AddServiceProviderToProject`
 * multi-select dialog. The inverse of `AddServiceProviderSheet`, which picks
 * providers for a single project.
 */
export function AddServiceProviderToProjectSheet({
	serviceProviderId,
	ref,
}: {
	serviceProviderId: Id<'serviceProviders'>;
	ref?: Ref<AddServiceProviderToProjectSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);
	const [search, setSearch] = useState('');
	const [selectedIds, setSelectedIds] = useState<Set<Id<'projects'>>>(
		new Set()
	);
	const [saving, setSaving] = useState(false);

	const projects = useQuery(api.projects.list.list, {});
	const addToProject = useMutation(api.projectServiceProviders.add.add);

	useImperativeHandle(ref, () => ({
		present: () => {
			setSearch('');
			setSelectedIds(new Set());
			sheetRef.current?.present();
		},
	}));

	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				opacity={0.5}
			/>
		),
		[]
	);

	const trimmedSearch = search.trim().toLowerCase();

	const candidates = useMemo(() => {
		return (projects ?? []).filter((project) => {
			if (!trimmedSearch) {
				return true;
			}
			return project.name.toLowerCase().includes(trimmedSearch);
		});
	}, [projects, trimmedSearch]);

	const toggle = (projectId: Id<'projects'>) =>
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(projectId)) {
				next.delete(projectId);
			} else {
				next.add(projectId);
			}
			return next;
		});

	const handleAdd = async () => {
		if (selectedIds.size === 0) {
			return;
		}
		setSaving(true);
		try {
			await Promise.all(
				[...selectedIds].map(async (projectId) => {
					try {
						await addToProject({ projectId, serviceProviderId });
					} catch (error) {
						// Tolerate re-linking a project the provider already belongs to.
						if (
							error instanceof ConvexError &&
							(error.data as { code?: string })?.code === 'ALREADY_EXISTS'
						) {
							return;
						}
						throw error;
					}
				})
			);
			sheetRef.current?.dismiss();
		} catch {
			Alert.alert('Could not add to project', 'Please try again.');
		} finally {
			setSaving(false);
		}
	};

	const selectedCount = selectedIds.size;

	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			backgroundStyle={{ backgroundColor: colors.card }}
			enableDynamicSizing
			handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
			maxDynamicContentSize={560}
			ref={sheetRef}
			stackBehavior="push"
			topInset={insets.top}
		>
			<BottomSheetScrollView
				className="px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
				keyboardShouldPersistTaps="handled"
			>
				<Text className="px-1 pb-3 font-sans-semibold text-base text-foreground">
					Add to project
				</Text>
				<View className="pb-3">
					<SearchBar
						onChangeText={setSearch}
						placeholder="Search projects"
						value={search}
					/>
				</View>
				{candidates.length === 0 ? (
					<Text className="py-3 font-sans text-muted-foreground text-sm">
						{projects === undefined ? 'Loading…' : 'No projects found.'}
					</Text>
				) : null}
				{candidates.map((project) => {
					const selected = selectedIds.has(project._id);
					return (
						<PressableCard
							accessibilityLabel={`${selected ? 'Deselect' : 'Select'} ${project.name}`}
							className={cn(
								'mb-2 flex-row items-center gap-3 p-3',
								selected && 'border-foreground/30 bg-muted'
							)}
							key={project._id}
							onPress={() => toggle(project._id)}
						>
							<Text
								className="flex-1 font-sans-semibold text-foreground text-sm"
								numberOfLines={1}
							>
								{project.name}
							</Text>
							{selected ? (
								<Check color={colors.foreground} size={18} strokeWidth={2} />
							) : null}
						</PressableCard>
					);
				})}
				<Button
					className="mt-1"
					disabled={selectedCount === 0}
					icon={<Plus color={colors.foreground} size={18} strokeWidth={2} />}
					loading={saving}
					onPress={handleAdd}
				>
					{selectedCount > 1
						? `Add to ${selectedCount} projects`
						: 'Add to project'}
				</Button>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
