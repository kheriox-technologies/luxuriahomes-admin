import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { Check, Plus, Trash2 } from 'lucide-react-native';
import {
	type Ref,
	useCallback,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ORDER_STATUSES, type OrderStatus } from '@/components/orders/types';
import { VendorSelectField } from '@/components/orders/vendor-select-field';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { DateField } from '@/components/ui/date-field';
import { Select } from '@/components/ui/select';
import { TextField } from '@/components/ui/text-field';

type Order = Doc<'projectOrders'>;

const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

const STATUS_OPTIONS = ORDER_STATUSES.map((value) => ({ value, label: value }));

interface ItemForm {
	description: string;
	link: string;
	name: string;
	price: string;
	quantity: string;
	sku: string;
	unit: string;
}

const emptyItem: ItemForm = {
	name: '',
	description: '',
	quantity: '',
	unit: '',
	price: '',
	sku: '',
	link: '',
};

function itemFromOrder(item: Order['items'][number]): ItemForm {
	return {
		name: item.name,
		description: item.description ?? '',
		quantity: String(item.quantity),
		unit: item.unit,
		price: item.price === undefined ? '' : String(item.price),
		sku: item.sku ?? '',
		link: item.link ?? '',
	};
}

export interface OrderFormSheetHandle {
	present: (order?: Order) => void;
}

/**
 * Add / Edit order bottom sheet. `present()` opens in create mode;
 * `present(order)` opens in edit mode with fields pre-filled. Mirrors the portal
 * Add/Edit Order forms (vendor, order-by date, line items, status).
 */
