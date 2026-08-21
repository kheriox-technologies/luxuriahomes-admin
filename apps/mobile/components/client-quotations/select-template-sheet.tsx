import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import { type Ref, useCallback, useImperativeHandle, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';

export interface SelectTemplateSheetHandle {
	present: () => void;
}

/**
 * Which template a new quotation is built from.
 *
 * A quotation is always composed from exactly one, so this is the way in rather
 * than an optional step — the composer has nothing to seed itself with until a
 * template is chosen.
 */
export function SelectTemplateSheet({
	onSelect,
	ref,
}: {
	onSelect: (templateId: Id<'quoteTemplates'>) => void;
	ref?: Ref<SelectTemplateSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);
	const templates = useQuery(api.quoteTemplates.list.list, {});

	useImperativeHandle(ref, () => ({
		present: () => sheetRef.current?.present(),
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

	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			backgroundStyle={{ backgroundColor: colors.card }}
			enableDynamicSizing
			handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
			maxDynamicContentSize={520}
			ref={sheetRef}
		>
			<BottomSheetScrollView
				className="px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16, gap: 8 }}
			>
				<Text className="px-1 pb-1 font-sans-semibold text-base text-foreground">
					Build from which template?
				</Text>
				{templates === undefined ? (
					<Text className="px-1 font-sans text-muted-foreground text-xs">
						Loading…
					</Text>
				) : null}
				{templates?.length === 0 ? (
					<Text className="px-1 font-sans text-muted-foreground text-xs">
						There are no quotation templates yet. Create one first.
					</Text>
				) : null}
				{templates?.map((template) => (
					<Pressable
						accessibilityLabel={`Build from ${template.name}`}
						accessibilityRole="button"
						className="gap-0.5 rounded-lg border border-border p-3 active:bg-muted"
						key={template._id}
						onPress={() => {
							sheetRef.current?.dismiss();
							onSelect(template._id);
						}}
					>
						<Text className="font-sans-medium text-foreground text-sm">
							{template.name}
						</Text>
						{template.description ? (
							<Text
								className="font-sans text-muted-foreground text-xs"
								numberOfLines={2}
							>
								{template.description}
							</Text>
						) : null}
					</Pressable>
				))}
				<View />
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
