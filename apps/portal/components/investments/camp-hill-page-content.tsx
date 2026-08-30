'use client';

import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import {
	Frame,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from '@workspace/ui/components/frame';
import { Skeleton } from '@workspace/ui/components/skeleton';
import {
	Tabs,
	TabsList,
	TabsPanel,
	TabsTab,
} from '@workspace/ui/components/tabs';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { TrendingUp } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import InvestmentAssumptionsPanel from '@/components/investments/investment-assumptions-panel';
import InvestmentKpiBar from '@/components/investments/investment-kpi-bar';
import InvestmentTransactionSheet from '@/components/investments/investment-transaction-sheet';
import InvestmentTransactionsTable from '@/components/investments/investment-transactions-table';
import ProfitForecastChart from '@/components/investments/profit-forecast-chart';
import PageHeading from '@/components/page-heading';
import { formatAudWhole } from '@/lib/currency';
import {
	buildForecast,
	type ForecastAssumptions,
	monthlyBurn,
} from '@/lib/investment-forecast';

const SLUG = 'camp-hill';

type Transaction = Doc<'investmentTransactions'>;
type TransactionKind = Transaction['kind'];

type StoredAssumptions = Doc<'investmentAssumptions'>;

function sum(transactions: Transaction[]): number {
	return transactions.reduce((total, row) => total + row.amount, 0);
}

/** Strips the Convex system fields, leaving just the forecast inputs. */
function toForecastAssumptions(stored: StoredAssumptions): ForecastAssumptions {
	return {
		salePrice: stored.salePrice,
		realEstateFeePercent: stored.realEstateFeePercent,
		miscCosts: stored.miscCosts,
		remainingLoan: stored.remainingLoan,
		monthlyRepayment: stored.monthlyRepayment,
		interestRatePercent: stored.interestRatePercent,
		stagingPerWeek: stored.stagingPerWeek,
		otherHoldingPerMonth: stored.otherHoldingPerMonth,
		projectManagementPercent: stored.projectManagementPercent,
		projectManagementPaid: stored.projectManagementPaid,
		annualPriceGrowthPercent: stored.annualPriceGrowthPercent,
		scenarioPrices: [...stored.scenarioPrices],
	};
}

/** How long to wait after the last keystroke before writing to Convex. */
const SAVE_DEBOUNCE_MS = 600;

function PageSkeleton() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-9 w-64" />
			<Skeleton className="h-28 w-full" />
			<Skeleton className="h-[360px] w-full" />
		</div>
	);
}

