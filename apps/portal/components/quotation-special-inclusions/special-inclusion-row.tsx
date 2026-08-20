'use client';

import type { Doc } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Input } from '@workspace/ui/components/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { EllipsisVertical, FilePlus2, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { amountToInput, parseAmountInput } from './special-inclusion-entry';

/**
 * One row of the standard list. Editing is inline — there is no edit dialog —
 * so both fields keep a local draft and commit on blur or Enter, the way the
 * catalogue lists do, and a server echo never clobbers what is being typed.
 */
export default function SpecialInclusionRow({
	inclusion,
	number,
	onAddToQuotation,
	onDelete,
	onSelectedChange,
	onUpdateAmount,
	onUpdateText,
	selected,
}: {
	inclusion: Doc<'quotationSpecialInclusions'>;
	number: number;
	onAddToQuotation: () => void;
	onDelete: () => void;
	onSelectedChange: (selected: boolean) => void;
	onUpdateAmount: (amount: number | null) => void;
	onUpdateText: (text: string) => void;
	selected: boolean;
}) {
	const [text, setText] = useState(inclusion.text);
	const committedText = useRef(inclusion.text);
	const storedAmount = amountToInput(inclusion.amount);
	const [amount, setAmount] = useState(storedAmount);
	const committedAmount = useRef(storedAmount);

	useEffect(() => {
		if (inclusion.text !== committedText.current) {
			committedText.current = inclusion.text;
			setText(inclusion.text);
		}
	}, [inclusion.text]);

	useEffect(() => {
		const next = amountToInput(inclusion.amount);
		if (next !== committedAmount.current) {
			committedAmount.current = next;
			setAmount(next);
		}
	}, [inclusion.amount]);

	const commitText = () => {
		const trimmed = text.trim();
		// Blank means "no change" — the row reverts and deleting is its own action.
		if (trimmed.length === 0 || trimmed === committedText.current) {
			setText(committedText.current);
			return;
		}
		committedText.current = trimmed;
		onUpdateText(trimmed);
	};

	const commitAmount = () => {
		const parsed = parseAmountInput(amount);
		const normalised = amountToInput(parsed);
		setAmount(normalised);
		if (normalised === committedAmount.current) {
			return;
		}
		committedAmount.current = normalised;
		onUpdateAmount(parsed ?? null);
	};

	const blurOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			event.currentTarget.blur();
		}
	};

	return (
		<div className="flex items-center gap-2 bg-card px-3 py-2">
			<Checkbox
				aria-label={`Select ${inclusion.text}`}
				checked={selected}
				onCheckedChange={(next) => onSelectedChange(next === true)}
			/>
			<span className="w-5 shrink-0 text-muted-foreground text-xs tabular-nums">
				{number}
			</span>
			<Input
				aria-label={`Special inclusion ${number}`}
				className="flex-1"
				nativeInput
				onBlur={commitText}
				onChange={(event) => setText(event.target.value)}
				onKeyDown={blurOnEnter}
				value={text}
			/>
			<InputGroup className="w-36 shrink-0">
				<InputGroupAddon align="inline-start">
					<InputGroupText>$</InputGroupText>
				</InputGroupAddon>
				<InputGroupInput
					aria-label={`Amount for special inclusion ${number}`}
					inputMode="decimal"
					nativeInput
					onBlur={commitAmount}
					onChange={(event) => setAmount(event.target.value)}
					onKeyDown={blurOnEnter}
					placeholder="0"
					type="text"
					value={amount}
				/>
			</InputGroup>
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label={`Actions for ${inclusion.text}`}
							size="icon-sm"
							type="button"
							variant="ghost"
						/>
					}
				>
					<EllipsisVertical className="size-4" />
				</MenuTrigger>
				<MenuPopup align="end">
					<MenuItem onClick={onAddToQuotation}>
						<FilePlus2 />
						Add to quotation
					</MenuItem>
					<MenuSeparator />
					<MenuItem onClick={onDelete} variant="destructive">
						<Trash2 />
						Delete
					</MenuItem>
				</MenuPopup>
			</Menu>
		</div>
	);
}
