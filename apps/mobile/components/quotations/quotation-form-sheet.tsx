import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useAction, useMutation } from 'convex/react';
import { getDocumentAsync } from 'expo-document-picker';
import { FileSystemUploadType, uploadAsync } from 'expo-file-system/legacy';
import { Check, FileUp, X } from 'lucide-react-native';
import {
	type Ref,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ServiceProviderSelectField } from '@/components/service-providers/service-provider-select-field';
import { useThemeColors } from '@/components/theme';
import { TradeSelectField } from '@/components/trades/trade-select-field';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { TextField } from '@/components/ui/text-field';
import type { ProjectQuotation } from './types';
import { QUOTATION_STATUSES, type QuotationStatus } from './types';

const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

const STATUS_OPTIONS = QUOTATION_STATUSES.map((value) => ({
	value,
	label: value,
}));

export interface QuotationFormSheetHandle {
	present: (quotation?: ProjectQuotation) => void;
}

/**
 * Add / Edit quotation bottom sheet. `present()` opens in create mode;
 * `present(quotation)` opens in edit mode with fields pre-filled. Mirrors the
 * portal Add/Edit Quotation forms (title, trade, service provider, price,
 * status, optional document upload).
 */
export function QuotationFormSheet({
	projectId,
	ref,
}: {
	projectId: Id<'projects'>;
	ref?: Ref<QuotationFormSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const addQuotation = useMutation(api.projectQuotations.add.add);
	const updateQuotation = useMutation(api.projectQuotations.update.update);
	const generateUploadUrl = useAction(
		api.projectQuotations.generateUploadUrl.generateUploadUrl
	);

	const [editingId, setEditingId] = useState<Id<'projectQuotations'> | null>(
		null
	);
	const [title, setTitle] = useState('');
	const [tradeId, setTradeId] = useState<Id<'trades'> | ''>('');
	const [serviceProviderId, setServiceProviderId] = useState<
		Id<'serviceProviders'> | ''
	>('');
	const [price, setPrice] = useState('');
	const [status, setStatus] = useState<QuotationStatus>('Under Review');
	const [s3Key, setS3Key] = useState<string | undefined>(undefined);
	const [docName, setDocName] = useState<string | null>(null);
	const [hasExistingDoc, setHasExistingDoc] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [showErrors, setShowErrors] = useState(false);

	useImperativeHandle(ref, () => ({
		present: (quotation) => {
			setEditingId(quotation?._id ?? null);
			setTitle(quotation?.title ?? '');
			setTradeId(quotation?.tradeId ?? '');
			setServiceProviderId(quotation?.serviceProviderId ?? '');
			setPrice(quotation ? String(quotation.price) : '');
			setStatus((quotation?.status as QuotationStatus) ?? 'Under Review');
			setS3Key(quotation?.s3Key);
			setHasExistingDoc(Boolean(quotation?.s3Key));
			setDocName(null);
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

	const priceInvalid = showErrors && !MONEY_PATTERN.test(price.trim());

	const pickDocument = async () => {
		const result = await getDocumentAsync({
			type: '*/*',
			copyToCacheDirectory: true,
			multiple: false,
		});
		if (result.canceled) {
			return;
		}
		const asset = result.assets[0];
		if (!asset) {
			return;
		}
		setUploading(true);
		try {
			const ext = asset.name.split('.').pop() || 'pdf';
			const contentType = asset.mimeType || 'application/octet-stream';
			const upload = await generateUploadUrl({ projectId, contentType, ext });
			const response = await uploadAsync(upload.uploadUrl, asset.uri, {
				httpMethod: 'PUT',
				uploadType: FileSystemUploadType.BINARY_CONTENT,
				headers: { 'Content-Type': contentType },
			});
			if (response.status < 200 || response.status >= 300) {
				throw new Error(`Upload failed (${response.status})`);
			}
			setS3Key(upload.s3Key);
			setDocName(asset.name);
			setHasExistingDoc(false);
		} catch {
			Alert.alert('Upload failed', 'Please try again.');
		} finally {
			setUploading(false);
		}
	};

	const clearDocument = () => {
		setS3Key(undefined);
		setDocName(null);
		setHasExistingDoc(false);
	};

	const handleSave = async () => {
		const trimmedTitle = title.trim();
		const trimmedPrice = price.trim();
		if (
			trimmedTitle === '' ||
			tradeId === '' ||
			serviceProviderId === '' ||
			!MONEY_PATTERN.test(trimmedPrice)
		) {
			setShowErrors(true);
			return;
		}
		setSaving(true);
		try {
			if (editingId) {
				await updateQuotation({
					quotationId: editingId,
					title: trimmedTitle,
					tradeId,
					serviceProviderId,
					price: Number(trimmedPrice),
					status,
					s3Key,
				});
			} else {
				await addQuotation({
					projectId,
					title: trimmedTitle,
					tradeId,
					serviceProviderId,
					price: Number(trimmedPrice),
					status,
					s3Key,
				});
			}
			sheetRef.current?.dismiss();
		} catch {
			Alert.alert(
				editingId ? 'Could not update quotation' : 'Could not add quotation',
				'Please try again.'
			);
		} finally {
			setSaving(false);
		}
	};

	const documentLabel = () => {
		if (docName) {
			return docName;
		}
		if (hasExistingDoc) {
			return '(existing document)';
		}
		return 'No document attached';
	};

	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			backgroundStyle={{ backgroundColor: colors.card }}
			enableDynamicSizing
			handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
			keyboardBehavior="interactive"
			maxDynamicContentSize={720}
			ref={sheetRef}
		>
			<BottomSheetScrollView
				className="px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16, gap: 12 }}
				keyboardShouldPersistTaps="handled"
			>
				<Text className="px-1 font-sans-semibold text-base text-foreground">
					{editingId ? 'Edit quotation' : 'Add quotation'}
				</Text>

				<TextField
					error={
						showErrors && title.trim() === '' ? 'Title is required' : undefined
					}
					label="Title"
					onChangeText={setTitle}
					placeholder="Quotation title"
					value={title}
				/>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Trade
					</Text>
					<TradeSelectField
						allowCreate
						invalid={showErrors && tradeId === ''}
						onValueChange={(next) => {
							setTradeId(next);
							// Clear the provider when the trade changes so it stays consistent.
							setServiceProviderId('');
						}}
						value={tradeId}
					/>
					{showErrors && tradeId === '' ? (
						<Text className="font-sans text-destructive text-xs">
							A trade is required
						</Text>
					) : null}
				</View>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Service provider
					</Text>
					<ServiceProviderSelectField
						allowCreate
						emptyMessage={
							tradeId
								? 'No service providers for this trade.'
								: 'Select a trade to filter providers.'
						}
						filterTradeId={tradeId}
						invalid={showErrors && serviceProviderId === ''}
						onProviderTradesChange={(tradeIds) => {
							// Keep the trade field in sync when a provider (or a newly created
							// one) brings its own trades — mirrors the portal behavior.
							if (tradeIds.length === 0) {
								return;
							}
							if (tradeId && tradeIds.includes(tradeId)) {
								return;
							}
							setTradeId(tradeIds[0]);
						}}
						onValueChange={setServiceProviderId}
						placeholder={
							tradeId ? 'Select a service provider' : 'Select a trade first'
						}
						value={serviceProviderId}
					/>
					{showErrors && serviceProviderId === '' ? (
						<Text className="font-sans text-destructive text-xs">
							Service provider is required
						</Text>
					) : null}
				</View>

				<TextField
					error={
						priceInvalid ? 'Enter a valid amount (up to 2 decimals)' : undefined
					}
					keyboardType="decimal-pad"
					label="Price (AUD)"
					onChangeText={setPrice}
					placeholder="0.00"
					value={price}
				/>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Status
					</Text>
					<Select
						onChange={(next) => setStatus(next as QuotationStatus)}
						options={STATUS_OPTIONS}
						title="Select status"
						value={status}
					/>
				</View>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Quotation document
					</Text>
					<View className="flex-row items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
						<Text
							className="flex-1 font-sans text-muted-foreground text-xs"
							numberOfLines={1}
						>
							{documentLabel()}
						</Text>
						{uploading ? (
							<ActivityIndicator color={colors.mutedForeground} size="small" />
						) : null}
						{!uploading && (s3Key || hasExistingDoc) ? (
							<Pressable
								accessibilityLabel="Remove document"
								accessibilityRole="button"
								hitSlop={8}
								onPress={clearDocument}
							>
								<X color={colors.mutedForeground} size={18} strokeWidth={2} />
							</Pressable>
						) : null}
					</View>
					<Button
						disabled={uploading}
						icon={
							<FileUp color={colors.foreground} size={18} strokeWidth={2} />
						}
						onPress={pickDocument}
					>
						{s3Key || hasExistingDoc ? 'Replace document' : 'Attach document'}
					</Button>
				</View>

				<Button
					className="mt-1"
					disabled={uploading}
					icon={<Check color={colors.foreground} size={18} strokeWidth={2} />}
					loading={saving}
					onPress={handleSave}
				>
					{editingId ? 'Save changes' : 'Save quotation'}
				</Button>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
