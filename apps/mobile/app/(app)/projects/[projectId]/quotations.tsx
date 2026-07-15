import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import {
	ChevronsDown,
	ChevronsUp,
	DollarSign,
	Plus,
} from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import type { QuotationFormSheetHandle } from '@/components/quotations/quotation-form-sheet';
import { QuotationFormSheet } from '@/components/quotations/quotation-form-sheet';
import type { QuotationNotesSheetHandle } from '@/components/quotations/quotation-notes-sheet';
import { QuotationNotesSheet } from '@/components/quotations/quotation-notes-sheet';
import { QuotationTradeAccordion } from '@/components/quotations/quotation-trade-accordion';
import {
	type ProjectQuotation,
	QUOTATION_STATUSES,
	type QuotationGroup,
	type QuotationStatus,
} from '@/components/quotations/types';
import { useThemeColors } from '@/components/theme';
import { EmptyState } from '@/components/ui/empty-state';
import { MultiSelect } from '@/components/ui/multi-select';
import { SearchBar } from '@/components/ui/search-bar';
import { ListSkeleton } from '@/components/ui/skeleton';

const STATUS_OPTIONS = QUOTATION_STATUSES.map((value) => ({
	value,
	label: value,
}));

function ToolbarIconButton({
	icon: Icon,
	label,
	onPress,
}: {
	icon: LucideIcon;
	label: string;
	onPress: () => void;
}) {
	const colors = useThemeColors();
	return (
		<Pressable
			accessibilityLabel={label}
			accessibilityRole="button"
			className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
			hitSlop={4}
			onPress={onPress}
		>
			<Icon color={colors.foreground} size={18} strokeWidth={2} />
		</Pressable>
	);
}

