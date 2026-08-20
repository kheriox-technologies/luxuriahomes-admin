'use client';

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { formatAud } from '@/lib/currency';
import { specialInclusionsTotal } from './client-quotation-form-shared';
import { DraftInlineAdd, DraftTextRow } from './quotation-draft-primitives';
import type { DraftSpecialInclusion } from './use-quotation-draft';

/**
 * The extras specific to one quotation. Twin of `QuotationEntriesEditor` with an
 * amount beside each line — the amounts add to the contract sum but are admin
 * reference only and never reach the PDF.
 */
export default function QuotationSpecialInclusionsEditor({
	entries,
	onAdd,
	onRemove,
	onUpdate,
}: {
	entries: DraftSpecialInclusion[];
	onAdd: (text: string) => void;
	onRemove: (key: string) => void;
	onUpdate: (key: string, patch: { amount?: string; text?: string }) => void;
}) {
	const total = specialInclusionsTotal(entries);

	return (
		<div className="flex flex-col gap-3">
			<DraftInlineAdd
				noun="special inclusion"
				onAdd={onAdd}
				placeholder="Add a special inclusion and press Enter…"
			/>
			{entries.length > 0 ? (
				<>
					<div className="divide-y overflow-hidden rounded-md border">
						{entries.map((entry, index) => (
							<DraftTextRow
								key={entry.key}
								label={`special inclusion ${index + 1}`}
								number={String(index + 1)}
								onChange={(text) => onUpdate(entry.key, { text })}
								onRemove={() => onRemove(entry.key)}
								trailing={
									<InputGroup className="w-36 shrink-0">
										<InputGroupAddon align="inline-start">
											<InputGroupText>$</InputGroupText>
										</InputGroupAddon>
										<InputGroupInput
											aria-label={`Amount for special inclusion ${index + 1}`}
											inputMode="decimal"
											nativeInput
											onChange={(event) =>
												onUpdate(entry.key, { amount: event.target.value })
											}
											placeholder="0"
											type="text"
											value={entry.amount}
										/>
									</InputGroup>
								}
								value={entry.text}
							/>
						))}
					</div>
					<p className="text-muted-foreground text-sm tabular-nums">
						{`Special inclusions ${formatAud(total)} — added to the contract sum. Amounts are for reference only and are not printed on the quotation.`}
					</p>
				</>
			) : (
				<p className="rounded-md border border-dashed px-3 py-4 text-center text-muted-foreground text-sm">
					No special inclusions on this quotation.
				</p>
			)}
		</div>
	);
}
