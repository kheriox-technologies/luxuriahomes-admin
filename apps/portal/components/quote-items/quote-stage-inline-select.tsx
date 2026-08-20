'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { useQuery } from 'convex/react';
import { useQuoteTemplateId } from '@/components/quotations/quote-template-context';
import QuoteStageCombobox from './quote-stage-combobox';

/**
 * Pick an existing quote stage or type a new one to create. Mirrors the trade
 * stage picker (`components/trades/trade-stage-inline-select.tsx`): the two
 * controls disable each other, and a non-empty `newStageName` takes precedence
 * over `stageId` at submit time. Unlike trades, a stage is required here — every
 * section belongs to one.
 */
export default function QuoteStageInlineSelect({
	idPrefix,
	stageId,
	onStageIdChange,
	newStageName,
	onNewStageNameChange,
	disabled,
}: {
	idPrefix: string;
	stageId: Id<'quoteStages'> | '';
	onStageIdChange: (next: Id<'quoteStages'> | '') => void;
	newStageName: string;
	onNewStageNameChange: (next: string) => void;
	disabled?: boolean;
}) {
	const templateId = useQuoteTemplateId();
	const stages = useQuery(api.quoteStages.list.list, { templateId });
	const creatingNew = newStageName.trim().length > 0;

	return (
		<Field>
			<FieldLabel htmlFor={`${idPrefix}-stage`}>Stage</FieldLabel>
			<QuoteStageCombobox
				disabled={disabled || creatingNew}
				id={`${idPrefix}-stage`}
				onChange={onStageIdChange}
				stages={stages}
				value={stageId}
			/>
			<Input
				aria-label="Or create new stage"
				disabled={disabled || stageId !== ''}
				nativeInput
				onChange={(e) => onNewStageNameChange(e.target.value)}
				placeholder="Or create new stage…"
				value={newStageName}
			/>
		</Field>
	);
}
