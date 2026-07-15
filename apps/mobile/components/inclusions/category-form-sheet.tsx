import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useMutation } from 'convex/react';
import { Check } from 'lucide-react-native';
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
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';

type InclusionCategory = Doc<'inclusionCategories'>;

const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

export interface CategoryFormSheetHandle {
	present: (category: InclusionCategory) => void;
}

function parseOptionalMoney(raw: string): number | undefined {
	const trimmed = raw.trim();
	if (trimmed === '') {
		return undefined;
	}
	return Number(trimmed);
}

/**
 * Edit inclusion category bottom sheet. `present(category)` opens with fields
 * pre-filled. Mirrors the portal Edit category form (name, code, base allowance,
 * labour allowance).
 */
export function CategoryFormSheet({
	ref,
}: {
	ref?: Ref<CategoryFormSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const updateCategory = useMutation(api.inclusionCategories.update.update);

	const [categoryId, setCategoryId] =
		useState<Id<'inclusionCategories'> | null>(null);
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [allowance, setAllowance] = useState('');
	const [labourAllowance, setLabourAllowance] = useState('');
	const [saving, setSaving] = useState(false);
	const [showErrors, setShowErrors] = useState(false);

	useImperativeHandle(ref, () => ({
		present: (category) => {
			setCategoryId(category._id);
			setName(category.name);
			setCode(category.code);
			setAllowance(
				category.allowance === undefined ? '' : String(category.allowance)
			);
			setLabourAllowance(
				category.labourAllowance === undefined
					? ''
					: String(category.labourAllowance)
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

	const priceInvalid = (raw: string) =>
		raw.trim() !== '' && !MONEY_PATTERN.test(raw.trim());

	const handleSave = async () => {
		const trimmedName = name.trim();
		const trimmedCode = code.trim();
		if (
			!categoryId ||
			trimmedName === '' ||
			trimmedCode === '' ||
			priceInvalid(allowance) ||
			priceInvalid(labourAllowance)
		) {
			setShowErrors(true);
			return;
		}
		setSaving(true);
		try {
			await updateCategory({
				categoryId,
				name: trimmedName,
				code: trimmedCode,
				allowance: parseOptionalMoney(allowance),
				labourAllowance: parseOptionalMoney(labourAllowance),
			});
			sheetRef.current?.dismiss();
		} catch {
			Alert.alert('Could not update category', 'Please try again.');
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
			maxDynamicContentSize={640}
			ref={sheetRef}
		>
			<BottomSheetScrollView
				className="px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16, gap: 12 }}
				keyboardShouldPersistTaps="handled"
			>
				<Text className="px-1 font-sans-semibold text-base text-foreground">
					Edit category
				</Text>

				<TextField
					error={
						showErrors && name.trim() === '' ? 'Name is required' : undefined
					}
					label="Name"
					onChangeText={setName}
					placeholder="Category name"
					value={name}
				/>

				<TextField
					autoCapitalize="characters"
					error={
						showErrors && code.trim() === '' ? 'Code is required' : undefined
					}
					label="Code"
					onChangeText={setCode}
					placeholder="e.g. TIL"
					value={code}
				/>

				<TextField
					error={
						showErrors && priceInvalid(allowance)
							? 'Enter a valid amount (up to 2 decimals)'
							: undefined
					}
					keyboardType="decimal-pad"
					label="Base allowance (AUD, optional)"
					onChangeText={setAllowance}
					placeholder="0.00"
					value={allowance}
				/>

				<TextField
					error={
						showErrors && priceInvalid(labourAllowance)
							? 'Enter a valid amount (up to 2 decimals)'
							: undefined
					}
					keyboardType="decimal-pad"
					label="Labour allowance (AUD, optional)"
					onChangeText={setLabourAllowance}
					placeholder="0.00"
					value={labourAllowance}
				/>

				<Button
					className="mt-1"
					icon={<Check color={colors.foreground} size={18} strokeWidth={2} />}
					loading={saving}
					onPress={handleSave}
				>
					Save changes
				</Button>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
