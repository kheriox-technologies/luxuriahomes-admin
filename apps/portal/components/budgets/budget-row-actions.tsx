'use client';

import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { Check, EllipsisVertical, Pencil, Trash2, Wallet } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import EditTrade from '@/components/trades/edit-trade';

/**
 * Per-row actions cell shared by the budget template and project budget tables.
 * Shows a `⋮` menu (Edit Budget / Edit trade / Delete). "Edit Budget" puts the
 * row into inline edit mode; while editing, the trigger becomes a Check button
 * that saves just that row. Delete is supplied by the parent via `renderDelete`
 * so each table can wire its own resource-specific delete dialog.
 */
export default function BudgetRowActions({
	trade,
	rowEditing,
	saving,
	onEditBudget,
	onSaveBudget,
	renderDelete,
}: {
	trade: {
		tradeId: Id<'trades'>;
		name: string;
		description?: string;
		stageId?: Id<'tradeStages'>;
	};
	rowEditing: boolean;
	saving: boolean;
	onEditBudget: () => void;
	onSaveBudget: () => void;
	renderDelete: (
		open: boolean,
		onOpenChange: (open: boolean) => void
	) => ReactNode;
}) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	if (rowEditing) {
		return (
			<div className="flex justify-end">
				<Button
					aria-label={`Save ${trade.name}`}
					loading={saving}
					onClick={onSaveBudget}
					size="icon"
					type="button"
					variant="outline"
				>
					<Check aria-hidden />
				</Button>
			</div>
		);
	}

	return (
		<div className="flex justify-end">
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label={`Actions for ${trade.name}`}
							size="icon-sm"
							type="button"
							variant="ghost"
						/>
					}
				>
					<EllipsisVertical className="size-4" />
				</MenuTrigger>
				<MenuPopup align="end">
					<MenuItem onClick={onEditBudget}>
						<Wallet />
						Edit Budget
					</MenuItem>
					<MenuItem onClick={() => setEditOpen(true)}>
						<Pencil />
						Edit
					</MenuItem>
					<MenuSeparator />
					<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
						<Trash2 />
						Delete
					</MenuItem>
				</MenuPopup>
			</Menu>
			<EditTrade
				initialDescription={trade.description}
				initialName={trade.name}
				initialStageId={trade.stageId}
				onOpenChange={setEditOpen}
				open={editOpen}
				tradeId={trade.tradeId}
			/>
			{renderDelete(deleteOpen, setDeleteOpen)}
		</div>
	);
}
