import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation } from 'convex/react';
import {
	type Ref,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { Alert, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';

export interface BudgetTemplateFormPayload {
	budgetTemplateId: Id<'budgetTemplates'>;
	description: string | null;
	title: string;
}

export interface BudgetTemplateFormSheetHandle {
	// Present with no payload to create, or with a payload to edit.
	present: (template?: BudgetTemplateFormPayload) => void;
}

export function BudgetTemplateFormSheet({
	ref,
}: {
	ref?: Ref<BudgetTemplateFormSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const addTemplate = useMutation(api.budgetTemplates.add.add);
	const updateTemplate = useMutation(api.budgetTemplates.update.update);

	const [editingId, setEditingId] = useState<Id<'budgetTemplates'> | null>(
		null
	);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [saving, setSaving] = useState(false);

	useImperativeHandle(ref, () => ({
		present: (template) => {
			setEditingId(template?.budgetTemplateId ?? null);
			setTitle(template?.title ?? '');
			setDescription(template?.description ?? '');
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
		const trimmedTitle = title.trim();
		if (!trimmedTitle) {
			Alert.alert('Enter a template title');
			return;
		}
		const trimmedDescription = description.trim() || undefined;
		setSaving(true);
		try {
			if (editingId) {
				await updateTemplate({
					budgetTemplateId: editingId,
					title: trimmedTitle,
					description: trimmedDescription,
				});
			} else {
				await addTemplate({
					title: trimmedTitle,
					description: trimmedDescription,
				});
			}
			sheetRef.current?.dismiss();
		} catch {
			Alert.alert('Could not save template', 'Please try again.');
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
			maxDynamicContentSize={480}
			ref={sheetRef}
		>
			<BottomSheetScrollView
				contentContainerClassName="gap-4 px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
			>
				<Text className="font-sans-semibold text-base text-foreground">
					{editingId ? 'Edit template' : 'Add template'}
				</Text>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Title
					</Text>
					<BottomSheetTextInput
						className="h-9 rounded-lg border border-border bg-card px-3 font-sans text-foreground text-sm"
						onChangeText={setTitle}
						placeholder="Template title"
						placeholderTextColor={colors.mutedForeground}
						value={title}
					/>
				</View>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Description
					</Text>
					<BottomSheetTextInput
						className="min-h-[72px] rounded-lg border border-border bg-card px-3 py-2 font-sans text-foreground text-sm"
						multiline
						onChangeText={setDescription}
						placeholder="Optional"
						placeholderTextColor={colors.mutedForeground}
						textAlignVertical="top"
						value={description}
					/>
				</View>

				<Button disabled={saving} loading={saving} onPress={handleSave}>
					{editingId ? 'Save' : 'Add template'}
				</Button>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