export default function CampHillPageContent() {
	const data = useQuery(api.investments.getBySlug.getBySlug, { slug: SLUG });
	const investmentId = data?.investment._id;
	const transactions = useQuery(
		api.investments.listTransactions.listTransactions,
		investmentId ? { investmentId } : 'skip'
	);

	const [assumptions, setAssumptions] = useState<ForecastAssumptions | null>(
		null
	);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetKind, setSheetKind] = useState<TransactionKind>('holding');
	const [editing, setEditing] = useState<Transaction | null>(null);

	// Seed local state once from Convex, then let the inputs own it so typing
	// stays responsive; the debounced mutation writes back.
	const storedAssumptions = data?.assumptions;
	const hasSeeded = useRef(false);
	useEffect(() => {
		if (storedAssumptions && !hasSeeded.current) {
			hasSeeded.current = true;
			setAssumptions(toForecastAssumptions(storedAssumptions));
		}
	}, [storedAssumptions]);

	// Local state owns the inputs so typing stays responsive; the write to
	// Convex is debounced so a dragged number field does not fire a mutation
	// per keystroke.
	const updateAssumptions = useMutation(
		api.investments.updateAssumptions.updateAssumptions
	);
	const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	useEffect(
		() => () => {
			if (saveTimer.current) {
				clearTimeout(saveTimer.current);
			}
		},
		[]
	);

	const persist = useCallback(
		(next: ForecastAssumptions) => {
			setAssumptions(next);
			if (!investmentId) {
				return;
			}
			if (saveTimer.current) {
				clearTimeout(saveTimer.current);
			}
			saveTimer.current = setTimeout(() => {
				updateAssumptions({ investmentId, ...next }).catch(() => {
					toastManager.add({
						title: 'Could not save assumptions',
						description: 'Your changes are shown but were not stored.',
						type: 'error',
					});
				});
			}, SAVE_DEBOUNCE_MS);
		},
		[investmentId, updateAssumptions]
	);

	const capitalRows = useMemo(
		() => (transactions ?? []).filter((row) => row.kind === 'capital'),
		[transactions]
	);
	// Newest first: the most recent payments are the ones being reviewed.
	const holdingRows = useMemo(
		() =>
			(transactions ?? [])
				.filter((row) => row.kind === 'holding')
				.sort((a, b) => b.date - a.date),
		[transactions]
	);

	// Categories already on the ledger, so the picker offers them next time.
	const usedCategories = useMemo(() => {
		const unique = new Set(
			(transactions ?? []).map((row) => row.category.trim()).filter(Boolean)
		);
		return [...unique].sort((a, b) => a.localeCompare(b));
	}, [transactions]);

	const forecast = useMemo(() => {
		if (!assumptions) {
			return [];
		}
		return buildForecast({
			assumptions,
			capitalIn: sum(capitalRows),
			holdingSpent: sum(holdingRows),
			today: new Date(),
		});
	}, [assumptions, capitalRows, holdingRows]);

	if (!(data && assumptions)) {
		return <PageSkeleton />;
	}

	const { investment } = data;
	const burn = monthlyBurn(assumptions);

	return (
		<div className="flex min-w-0 flex-1 flex-col gap-6">
			<PageHeading
				heading={investment.name}
				icon={TrendingUp}
				titleTrailing={<Badge variant="outline">Holding</Badge>}
			/>

			<InvestmentKpiBar
				capitalIn={sum(capitalRows)}
				holdingSpent={sum(holdingRows)}
				monthlyBurn={burn}
				sellNow={forecast[0]}
			/>

			<Frame>
				<FrameHeader className="flex flex-row items-center justify-between gap-2 py-3">
					<FrameTitle className="min-w-0 truncate leading-none">
						Profit if sold, next 12 months
					</FrameTitle>
					<span className="shrink-0 text-muted-foreground text-xs">
						{formatAudWhole(burn)} eroded per month held
					</span>
				</FrameHeader>
				<FramePanel>
					<ProfitForecastChart forecast={forecast} />
				</FramePanel>
			</Frame>

			<InvestmentAssumptionsPanel
				assumptions={assumptions}
				onChange={(key, value) =>
					persist({
						...assumptions,
						[key]: Number.isFinite(value) ? value : 0,
					})
				}
				onScenarioPricesChange={(scenarioPrices) =>
					persist({ ...assumptions, scenarioPrices })
				}
			/>

			<Tabs defaultValue="holding">
				<TabsList>
					<TabsTab value="holding">Holding costs</TabsTab>
					<TabsTab value="capital">Capital in</TabsTab>
				</TabsList>
				<TabsPanel value="holding">
					<InvestmentTransactionsTable
						description="Mortgage, staging, rates and utilities paid while holding."
						initialPageSize={50}
						onAdd={() => {
							setEditing(null);
							setSheetKind('holding');
							setSheetOpen(true);
						}}
						onEdit={(row) => {
							setEditing(row);
							setSheetOpen(true);
						}}
						title="Holding costs"
						transactions={holdingRows}
					/>
				</TabsPanel>
				<TabsPanel value="capital">
					<InvestmentTransactionsTable
						description="Deposits and settlement funds put into the property."
						onAdd={() => {
							setEditing(null);
							setSheetKind('capital');
							setSheetOpen(true);
						}}
						onEdit={(row) => {
							setEditing(row);
							setSheetOpen(true);
						}}
						title="Capital in"
						transactions={capitalRows}
					/>
				</TabsPanel>
			</Tabs>

			{investmentId ? (
				<InvestmentTransactionSheet
					categories={usedCategories}
					investmentId={investmentId}
					key={editing?._id ?? `new-${sheetKind}`}
					kind={sheetKind}
					onOpenChange={(next) => {
						setSheetOpen(next);
						if (!next) {
							setEditing(null);
						}
					}}
					open={sheetOpen}
					transaction={editing}
				/>
			) : null}
		</div>
	);
}
