'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
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
import { Pencil, Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';
import PageHeading from '@/components/page-heading';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import AddBudgetItemDialog from './add-budget-item-dialog';
import AddBudgetTemplateToProject from './add-budget-template-to-project';
import { formatBudgetPrice } from './budget-form-shared';
import DeleteBudgetTemplateItem from './delete-budget-template-item';
import { usePriceEditing } from './use-price-editing';

type TemplateItem = Doc<'budgetTemplateItems'> & { tradeName: string | null };

function TradeItemRow({
	item,
	isEditing,
	draftValue,
	onDraftChange,
}: {
	item: TemplateItem;
	isEditing: boolean;
	draftValue: string;
	onDraftChange: (value: string) => void;
}) {
	const tradeName = item.tradeName ?? 'Unknown trade';

	return (
		<TableRow>
			<TableCell className="font-medium">
				{item.tradeName ?? (
					<span className="text-muted-foreground">Unknown trade</span>
				)}
			</TableCell>
			<TableCell>
				{isEditing ? (
					<InputGroup className="max-w-48">
						<InputGroupAddon align="inline-start">
							<InputGroupText>$</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							aria-label={`Price for ${tradeName}`}
							inputMode="decimal"
							nativeInput
							onChange={(e) => onDraftChange(e.target.value)}
							placeholder="0.00"
							type="text"
							value={draftValue}
						/>
						<InputGroupAddon align="inline-end">
							<InputGroupText>AUD</InputGroupText>
						</InputGroupAddon>
					</InputGroup>
				) : (
					<span className="tabular-nums">{formatBudgetPrice(item.price)}</span>
				)}
			</TableCell>
			<TableCell className="text-right">
				<DeleteBudgetTemplateItem
					budgetTemplateItemId={item._id}
					itemName={tradeName}
				/>
			</TableCell>
		</TableRow>
	);
}

function ItemsSection({
	items,
	isEditing,
	drafts,
	onDraftChange,
}: {
	items: TemplateItem[] | undefined;
	isEditing: boolean;
	drafts: Record<string, string>;
	onDraftChange: (tradeId: string, value: string) => void;
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
					<EmptyTitle>No items yet</EmptyTitle>
					<EmptyDescription>
						Use “Add Item” to add trades and set budget prices for this
						template.
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
						<TableHead className="sr-only">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.map((item) => (
						<TradeItemRow
							draftValue={drafts[item.tradeId] ?? ''}
							isEditing={isEditing}
							item={item}
							key={item._id}
							onDraftChange={(value) => onDraftChange(item.tradeId, value)}
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

	const setPrices = useMutation(api.budgetTemplateItems.setPrices.setPrices);
	const addItem = useMutation(api.budgetTemplateItems.addItem.addItem);

	const { isEditing, drafts, begin, setDraft, cancel, getChanges } =
		usePriceEditing();
	const [isSaving, setIsSaving] = useState(false);

	const usedTradeIds = useMemo(
		() => items?.map((item) => item.tradeId) ?? [],
		[items]
	);

	const handleEdit = () => {
		begin(
			(items ?? []).map((item) => ({
				tradeId: item.tradeId,
				price: item.price,
			}))
		);
	};

	const handleDone = async () => {
		const changes = getChanges();
		if (changes.length === 0) {
			cancel();
			return;
		}
		setIsSaving(true);
		try {
			await setPrices({
				budgetTemplateId,
				items: changes.map((change) => ({
					tradeId: change.tradeId as Id<'trades'>,
					price: change.price,
				})),
			});
			toastManager.add({ title: 'Prices saved', type: 'success' });
			cancel();
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not save prices. Please try again in a moment.'
				),
				title: 'Could not save prices',
				type: 'error',
			});
		} finally {
			setIsSaving(false);
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
		<div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
			<PageHeading
				backLink="/budgets"
				description={template.description}
				heading={template.title}
				rightSlot={
					<>
						{isEditing ? (
							<Button
								loading={isSaving}
								onClick={() => {
									handleDone().catch(() => {
										/* Error handled in handleDone */
									});
								}}
								type="button"
							>
								Done
							</Button>
						) : (
							<Button onClick={handleEdit} type="button" variant="outline">
								<Pencil />
								Edit
							</Button>
						)}
						<AddBudgetItemDialog
							excludedTradeIds={usedTradeIds}
							onSubmit={async (args) => {
								await addItem({ budgetTemplateId, ...args });
							}}
						/>
						<AddBudgetTemplateToProject
							budgetTemplateId={budgetTemplateId}
							templateTitle={template.title}
						/>
					</>
				}
				titleTrailing={
					<Badge size="lg" variant="outline">
						Total {formatBudgetPrice(template.totalPrice)}
					</Badge>
				}
			/>

			<ItemsSection
				drafts={drafts}
				isEditing={isEditing}
				items={items}
				onDraftChange={setDraft}
			/>
		</div>
	);
}
