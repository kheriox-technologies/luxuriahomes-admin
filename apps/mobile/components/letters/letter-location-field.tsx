import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import {
	ChevronLeft,
	ChevronRight,
	Folder,
	FolderInput,
	Home,
	MapPin,
} from 'lucide-react-native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { PressableCard } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';

export type LetterDestination =
	| { scope: 'company'; folderPath: string }
	| { scope: 'project'; projectId: Id<'projects'>; folderPath: string };

const COMPANY_KEY = 'company';

type DocFolder =
	| Doc<'companyDocumentFolders'>
	| Doc<'projectDocumentFolders'>;

function folderLabel(folderPath: string): string {
	return folderPath === '' ? 'Root' : folderPath;
}

/**
 * Mobile port of the portal's `LetterLocationField`. Shows the letter's current
 * destination and lets the user change both the section (Company Documents or a
 * project) and the folder within it. Section selection uses a Chip row and the
 * folder browser mirrors the move-document sheet, so no bottom sheets are nested.
 */
export function LetterLocationField({
	value,
	onChange,
}: {
	value: LetterDestination;
	onChange: (next: LetterDestination) => void;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const projects = useQuery(api.projects.list.list, {});

	// Draft selection inside the sheet (committed on "Select location").
	const [scopeKey, setScopeKey] = useState<string>(COMPANY_KEY);
	const [folderPath, setFolderPath] = useState('');

	const isCompany = scopeKey === COMPANY_KEY;

	const companyContents = useQuery(
		api.companyDocuments.listContents.listContents,
		isCompany ? { folderPath } : 'skip'
	) as { folders: DocFolder[] } | undefined;
	const projectContents = useQuery(
		api.projectDocuments.listContents.listContents,
		isCompany
			? 'skip'
			: { projectId: scopeKey as Id<'projects'>, folderPath }
	) as { folders: DocFolder[] } | undefined;
	const folders = (isCompany ? companyContents : projectContents)?.folders ?? [];

	const projectNameById = useMemo(() => {
		const map = new Map<string, string>();
		for (const project of projects ?? []) {
			map.set(project._id, project.name);
		}
		return map;
	}, [projects]);

	const sectionLabel = (key: string) =>
		key === COMPANY_KEY
			? 'Company Documents'
			: (projectNameById.get(key) ?? 'Project');

	const currentLabel = `${sectionLabel(
		value.scope === 'company' ? COMPANY_KEY : value.projectId
	)} / ${folderLabel(value.folderPath)}`;

	const openSheet = () => {
		setScopeKey(value.scope === 'company' ? COMPANY_KEY : value.projectId);
		setFolderPath(value.folderPath);
		sheetRef.current?.present();
	};

	const selectSection = (key: string) => {
		setScopeKey(key);
		// Folder paths differ per section — reset to root.
		setFolderPath('');
	};

	const goUp = () => {
		const parts = folderPath.split('/');
		parts.pop();
		setFolderPath(parts.join('/'));
	};

	const confirm = () => {
		onChange(
			isCompany
				? { scope: 'company', folderPath }
				: { scope: 'project', projectId: scopeKey as Id<'projects'>, folderPath }
		);
		sheetRef.current?.dismiss();
	};

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

	return (
		<View className="gap-2">
			<View className="flex-row items-center gap-2">
				<View className="h-9 flex-1 flex-row items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3">
					<MapPin color={colors.mutedForeground} size={16} strokeWidth={2} />
					<Text
						className="flex-1 font-sans text-muted-foreground text-sm"
						numberOfLines={1}
					>
						{currentLabel}
					</Text>
				</View>
				<Button onPress={openSheet}>Change</Button>
			</View>

			<BottomSheetModal
				backdropComponent={renderBackdrop}
				backgroundStyle={{ backgroundColor: colors.card }}
				enableDynamicSizing
				handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
				maxDynamicContentSize={560}
				ref={sheetRef}
			>
				<BottomSheetView
					className="gap-3 px-4 pt-1"
					style={{ paddingBottom: insets.bottom + 16 }}
				>
					<Text className="font-sans-semibold text-base text-foreground">
						Choose location
					</Text>

					<ScrollView
						className="max-h-[44px] flex-none"
						contentContainerClassName="gap-2"
						horizontal
						showsHorizontalScrollIndicator={false}
					>
						<Chip
							label="Company Documents"
							onPress={() => selectSection(COMPANY_KEY)}
							selected={isCompany}
						/>
						{(projects ?? []).map((project) => (
							<Chip
								key={project._id}
								label={project.name}
								onPress={() => selectSection(project._id)}
								selected={scopeKey === project._id}
							/>
						))}
					</ScrollView>

					<View className="flex-row items-center gap-2">
						<Pressable
							accessibilityLabel="Go to root folder"
							accessibilityRole="button"
							className="h-8 w-8 items-center justify-center rounded-lg active:bg-muted"
							hitSlop={4}
							onPress={() => setFolderPath('')}
						>
							<Home
								color={folderPath ? colors.mutedForeground : colors.foreground}
								size={16}
								strokeWidth={2}
							/>
						</Pressable>
						{folderPath ? (
							<Pressable
								accessibilityLabel="Go up one folder"
								accessibilityRole="button"
								className="h-8 flex-row items-center gap-1 rounded-lg px-2 active:bg-muted"
								hitSlop={4}
								onPress={goUp}
							>
								<ChevronLeft
									color={colors.mutedForeground}
									size={16}
									strokeWidth={2}
								/>
								<Text
									className="font-sans-medium text-foreground text-sm"
									numberOfLines={1}
								>
									{folderPath.split('/').pop()}
								</Text>
							</Pressable>
						) : (
							<Text className="font-sans-medium text-muted-foreground text-sm">
								Home
							</Text>
						)}
					</View>

					<ScrollView className="max-h-[260px]">
						{folders.length === 0 ? (
							<Text className="py-3 font-sans text-muted-foreground text-sm">
								No subfolders here.
							</Text>
						) : null}
						{folders.map((folder) => (
							<PressableCard
								accessibilityLabel={`Open folder ${folder.name}`}
								className="mb-2 flex-row items-center gap-3 p-3"
								key={folder._id}
								onPress={() => setFolderPath(folder.path)}
							>
								<Folder
									color={colors.mutedForeground}
									size={18}
									strokeWidth={1.75}
								/>
								<Text className="flex-1 font-sans-medium text-foreground text-sm">
									{folder.name}
								</Text>
								<ChevronRight
									color={colors.mutedForeground}
									size={16}
									strokeWidth={2}
								/>
							</PressableCard>
						))}
					</ScrollView>

					<Button
						icon={
							<FolderInput color={colors.foreground} size={18} strokeWidth={2} />
						}
						onPress={confirm}
					>
						Select this location
					</Button>
				</BottomSheetView>
			</BottomSheetModal>
		</View>
	);
}
