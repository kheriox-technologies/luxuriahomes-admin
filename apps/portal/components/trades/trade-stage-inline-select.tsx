'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { useQuery } from 'convex/react';
import TradeStageCombobox from './trade-stage-combobox';

/**
 * Pick an existing trade stage or type a new one to create. Used wherever a trade
 * is created (the Add/Edit Trade dialogs and the inline create-trade flows). A
 * non-empty `newStageName` takes precedence over `stageId` at submit time.
 */
export default function TradeStageInlineSelect({
	idPrefix,
	stageId,
	onStageIdChange,
	newStageName,
	onNewStageNameChange,
	disabled,
}: {
	idPrefix: string;
	stageId: Id<'tradeStages'> | '';
	onStageIdChange: (next: Id<'tradeStages'> | '') => void;
	newStageName: string;
	onNewStageNameChange: (next: string) => void;
	disabled?: boolean;
}) {
	const stages = useQuery(api.tradeStages.list.list, {});
	const creatingNew = newStageName.trim().length > 0;

	return (
		<Field>
			<FieldLabel htmlFor={`${idPrefix}-stage`}>
				Trade Stage
				<span className="ml-1 text-muted-foreground text-xs">(optional)</span>
			</FieldLabel>
			<TradeStageCombobox
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
