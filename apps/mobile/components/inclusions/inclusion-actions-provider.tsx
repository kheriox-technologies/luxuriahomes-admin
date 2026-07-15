import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useAction, useConvex, useMutation } from 'convex/react';
import { useRouter } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { X } from 'lucide-react-native';
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import {
	InclusionAdjustVariationSheet,
	type InclusionAdjustVariationSheetHandle,
} from './inclusion-adjust-variation-sheet';
import {
	InclusionEditQuantitiesSheet,
	type InclusionEditQuantitiesSheetHandle,
} from './inclusion-edit-quantities-sheet';
import {
	InclusionEmailSheet,
	type InclusionEmailSheetHandle,
} from './inclusion-email-sheet';
import {
	InclusionNotesSheet,
	type InclusionNotesSheetHandle,
} from './inclusion-notes-sheet';
import {
	InclusionOrderBuilderSheet,
	type InclusionOrderBuilderSheetHandle,
} from './inclusion-order-builder-sheet';
import type {
	ClassFilter,
	GroupBy,
	PendingOrderItem,
	ProjectInclusion,
} from './types';

interface PdfTrigger {
	sectionKey?: string;
	title?: string;
}

interface InclusionActionsContextValue {
	addToOrder: (inclusion: ProjectInclusion) => void;
	deleteInclusion: (inclusion: ProjectInclusion) => void;
	downloadPdf: (trigger?: PdfTrigger) => Promise<void>;
	emailPdf: (trigger?: PdfTrigger) => Promise<void>;
	openAdjustVariation: (inclusion: ProjectInclusion) => void;
	openEditQuantities: (inclusion: ProjectInclusion) => void;
	openNotes: (inclusion: ProjectInclusion) => void;
	pendingOrderItems: PendingOrderItem[];
	viewOrder: (orderRefId: string, inclusionId: Id<'projectInclusions'>) => void;
}

const InclusionActionsContext =
	createContext<InclusionActionsContextValue | null>(null);

export function useInclusionActions(): InclusionActionsContextValue {
	const value = useContext(InclusionActionsContext);
	if (!value) {
		throw new Error(
			'useInclusionActions must be used within an InclusionActionsProvider'
		);
	}
	return value;
}

const DEFAULT_TITLE = 'Schedule of Finishes';
const filenameUnsafe = /[^a-z0-9]+/gi;

function toFilename(title: string): string {
	const slug = title.replace(filenameUnsafe, '-').replace(/^-+|-+$/g, '');
	return `${slug || 'inclusions'}.pdf`;
}

function toPendingOrderItem(inclusion: ProjectInclusion): PendingOrderItem {
	const totalQty =
		inclusion.locations?.reduce((sum, l) => sum + (l.quantity ?? 0), 0) ?? 0;
	return {
		inclusionId: inclusion._id,
		title: inclusion.title,
		vendor: inclusion.vendor,
		totalQty,
		unit: inclusion.unitAbbr ?? inclusion.locations?.[0]?.unit ?? '',
		details: inclusion.details,
		color: inclusion.color,
		models: inclusion.models,
		costPrice: inclusion.costPrice,
	};
}

