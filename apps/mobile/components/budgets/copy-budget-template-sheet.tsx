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
import { useRouter } from 'expo-router';
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

const PERCENTAGE_PATTERN = /^\d+(\.\d+)?$/;

export interface CopyBudgetTemplatePayload {
	sourceBudgetTemplateId: Id<'budgetTemplates'>;
	title: string;
}

export interface CopyBudgetTemplateSheetHandle {
	present: (template: CopyBudgetTemplatePayload) => void;
}

export function CopyBudgetTemplateSheet({
	ref,
}: {
	ref?: Ref<CopyBudgetTemplateSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const sheetRef = useRef<BottomSheetModal>(null);

	const copyTemplate = useMutation(api.budgetTemplates.copy.copy);

	const [sourceId, setSourceId] = useState<Id<'budgetTemplates'> | null>(null);
	const [name, setName] = useState('');
	const [percentage, setPercentage] = useState('');
	const [saving, setSaving] = useState(false);

	useImperativeHandle(ref, () => ({
		present: (template) => {
			setSourceId(template.sourceBudgetTemplateId);
			setName(`${template.title} (Copy)`);
			setPercentage('');
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
			Alert.alert('Enter a name for the new template');
			return;
		}
		if (!sourceId) {
			return;
		}
		const trimmedPercentage = percentage.trim();
		let percentageIncrease = 0;
		if (trimmedPercentage.length > 0) {
			if (!PERCENTAGE_PATTERN.test(trimmedPercentage)) {
				Alert.alert(
					'Percentage is invalid',
					'Enter a positive number, e.g. 10 for a 10% increase.'
				);
				return;
			}
			percentageIncrease = Number(trimmedPercentage);
		}
		setSaving(true);
		try {
			const newId = await copyTemplate({
				sourceBudgetTemplateId: sourceId,
				title: trimmedName,
				percentageIncrease,
			});
			sheetRef.current?.dismiss();
			router.push({
				pathname: '/(app)/budgets/[budgetTemplateId]',
				params: { budgetTemplateId: newId },
			});
		} catch {
			Alert.alert('Could not copy template', 'Please try again.');
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
					Copy template
				</Text>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">Name</Text>
					<BottomSheetTextInput
						className="h-9 rounded-lg border border-border bg-card px-3 font-sans text-foreground text-sm"
						onChangeText={setName}
						placeholder="Template name"
						placeholderTextColor={colors.mutedForeground}
						value={name}
					/>
				</View>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						% increase (optional)
					</Text>
					<BottomSheetTextInput
						className="h-9 rounded-lg border border-border bg-card px-3 font-sans text-foreground text-sm"
						keyboardType="decimal-pad"
						onChangeText={setPercentage}
						placeholder="0"
						placeholderTextColor={colors.mutedForeground}
						value={percentage}
					/>
					<Text className="font-sans text-muted-foreground text-xs">
						Increase every trade price by this percentage. Leave blank for an
						exact copy.
					</Text>
				</View>

				<Button disabled={saving} loading={saving} onPress={handleSave}>
					Copy template
				</Button>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