function QuotationsBody({ projectId }: { projectId: Id<'projects'> }) {
	const quotations = useQuery(
		api.projectQuotations.listByProject.listByProject,
		{ projectId }
	) as ProjectQuotation[] | undefined;
	const tradeSummary = useQuery(api.projectBudgets.tradeSummary.tradeSummary, {
		projectId,
	});

	const [search, setSearch] = useState('');
	const [filterTradeIds, setFilterTradeIds] = useState<Id<'trades'>[]>([]);
	const [filterStatuses, setFilterStatuses] = useState<QuotationStatus[]>([]);
	const [collapsedKeys, setCollapsedKeys] = useState<Set<string>>(new Set());
	const notesSheetRef = useRef<QuotationNotesSheetHandle>(null);
	const formSheetRef = useRef<QuotationFormSheetHandle>(null);
	const didInitCollapse = useRef(false);

	// Trades start collapsed. Seed collapsedKeys with every trade id the first
	// time quotations load so the accordions render closed by default.
	useEffect(() => {
		if (didInitCollapse.current || quotations === undefined) {
			return;
		}
		didInitCollapse.current = true;
		setCollapsedKeys(new Set(quotations.map((quotation) => quotation.tradeId)));
	}, [quotations]);

	const budgetByTradeId = useMemo(() => {
		const map = new Map<
			Id<'trades'>,
			{ budgetPrice: number | null; xeroActual: number | null }
		>();
		for (const row of tradeSummary ?? []) {
			map.set(row.tradeId, {
				budgetPrice: row.budgetPrice,
				xeroActual: row.xeroActual,
			});
		}
		return map;
	}, [tradeSummary]);

	// Trade filter options come from the trades that actually have quotations.
	const tradeOptions = useMemo(() => {
		const map = new Map<Id<'trades'>, string>();
		for (const quotation of quotations ?? []) {
			map.set(quotation.tradeId, quotation.tradeName);
		}
		return [...map.entries()]
			.map(([value, label]) => ({ value, label }))
			.sort((a, b) => a.label.localeCompare(b.label));
	}, [quotations]);

	const trimmedSearch = search.trim().toLowerCase();

	const groups = useMemo<QuotationGroup[]>(() => {
		if (!quotations) {
			return [];
		}
		const filtered = quotations.filter((quotation) => {
			if (
				filterTradeIds.length > 0 &&
				!filterTradeIds.includes(quotation.tradeId)
			) {
				return false;
			}
			if (
				filterStatuses.length > 0 &&
				!filterStatuses.includes(quotation.status as QuotationStatus)
			) {
				return false;
			}
			if (
				trimmedSearch &&
				!`${quotation.title} ${quotation.tradeName} ${quotation.companyName}`
					.toLowerCase()
					.includes(trimmedSearch)
			) {
				return false;
			}
			return true;
		});

		const map = new Map<string, QuotationGroup>();
		for (const quotation of filtered) {
			const key = quotation.tradeId as string;
			let group = map.get(key);
			if (!group) {
				const budget = budgetByTradeId.get(quotation.tradeId);
				group = {
					key,
					tradeId: quotation.tradeId,
					tradeName: quotation.tradeName,
					quotations: [],
					budgetPrice: budget?.budgetPrice ?? null,
					xeroActual: budget?.xeroActual ?? null,
				};
				map.set(key, group);
			}
			group.quotations.push(quotation);
		}
		return [...map.values()].sort((a, b) =>
			a.tradeName.localeCompare(b.tradeName, undefined, { sensitivity: 'base' })
		);
	}, [
		quotations,
		trimmedSearch,
		filterTradeIds,
		filterStatuses,
		budgetByTradeId,
	]);

	if (quotations === undefined) {
		return <ListSkeleton />;
	}

	const toggleTrade = (value: Id<'trades'>) =>
		setFilterTradeIds((prev) =>
			prev.includes(value)
				? prev.filter((id) => id !== value)
				: [...prev, value]
		);
	const toggleStatus = (value: QuotationStatus) =>
		setFilterStatuses((prev) =>
			prev.includes(value)
				? prev.filter((status) => status !== value)
				: [...prev, value]
		);
	const toggleKey = (key: string) =>
		setCollapsedKeys((prev) => {
			const next = new Set(prev);
			if (next.has(key)) {
				next.delete(key);
			} else {
				next.add(key);
			}
			return next;
		});
	const expandAll = () => setCollapsedKeys(new Set());
	const collapseAll = () =>
		setCollapsedKeys(new Set(groups.map((group) => group.key)));

	const emptyDescription =
		quotations.length === 0
			? 'Tap the + button to add a quotation.'
			: 'No quotations match your filters.';

	return (
		<View className="flex-1">
			<View className="gap-2 px-4 pt-2 pb-3">
				<View className="flex-row items-center gap-2">
					<MultiSelect
						className="flex-1"
						onToggle={toggleTrade}
						options={tradeOptions}
						placeholder="All trades"
						title="Filter by trade"
						values={filterTradeIds}
					/>
					<MultiSelect
						className="flex-1"
						onToggle={toggleStatus}
						options={STATUS_OPTIONS}
						placeholder="All statuses"
						title="Filter by status"
						values={filterStatuses}
					/>
					<ToolbarIconButton
						icon={ChevronsDown}
						label="Expand all trades"
						onPress={expandAll}
					/>
					<ToolbarIconButton
						icon={ChevronsUp}
						label="Collapse all trades"
						onPress={collapseAll}
					/>
					<ToolbarIconButton
						icon={Plus}
						label="Add quotation"
						onPress={() => formSheetRef.current?.present()}
					/>
				</View>
				<SearchBar
					onChangeText={setSearch}
					placeholder="Search by title, trade, or provider"
					value={search}
				/>
			</View>
			<FlatList
				contentContainerClassName="pb-6"
				data={groups}
				keyExtractor={(item) => item.key}
				ListEmptyComponent={
					<EmptyState
						description={emptyDescription}
						icon={DollarSign}
						title="No quotations"
					/>
				}
				renderItem={({ item }) => (
					<QuotationTradeAccordion
						expanded={!collapsedKeys.has(item.key)}
						formSheetRef={formSheetRef}
						group={item}
						notesSheetRef={notesSheetRef}
						onToggle={() => toggleKey(item.key)}
					/>
				)}
			/>
			<QuotationNotesSheet ref={notesSheetRef} />
			<QuotationFormSheet projectId={projectId} ref={formSheetRef} />
		</View>
	);
}

export default function QuotationsScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	return <QuotationsBody projectId={projectId as Id<'projects'>} />;
}
