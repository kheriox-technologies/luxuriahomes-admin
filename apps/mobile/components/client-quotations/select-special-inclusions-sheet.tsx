import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import { useQuery } from 'convex/react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/format';
import { brand } from '@/lib/theme';

export interface SelectSpecialInclusionsSheetHandle {
	present: () => void;
}

/**
 * Picks from the standard special-inclusions list into this quotation.
 *
 * The rows are copied by value — nothing is linked — so editing the standard
 * list afterwards never reaches a quotation that already carries one.
 */
export function SelectSpecialInclusionsSheet({
	onConfirm,
	ref,
}: {
	onConfirm: (entries: { amount?: number; text: string }[]) => void;
	ref?: Ref<SelectSpecialInclusionsSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);
	const inclusions = useQuery(api.quotationSpecialInclusions.list.list, {});

	const [picked, setPicked] = useState<Set<string>>(new Set());

	useImperativeHandle(ref, () => ({
		present: () => {
			setPicked(new Set());
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

	const toggle = (id: string) =>
		setPicked((current) => {
			const next = new Set(current);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});

	const confirm = () => {
		const entries = (inclusions ?? [])
			.filter((row) => picked.has(row._id))
			.map((row) => ({ text: row.text, amount: row.amount }));
		sheetRef.current?.dismiss();
		onConfirm(entries);
	};

	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			backgroundStyle={{ backgroundColor: colors.card }}
			enableDynamicSizing
			handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
			maxDynamicContentSize={600}
			ref={sheetRef}
			stackBehavior="push"
		>
			<BottomSheetScrollView
				className="px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16, gap: 8 }}
			>
				<Text className="px-1 pb-1 font-sans-semibold text-base text-foreground">
					Add from standard list
				</Text>
				{inclusions?.length === 0 ? (
					<Text className="px-1 font-sans text-muted-foreground text-xs">
						The standard list is empty. Add to it from the Quotation Templates
						screen.
					</Text>
				) : null}
				{inclusions?.map((row) => {
					const selected = picked.has(row._id);
					return (
						<Pressable
							accessibilityLabel={row.text}
							accessibilityRole="checkbox"
							accessibilityState={{ checked: selected }}
							className="flex-row items-center gap-3 rounded-lg border border-border p-3 active:bg-muted"
							key={row._id}
							onPress={() => toggle(row._id)}
						>
							<View
								className={
									selected
										? 'h-5 w-5 items-center justify-center rounded border border-primary bg-primary'
										: 'h-5 w-5 items-center justify-center rounded border border-border'
								}
							>
								{selected ? (
									<Check color={brand.linen} size={14} strokeWidth={3} />
								) : null}
							</View>
							<Text className="flex-1 font-sans text-foreground text-sm">
								{row.text}
							</Text>
							{row.amount === undefined ? null : (
								<Badge variant="purple">{formatCurrency(row.amount)}</Badge>
							)}
						</Pressable>
					);
				})}
				<Button className="mt-1" disabled={picked.size === 0} onPress={confirm}>
					{picked.size === 0
						? 'Add to quotation'
						: `Add ${picked.size} to quotation`}
				</Button>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
