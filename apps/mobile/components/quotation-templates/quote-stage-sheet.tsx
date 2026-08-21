import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
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
import { Alert, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { BottomSheetInputProvider } from '@/components/ui/bottom-sheet-input-context';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { convexErrorMessage } from '@/lib/project-form';

const PERCENT_PATTERN = /^\d{1,3}(\.\d{1,2})?$/;
const MAX_SCOPE_SUMMARY = 160;

export interface QuoteStagePayload {
	defaultPercent: number | null;
	name: string;
	scopeSummary: string | null;
	stageId: Id<'quoteStages'>;
}

export interface QuoteStageSheetHandle {
	/** No payload adds a stage; a payload edits the one given. */
	present: (stage?: QuoteStagePayload) => void;
}

/**
 * A stage carries more than a name: the share of the contract sum it claims by
 * default, and the one-line scope that prints under its heading. Both seed a
 * new quotation, so they belong with the stage rather than on the quotation.
 */
export function QuoteStageSheet({
	ref,
	templateId,
}: {
	ref?: Ref<QuoteStageSheetHandle>;
	templateId: Id<'quoteTemplates'>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const addStage = useMutation(api.quoteStages.add.add);
	const updateStage = useMutation(api.quoteStages.update.update);

	const [editingId, setEditingId] = useState<Id<'quoteStages'> | null>(null);
	const [name, setName] = useState('');
	const [percent, setPercent] = useState('');
	const [scopeSummary, setScopeSummary] = useState('');
	const [showErrors, setShowErrors] = useState(false);
	const [saving, setSaving] = useState(false);

	useImperativeHandle(ref, () => ({
		present: (stage) => {
			setEditingId(stage?.stageId ?? null);
			setName(stage?.name ?? '');
			setPercent(
				stage?.defaultPercent === null || stage?.defaultPercent === undefined
					? ''
					: String(stage.defaultPercent)
			);
			setScopeSummary(stage?.scopeSummary ?? '');
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

	const trimmedPercent = percent.trim();
	const percentInvalid =
		trimmedPercent !== '' &&
		(!PERCENT_PATTERN.test(trimmedPercent) || Number(trimmedPercent) > 100);
	const scopeTooLong = scopeSummary.trim().length > MAX_SCOPE_SUMMARY;

	const handleSave = async () => {
		const trimmedName = name.trim();
		if (!trimmedName || percentInvalid || scopeTooLong) {
			setShowErrors(true);
			return;
		}
		const defaultPercent =
			trimmedPercent === '' ? undefined : Number(trimmedPercent);
		const summary = scopeSummary.trim() || undefined;
		setSaving(true);
		try {
			if (editingId) {
				await updateStage({
					stageId: editingId,
					name: trimmedName,
					defaultPercent,
					scopeSummary: summary,
				});
			} else {
				await addStage({
					templateId,
					name: trimmedName,
					defaultPercent,
					scopeSummary: summary,
				});
			}
			sheetRef.current?.dismiss();
		} catch (error) {
			Alert.alert(
				'Could not save stage',
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
			maxDynamicContentSize={560}
			ref={sheetRef}
			stackBehavior="push"
		>
			<BottomSheetScrollView
				className="px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16, gap: 12 }}
				keyboardShouldPersistTaps="handled"
			>
				<BottomSheetInputProvider>
					<Text className="px-1 font-sans-semibold text-base text-foreground">
						{editingId ? 'Edit stage' : 'Add stage'}
					</Text>
					<TextField
						error={showErrors && !name.trim() ? 'Enter a stage name' : ''}
						label="Name"
						onChangeText={setName}
						placeholder="e.g. Base"
						value={name}
					/>
					<TextField
						error={
							showErrors && percentInvalid
								? 'Enter a percentage between 0 and 100'
								: ''
						}
						keyboardType="decimal-pad"
						label="Progress payment %"
						onChangeText={setPercent}
						placeholder="e.g. 15"
						value={percent}
					/>
					<TextField
						error={
							showErrors && scopeTooLong
								? `Keep the scope under ${MAX_SCOPE_SUMMARY} characters`
								: ''
						}
						label="Scope of works"
						multiline
						onChangeText={setScopeSummary}
						placeholder="One line describing what this stage covers"
						value={scopeSummary}
					/>
					<Button
						className="mt-1"
						disabled={saving}
						loading={saving}
						onPress={handleSave}
					>
						{editingId ? 'Save changes' : 'Add stage'}
					</Button>
				</BottomSheetInputProvider>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
