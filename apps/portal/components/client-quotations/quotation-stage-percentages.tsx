'use client';

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { formatAudWhole } from '@/lib/currency';

export interface QuotationStageRow {
	amount: number;
	name: string;
	percent: string;
	// The draft stage's local key, not the catalogue id — a revised quotation can
	// carry a stage the catalogue no longer has.
	stageKey: string;
}

/**
 * Per-stage progress-payment split, one row per stage: name, percentage, amount.
 * The total must land on exactly 100% — a quotation whose stage claims don't add
 * up to the contract sum isn't one we can issue — so the composer blocks saving
 * until it does.
 */
export default function QuotationStagePercentages({
	onPercentChange,
	percentTotal,
	rows,
	totalAmount,
	valid,
}: {
	onPercentChange: (stageKey: string, percent: string) => void;
	percentTotal: number;
	rows: QuotationStageRow[];
	totalAmount: number;
	valid: boolean;
}) {
	if (rows.length === 0) {
		return (
			<p className="text-muted-foreground text-sm">
				No quote stages yet. Add them under Lists → Quote Items.
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-1">
			{rows.map((row) => (
				<div
					className="flex items-center gap-3 border-b py-1.5 last:border-b-0"
					key={row.stageKey}
				>
					<label
						className="min-w-0 flex-1 truncate text-sm"
						htmlFor={`quotation-stage-${row.stageKey}`}
					>
						{row.name}
					</label>
					<InputGroup className="w-22 shrink-0">
						<InputGroupInput
							id={`quotation-stage-${row.stageKey}`}
							inputMode="decimal"
							nativeInput
							onChange={(event) =>
								onPercentChange(row.stageKey, event.target.value)
							}
							placeholder="0"
							type="text"
							value={row.percent}
						/>
						<InputGroupAddon align="inline-end">
							<InputGroupText>%</InputGroupText>
						</InputGroupAddon>
					</InputGroup>
					<span className="w-24 shrink-0 text-right text-sm tabular-nums">
						{formatAudWhole(row.amount)}
					</span>
				</div>
			))}

			<div className="flex items-center gap-3 pt-2">
				<span className="min-w-0 flex-1 font-medium text-sm">Total</span>
				<span
					className={
						valid
							? 'w-22 shrink-0 pe-3 text-right font-medium text-sm tabular-nums'
							: 'w-22 shrink-0 pe-3 text-right font-medium text-destructive text-sm tabular-nums'
					}
				>
					{percentTotal}%
				</span>
				<span className="w-24 shrink-0 text-right font-medium text-sm tabular-nums">
					{formatAudWhole(totalAmount)}
				</span>
			</div>

			{valid ? null : (
				<p className="text-destructive text-sm">
					Stage percentages must total exactly 100%.
				</p>
			)}
		</div>
	);
}
