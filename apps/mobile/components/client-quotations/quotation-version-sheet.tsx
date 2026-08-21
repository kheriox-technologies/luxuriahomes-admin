import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { Check } from 'lucide-react-native';
import {
	type Ref,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { BottomSheetInputProvider } from '@/components/ui/bottom-sheet-input-context';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { MAX_VERSION_DESCRIPTION_LENGTH } from '@/lib/client-quotation-form';
import { brand } from '@/lib/theme';

export interface QuotationVersionSheetHandle {
	present: () => void;
}

/**
 * A revision has to be described before it is saved — the description is what
 * the history and the trail printed on page 2 both read.
 */
export function QuotationVersionSheet({
	amending,
	initialDescription,
	onConfirm,
	recipients,
	ref,
	reopening,
	saving,
	version,
}: {
	amending: boolean;
	initialDescription: string;
	onConfirm: (description: string, emailClients: boolean) => void;
	recipients: string[];
	ref?: Ref<QuotationVersionSheetHandle>;
	reopening: boolean;
	saving: boolean;
	version: number;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const [description, setDescription] = useState('');
	const [emailClients, setEmailClients] = useState(false);
	const [showErrors, setShowErrors] = useState(false);

	useImperativeHandle(ref, () => ({
		present: () => {
			setDescription(initialDescription);
			setEmailClients(false);
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

	const trimmed = description.trim();
	const tooLong = trimmed.length > MAX_VERSION_DESCRIPTION_LENGTH;

	const handleConfirm = () => {
		if (!trimmed || tooLong) {
			setShowErrors(true);
			return;
		}
		sheetRef.current?.dismiss();
		onConfirm(trimmed, emailClients);
	};

	let descriptionError = '';
	if (showErrors && !trimmed) {
		descriptionError = 'Describe what changed in this version';
	} else if (showErrors && tooLong) {
		descriptionError = `Keep it under ${MAX_VERSION_DESCRIPTION_LENGTH} characters`;
	}

	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			backgroundStyle={{ backgroundColor: colors.card }}
			enableDynamicSizing
			handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
			keyboardBehavior="interactive"
			maxDynamicContentSize={520}
			ref={sheetRef}
		>
			<BottomSheetScrollView
				className="px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16, gap: 12 }}
				keyboardShouldPersistTaps="handled"
			>
				<BottomSheetInputProvider>
					<Text className="px-1 font-sans-semibold text-base text-foreground">
						{amending ? `Update version ${version}` : `Save version ${version}`}
					</Text>

					{reopening ? (
						<Text className="px-1 font-sans text-destructive text-xs">
							This quotation has already been agreed. Saving a new version sends
							it back for approval and voids any signatures collected against
							the current one.
						</Text>
					) : null}

					<TextField
						error={descriptionError}
						label="What changed"
						multiline
						onChangeText={setDescription}
						placeholder="e.g. Revised kitchen scope"
						value={description}
					/>

					{recipients.length > 0 ? (
						<Pressable
							accessibilityLabel="Email this version to the clients"
							accessibilityRole="checkbox"
							accessibilityState={{ checked: emailClients }}
							className="flex-row items-center gap-3 rounded-lg border border-border p-3"
							onPress={() => setEmailClients((current) => !current)}
						>
							<View
								className={
									emailClients
										? 'h-5 w-5 items-center justify-center rounded border border-primary bg-primary'
										: 'h-5 w-5 items-center justify-center rounded border border-border'
								}
							>
								{emailClients ? (
									<Check color={brand.linen} size={14} strokeWidth={3} />
								) : null}
							</View>
							<Text className="flex-1 font-sans text-foreground text-sm">
								{`Email version ${version} to ${recipients.join(', ')}`}
							</Text>
						</Pressable>
					) : null}

					<Button
						className="mt-1"
						disabled={saving}
						loading={saving}
						onPress={handleConfirm}
					>
						{amending ? `Update version ${version}` : `Save version ${version}`}
					</Button>
				</BottomSheetInputProvider>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
