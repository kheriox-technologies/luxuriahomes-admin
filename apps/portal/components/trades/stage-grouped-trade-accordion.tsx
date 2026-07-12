'use client';

import type { Doc, Id } from '@workspace/backend/dataModel';
import {
	Accordion,
	AccordionItem,
	AccordionPanel,
	AccordionPrimitive,
} from '@workspace/ui/components/accordion';
import { Badge } from '@workspace/ui/components/badge';
import { ChevronDownIcon } from 'lucide-react';
import {
	type ReactNode,
	type Ref,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import { formatBudgetPrice } from '@/components/budgets/budget-form-shared';
import { UNGROUPED_KEY } from './trade-stage-form-shared';

export interface StageGroupedTradeAccordionHandle {
	collapseAll: () => void;
	expandAll: () => void;
}

// One collapsible trade section. `content` is the trade's quotes/orders table.
export interface TradeAccordionItem {
	budgetPrice: number | null;
	content: ReactNode;
	count: number;
	stageId: Id<'tradeStages'> | null;
	tradeId: Id<'trades'>;
	tradeName: string;
	tradeOrder: number | null;
	// Xero-driven "Actual" for the trade; null when nothing has synced.
	xeroActual: number | null;
}

interface StageTradeGroup {
	items: TradeAccordionItem[];
	key: string;
	name: string;
}

const MAX_TRADE_ORDER = Number.MAX_SAFE_INTEGER;

// Green when the Xero actual is within budget, red when over, neutral when the
// trade has no budget set — mirrors the Budgets tab colour logic.
function actualBadgeVariant(
	actual: number,
	budgetPrice: number | null
): 'success-outline' | 'destructive-outline' | 'secondary' {
	if (budgetPrice === null) {
		return 'secondary';
	}
	return actual <= budgetPrice ? 'success-outline' : 'destructive-outline';
}

function TradeBudgetBadges({ item }: { item: TradeAccordionItem }) {
	return (
		<span className="flex items-center gap-2">
			{item.budgetPrice === null ? (
				<Badge size="lg" variant="outline">
					No budget
				</Badge>
			) : (
				<Badge size="lg" variant="purple">
					B {formatBudgetPrice(item.budgetPrice)}
				</Badge>
			)}
			{item.xeroActual === null ? null : (
				<Badge
					size="lg"
					variant={actualBadgeVariant(item.xeroActual, item.budgetPrice)}
				>
					A {formatBudgetPrice(item.xeroActual)}
				</Badge>
			)}
		</span>
	);
}

function TradeAccordionSection({ item }: { item: TradeAccordionItem }) {
	return (
		<AccordionItem className="border-b last:border-b-0" value={item.tradeId}>
			<AccordionPrimitive.Header className="flex">
				<AccordionPrimitive.Trigger
					className="flex flex-1 cursor-pointer items-center justify-between gap-2 px-4 py-3 outline-none transition-colors hover:bg-muted/40 focus-visible:ring-[3px] focus-visible:ring-ring [&[data-panel-open]_[data-slot=accordion-indicator]]:rotate-180"
					type="button"
				>
					<span className="flex items-center gap-2 font-medium text-sm">
						{item.tradeName}
						<ChevronDownIcon
							className="size-4 shrink-0 opacity-70 transition-transform duration-200"
							data-slot="accordion-indicator"
						/>
						<Badge size="lg" variant="outline">
							{item.count}
						</Badge>
					</span>
					<TradeBudgetBadges item={item} />
				</AccordionPrimitive.Trigger>
			</AccordionPrimitive.Header>
			<AccordionPanel className="overflow-x-auto p-0">
				{item.content}
			</AccordionPanel>
		</AccordionItem>
	);
}

function StageSection({ group }: { group: StageTradeGroup }) {
	const isUngrouped = group.key === UNGROUPED_KEY;
	return (
		<div
			className={
				isUngrouped
					? 'rounded-lg border border-dashed bg-card'
					: 'rounded-lg border bg-card'
			}
		>
			<AccordionItem className="border-b-0" value={group.key}>
				<AccordionPrimitive.Header className="flex">
					<AccordionPrimitive.Trigger
						className="flex flex-1 cursor-pointer items-center justify-between gap-2 px-4 py-3 outline-none transition-colors hover:bg-muted/40 focus-visible:ring-[3px] focus-visible:ring-ring [&[data-panel-open]_[data-slot=stage-indicator]]:rotate-180"
						type="button"
					>
						<span className="flex items-center gap-2 font-medium text-sm">
							<span
								className={isUngrouped ? 'text-muted-foreground' : undefined}
							>
								{group.name}
							</span>
							<Badge size="lg" variant="secondary">
								{group.items.length}
							</Badge>
						</span>
						<ChevronDownIcon
							className="size-4 shrink-0 opacity-70 transition-transform duration-200"
							data-slot="stage-indicator"
						/>
					</AccordionPrimitive.Trigger>
				</AccordionPrimitive.Header>
				<AccordionPanel className="px-3 pb-3">
					{/* Uncontrolled: trade sections are toggled individually — the
					    Expand/Collapse controls act on stages only. */}
					<Accordion className="rounded-lg border" multiple>
						{group.items.map((item) => (
							<TradeAccordionSection item={item} key={item.tradeId} />
						))}
					</Accordion>
				</AccordionPanel>
			</AccordionItem>
		</div>
	);
}

export function StageGroupedTradeAccordion({
	stages,
	items,
	ref,
}: {
	items: TradeAccordionItem[];
	ref?: Ref<StageGroupedTradeAccordionHandle>;
	stages: Doc<'tradeStages'>[] | undefined;
}) {
	const [openStageKeys, setOpenStageKeys] = useState<string[]>([]);
	const initializedRef = useRef(false);

	const groups = useMemo<StageTradeGroup[]>(() => {
		if (!stages) {
			return [];
		}
		const sortItems = (list: TradeAccordionItem[]) =>
			[...list].sort((a, b) => {
				const byOrder =
					(a.tradeOrder ?? MAX_TRADE_ORDER) - (b.tradeOrder ?? MAX_TRADE_ORDER);
				if (byOrder !== 0) {
					return byOrder;
				}
				return a.tradeName.localeCompare(b.tradeName, undefined, {
					sensitivity: 'base',
				});
			});
		const byStage = new Map<string, TradeAccordionItem[]>();
		const ungrouped: TradeAccordionItem[] = [];
		for (const item of items) {
			if (item.stageId) {
				const list = byStage.get(item.stageId) ?? [];
				list.push(item);
				byStage.set(item.stageId, list);
			} else {
				ungrouped.push(item);
			}
		}
		const built: StageTradeGroup[] = [];
		for (const stage of stages) {
			const stageItems = byStage.get(stage._id);
			if (stageItems && stageItems.length > 0) {
				built.push({
					key: stage._id,
					name: stage.name,
					items: sortItems(stageItems),
				});
			}
		}
		if (ungrouped.length > 0) {
			built.push({
				key: UNGROUPED_KEY,
				name: 'Ungrouped',
				items: sortItems(ungrouped),
			});
		}
		return built;
	}, [stages, items]);

	// Open every stage the first time data loads.
	useEffect(() => {
		if (groups.length > 0 && !initializedRef.current) {
			initializedRef.current = true;
			setOpenStageKeys(groups.map((g) => g.key));
		}
	}, [groups]);

	useImperativeHandle(
		ref,
		() => ({
			expandAll: () => setOpenStageKeys(groups.map((g) => g.key)),
			collapseAll: () => setOpenStageKeys([]),
		}),
		[groups]
	);

	return (
		<Accordion
			className="flex flex-col gap-3"
			multiple
			onValueChange={(value) => setOpenStageKeys(value as string[])}
			value={openStageKeys}
		>
			{groups.map((group) => (
				<StageSection group={group} key={group.key} />
			))}
		</Accordion>
	);
}
