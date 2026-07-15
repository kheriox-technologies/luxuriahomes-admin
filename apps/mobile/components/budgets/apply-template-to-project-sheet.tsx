import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
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
import { Select, type SelectOption } from '@/components/ui/select';

export interface ApplyTemplateToProjectPayload {
	budgetTemplateId: Id<'budgetTemplates'>;
	title: string;
}

export interface ApplyTemplateToProjectSheetHandle {
	present: (template: ApplyTemplateToProjectPayload) => void;
}

export function ApplyTemplateToProjectSheet({
	ref,
}: {
	ref?: Ref<ApplyTemplateToProjectSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const projects = useQuery(api.projects.list.list, {}) as
		| Doc<'projects'>[]
		| undefined;
	const applyToProject = useMutation(
		api.budgetTemplates.applyToProject.applyToProject
	);

	const [budgetTemplateId, setBudgetTemplateId] =
		useState<Id<'budgetTemplates'> | null>(null);
	const [templateTitle, setTemplateTitle] = useState('');
	const [projectId, setProjectId] = useState('');
	const [saving, setSaving] = useState(false);

	const projectOptions = useMemo<SelectOption<string>[]>(
		() =>
			(projects ?? [])
				.slice()
				.sort((a, b) =>
					a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
				)
				.map((project) => ({ value: project._id, label: project.name })),
		[projects]
	);

	useImperativeHandle(ref, () => ({
		present: (template) => {
			setBudgetTemplateId(template.budgetTemplateId);
			setTemplateTitle(template.title);
			setProjectId('');
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

	const handleSave = async () => {
		if (!projectId) {
			Alert.alert('Select a project');
			return;
		}
		if (!budgetTemplateId) {
			return;
		}
		setSaving(true);
		try {
			await applyToProject({
				projectId: projectId as Id<'projects'>,
				budgetTemplateId,
			});
			sheetRef.current?.dismiss();
			Alert.alert('Template added to project');
		} catch {
			Alert.alert('Could not add to project', 'Please try again.');
		} finally {
			setSaving(false);
		}
	};

	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			backgroundStyle={{ backgroundColor: colors.card }}
			enableDynamicSizing
			handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
			keyboardBehavior="interactive"
			maxDynamicContentSize={420}
			ref={sheetRef}
		>
			<BottomSheetScrollView
				contentContainerClassName="gap-4 px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
			>
				<Text className="font-sans-semibold text-base text-foreground">
					Add to project
				</Text>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Project
					</Text>
					<Select
						onChange={setProjectId}
						options={projectOptions}
						placeholder={
							projects === undefined ? 'Loading…' : 'Select a project'
						}
						title="Select project"
						value={projectId}
					/>
					<Text className="font-sans text-muted-foreground text-xs">
						{`Adds every trade price from "${templateTitle}" to the selected project. Existing trade prices on the project are overwritten.`}
					</Text>
				</View>

				<Button
					disabled={saving || !projectId}
					loading={saving}
					onPress={handleSave}
				>
					Add to project
				</Button>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
