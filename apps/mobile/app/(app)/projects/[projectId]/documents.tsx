import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useAction, useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import {
	ChevronRight,
	File,
	FileImage,
	FileText,
	Folder,
	FolderOpen,
	Home,
} from 'lucide-react-native';
import { useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Pressable,
	ScrollView,
	Text,
	View,
} from 'react-native';
import { useThemeColors } from '@/components/theme';
import { PressableCard } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/format';

type ProjectDocument = Doc<'projectDocuments'>;
type ProjectFolder = Doc<'projectDocumentFolders'>;

const KILOBYTE = 1024;

function formatSize(bytes: number | undefined): string {
	if (!bytes) {
		return '';
	}
	if (bytes < KILOBYTE * KILOBYTE) {
		return `${Math.round(bytes / KILOBYTE)} KB`;
	}
	return `${(bytes / (KILOBYTE * KILOBYTE)).toFixed(1)} MB`;
}

function fileIcon(mimeType: string | undefined) {
	if (mimeType?.startsWith('image/')) {
		return FileImage;
	}
	if (mimeType === 'application/pdf') {
		return FileText;
	}
	return File;
}

export default function DocumentsScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	const [folderPath, setFolderPath] = useState('');
	const [openingId, setOpeningId] = useState<string | null>(null);
	const colors = useThemeColors();

	const contents = useQuery(api.projectDocuments.listContents.listContents, {
		projectId: projectId as Id<'projects'>,
		folderPath,
	});
	const signUrl = useAction(api.cdn.signUrl.signUrl);

	const openDocument = async (document: ProjectDocument) => {
		setOpeningId(document._id);
		try {
			const url = await signUrl({ s3Key: document.s3Key });
			await openBrowserAsync(url);
		} catch {
			Alert.alert(
				'Unable to open document',
				'Check that CDN signing is configured on the Convex deployment.'
			);
		} finally {
			setOpeningId(null);
		}
	};

	if (contents === undefined) {
		return <ListSkeleton />;
	}

	const { folders, documents } = contents as {
		folders: ProjectFolder[];
		documents: ProjectDocument[];
	};
	const isEmpty = folders.length === 0 && documents.length === 0;
	const crumbs = folderPath ? folderPath.split('/') : [];

	return (
		<View className="flex-1">
			<ScrollView
				className="max-h-[40px] flex-none"
				contentContainerClassName="items-center gap-1 px-4 pb-2"
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				<Pressable
					accessibilityLabel="Go to root folder"
					accessibilityRole="button"
					className="h-8 w-8 items-center justify-center rounded-full active:bg-muted"
					hitSlop={4}
					onPress={() => setFolderPath('')}
				>
					<Home
						color={folderPath ? colors.mutedForeground : colors.foreground}
						size={16}
						strokeWidth={2}
					/>
				</Pressable>
				{crumbs.map((crumb, index) => {
					const path = crumbs.slice(0, index + 1).join('/');
					const isLast = index === crumbs.length - 1;
					return (
						<View className="flex-row items-center gap-1" key={path}>
							<ChevronRight
								color={colors.mutedForeground}
								size={14}
								strokeWidth={2}
							/>
							<Pressable
								accessibilityLabel={`Go to folder ${crumb}`}
								accessibilityRole="button"
								className="min-h-[32px] justify-center rounded-md px-1.5 active:bg-muted"
								disabled={isLast}
								onPress={() => setFolderPath(path)}
							>
								<Text
									className={
										isLast
											? 'font-sans-semibold text-foreground text-sm'
											: 'font-sans text-muted-foreground text-sm'
									}
								>
									{crumb}
								</Text>
							</Pressable>
						</View>
					);
				})}
			</ScrollView>

			<ScrollView className="flex-1" contentContainerClassName="pb-6">
				{isEmpty ? (
					<EmptyState
						description="Files uploaded in the web portal will appear here."
						icon={FolderOpen}
						title="Empty folder"
					/>
				) : null}

				{folders.map((folder) => (
					<PressableCard
						accessibilityLabel={`Open folder ${folder.name}`}
						className="mx-4 mb-2 flex-row items-center gap-3 p-3.5"
						key={folder._id}
						onPress={() => setFolderPath(folder.path)}
					>
						<Folder
							color={colors.mutedForeground}
							size={20}
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

				{documents.map((document) => {
					const Icon = fileIcon(document.mimeType);
					const isOpening = openingId === document._id;
					return (
						<PressableCard
							accessibilityLabel={`Open document ${document.name}`}
							className="mx-4 mb-2 flex-row items-center gap-3 p-3.5"
							disabled={isOpening}
							key={document._id}
							onPress={() => openDocument(document)}
						>
							<Icon
								color={colors.mutedForeground}
								size={20}
								strokeWidth={1.75}
							/>
							<View className="flex-1">
								<Text
									className="font-sans-medium text-foreground text-sm"
									numberOfLines={1}
								>
									{document.name}
								</Text>
								<Text className="font-sans text-muted-foreground text-xs">
									{formatDate(document.uploadedAt)}
									{document.size ? ` · ${formatSize(document.size)}` : ''}
								</Text>
							</View>
							{isOpening ? (
								<ActivityIndicator
									color={colors.mutedForeground}
									size="small"
								/>
							) : null}
						</PressableCard>
					);
				})}
			</ScrollView>
		</View>
	);
}
