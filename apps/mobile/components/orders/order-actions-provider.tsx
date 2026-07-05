import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useAction } from 'convex/react';
import { openBrowserAsync } from 'expo-web-browser';
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useRef,
} from 'react';
import { Alert } from 'react-native';
import {
	OrderEmailSheet,
	type OrderEmailSheetHandle,
} from './order-email-sheet';
import {
	OrderNotesSheet,
	type OrderNotesSheetHandle,
} from './order-notes-sheet';
import {
	OrderStatusHistorySheet,
	type OrderStatusHistorySheetHandle,
} from './order-status-history-sheet';
import {
	OrderStatusSheet,
	type OrderStatusSheetHandle,
} from './order-status-sheet';
import type { ProjectOrder } from './types';

interface OrderActionsContextValue {
	emailOrder: (order: ProjectOrder) => Promise<void>;
	openNotes: (order: ProjectOrder) => void;
	openStatusHistory: (order: ProjectOrder) => void;
	openStatusPicker: (order: ProjectOrder) => void;
	viewOrderPdf: (order: ProjectOrder) => Promise<void>;
}

const OrderActionsContext = createContext<OrderActionsContextValue | null>(
	null
);

export function useOrderActions(): OrderActionsContextValue {
	const value = useContext(OrderActionsContext);
	if (!value) {
		throw new Error(
			'useOrderActions must be used within an OrderActionsProvider'
		);
	}
	return value;
}

const PDF_ERROR_TITLE = 'Unable to generate PDF';
const PDF_ERROR_MESSAGE = 'The order PDF could not be generated. Try again.';

export function OrderActionsProvider({
	projectId,
	children,
}: {
	projectId: Id<'projects'>;
	children: ReactNode;
}) {
	const generatePdf = useAction(api.projectOrders.generatePdf.generatePdf);
	const notesSheetRef = useRef<OrderNotesSheetHandle>(null);
	const historySheetRef = useRef<OrderStatusHistorySheetHandle>(null);
	const statusSheetRef = useRef<OrderStatusSheetHandle>(null);
	const emailSheetRef = useRef<OrderEmailSheetHandle>(null);

	const openNotes = useCallback((order: ProjectOrder) => {
		notesSheetRef.current?.present(order);
	}, []);

	const openStatusHistory = useCallback((order: ProjectOrder) => {
		historySheetRef.current?.present(order);
	}, []);

	const openStatusPicker = useCallback((order: ProjectOrder) => {
		statusSheetRef.current?.present(order);
	}, []);

	const viewOrderPdf = useCallback(
		async (order: ProjectOrder) => {
			try {
				const { url } = await generatePdf({ orderId: order._id });
				await openBrowserAsync(url);
			} catch {
				Alert.alert(PDF_ERROR_TITLE, PDF_ERROR_MESSAGE);
			}
		},
		[generatePdf]
	);

	const emailOrder = useCallback(
		async (order: ProjectOrder) => {
			try {
				const { s3Key } = await generatePdf({ orderId: order._id });
				emailSheetRef.current?.present({
					s3Key,
					filename: `${order.orderId}.pdf`,
					subject: `Order ${order.orderId} — ${order.vendor}`,
					relatedId: order._id,
				});
			} catch {
				Alert.alert(PDF_ERROR_TITLE, PDF_ERROR_MESSAGE);
			}
		},
		[generatePdf]
	);

	const value = useMemo(
		() => ({
			openNotes,
			openStatusHistory,
			openStatusPicker,
			viewOrderPdf,
			emailOrder,
		}),
		[openNotes, openStatusHistory, openStatusPicker, viewOrderPdf, emailOrder]
	);

	return (
		<OrderActionsContext.Provider value={value}>
			{children}
			<OrderNotesSheet ref={notesSheetRef} />
			<OrderStatusHistorySheet ref={historySheetRef} />
			<OrderStatusSheet ref={statusSheetRef} />
			<OrderEmailSheet projectId={projectId} ref={emailSheetRef} />
		</OrderActionsContext.Provider>
	);
}
