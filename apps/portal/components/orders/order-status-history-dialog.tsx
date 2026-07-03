'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import { useQuery } from 'convex/react';
import { Info } from 'lucide-react';
import type React from 'react';
import type { OrderStatus } from './order-form-shared';

type StatusHistoryEntry = Doc<'projectOrderStatusHistory'>;

function ordinalSuffix(day: number): string {
	const mod100 = day % 100;
	if (mod100 >= 11 && mod100 <= 13) {
		return 'th';
	}
	switch (day % 10) {
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default:
			return 'th';
	}
}

function formatHistoryDate(timestamp: number): string {
	const d = new Date(timestamp);
	const weekday = new Intl.DateTimeFormat('en-AU', { weekday: 'short' }).format(
		d
	);
	const day = d.getDate();
	const month = new Intl.DateTimeFormat('en-AU', { month: 'short' }).format(d);
	const year = d.getFullYear();
	const time = new Intl.DateTimeFormat('en-AU', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	}).format(d);
	return `${weekday}, ${day}${ordinalSuffix(day)} ${month} ${year} at ${time}`;
}

function statusBadgeVariant(
	status: OrderStatus
): 'warning' | 'info' | 'purple' | 'success' {
	switch (status) {
		case 'Pending':
			return 'warning';
		case 'Ordered':
			return 'info';
		case 'In Transit':
			return 'purple';
		default:
			return 'success';
	}
}

function StatusHistoryList({ entries }: { entries: StatusHistoryEntry[] }) {
	return (
		<div className="flex flex-col gap-4">
			{entries.map((entry) => (
				<div
					className="flex flex-col gap-1 border-border border-l-2 pl-4"
					key={entry._id}
				>
					<div className="flex items-center gap-2">
						<Badge
							size="lg"
							variant={statusBadgeVariant(entry.status as OrderStatus)}
						>
							{entry.status}
						</Badge>
						<span className="font-medium text-sm">{entry.label}</span>
					</div>
					<p className="text-muted-foreground text-sm">By {entry.changedBy}</p>
					<p className="text-muted-foreground text-xs">
						{formatHistoryDate(entry.timestamp)}
					</p>
				</div>
			))}
		</div>
	);
}

export default function OrderStatusHistoryDialog({
	orderId,
	open,
	onOpenChange,
}: {
	orderId: Id<'projectOrders'>;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const history = useQuery(
		api.projectOrders.listStatusHistory.listStatusHistory,
		open ? { orderId } : 'skip'
	);

	let body: React.ReactNode;
	if (history === undefined) {
		body = <p className="text-muted-foreground text-sm">Loading history…</p>;
	} else if (history.length === 0) {
		body = (
			<Alert variant="info">
				<Info aria-hidden className="size-4 shrink-0" />
				<AlertDescription>No status history found.</AlertDescription>
			</Alert>
		);
	} else {
		body = <StatusHistoryList entries={history} />;
	}

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="flex h-[min(88vh,36rem)] w-[min(92vw,36rem)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-none">
				<DialogHeader className="shrink-0 space-y-1.5 px-6 pt-6">
					<DialogTitle>Status History</DialogTitle>
				</DialogHeader>
				<div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">{body}</div>
				<DialogFooter className="shrink-0 border-t px-6 py-4">
					<DialogClose render={<Button type="button" variant="outline" />}>
						Close
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
