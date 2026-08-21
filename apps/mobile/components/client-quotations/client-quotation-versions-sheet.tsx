import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useAction, useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { ExternalLink, SquarePen } from 'lucide-react-native';
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
import { formatCurrency, formatDate } from '@/lib/format';
import { shareRemotePdf } from '@/lib/share-file';
import type { QuotationSurface } from './quotation-surface';

export interface ClientQuotationVersionsSheetHandle {
	present: (quotationId: Id<'clientQuotations'>, reference: string) => void;
}

/**
 * A quotation's history: the revisions, and the lifecycle events recorded
 * against them.
 *
 * A status event shares its version number with the revision it happened
 * against, so only revisions are editable and only they carry a PDF — the
 * badges say which is which.
 */
export function ClientQuotationVersionsSheet({
	ref,
	surface,
}: {
	ref?: Ref<ClientQuotationVersionsSheetHandle>;
	surface: QuotationSurface;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const sheetRef = useRef<BottomSheetModal>(null);

	const [quotationId, setQuotationId] = useState<Id<'clientQuotations'> | null>(
		null
	);
	const [reference, setReference] = useState('');

	const isClient = surface === 'client';
	const args = quotationId ? { quotationId } : ('skip' as const);
	const adminVersions = useQuery(
		api.clientQuotations.listVersions.listVersions,
		isClient ? 'skip' : args
	);
	const clientVersions = useQuery(
		api.clientPortal.quotations.listVersions.listVersions,
		isClient ? args : 'skip'
	);
	const versions = isClient ? clientVersions : adminVersions;

	const signAdminUrl = useAction(api.cdn.signUrl.signUrl);
	const signClientUrl = useAction(api.clientPortal.quotations.signUrl.signUrl);

	useImperativeHandle(ref, () => ({
		present: (id, quotationReference) => {
			setQuotationId(id);
			setReference(quotationReference);
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

	const openPdf = async (s3Key: string, fileName: string) => {
		if (!quotationId) {
			return;
		}
		const url = isClient
			? await signClientUrl({ quotationId, s3Key })
			: await signAdminUrl({ s3Key });
		await shareRemotePdf(url, fileName);
	};

	// The newest revision — the only one that can be rewritten in place.
	const currentRevision = versions?.find(
		(row) => row.changeType === 'Revision'
	);

	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			backgroundStyle={{ backgroundColor: colors.card }}
			enableDynamicSizing
			handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
			maxDynamicContentSize={640}
			ref={sheetRef}
		>
			<BottomSheetScrollView
				className="px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16, gap: 10 }}
			>
				<Text className="px-1 font-sans-semibold text-base text-foreground">
					{`History · ${reference}`}
				</Text>

				{versions === undefined ? (
					<Text className="px-1 font-sans text-muted-foreground text-xs">
						Loading…
					</Text>
				) : null}

				{versions?.map((row) => {
					const isRevision = row.changeType === 'Revision';
					const isCurrent =
						isRevision && row.version === currentRevision?.version;
					return (
						<View
							className="gap-1.5 rounded-lg border border-border p-3"
							key={`${row.version}-${row.updatedAt}-${row.description}`}
						>
							<View className="flex-row items-center gap-2">
								<Text className="font-sans-semibold text-foreground text-xs tabular-nums">
									{`v${row.version}`}
								</Text>
								{isCurrent ? <Badge variant="info">Current</Badge> : null}
								{isRevision ? null : <Badge variant="outline">Status</Badge>}
								<View className="flex-1" />
								<Text className="font-sans text-muted-foreground text-xs">
									{formatCurrency(row.totalInclGst)}
								</Text>
							</View>
							<Text className="font-sans text-foreground text-sm">
								{row.description}
							</Text>
							<Text className="font-sans text-muted-foreground text-xs">
								{`${row.updatedBy} · ${formatDate(row.updatedAt)}`}
							</Text>
							<View className="flex-row items-center gap-3 pt-1">
								{row.s3Key ? (
									<Pressable
										accessibilityLabel={`Open the version ${row.version} PDF`}
										accessibilityRole="button"
										className="flex-row items-center gap-1.5"
										hitSlop={8}
										onPress={() => {
											openPdf(
												row.s3Key as string,
												row.fileName ?? `${reference} - v${row.version}.pdf`
											).catch(() => {
												/* shareRemotePdf reports its own failures */
											});
										}}
									>
										<ExternalLink
											color={colors.mutedForeground}
											size={14}
											strokeWidth={2}
										/>
										<Text className="font-sans text-muted-foreground text-xs">
											Open PDF
										</Text>
									</Pressable>
								) : null}
								{isCurrent && !isClient && quotationId ? (
									<Pressable
										accessibilityLabel={`Edit version ${row.version}`}
										accessibilityRole="button"
										className="flex-row items-center gap-1.5"
										hitSlop={8}
										onPress={() => {
											sheetRef.current?.dismiss();
											router.push({
												pathname: '/(app)/quotations/[quotationId]/edit',
												params: {
													quotationId,
													version: String(row.version),
												},
											});
										}}
									>
										<SquarePen
											color={colors.mutedForeground}
											size={14}
											strokeWidth={2}
										/>
										<Text className="font-sans text-muted-foreground text-xs">
											Edit
										</Text>
									</Pressable>
								) : null}
							</View>
						</View>
					);
				})}
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
