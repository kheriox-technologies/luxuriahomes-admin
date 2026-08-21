import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
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

export interface QuoteEntrySheetHandle {
	/** No initial text adds; text edits the row it came from. */
	present: (initialText?: string, id?: string) => void;
}

/**
 * A one-field sheet for the text rows that make up a template — an exclusion, a
 * note, a term clause, a section or stage name. The caller supplies the copy and
 * what to do with the value, so the same sheet serves every level of the
 * catalogue rather than each growing its own.
 */
export function QuoteEntrySheet({
	label,
	multiline = false,
	onSubmit,
	placeholder,
	ref,
	title,
}: {
	label: string;
	multiline?: boolean;
	onSubmit: (text: string, id?: string) => Promise<unknown>;
	placeholder?: string;
	ref?: Ref<QuoteEntrySheetHandle>;
	title: string;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const [editingId, setEditingId] = useState<string | undefined>(undefined);
	const [text, setText] = useState('');
	const [showErrors, setShowErrors] = useState(false);
	const [saving, setSaving] = useState(false);

	useImperativeHandle(ref, () => ({
		present: (initialText, id) => {
			setEditingId(id);
			setText(initialText ?? '');
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
		const trimmed = text.trim();
		if (!trimmed) {
			setShowErrors(true);
			return;
		}
		setSaving(true);
		try {
			await onSubmit(trimmed, editingId);
			sheetRef.current?.dismiss();
		} catch (error) {
			Alert.alert(
				`Could not save ${label.toLowerCase()}`,
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
			stackBehavior="push"
		>
			<BottomSheetScrollView
				className="px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16, gap: 12 }}
				keyboardShouldPersistTaps="handled"
			>
				<BottomSheetInputProvider>
					<Text className="px-1 font-sans-semibold text-base text-foreground">
						{editingId ? `Edit ${title.toLowerCase()}` : title}
					</Text>
					<TextField
						error={
							showErrors && !text.trim()
								? `Enter the ${label.toLowerCase()}`
								: ''
						}
						label={label}
						multiline={multiline}
						onChangeText={setText}
						placeholder={placeholder}
						value={text}
					/>
					<Button
						className="mt-1"
						disabled={saving}
						loading={saving}
						onPress={handleSave}
					>
						{editingId ? 'Save changes' : 'Add'}
					</Button>
				</BottomSheetInputProvider>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