export function InclusionActionsProvider({
	projectId,
	groupBy,
	classFilter,
	search,
	children,
}: {
	projectId: Id<'projects'>;
	groupBy: GroupBy;
	classFilter: ClassFilter;
	search: string;
	children: ReactNode;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const convex = useConvex();

	const generatePdf = useAction(api.projectInclusions.generatePdf.generatePdf);
	const removeInclusion = useMutation(api.projectInclusions.remove.remove);
	const updateInclusion = useMutation(api.projectInclusions.update.update);

	const emailSheetRef = useRef<InclusionEmailSheetHandle>(null);
	const notesSheetRef = useRef<InclusionNotesSheetHandle>(null);
	const editQuantitiesSheetRef =
		useRef<InclusionEditQuantitiesSheetHandle>(null);
	const adjustVariationSheetRef =
		useRef<InclusionAdjustVariationSheetHandle>(null);
	const orderBuilderSheetRef = useRef<InclusionOrderBuilderSheetHandle>(null);

	const [pendingOrderItems, setPendingOrderItems] = useState<
		PendingOrderItem[]
	>([]);

	// Hold the latest filter state so the callbacks can stay referentially stable
	// while still generating a PDF that reflects the current on-screen selection.
	const paramsRef = useRef({ groupBy, classFilter, search });
	paramsRef.current = { groupBy, classFilter, search };

	const generate = useCallback(
		(trigger?: PdfTrigger) => {
			const { groupBy: gb, classFilter: cf, search: s } = paramsRef.current;
			return generatePdf({
				projectId,
				groupBy: gb,
				class: cf,
				search: s.trim() === '' ? undefined : s.trim(),
				sectionKey: trigger?.sectionKey,
			});
		},
		[generatePdf, projectId]
	);

	const downloadPdf = useCallback(
		async (trigger?: PdfTrigger) => {
			try {
				const { url } = await generate(trigger);
				await openBrowserAsync(url);
			} catch {
				Alert.alert(
					'Unable to generate PDF',
					'The inclusions PDF could not be generated. Try again.'
				);
			}
		},
		[generate]
	);

	const emailPdf = useCallback(
		async (trigger?: PdfTrigger) => {
			try {
				const title = trigger?.title ?? DEFAULT_TITLE;
				const { s3Key } = await generate(trigger);
				emailSheetRef.current?.present({
					s3Key,
					filename: toFilename(title),
					subject: title,
				});
			} catch {
				Alert.alert(
					'Unable to generate PDF',
					'The inclusions PDF could not be generated. Try again.'
				);
			}
		},
		[generate]
	);

	const openNotes = useCallback((inclusion: ProjectInclusion) => {
		notesSheetRef.current?.present(inclusion);
	}, []);

	const openEditQuantities = useCallback((inclusion: ProjectInclusion) => {
		editQuantitiesSheetRef.current?.present(inclusion);
	}, []);

	const openAdjustVariation = useCallback((inclusion: ProjectInclusion) => {
		adjustVariationSheetRef.current?.present(inclusion);
	}, []);

	const deleteInclusion = useCallback(
		(inclusion: ProjectInclusion) => {
			Alert.alert(
				'Delete inclusion?',
				`This will permanently delete ${inclusion.title} (${inclusion.code}) from this project.`,
				[
					{ text: 'Cancel', style: 'cancel' },
					{
						text: 'Delete',
						style: 'destructive',
						onPress: () => {
							removeInclusion({ projectInclusionId: inclusion._id }).catch(
								() => {
									Alert.alert('Unable to delete', 'Please try again.');
								}
							);
						},
					},
				]
			);
		},
		[removeInclusion]
	);

	const clearStaleOrderLink = useCallback(
		(inclusionId: Id<'projectInclusions'>) => {
			updateInclusion({
				projectInclusionId: inclusionId,
				orderRefId: null,
				orderStatus: null,
			}).catch(() => {
				Alert.alert('Unable to clear link', 'Please try again.');
			});
		},
		[updateInclusion]
	);

	const viewOrder = useCallback(
		async (orderRefId: string, inclusionId: Id<'projectInclusions'>) => {
			try {
				const order = await convex.query(api.projectOrders.getByRef.getByRef, {
					orderRefId,
				});
				if (order) {
					router.push({
						pathname: '/(app)/orders/[orderId]',
						params: { orderId: order._id },
					});
					return;
				}
				Alert.alert(
					'Order not found',
					'This inclusion is linked to an order that no longer exists.',
					[
						{ text: 'Dismiss', style: 'cancel' },
						{
							text: 'Clear link',
							style: 'destructive',
							onPress: () => clearStaleOrderLink(inclusionId),
						},
					]
				);
			} catch {
				Alert.alert('Unable to open order', 'Please try again.');
			}
		},
		[clearStaleOrderLink, convex, router]
	);

	const addToOrder = useCallback((inclusion: ProjectInclusion) => {
		setPendingOrderItems((prev) => {
			if (prev.some((item) => item.inclusionId === inclusion._id)) {
				return prev;
			}
			return [...prev, toPendingOrderItem(inclusion)];
		});
	}, []);

	const removePendingItem = useCallback(
		(inclusionId: Id<'projectInclusions'>) => {
			setPendingOrderItems((prev) =>
				prev.filter((item) => item.inclusionId !== inclusionId)
			);
		},
		[]
	);

	const clearPending = useCallback(() => setPendingOrderItems([]), []);

	const value = useMemo(
		() => ({
			addToOrder,
			deleteInclusion,
			downloadPdf,
			emailPdf,
			openAdjustVariation,
			openEditQuantities,
			openNotes,
			pendingOrderItems,
			viewOrder,
		}),
		[
			addToOrder,
			deleteInclusion,
			downloadPdf,
			emailPdf,
			openAdjustVariation,
			openEditQuantities,
			openNotes,
			pendingOrderItems,
			viewOrder,
		]
	);

	const pendingCount = pendingOrderItems.length;
	const pendingVendor = pendingOrderItems[0]?.vendor ?? '';

	return (
		<InclusionActionsContext.Provider value={value}>
			<View className="flex-1">
				{children}
				{pendingCount > 0 ? (
					<View
						className="absolute inset-x-0 bottom-0 border-border border-t bg-card px-4 pt-3"
						style={{ paddingBottom: insets.bottom + 12 }}
					>
						<View className="flex-row items-center gap-3">
							<View className="flex-1">
								<Text className="font-sans-semibold text-foreground text-sm">
									{pendingCount === 1 ? '1 item' : `${pendingCount} items`}
									{pendingVendor ? ` · ${pendingVendor}` : ''}
								</Text>
								<Text className="font-sans text-muted-foreground text-xs">
									Pending order
								</Text>
							</View>
							<Pressable
								accessibilityLabel="Discard pending order"
								accessibilityRole="button"
								className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
								hitSlop={4}
								onPress={clearPending}
							>
								<X color={colors.mutedForeground} size={18} strokeWidth={2} />
							</Pressable>
							<Button onPress={() => orderBuilderSheetRef.current?.present()}>
								Review order
							</Button>
						</View>
					</View>
				) : null}
			</View>
			<InclusionEmailSheet projectId={projectId} ref={emailSheetRef} />
			<InclusionNotesSheet ref={notesSheetRef} />
			<InclusionEditQuantitiesSheet ref={editQuantitiesSheetRef} />
			<InclusionAdjustVariationSheet ref={adjustVariationSheetRef} />
			<InclusionOrderBuilderSheet
				items={pendingOrderItems}
				onCreated={clearPending}
				onRemove={removePendingItem}
				projectId={projectId}
				ref={orderBuilderSheetRef}
			/>
		</InclusionActionsContext.Provider>
	);
}
