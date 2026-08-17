'use client';

import type { Doc } from '@workspace/backend/dataModel';
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
import { GST_RATE_LABEL } from '@/lib/client/pdf/client-quotation-theme';
import { formatAud } from '@/lib/currency';
import { splitGst } from './client-quotation-form-shared';

/**
 * Price for the quotation. A budget template seeds the figure — template total
 * plus margin — after which the number is the user's to adjust: every project
 * carries client- or site-specific movement the template can't know about.
 */
export default function QuotationPricingField({
	budgetTemplateId,
	budgetTemplates,
	marginPercent,
	marginError,
	onBudgetTemplateChange,
	onMarginChange,
	onTotalChange,
	totalError,
	totalInclGst,
}: {
	budgetTemplateId: string;
	budgetTemplates: Doc<'budgetTemplates'>[] | undefined;
	marginError?: string;
	marginPercent: string;
	onBudgetTemplateChange: (templateId: string) => void;
	onMarginChange: (margin: string) => void;
	onTotalChange: (total: string) => void;
	totalError?: string;
	totalInclGst: string;
}) {
	const selected =
		budgetTemplates?.find((template) => template._id === budgetTemplateId) ??
		null;
	const total = Number(totalInclGst);
	const { contractSumExclGst, gstAmount } = splitGst(
		Number.isFinite(total) ? total : 0
	);

	return (
		<div className="flex flex-col gap-3">
			{/* Template at half the row, margin and total at a quarter each. */}
			<div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-4">
				<Field className="lg:col-span-2">
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
							placeholder="Select a template to seed the price"
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

				<Field data-invalid={Boolean(marginError)}>
					<FieldLabel htmlFor="quotation-margin">Margin</FieldLabel>
					<InputGroup>
						<InputGroupInput
							aria-invalid={Boolean(marginError)}
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

				<Field data-invalid={Boolean(totalError)}>
					<FieldLabel htmlFor="quotation-total">Total (incl. GST)</FieldLabel>
					<InputGroup>
						<InputGroupAddon align="inline-start">
							<InputGroupText>$</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							aria-invalid={Boolean(totalError)}
							id="quotation-total"
							inputMode="decimal"
							nativeInput
							onChange={(event) => onTotalChange(event.target.value)}
							placeholder="0.00"
							type="text"
							value={totalInclGst}
						/>
					</InputGroup>
					{totalError ? <FieldError>{totalError}</FieldError> : null}
				</Field>
			</div>

			<p className="text-muted-foreground text-sm tabular-nums">
				Contract sum {formatAud(contractSumExclGst)} · {GST_RATE_LABEL}{' '}
				{formatAud(gstAmount)}
			</p>
		</div>
	);
}
