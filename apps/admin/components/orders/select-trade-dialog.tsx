'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { useQuery } from 'convex/react';
import { type ReactNode, useEffect, useState } from 'react';
import TradeCombobox from '@/components/budgets/trade-combobox';

export default function SelectTradeDialog({
	open,
	onOpenChange,
	onConfirm,
	loading,
	description,
	children,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: (tradeId: Id<'trades'>) => void;
	loading?: boolean;
	description?: ReactNode;
	children?: ReactNode;
}) {
	const trades = useQuery(api.trades.list.list, {});
	const [tradeId, setTradeId] = useState<Id<'trades'> | ''>('');

	useEffect(() => {
		if (!open) {
			setTradeId('');
		}
	}, [open]);

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Order</DialogTitle>
					{description ? (
						<DialogDescription>{description}</DialogDescription>
					) : null}
				</DialogHeader>
				{children}
				<div className="px-6">
					<Field>
						<FieldLabel htmlFor="select-trade-dialog-trade">Trade</FieldLabel>
						<TradeCombobox
							id="select-trade-dialog-trade"
							onBlur={() => {
								/* no-op */
							}}
							onChange={(next) => setTradeId(next)}
							trades={trades}
							value={tradeId}
						/>
					</Field>
				</div>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						disabled={tradeId === ''}
						loading={loading}
						onClick={() => {
							if (tradeId !== '') {
								onConfirm(tradeId);
							}
						}}
						type="button"
					>
						Create Order
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
