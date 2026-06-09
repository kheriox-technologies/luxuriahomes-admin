'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import {
	Accordion,
	AccordionItem,
	AccordionPanel,
	AccordionPrimitive,
} from '@workspace/ui/components/accordion';
import { Badge } from '@workspace/ui/components/badge';
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import { ChevronDownIcon, GitCompareArrows } from 'lucide-react';
import { useMemo, useState } from 'react';
import PageHeading from '@/components/page-heading';
import type { QuotationStatus } from './quotation-form-shared';

// ─── Types ──────────────────────────────────────────────────────────────────

interface CompareQuotation {
	_id: Id<'quotations'>;
	companyName: string;
	price: number;
	projectId: Id<'projects'>;
	projectName: string;
	serviceProviderId: Id<'serviceProviders'>;
	status: QuotationStatus;
	tradeIds: Id<'trades'>[];
	tradeNames: string[];
}

interface CellData {
	quotations: CompareQuotation[];
	statuses: Set<QuotationStatus>;
	totalPrice: number;
}

interface CompanyGroup {
	byProject: Map<Id<'projects'>, CellData>;
	companyName: string;
	serviceProviderId: Id<'serviceProviders'>;
}

interface TradeGroup {
	companies: Map<Id<'serviceProviders'>, CompanyGroup>;
	countByProject: Map<Id<'projects'>, number>;
	tradeId: Id<'trades'>;
	tradeName: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(price: number): string {
	return new Intl.NumberFormat('en-AU', {
		currency: 'AUD',
		style: 'currency',
	}).format(price);
}

function buildQuotationsLink(
	projectId: Id<'projects'>,
	tradeId: Id<'trades'>,
	status?: QuotationStatus
): string {
	const params = new URLSearchParams({ projectId, tradeId });
	if (status) {
		params.set('status', status);
	}
	return `/quotations?${params.toString()}`;
}

function buildCompareData(
	quotations: CompareQuotation[],
	filterTradeIds: Id<'trades'>[] | null,
	filterServiceProviderIds: Id<'serviceProviders'>[] | null
): Map<Id<'trades'>, TradeGroup> {
	const tradeMap = new Map<Id<'trades'>, TradeGroup>();

	for (const q of quotations) {
		if (
			filterServiceProviderIds &&
			!filterServiceProviderIds.includes(q.serviceProviderId)
		) {
			continue;
		}

		for (let i = 0; i < q.tradeIds.length; i++) {
			const tradeId = q.tradeIds[i];
			const tradeName = q.tradeNames[i] ?? '';

			if (filterTradeIds && !filterTradeIds.includes(tradeId)) {
				continue;
			}

			let trade = tradeMap.get(tradeId);
			if (!trade) {
				trade = {
					tradeName,
					tradeId,
					countByProject: new Map(),
					companies: new Map(),
				};
				tradeMap.set(tradeId, trade);
			}

			trade.countByProject.set(
				q.projectId,
				(trade.countByProject.get(q.projectId) ?? 0) + 1
			);

			let company = trade.companies.get(q.serviceProviderId);
			if (!company) {
				company = {
					companyName: q.companyName,
					serviceProviderId: q.serviceProviderId,
					byProject: new Map(),
				};
				trade.companies.set(q.serviceProviderId, company);
			}

			let cell = company.byProject.get(q.projectId);
			if (!cell) {
				cell = { quotations: [], totalPrice: 0, statuses: new Set() };
				company.byProject.set(q.projectId, cell);
			}
			cell.quotations.push(q);
			cell.totalPrice += q.price;
			cell.statuses.add(q.status);
		}
	}

	return tradeMap;
}

// ─── AmountCell ───────────────────────────────────────────────────────────────

function AmountCell({
	cell,
	projectId,
	tradeId,
}: {
	cell: CellData;
	projectId: Id<'projects'>;
	tradeId: Id<'trades'>;
}) {
	const isMixed = cell.statuses.size > 1;
	const singleStatus = isMixed ? undefined : [...cell.statuses][0];
	const href = buildQuotationsLink(projectId, tradeId, singleStatus);

	let badgeVariant: 'destructive' | 'outline' | 'success' | 'warning';
	if (isMixed) {
		badgeVariant = 'outline';
	} else if (singleStatus === 'Approved') {
		badgeVariant = 'success';
	} else if (singleStatus === 'Under Review') {
		badgeVariant = 'warning';
	} else {
		badgeVariant = 'destructive';
	}

	return (
		<a
			className="inline-flex transition-opacity hover:opacity-75"
			href={href}
			rel="noopener noreferrer"
			target="_blank"
		>
			<Badge
				className={cn(isMixed && 'border-0 bg-gray-400 text-gray-900')}
				size="lg"
				variant={badgeVariant}
			>
				{formatPrice(cell.totalPrice)}
			</Badge>
		</a>
	);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ComparePageContent() {
	const [selectedProjectIds, setSelectedProjectIds] = useState<
		Id<'projects'>[]
	>([]);
	const [filterTradeIds, setFilterTradeIds] = useState<Id<'trades'>[] | null>(
		null
	);
	const [filterServiceProviderIds, setFilterServiceProviderIds] = useState<
		Id<'serviceProviders'>[] | null
	>(null);

	const quotations = useQuery(
		api.quotations.listByProjects.listByProjects,
		selectedProjectIds.length > 0 ? { projectIds: selectedProjectIds } : 'skip'
	) as CompareQuotation[] | undefined;

	const projects = useQuery(api.projects.list.list, {});

	const projectNameById = useMemo(
		() => new Map((projects ?? []).map((p) => [p._id, p.name])),
		[projects]
	);

	const availableTradeIds = useMemo(() => {
		if (!quotations) {
			return [];
		}
		return [...new Set(quotations.flatMap((q) => q.tradeIds))];
	}, [quotations]);

	const tradeNameById = useMemo(() => {
		if (!quotations) {
			return new Map<Id<'trades'>, string>();
		}
		const map = new Map<Id<'trades'>, string>();
		for (const q of quotations) {
			for (let i = 0; i < q.tradeIds.length; i++) {
				map.set(q.tradeIds[i], q.tradeNames[i] ?? '');
			}
		}
		return map;
	}, [quotations]);

	const availableServiceProviderIds = useMemo(() => {
		if (!quotations) {
			return [];
		}
		return [...new Set(quotations.map((q) => q.serviceProviderId))];
	}, [quotations]);

	const companyNameById = useMemo(() => {
		if (!quotations) {
			return new Map<Id<'serviceProviders'>, string>();
		}
		return new Map(quotations.map((q) => [q.serviceProviderId, q.companyName]));
	}, [quotations]);

	const compareData = useMemo(() => {
		if (!quotations) {
			return new Map<Id<'trades'>, TradeGroup>();
		}
		return buildCompareData(
			quotations,
			filterTradeIds,
			filterServiceProviderIds
		);
	}, [quotations, filterTradeIds, filterServiceProviderIds]);

	const gridStyle = {
		gridTemplateColumns: `minmax(12rem, 1.5fr) repeat(${selectedProjectIds.length}, 1fr)`,
	};

	let tableContent: React.ReactNode;

	if (selectedProjectIds.length === 0) {
		tableContent = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<GitCompareArrows aria-hidden />
					</EmptyMedia>
					<EmptyTitle>Select projects to compare</EmptyTitle>
					<EmptyDescription>
						Select up to 5 projects to compare quotations
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else if (quotations === undefined) {
		tableContent = (
			<div className="text-muted-foreground text-sm">Loading quotations…</div>
		);
	} else if (compareData.size === 0) {
		tableContent = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<GitCompareArrows aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No quotations found</EmptyTitle>
					<EmptyDescription>
						No quotations exist for the selected projects and filters.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else {
		tableContent = (
			<div className="overflow-hidden rounded-xl border bg-white shadow-sm">
				{/* Header row */}
				<div className="grid border-b bg-muted/50" style={gridStyle}>
					<div className="px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">
						Company
					</div>
					{selectedProjectIds.map((pid) => (
						<div
							className="truncate px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide"
							key={pid}
						>
							{projectNameById.get(pid) ?? pid}
						</div>
					))}
				</div>

				{/* Trade accordion rows */}
				<Accordion multiple>
					{[...compareData.values()].map((tradeGroup) => (
						<AccordionItem key={tradeGroup.tradeId} value={tradeGroup.tradeId}>
							<AccordionPrimitive.Header className="flex border-b last:border-b-0">
								<AccordionPrimitive.Trigger
									className={cn(
										'grid flex-1 cursor-pointer bg-muted/20 outline-none transition-colors hover:bg-muted/40',
										'focus-visible:ring-[3px] focus-visible:ring-ring',
										'[&[data-panel-open]_[data-slot=accordion-indicator]]:rotate-180'
									)}
									style={gridStyle}
								>
									<div className="flex items-center gap-2 px-4 py-3 font-medium text-sm">
										{tradeGroup.tradeName}
										<ChevronDownIcon
											className="size-4 shrink-0 opacity-70 transition-transform duration-200"
											data-slot="accordion-indicator"
										/>
									</div>
									{selectedProjectIds.map((pid) => {
										const count = tradeGroup.countByProject.get(pid);
										return (
											<div className="flex items-center px-4 py-3" key={pid}>
												{count ? (
													<Badge size="lg" variant="outline">
														{count}
													</Badge>
												) : null}
											</div>
										);
									})}
								</AccordionPrimitive.Trigger>
							</AccordionPrimitive.Header>

							<AccordionPanel className="p-0">
								{[...tradeGroup.companies.values()].map((company) => (
									<div
										className="grid border-b last:border-b-0"
										key={company.serviceProviderId}
										style={gridStyle}
									>
										<div className="flex items-center px-4 py-2.5 pl-8 text-muted-foreground text-sm">
											{company.companyName}
										</div>
										{selectedProjectIds.map((pid) => {
											const cell = company.byProject.get(pid);
											return (
												<div
													className="flex items-center px-4 py-2.5"
													key={pid}
												>
													{cell ? (
														<AmountCell
															cell={cell}
															projectId={pid}
															tradeId={tradeGroup.tradeId}
														/>
													) : (
														<span className="text-muted-foreground text-sm">
															—
														</span>
													)}
												</div>
											);
										})}
									</div>
								))}
							</AccordionPanel>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<PageHeading
				className="mb-0"
				heading="Compare Quotations"
				icon={GitCompareArrows}
			/>

			{/* Filter row */}
			<div className="grid grid-cols-3 gap-2">
				{/* Projects multi-select (max 5) */}
				<Combobox
					items={(projects ?? []).map((p) => p._id)}
					itemToStringLabel={(val) =>
						projectNameById.get(val as Id<'projects'>) ?? String(val ?? '')
					}
					multiple
					onValueChange={(val) => {
						const ids = (val as Id<'projects'>[] | null) ?? [];
						setSelectedProjectIds(ids.slice(0, 5));
					}}
					value={selectedProjectIds}
				>
					<ComboboxChips>
						{selectedProjectIds.map((id) => (
							<ComboboxChip key={id}>
								{projectNameById.get(id) ?? id}
							</ComboboxChip>
						))}
						<ComboboxChipsInput placeholder="Select projects (max 5)…" />
					</ComboboxChips>
					<ComboboxPopup>
						<ComboboxEmpty>No projects found.</ComboboxEmpty>
						<ComboboxList>
							{(pid: Id<'projects'>) => (
								<ComboboxItem key={pid} value={pid}>
									{projectNameById.get(pid) ?? pid}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxPopup>
				</Combobox>

				{/* Trades multi-select */}
				<Combobox
					disabled={availableTradeIds.length === 0}
					items={availableTradeIds}
					itemToStringLabel={(val) =>
						tradeNameById.get(val as Id<'trades'>) ?? String(val ?? '')
					}
					multiple
					onValueChange={(val) => {
						const ids = (val as Id<'trades'>[] | null) ?? [];
						setFilterTradeIds(ids.length > 0 ? ids : null);
					}}
					value={filterTradeIds ?? []}
				>
					<ComboboxChips>
						{(filterTradeIds ?? []).map((id) => (
							<ComboboxChip key={id}>
								{tradeNameById.get(id) ?? id}
							</ComboboxChip>
						))}
						<ComboboxChipsInput placeholder="All trades…" />
					</ComboboxChips>
					<ComboboxPopup>
						<ComboboxEmpty>No trades found.</ComboboxEmpty>
						<ComboboxList>
							{(tradeId: Id<'trades'>) => (
								<ComboboxItem key={tradeId} value={tradeId}>
									{tradeNameById.get(tradeId) ?? tradeId}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxPopup>
				</Combobox>

				{/* Service Providers multi-select */}
				<Combobox
					disabled={availableServiceProviderIds.length === 0}
					items={availableServiceProviderIds}
					itemToStringLabel={(val) =>
						companyNameById.get(val as Id<'serviceProviders'>) ??
						String(val ?? '')
					}
					multiple
					onValueChange={(val) => {
						const ids = (val as Id<'serviceProviders'>[] | null) ?? [];
						setFilterServiceProviderIds(ids.length > 0 ? ids : null);
					}}
					value={filterServiceProviderIds ?? []}
				>
					<ComboboxChips>
						{(filterServiceProviderIds ?? []).map((id) => (
							<ComboboxChip key={id}>
								{companyNameById.get(id) ?? id}
							</ComboboxChip>
						))}
						<ComboboxChipsInput placeholder="All service providers…" />
					</ComboboxChips>
					<ComboboxPopup>
						<ComboboxEmpty>No service providers found.</ComboboxEmpty>
						<ComboboxList>
							{(spId: Id<'serviceProviders'>) => (
								<ComboboxItem key={spId} value={spId}>
									{companyNameById.get(spId) ?? spId}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxPopup>
				</Combobox>
			</div>

			{tableContent}
		</div>
	);
}
