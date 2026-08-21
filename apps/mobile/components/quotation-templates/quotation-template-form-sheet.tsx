import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation } from 'convex/react';
import { useRouter } from 'expo-router';
import {
	type Ref,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { Alert, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { BottomSheetInputProvider } from '@/components/ui/bottom-sheet-input-context';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { convexErrorMessage } from '@/lib/project-form';

/**
 * What the sheet was opened to do. Add, edit and duplicate all collect the same
 * two fields, so they share one sheet rather than three near-identical ones —
 * the portal does the same with `quotation-template-dialog.tsx`.
 */
type Mode = 'add' | 'duplicate' | 'edit';

export interface QuotationTemplateFormPayload {
	description: string | null;
	name: string;
	templateId: Id<'quoteTemplates'>;
}

export interface QuotationTemplateFormSheetHandle {
	/** No payload creates; a payload edits or duplicates the template given. */
	present: (mode: Mode, template?: QuotationTemplateFormPayload) => void;
}

const TITLES: Record<Mode, string> = {
	add: 'Add template',
	duplicate: 'Duplicate template',
	edit: 'Edit template',
};

const ACTIONS: Record<Mode, string> = {
	add: 'Add template',
	duplicate: 'Duplicate',
	edit: 'Save changes',
};

export function QuotationTemplateFormSheet({
	ref,
}: {
	ref?: Ref<QuotationTemplateFormSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const sheetRef = useRef<BottomSheetModal>(null);

	const addTemplate = useMutation(api.quoteTemplates.add.add);
	const updateTemplate = useMutation(api.quoteTemplates.update.update);
	const copyTemplate = useMutation(api.quoteTemplates.copy.copy);

	const [mode, setMode] = useState<Mode>('add');
	const [sourceId, setSourceId] = useState<Id<'quoteTemplates'> | null>(null);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [showErrors, setShowErrors] = useState(false);
	const [saving, setSaving] = useState(false);

	useImperativeHandle(ref, () => ({
		present: (nextMode, template) => {
			setMode(nextMode);
			setSourceId(template?.templateId ?? null);
			// A duplicate opens on a distinct name so it can be saved straight away
			// without colliding with the template it came from.
			setName(
				nextMode === 'duplicate' && template
					? `${template.name} (copy)`
					: (template?.name ?? '')
			);
			setDescription(template?.description ?? '');
			setShowErrors(false);
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
		const trimmedName = name.trim();
		if (!trimmedName) {
			setShowErrors(true);
			return;
		}
		const trimmedDescription = description.trim() || undefined;
		setSaving(true);
		try {
			if (mode === 'edit' && sourceId) {
				await updateTemplate({
					templateId: sourceId,
					name: trimmedName,
					description: trimmedDescription,
				});
			} else if (mode === 'duplicate' && sourceId) {
				const templateId = await copyTemplate({
					sourceTemplateId: sourceId,
					name: trimmedName,
					description: trimmedDescription,
				});
				sheetRef.current?.dismiss();
				// Straight into the copy — it is the thing the user wants to edit.
				router.push({
					pathname: '/(app)/quotation-templates/[templateId]/items',
					params: { templateId },
				});
				return;
			} else {
				await addTemplate({
					name: trimmedName,
					description: trimmedDescription,
				});
			}
			sheetRef.current?.dismiss();
		} catch (error) {
			Alert.alert(
				'Could not save template',
				convexErrorMessage(error, 'Please try again.')
			);
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
				className="px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16, gap: 12 }}
				keyboardShouldPersistTaps="handled"
			>
				<BottomSheetInputProvider>
					<Text className="px-1 font-sans-semibold text-base text-foreground">
						{TITLES[mode]}
					</Text>
					<TextField
						error={showErrors && !name.trim() ? 'Enter a template name' : ''}
						label="Name"
						onChangeText={setName}
						placeholder="e.g. Standard two-storey"
						value={name}
					/>
					<TextField
						label="Description"
						onChangeText={setDescription}
						placeholder="Optional"
						value={description}
					/>
					<Button
						className="mt-1"
						disabled={saving}
						loading={saving}
						onPress={handleSave}
					>
						{ACTIONS[mode]}
					</Button>
				</BottomSheetInputProvider>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
