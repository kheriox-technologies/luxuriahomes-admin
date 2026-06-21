'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { Label } from '@workspace/ui/components/label';
import { Switch } from '@workspace/ui/components/switch';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@workspace/ui/components/table';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/page-heading';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import AddBudgetTemplateToProject from './add-budget-template-to-project';
import {
	formatBudgetPrice,
	isValidMoneyString,
	parseMoneyString,
} from './budget-form-shared';

type TemplateItem = Doc<'budgetTemplateItems'> & { tradeName: string | null };

function TradeItemRow({
	item,
	editMode,
	onSave,
}: {
	item: TemplateItem;
	editMode: boolean;
	onSave: (price: number) => Promise<void>;
}) {
	const [value, setValue] = useState(String(item.price));

	// Keep the input in sync when the server value changes.
	useEffect(() => {
		setValue(String(item.price));
	}, [item.price]);

	const handleBlur = () => {
		const trimmed = value.trim();
		if (!isValidMoneyString(trimmed)) {
			setValue(String(item.price));
			return;
		}
		const next = parseMoneyString(trimmed);
		if (next === item.price) {
			return;
		}
		onSave(next).catch(() => {
			setValue(String(item.price));
		});
	};

	return (
		<TableRow>
			<TableCell className="font-medium">
				{item.tradeName ?? (
					<span className="text-muted-foreground">Unknown trade</span>
				)}
			</TableCell>
			<TableCell>
				{editMode ? (
					<InputGroup className="max-w-48">
						<InputGroupAddon align="inline-start">
							<InputGroupText>$</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							aria-label={`Price for ${item.tradeName ?? 'trade'}`}
							inputMode="decimal"
							nativeInput
							onBlur={handleBlur}
							onChange={(e) => setValue(e.target.value)}
							placeholder="0.00"
							type="text"
							value={value}
						/>
						<InputGroupAddon align="inline-end">
							<InputGroupText>AUD</InputGroupText>
						</InputGroupAddon>
					</InputGroup>
				) : (
					<span className="tabular-nums">{formatBudgetPrice(item.price)}</span>
				)}
			</TableCell>
		</TableRow>
	);
}

function ItemsSection({
	items,
	editMode,
	onSaveItem,
}: {
	items: TemplateItem[] | undefined;
	editMode: boolean;
	onSaveItem: (tradeId: Id<'trades'>, price: number) => Promise<void>;
}) {
	if (items === undefined) {
		return <div className="text-muted-foreground text-sm">Loading items…</div>;
	}

	if (items.length === 0) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Wallet aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No trades yet</EmptyTitle>
					<EmptyDescription>
						Create trades to set budget prices for this template.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div className="rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Trade</TableHead>
						<TableHead>Price</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.map((item) => (
						<TradeItemRow
							editMode={editMode}
							item={item}
							key={item._id}
							onSave={(price) => onSaveItem(item.tradeId, price)}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

export default function BudgetTemplateDetailView({
	budgetTemplateId,
}: {
	budgetTemplateId: Id<'budgetTemplates'>;
}) {
	const template = useQuery(api.budgetTemplates.get.get, { budgetTemplateId });
	const items = useQuery(
		api.budgetTemplateItems.listByTemplate.listByTemplate,
		{ budgetTemplateId }
	) as TemplateItem[] | undefined;

	const setPrice = useMutation(api.budgetTemplateItems.setPrice.setPrice);
	const ensureAllTrades = useMutation(
		api.budgetTemplateItems.ensureAllTrades.ensureAllTrades
	);

	const [editMode, setEditMode] = useState(false);

	// Backfill a $0 row for any trade added after this template was created.
	useEffect(() => {
		ensureAllTrades({ budgetTemplateId }).catch(() => {
			/* Non-blocking: missing rows simply won't appear until next open */
		});
	}, [budgetTemplateId, ensureAllTrades]);

	const handleSaveItem = async (tradeId: Id<'trades'>, price: number) => {
		try {
			await setPrice({ budgetTemplateId, tradeId, price });
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not update price. Please try again in a moment.'
				),
				title: 'Could not update price',
				type: 'error',
			});
			throw error;
		}
	};

	if (template === undefined) {
		return <div className="text-muted-foreground text-sm">Loading…</div>;
	}

	if (template === null) {
		return (
			<div className="text-muted-foreground text-sm">
				Budget template not found.
			</div>
		);
	}

	return (
		<div className="flex min-h-0 min-w-0 flex-1 flex-col">
			<PageHeading
				backLink="/budgets"
				description={template.description}
				heading={template.title}
				metaSlot={
					<Badge size="lg" variant="outline">
						Total {formatBudgetPrice(template.totalPrice)}
					</Badge>
				}
				rightSlot={
					<AddBudgetTemplateToProject
						budgetTemplateId={budgetTemplateId}
						templateTitle={template.title}
					/>
				}
			/>

			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-2">
					<Switch
						checked={editMode}
						id="budget-template-edit-mode"
						onCheckedChange={setEditMode}
					/>
					<Label htmlFor="budget-template-edit-mode">Edit Mode</Label>
				</div>

				<ItemsSection
					editMode={editMode}
					items={items}
					onSaveItem={handleSaveItem}
				/>
			</div>
		</div>
	);
}
