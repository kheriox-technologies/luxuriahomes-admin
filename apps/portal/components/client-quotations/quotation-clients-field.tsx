'use client';

import { Button } from '@workspace/ui/components/button';
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { X } from 'lucide-react';
import type { ClientQuotationFormValues } from './client-quotation-form-shared';

type QuotationClient = ClientQuotationFormValues['clients'][number];

/**
 * A card per client, laid out across one row. Clients print under "Prepared for"
 * on the quotation's details page, so the fields mirror what the PDF shows:
 * name, phone, email. The composer owns the add button — it lives in the frame
 * header rather than after the cards.
 */
export default function QuotationClientsField({
	errors,
	onChange,
	value,
}: {
	errors?: Partial<Record<keyof QuotationClient, string>>[];
	onChange: (next: QuotationClient[]) => void;
	value: QuotationClient[];
}) {
	const updateClient = (index: number, patch: Partial<QuotationClient>) => {
		onChange(
			value.map((client, i) => (i === index ? { ...client, ...patch } : client))
		);
	};

	return (
		<div className="grid items-start gap-3 sm:grid-cols-2 xl:grid-cols-4">
			{value.map((client, index) => {
				const clientErrors = errors?.[index];
				return (
					<div
						className="flex flex-col gap-3 rounded-lg border p-3"
						// biome-ignore lint/suspicious/noArrayIndexKey: clients have no id; the list is short and only ever grows or shrinks at the end
						key={`quotation-client-${index}`}
					>
						{/* Fixed height so cards sitting side by side keep their fields aligned whether or not they carry a remove button. */}
						<div className="flex h-7 items-center justify-between">
							<span className="font-medium text-sm">Client {index + 1}</span>
							{index > 0 ? (
								<Button
									aria-label={`Remove client ${index + 1}`}
									className="-me-1"
									onClick={() => onChange(value.filter((_, i) => i !== index))}
									size="icon-xs"
									type="button"
									variant="ghost"
								>
									<X />
								</Button>
							) : null}
						</div>

						<Field data-invalid={Boolean(clientErrors?.name)}>
							<FieldLabel htmlFor={`quotation-client-name-${index}`}>
								Name
							</FieldLabel>
							<Input
								aria-invalid={Boolean(clientErrors?.name)}
								id={`quotation-client-name-${index}`}
								nativeInput
								onChange={(event) =>
									updateClient(index, { name: event.target.value })
								}
								placeholder="e.g. Mr & Mrs J. Whitmore"
								value={client.name}
							/>
							{clientErrors?.name ? (
								<FieldError>{clientErrors.name}</FieldError>
							) : null}
						</Field>

						<Field data-invalid={Boolean(clientErrors?.phone)}>
							<FieldLabel htmlFor={`quotation-client-phone-${index}`}>
								Phone
							</FieldLabel>
							<Input
								aria-invalid={Boolean(clientErrors?.phone)}
								id={`quotation-client-phone-${index}`}
								nativeInput
								onChange={(event) =>
									updateClient(index, { phone: event.target.value })
								}
								placeholder="0400 000 000"
								value={client.phone}
							/>
							{clientErrors?.phone ? (
								<FieldError>{clientErrors.phone}</FieldError>
							) : null}
						</Field>

						<Field data-invalid={Boolean(clientErrors?.email)}>
							<FieldLabel htmlFor={`quotation-client-email-${index}`}>
								Email
							</FieldLabel>
							<Input
								aria-invalid={Boolean(clientErrors?.email)}
								id={`quotation-client-email-${index}`}
								nativeInput
								onChange={(event) =>
									updateClient(index, { email: event.target.value })
								}
								placeholder="name@example.com"
								type="email"
								value={client.email}
							/>
							{clientErrors?.email ? (
								<FieldError>{clientErrors.email}</FieldError>
							) : null}
						</Field>
					</div>
				);
			})}
		</div>
	);
}
