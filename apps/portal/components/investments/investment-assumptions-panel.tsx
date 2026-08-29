'use client';

import { Field, FieldLabel } from '@workspace/ui/components/field';
import {
	Frame,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from '@workspace/ui/components/frame';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import type { ForecastAssumptions } from '@/lib/investment-forecast';

type NumericKey = Exclude<keyof ForecastAssumptions, 'scenarioPrices'>;

interface AssumptionField {
	hint?: string;
	key: NumericKey;
	label: string;
	unit: 'aud' | 'percent';
}

const SALE_FIELDS: AssumptionField[] = [
	{ key: 'salePrice', label: 'Sale price', unit: 'aud' },
	{
		key: 'realEstateFeePercent',
		label: 'Real estate fees',
		unit: 'percent',
		hint: 'Agent commission including GST',
	},
	{
		key: 'miscCosts',
		label: 'Misc costs',
		unit: 'aud',
		hint: 'Conveyancing, marketing, sundries at sale',
	},
	{
		key: 'annualPriceGrowthPercent',
		label: 'Annual price growth',
		unit: 'percent',
		hint: 'Applied to the sale price as the property is held',
	},
];

const HOLDING_FIELDS: AssumptionField[] = [
	{ key: 'remainingLoan', label: 'Remaining loan', unit: 'aud' },
	{ key: 'monthlyRepayment', label: 'Monthly repayment', unit: 'aud' },
	{
		key: 'interestRatePercent',
		label: 'Interest rate',
		unit: 'percent',
		hint: 'Accrues monthly; the rest of the repayment pays down principal',
	},
	{ key: 'stagingPerWeek', label: 'Staging / styling', unit: 'aud' },
	{
		key: 'otherHoldingPerMonth',
		label: 'Other holding costs',
		unit: 'aud',
		hint: 'Rates, water, electricity, lawns',
	},
];

const SPLIT_FIELDS: AssumptionField[] = [
	{
		key: 'projectManagementPercent',
		label: 'Management share',
		unit: 'percent',
	},
	{
		key: 'projectManagementPaid',
		label: 'Management already paid',
		unit: 'aud',
		hint: 'Deducted from the management share',
	},
];

/** Per-field suffix so the reader knows what the number is measured against. */
const UNIT_SUFFIX: Partial<Record<NumericKey, string>> = {
	stagingPerWeek: '/ week',
	monthlyRepayment: '/ month',
	otherHoldingPerMonth: '/ month',
};

function FieldGroup({
	fields,
	onChange,
	title,
	values,
}: {
	fields: AssumptionField[];
	onChange: (key: NumericKey, value: number) => void;
	title: string;
	values: ForecastAssumptions;
}) {
	return (
		<Frame>
			<FrameHeader className="flex flex-row items-center py-3">
				<FrameTitle className="min-w-0 truncate leading-none">
					{title}
				</FrameTitle>
			</FrameHeader>
			<FramePanel className="space-y-4">
				{fields.map((field) => {
					const id = `assumption-${field.key}`;
					return (
						<Field key={field.key}>
							<FieldLabel htmlFor={id}>{field.label}</FieldLabel>
							<InputGroup>
								{field.unit === 'aud' ? (
									<InputGroupAddon align="inline-start">
										<InputGroupText>$</InputGroupText>
									</InputGroupAddon>
								) : null}
								<InputGroupInput
									id={id}
									inputMode="decimal"
									nativeInput
									onChange={(event) =>
										onChange(field.key, Number(event.target.value))
									}
									step="any"
									type="number"
									value={values[field.key]}
								/>
								<InputGroupAddon align="inline-end">
									<InputGroupText>
										{field.unit === 'percent'
											? '%'
											: (UNIT_SUFFIX[field.key] ?? 'AUD')}
									</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
							{field.hint ? (
								<p className="text-muted-foreground text-xs">{field.hint}</p>
							) : null}
						</Field>
					);
				})}
			</FramePanel>
		</Frame>
	);
}

export default function InvestmentAssumptionsPanel({
	assumptions,
	onChange,
	onScenarioPricesChange,
}: {
	assumptions: ForecastAssumptions;
	onChange: (key: NumericKey, value: number) => void;
	onScenarioPricesChange: (prices: number[]) => void;
}) {
	return (
		<div className="grid gap-4">
			<FieldGroup
				fields={SALE_FIELDS}
				onChange={onChange}
				title="Sale"
				values={assumptions}
			/>
			<FieldGroup
				fields={HOLDING_FIELDS}
				onChange={onChange}
				title="Holding"
				values={assumptions}
			/>
			<FieldGroup
				fields={SPLIT_FIELDS}
				onChange={onChange}
				title="Profit split"
				values={assumptions}
			/>
			<Frame>
				<FrameHeader className="flex flex-row items-center py-3">
					<FrameTitle className="min-w-0 truncate leading-none">
						Chart scenarios
					</FrameTitle>
				</FrameHeader>
				<FramePanel className="space-y-4">
					<p className="text-muted-foreground text-xs">
						Comparison prices plotted alongside the sale price above, which is
						always the first line and the one the summary tiles report.
					</p>
					{assumptions.scenarioPrices.map((price, index) => {
						const id = `scenario-price-${index}`;
						return (
							<Field key={id}>
								<FieldLabel htmlFor={id}>Scenario {index + 1}</FieldLabel>
								<InputGroup>
									<InputGroupAddon align="inline-start">
										<InputGroupText>$</InputGroupText>
									</InputGroupAddon>
									<InputGroupInput
										id={id}
										inputMode="decimal"
										nativeInput
										onChange={(event) => {
											const next = [...assumptions.scenarioPrices];
											next[index] = Number(event.target.value);
											onScenarioPricesChange(next);
										}}
										step="any"
										type="number"
										value={price}
									/>
									<InputGroupAddon align="inline-end">
										<InputGroupText>AUD</InputGroupText>
									</InputGroupAddon>
								</InputGroup>
							</Field>
						);
					})}
				</FramePanel>
			</Frame>
		</div>
	);
}
