'use client';

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
import { Plus } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import TradeSelect from '@/components/trades/trade-select';

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
						<TradeSelect
							allowCreate
							id="select-trade-dialog-trade"
							onValueChange={(next) => setTradeId(next)}
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
						variant="outline"
					>
						<Plus aria-hidden /> Create Order
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
