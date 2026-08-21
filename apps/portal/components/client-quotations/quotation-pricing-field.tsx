'use client';

import type { Doc } from '@workspace/backend/dataModel';
import { GST_RATE_LABEL } from '@workspace/backend/quotationPdfTheme';
import {
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from '@workspace/ui/components/field';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { formatAud } from '@/lib/currency';
import { splitGst } from './client-quotation-form-shared';

/**
 * Price for the quotation. A budget template seeds the project budget, which can
 * equally be typed by hand; the quoted total is the budget plus margin and is
 * derived rather than entered.
 */
export default function QuotationPricingField({
	budgetAmount,
	budgetError,
	budgetTemplateId,
	budgetTemplates,
	marginPercent,
	marginError,
	onBudgetAmountChange,
	onBudgetTemplateChange,
	onMarginChange,
	totalInclGst,
}: {
	budgetAmount: string;
	budgetError?: string;
	budgetTemplateId: string;
	budgetTemplates: Doc<'budgetTemplates'>[] | undefined;
	marginError?: string;
	marginPercent: string;
	onBudgetAmountChange: (budget: string) => void;
	onBudgetTemplateChange: (templateId: string) => void;
	onMarginChange: (margin: string) => void;
	totalInclGst: number;
}) {
	const selected =
		budgetTemplates?.find((template) => template._id === budgetTemplateId) ??
		null;
	const { contractSumExclGst, gstAmount } = splitGst(totalInclGst);

	return (
		<div className="flex flex-col gap-3">
			{/* Template on its own row, budget and margin sharing the one below. */}
			<div className="grid items-start gap-3 sm:grid-cols-2">
				<Field className="sm:col-span-2">
					<FieldLabel htmlFor="quotation-budget-template">
						Budget template
					</FieldLabel>
					<Combobox<Doc<'budgetTemplates'>>
						items={budgetTemplates ?? []}
						itemToStringLabel={(template) => template.title}
						onValueChange={(next) => onBudgetTemplateChange(next?._id ?? '')}
						value={selected}
					>
						<ComboboxInput
							id="quotation-budget-template"
							placeholder="Select a template to seed the budget"
						/>
						<ComboboxPopup>
							<ComboboxEmpty>No budget templates found.</ComboboxEmpty>
							<ComboboxList>
								{(template: Doc<'budgetTemplates'>) => (
									<ComboboxItem key={template._id} value={template}>
										<span className="flex w-full items-center justify-between gap-4">
											<span>{template.title}</span>
											<span className="text-muted-foreground tabular-nums">
												{formatAud(template.totalPrice)}
											</span>
										</span>
									</ComboboxItem>
								)}
							</ComboboxList>
						</ComboboxPopup>
					</Combobox>
					{selected ? (
						<FieldDescription>
							Template total {formatAud(selected.totalPrice)}.
						</FieldDescription>
					) : null}
				</Field>

				<Field data-invalid={Boolean(budgetError)}>
					<FieldLabel htmlFor="quotation-budget">Budget</FieldLabel>
					<InputGroup>
						<InputGroupAddon align="inline-start">
							<InputGroupText>$</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							aria-invalid={Boolean(budgetError) || undefined}
							id="quotation-budget"
							inputMode="decimal"
							nativeInput
							onChange={(event) => onBudgetAmountChange(event.target.value)}
							placeholder="0.00"
							type="text"
							value={budgetAmount}
						/>
					</InputGroup>
					{budgetError ? <FieldError>{budgetError}</FieldError> : null}
				</Field>

				<Field data-invalid={Boolean(marginError)}>
					<FieldLabel htmlFor="quotation-margin">Margin</FieldLabel>
					<InputGroup>
						<InputGroupInput
							aria-invalid={Boolean(marginError) || undefined}
							id="quotation-margin"
							inputMode="decimal"
							nativeInput
							onChange={(event) => onMarginChange(event.target.value)}
							placeholder="0"
							type="text"
							value={marginPercent}
						/>
						<InputGroupAddon align="inline-end">
							<InputGroupText>%</InputGroupText>
						</InputGroupAddon>
					</InputGroup>
					{marginError ? <FieldError>{marginError}</FieldError> : null}
				</Field>
			</div>

			<p className="text-muted-foreground text-sm tabular-nums">
				Contract sum {formatAud(contractSumExclGst)} · {GST_RATE_LABEL}{' '}
				{formatAud(gstAmount)}
			</p>
		</div>
	);
}
