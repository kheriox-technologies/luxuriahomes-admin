'use client';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import { parseAmountInput } from './special-inclusion-entry';

/**
 * Adding is inline too — the text field keeps focus so several standard
 * inclusions can be typed one after another.
 */
export default function SpecialInclusionsInlineAdd({
	disabled,
	onAdd,
}: {
	disabled?: boolean;
	onAdd: (entry: { amount?: number; text: string }) => Promise<unknown>;
}) {
	const [text, setText] = useState('');
	const [amount, setAmount] = useState('');
	const [saving, setSaving] = useState(false);
	const textRef = useRef<HTMLInputElement>(null);

	const submit = () => {
		const trimmed = text.trim();
		if (trimmed.length === 0 || saving) {
			return;
		}
		setSaving(true);
		onAdd({ amount: parseAmountInput(amount), text: trimmed })
			.then(() => {
				setText('');
				setAmount('');
				textRef.current?.focus();
			})
			.catch(() => {
				// The caller has already reported it; leave the fields alone so the
				// typed line isn't lost.
			})
			.finally(() => setSaving(false));
	};

	const submitOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			submit();
		}
	};

	return (
		<div className="flex items-center gap-2">
			<Input
				aria-label="New special inclusion"
				className="flex-1"
				disabled={disabled}
				nativeInput
				onChange={(event) => setText(event.target.value)}
				onKeyDown={submitOnEnter}
				placeholder="Add a special inclusion and press Enter…"
				ref={textRef}
				value={text}
			/>
			<InputGroup className="w-36 shrink-0">
				<InputGroupAddon align="inline-start">
					<InputGroupText>$</InputGroupText>
				</InputGroupAddon>
				<InputGroupInput
					aria-label="Amount for the new special inclusion"
					disabled={disabled}
					inputMode="decimal"
					nativeInput
					onChange={(event) => setAmount(event.target.value)}
					onKeyDown={submitOnEnter}
					placeholder="0"
					type="text"
					value={amount}
				/>
			</InputGroup>
			<Button
				aria-label="Add special inclusion"
				disabled={disabled || text.trim().length === 0}
				onClick={submit}
				size="icon"
				type="button"
				variant="outline"
			>
				<Plus />
			</Button>
		</div>
	);
}
