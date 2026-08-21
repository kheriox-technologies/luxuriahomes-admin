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

const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

export interface SpecialInclusionPayload {
	amount: number | null;
	inclusionId: Id<'quotationSpecialInclusions'>;
	text: string;
}

export interface SpecialInclusionSheetHandle {
	/** No payload adds; a payload edits the row given. */
	present: (inclusion?: SpecialInclusionPayload) => void;
}

export function SpecialInclusionSheet({
	ref,
}: {
	ref?: Ref<SpecialInclusionSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const addInclusion = useMutation(api.quotationSpecialInclusions.add.add);
	const updateInclusion = useMutation(
		api.quotationSpecialInclusions.update.update
	);

	const [editingId, setEditingId] =
		useState<Id<'quotationSpecialInclusions'> | null>(null);
	const [text, setText] = useState('');
	const [amount, setAmount] = useState('');
	const [showErrors, setShowErrors] = useState(false);
	const [saving, setSaving] = useState(false);

	useImperativeHandle(ref, () => ({
		present: (inclusion) => {
			setEditingId(inclusion?.inclusionId ?? null);
			setText(inclusion?.text ?? '');
			setAmount(
				inclusion?.amount === null || inclusion?.amount === undefined
					? ''
					: String(inclusion.amount)
			);
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

	const trimmedAmount = amount.trim();
	const amountInvalid =
		trimmedAmount !== '' && !MONEY_PATTERN.test(trimmedAmount);

	const handleSave = async () => {
		const trimmedText = text.trim();
		if (!trimmedText || amountInvalid) {
			setShowErrors(true);
			return;
		}
		setSaving(true);
		try {
			if (editingId) {
				await updateInclusion({
					inclusionId: editingId,
					text: trimmedText,
					// `null` clears the price; omitting it would leave the old one.
					amount: trimmedAmount === '' ? null : Number(trimmedAmount),
				});
			} else {
				await addInclusion({
					text: trimmedText,
					amount: trimmedAmount === '' ? undefined : Number(trimmedAmount),
				});
			}
			sheetRef.current?.dismiss();
		} catch (error) {
			Alert.alert(
				'Could not save inclusion',
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
						{editingId ? 'Edit special inclusion' : 'Add special inclusion'}
					</Text>
					<TextField
						error={showErrors && !text.trim() ? 'Enter the inclusion' : ''}
						label="Inclusion"
						onChangeText={setText}
						placeholder="e.g. Upgraded kitchen benchtop"
						value={text}
					/>
					<TextField
						error={showErrors && amountInvalid ? 'Enter a valid amount' : ''}
						keyboardType="decimal-pad"
						label="Amount"
						onChangeText={setAmount}
						placeholder="Optional"
						value={amount}
					/>
					<Text className="px-1 font-sans text-muted-foreground text-xs">
						The amount is added to the contract total for your reference — it is
						never printed on the client's quotation.
					</Text>
					<Button
						className="mt-1"
						disabled={saving}
						loading={saving}
						onPress={handleSave}
					>
						{editingId ? 'Save changes' : 'Add inclusion'}
					</Button>
				</BottomSheetInputProvider>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