export function OrderFormSheet({
	projectId,
	ref,
}: {
	projectId: Id<'projects'>;
	ref?: Ref<OrderFormSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const addOrder = useMutation(api.projectOrders.add.add);
	const updateOrder = useMutation(api.projectOrders.update.update);
	const units = useQuery(api.units.list.list, {});

	const unitOptions = useMemo(
		() =>
			(units ?? []).map((unit) => ({
				value: unit.abbr,
				label: `${unit.label} (${unit.abbr})`,
			})),
		[units]
	);

	const [editingId, setEditingId] = useState<Id<'projectOrders'> | null>(null);
	const [vendor, setVendor] = useState('');
	const [orderBy, setOrderBy] = useState<Date | undefined>(undefined);
	const [items, setItems] = useState<ItemForm[]>([{ ...emptyItem }]);
	const [status, setStatus] = useState<OrderStatus>('Pending');
	const [saving, setSaving] = useState(false);
	const [showErrors, setShowErrors] = useState(false);

	useImperativeHandle(ref, () => ({
		present: (order) => {
			setEditingId(order?._id ?? null);
			setVendor(order?.vendor ?? '');
			setOrderBy(order?.orderBy ? new Date(order.orderBy) : undefined);
			setItems(
				order && order.items.length > 0
					? order.items.map(itemFromOrder)
					: [{ ...emptyItem }]
			);
			setStatus((order?.status as OrderStatus) ?? 'Pending');
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

	const updateItem = (index: number, patch: Partial<ItemForm>) =>
		setItems((prev) =>
			prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
		);

	const addItem = () => setItems((prev) => [...prev, { ...emptyItem }]);

	const removeItem = (index: number) =>
		setItems((prev) => prev.filter((_, i) => i !== index));

	const itemIsValid = (item: ItemForm) => {
		const quantity = Number(item.quantity.trim());
		if (item.name.trim() === '' || item.unit.trim() === '') {
			return false;
		}
		if (Number.isNaN(quantity) || quantity <= 0) {
			return false;
		}
		const price = item.price.trim();
		return price === '' || MONEY_PATTERN.test(price);
	};

	const handleSave = async () => {
		if (vendor.trim() === '' || !items.every(itemIsValid)) {
			setShowErrors(true);
			return;
		}
		const payloadItems = items.map((item) => ({
			name: item.name.trim(),
			description: item.description.trim() || undefined,
			quantity: Number(item.quantity.trim()),
			unit: item.unit.trim(),
			price: item.price.trim() ? Number(item.price.trim()) : undefined,
			sku: item.sku.trim() || undefined,
			link: item.link.trim() || undefined,
		}));
		setSaving(true);
		try {
			if (editingId) {
				await updateOrder({
					orderId: editingId,
					vendor: vendor.trim(),
					orderBy: orderBy?.getTime(),
					items: payloadItems,
					status,
				});
			} else {
				await addOrder({
					projectId,
					vendor: vendor.trim(),
					orderBy: orderBy?.getTime(),
					items: payloadItems,
					status,
				});
			}
			sheetRef.current?.dismiss();
		} catch {
			Alert.alert(
				editingId ? 'Could not update order' : 'Could not add order',
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
			maxDynamicContentSize={720}
			ref={sheetRef}
		>
			<BottomSheetScrollView
				className="px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16, gap: 12 }}
				keyboardShouldPersistTaps="handled"
			>
				<Text className="px-1 font-sans-semibold text-base text-foreground">
					{editingId ? 'Edit order' : 'Add order'}
				</Text>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Vendor
					</Text>
					<VendorSelectField
						allowCreate
						invalid={showErrors && vendor.trim() === ''}
						onValueChange={setVendor}
						value={vendor}
					/>
					{showErrors && vendor.trim() === '' ? (
						<Text className="font-sans text-destructive text-xs">
							A vendor is required
						</Text>
					) : null}
				</View>

				<DateField
					label="Order by (optional)"
					onChange={setOrderBy}
					value={orderBy}
				/>

				<View className="gap-2">
					<Text className="font-sans-medium text-foreground text-sm">
						Items
					</Text>
					{items.map((item, index) => {
						const quantityInvalid =
							showErrors &&
							(Number.isNaN(Number(item.quantity.trim())) ||
								Number(item.quantity.trim()) <= 0);
						const priceInvalid =
							showErrors &&
							item.price.trim() !== '' &&
							!MONEY_PATTERN.test(item.price.trim());
						return (
							<View
								className="gap-2.5 rounded-lg border border-border p-3"
								// biome-ignore lint/suspicious/noArrayIndexKey: form rows have no stable id
								key={index}
							>
								{items.length > 1 ? (
									<View className="flex-row justify-end">
										<Pressable
											accessibilityLabel="Remove item"
											accessibilityRole="button"
											hitSlop={8}
											onPress={() => removeItem(index)}
										>
											<Trash2
												color={colors.destructive}
												size={18}
												strokeWidth={2}
											/>
										</Pressable>
									</View>
								) : null}
								<TextField
									error={
										showErrors && item.name.trim() === ''
											? 'Item name is required'
											: undefined
									}
									label="Name"
									onChangeText={(next) => updateItem(index, { name: next })}
									placeholder="Item name"
									value={item.name}
								/>
								<TextField
									label="Description (optional)"
									onChangeText={(next) =>
										updateItem(index, { description: next })
									}
									placeholder="Short description"
									value={item.description}
								/>
								<TextField
									error={
										quantityInvalid ? 'Enter a positive quantity' : undefined
									}
									keyboardType="decimal-pad"
									label="Quantity"
									onChangeText={(next) => updateItem(index, { quantity: next })}
									placeholder="0"
									value={item.quantity}
								/>
								<View className="gap-1.5">
									<Text className="font-sans-medium text-foreground text-sm">
										Unit
									</Text>
									<Select
										onChange={(next) => updateItem(index, { unit: next })}
										options={unitOptions}
										placeholder={
											units === undefined ? 'Loading…' : 'Select a unit'
										}
										title="Select unit"
										value={item.unit}
									/>
									{showErrors && item.unit.trim() === '' ? (
										<Text className="font-sans text-destructive text-xs">
											A unit is required
										</Text>
									) : null}
								</View>
								<TextField
									error={
										priceInvalid
											? 'Enter a valid amount (up to 2 decimals)'
											: undefined
									}
									keyboardType="decimal-pad"
									label="Price per unit (optional)"
									onChangeText={(next) => updateItem(index, { price: next })}
									placeholder="0.00"
									value={item.price}
								/>
								<TextField
									label="SKU (optional)"
									onChangeText={(next) => updateItem(index, { sku: next })}
									placeholder="e.g. ABC-123"
									value={item.sku}
								/>
								<TextField
									autoCapitalize="none"
									keyboardType="url"
									label="Link (optional)"
									onChangeText={(next) => updateItem(index, { link: next })}
									placeholder="https://"
									value={item.link}
								/>
							</View>
						);
					})}
					<Button
						icon={<Plus color={colors.foreground} size={18} strokeWidth={2} />}
						onPress={addItem}
					>
						Add item
					</Button>
				</View>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Status
					</Text>
					<Select
						onChange={(next) => setStatus(next as OrderStatus)}
						options={STATUS_OPTIONS}
						title="Select status"
						value={status}
					/>
				</View>

				<Button
					className="mt-1"
					icon={<Check color={colors.foreground} size={18} strokeWidth={2} />}
					loading={saving}
					onPress={handleSave}
				>
					{editingId ? 'Save changes' : 'Save order'}
				</Button>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
