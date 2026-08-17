'use client';

import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { Textarea } from '@workspace/ui/components/textarea';

export interface QuoteStageDefaultsFieldState {
	error: string;
	invalid: boolean;
	onBlur: () => void;
	onChange: (value: string) => void;
	value: string;
}

/**
 * The two quotation-only stage fields, shared by the add and edit stage dialogs.
 * Both feed a client quotation: the percentage pre-fills the progress-payment
 * split, the scope line prints beside the stage in the payment schedule.
 */
export default function QuoteStageDefaultsFields({
	defaultPercent,
	scopeSummary,
}: {
	defaultPercent: QuoteStageDefaultsFieldState;
	scopeSummary: QuoteStageDefaultsFieldState;
}) {
	return (
		<>
			<Field data-invalid={defaultPercent.invalid}>
				<FieldLabel htmlFor="quote-stage-default-percent">
					Progress payment %
				</FieldLabel>
				<InputGroup>
					<InputGroupInput
						aria-invalid={defaultPercent.invalid}
						id="quote-stage-default-percent"
						inputMode="decimal"
						nativeInput
						onBlur={defaultPercent.onBlur}
						onChange={(event) => defaultPercent.onChange(event.target.value)}
						placeholder="e.g. 20"
						type="text"
						value={defaultPercent.value}
					/>
					<InputGroupAddon align="inline-end">
						<InputGroupText>%</InputGroupText>
					</InputGroupAddon>
				</InputGroup>
				{defaultPercent.invalid ? (
					<FieldError>{defaultPercent.error}</FieldError>
				) : null}
			</Field>

			<Field data-invalid={scopeSummary.invalid}>
				<FieldLabel htmlFor="quote-stage-scope-summary">
					Scope of works
				</FieldLabel>
				<Textarea
					aria-invalid={scopeSummary.invalid}
					id="quote-stage-scope-summary"
					onBlur={scopeSummary.onBlur}
					onChange={(event) => scopeSummary.onChange(event.target.value)}
					placeholder="One line describing what this stage covers"
					rows={2}
					value={scopeSummary.value}
				/>
				{scopeSummary.invalid ? (
					<FieldError>{scopeSummary.error}</FieldError>
				) : null}
			</Field>
		</>
	);
}
