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
import { Alert, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategorySelectField } from '@/components/inclusions/category-select-field';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';

type Inclusion = Doc<'inclusions'>;

const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

export interface InclusionFormSheetHandle {
	present: (
		inclusion?: Inclusion,
		presetCategoryId?: Id<'inclusionCategories'>
	) => void;
}

function parseOptionalMoney(raw: string): number | undefined {
	const trimmed = raw.trim();
	if (trimmed === '') {
		return undefined;
	}
	return Number(trimmed);
}

/**
 * Add / Edit inclusion bottom sheet. `present()` opens in create mode,
 * `present(undefined, categoryId)` opens in create mode with the category
 * preset, and `present(inclusion)` opens in edit mode with fields pre-filled.
 * Mirrors the portal Add/Edit inclusion forms (title, category, base + labour
 * price). Measurement unit is set in the web portal and preserved untouched on
 * edit.
 */
export function InclusionFormSheet({
	ref,
}: {
	ref?: Ref<InclusionFormSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const addInclusion = useMutation(api.inclusions.add.add);
	const updateInclusion = useMutation(api.inclusions.update.update);

	const [editingId, setEditingId] = useState<Id<'inclusions'> | null>(null);
	const [title, setTitle] = useState('');
	const [categoryId, setCategoryId] = useState<Id<'inclusionCategories'> | ''>(
		''
	);
	const [standardPrice, setStandardPrice] = useState('');
	const [standardLabourPrice, setStandardLabourPrice] = useState('');
	const [measurementUnit, setMeasurementUnit] = useState<
		Id<'units'> | undefined
	>(undefined);
	const [saving, setSaving] = useState(false);
	const [showErrors, setShowErrors] = useState(false);

	useImperativeHandle(ref, () => ({
		present: (inclusion, presetCategoryId) => {
			setEditingId(inclusion?._id ?? null);
			setTitle(inclusion?.title ?? '');
			setCategoryId(inclusion?.categoryId ?? presetCategoryId ?? '');
			setStandardPrice(
				inclusion?.standardPrice === undefined
					? ''
					: String(inclusion.standardPrice)
			);
			setStandardLabourPrice(
				inclusion?.standardLabourPrice === undefined
					? ''
					: String(inclusion.standardLabourPrice)
			);
			setMeasurementUnit(inclusion?.measurementUnit);
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
		const trimmedTitle = title.trim();
		if (
			trimmedTitle === '' ||
			categoryId === '' ||
			priceInvalid(standardPrice) ||
			priceInvalid(standardLabourPrice)
		) {
			setShowErrors(true);
			return;
		}
		setSaving(true);
		try {
			if (editingId) {
				await updateInclusion({
					inclusionId: editingId,
					title: trimmedTitle,
					categoryId,
					standardPrice: parseOptionalMoney(standardPrice),
					standardLabourPrice: parseOptionalMoney(standardLabourPrice),
					measurementUnit,
				});
			} else {
				await addInclusion({
					title: trimmedTitle,
					categoryId,
					standardPrice: parseOptionalMoney(standardPrice),
					standardLabourPrice: parseOptionalMoney(standardLabourPrice),
				});
			}
			sheetRef.current?.dismiss();
		} catch {
			Alert.alert(
				editingId ? 'Could not update inclusion' : 'Could not add inclusion',
				'Please try again.'
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
			maxDynamicContentSize={640}
			ref={sheetRef}
		>
			<BottomSheetScrollView
				className="px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16, gap: 12 }}
				keyboardShouldPersistTaps="handled"
			>
				<Text className="px-1 font-sans-semibold text-base text-foreground">
					{editingId ? 'Edit inclusion' : 'Add inclusion'}
				</Text>

				<TextField
					error={
						showErrors && title.trim() === '' ? 'Title is required' : undefined
					}
					label="Title"
					onChangeText={setTitle}
					placeholder="Inclusion title"
					value={title}
				/>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Category
					</Text>
					<CategorySelectField
						allowCreate
						invalid={showErrors && categoryId === ''}
						onValueChange={setCategoryId}
						value={categoryId}
					/>
					{showErrors && categoryId === '' ? (
						<Text className="font-sans text-destructive text-xs">
							A category is required
						</Text>
					) : null}
				</View>

				<TextField
					error={
						showErrors && priceInvalid(standardPrice)
							? 'Enter a valid amount (up to 2 decimals)'
							: undefined
					}
					keyboardType="decimal-pad"
					label="Base price (AUD, optional)"
					onChangeText={setStandardPrice}
					placeholder="0.00"
					value={standardPrice}
				/>

				<TextField
					error={
						showErrors && priceInvalid(standardLabourPrice)
							? 'Enter a valid amount (up to 2 decimals)'
							: undefined
					}
					keyboardType="decimal-pad"
					label="Labour price (AUD, optional)"
					onChangeText={setStandardLabourPrice}
					placeholder="0.00"
					value={standardLabourPrice}
				/>

				<Button
					className="mt-1"
					icon={<Check color={colors.foreground} size={18} strokeWidth={2} />}
					loading={saving}
					onPress={handleSave}
				>
					{editingId ? 'Save changes' : 'Save inclusion'}
				</Button>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
