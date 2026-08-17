'use client';

import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { AustralianStateCombobox } from '@/components/projects/project-form-shared';
import type { ClientQuotationFormValues } from './client-quotation-form-shared';

type QuotationAddress = ClientQuotationFormValues['address'];

/** The project address printed on the quotation's details page. */
export default function QuotationAddressField({
	errors,
	onChange,
	value,
}: {
	errors?: Partial<Record<keyof QuotationAddress, string>>;
	onChange: (next: QuotationAddress) => void;
	value: QuotationAddress;
}) {
	const patch = (next: Partial<QuotationAddress>) =>
		onChange({ ...value, ...next });

	return (
		<div className="flex flex-col gap-3">
			<Field data-invalid={Boolean(errors?.street)}>
				<FieldLabel htmlFor="quotation-address-street">Street</FieldLabel>
				<Input
					aria-invalid={Boolean(errors?.street)}
					id="quotation-address-street"
					nativeInput
					onChange={(event) => patch({ street: event.target.value })}
					placeholder="14 Kingsford Smith Drive"
					value={value.street}
				/>
				{errors?.street ? <FieldError>{errors.street}</FieldError> : null}
			</Field>

			{/* State and postcode are fixed-width, so the suburb takes the slack. */}
			<div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_6rem_6rem]">
				<Field data-invalid={Boolean(errors?.suburb)}>
					<FieldLabel htmlFor="quotation-address-suburb">Suburb</FieldLabel>
					<Input
						aria-invalid={Boolean(errors?.suburb)}
						id="quotation-address-suburb"
						nativeInput
						onChange={(event) => patch({ suburb: event.target.value })}
						placeholder="Hamilton"
						value={value.suburb}
					/>
					{errors?.suburb ? <FieldError>{errors.suburb}</FieldError> : null}
				</Field>

				<Field data-invalid={Boolean(errors?.state)}>
					<FieldLabel htmlFor="quotation-address-state">State</FieldLabel>
					<AustralianStateCombobox
						codeOnly
						id="quotation-address-state"
						invalid={Boolean(errors?.state)}
						onBlur={() => {
							/* validation runs on change */
						}}
						onChange={(next) => patch({ state: next })}
						placeholder="QLD"
						value={value.state}
					/>
					{errors?.state ? <FieldError>{errors.state}</FieldError> : null}
				</Field>

				<Field data-invalid={Boolean(errors?.postcode)}>
					<FieldLabel htmlFor="quotation-address-postcode">Postcode</FieldLabel>
					<Input
						aria-invalid={Boolean(errors?.postcode)}
						id="quotation-address-postcode"
						inputMode="numeric"
						nativeInput
						onChange={(event) => patch({ postcode: event.target.value })}
						placeholder="4007"
						value={value.postcode}
					/>
					{errors?.postcode ? <FieldError>{errors.postcode}</FieldError> : null}
				</Field>
			</div>
		</div>
	);
}
