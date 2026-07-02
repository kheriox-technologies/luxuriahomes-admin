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
import { Input } from '@workspace/ui/components/input';
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
import {
	formatBudgetPrice,
	isValidMoneyString,
	parseMoneyString,
} from './budget-form-shared';
import DeleteBudgetTemplateItem from './delete-budget-template-item';
import { usePriceEditing } from './use-price-editing';

type TemplateItem = Doc<'budgetTemplateItems'> & { tradeName: string | null };

function TradeItemRow({
	item,
	isEditing,
	draftValue,
	nameDraftValue,
	onDraftChange,
	onNameDraftChange,
}: {
	item: TemplateItem;
	isEditing: boolean;
	draftValue: string;
	nameDraftValue: string;
	onDraftChange: (value: string) => void;
	onNameDraftChange: (value: string) => void;
}) {
	const tradeName = item.tradeName ?? 'Unknown trade';

	return (
		<TableRow>
			<TableCell className="font-medium">
				{isEditing ? (
					<Input
						aria-label={`Trade name for ${tradeName}`}
						className="max-w-64"
						nativeInput
						onChange={(e) => onNameDraftChange(e.target.value)}
						placeholder="Trade name"
						type="text"
						value={nameDraftValue}
					/>
				) : (
					(item.tradeName ?? (
						<span className="text-muted-foreground">Unknown trade</span>
					))
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
	nameDrafts,
	onDraftChange,
	onNameDraftChange,
}: {
	items: TemplateItem[] | undefined;
	isEditing: boolean;
	drafts: Record<string, string>;
	nameDrafts: Record<string, string>;
	onDraftChange: (tradeId: string, value: string) => void;
	onNameDraftChange: (tradeId: string, value: string) => void;
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
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border">
			<Table containerClassName="min-h-0 flex-1 overflow-y-auto">
				<TableHeader className="[&_th]:sticky [&_th]:top-0 [&_th]:z-10 [&_th]:bg-background">
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
							nameDraftValue={nameDrafts[item.tradeId] ?? ''}
							onDraftChange={(value) => onDraftChange(item.tradeId, value)}
							onNameDraftChange={(value) =>
								onNameDraftChange(item.tradeId, value)
							}
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
	const updateTrade = useMutation(api.trades.update.update);

	const {
		isEditing,
		drafts,
		nameDrafts,
		begin,
		setDraft,
		setNameDraft,
		cancel,
		getChanges,
		getNameChanges,
	} = usePriceEditing();
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
				name: item.tradeName ?? '',
			}))
		);
	};

	const handleDone = async () => {
		const changes = getChanges();
		const nameChanges = getNameChanges();
		if (changes.length === 0 && nameChanges.length === 0) {
			cancel();
			return;
		}
		setIsSaving(true);
		try {
			await Promise.all([
				changes.length > 0
					? setPrices({
							budgetTemplateId,
							items: changes.map((change) => ({
								tradeId: change.tradeId as Id<'trades'>,
								price: change.price,
							})),
						})
					: Promise.resolve(),
				...nameChanges.map((change) =>
					updateTrade({
						tradeId: change.tradeId as Id<'trades'>,
						name: change.name,
					})
				),
			]);
			toastManager.add({ title: 'Changes saved', type: 'success' });
			cancel();
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not save changes. Please try again in a moment.'
				),
				title: 'Could not save changes',
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

	const displayTotal =
		isEditing && items
			? items.reduce((sum, item) => {
					const raw = (drafts[item.tradeId] ?? '').trim();
					return (
						sum +
						(raw.length > 0 && isValidMoneyString(raw)
							? parseMoneyString(raw)
							: (item.price ?? 0))
					);
				}, 0)
			: template.totalPrice;

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
					<Badge size="lg" variant="purple">
						Total {formatBudgetPrice(displayTotal)}
					</Badge>
				}
			/>

			<ItemsSection
				drafts={drafts}
				isEditing={isEditing}
				items={items}
				nameDrafts={nameDrafts}
				onDraftChange={setDraft}
				onNameDraftChange={setNameDraft}
			/>
		</div>
	);
}
