'use client';

import type { useSortable } from '@dnd-kit/sortable';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { toastManager } from '@workspace/ui/components/toast';
import { GripVertical, Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

type SortableHandle = Pick<
	ReturnType<typeof useSortable>,
	'attributes' | 'listeners'
>;

/**
 * The grab handle every sortable row in the quotations pages renders. Shared by
 * the catalogue tree, the terms tree and the flat exclusion/note lists so the
 * hit area and cursor affordance stay identical across all three.
 */
export function DragHandle({
	attributes,
	listeners,
	label,
}: {
	attributes: SortableHandle['attributes'];
	listeners: SortableHandle['listeners'];
	label: string;
}) {
	return (
		<button
			aria-label={label}
			className="flex cursor-grab touch-none items-center text-muted-foreground active:cursor-grabbing"
			type="button"
			{...attributes}
			{...listeners}
		>
			<GripVertical className="size-4" />
		</button>
	);
}

/**
 * Inline "add" row pinned above a list. Enter or the icon button appends the
 * record and clears the box so several can be typed in a row without leaving the
 * keyboard; the full dialogs remain for the fields this row doesn't cover.
 */
export function InlineAddRow({
	noun,
	placeholder,
	onAdd,
}: {
	noun: string;
	placeholder: string;
	onAdd: (value: string) => Promise<unknown>;
}) {
	const [value, setValue] = useState('');
	const [isSaving, setIsSaving] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const submit = async () => {
		const trimmed = value.trim();
		if (!trimmed || isSaving) {
			return;
		}
		setIsSaving(true);
		try {
			await onAdd(trimmed);
			setValue('');
			inputRef.current?.focus();
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					`Could not add ${noun}. Please try again in a moment.`
				),
				title: `Could not add ${noun}`,
				type: 'error',
			});
		} finally {
			setIsSaving(false);
		}
	};

	const handleSubmit = () => {
		submit().catch(() => {
			/* Error handled in submit */
		});
	};

	return (
		<div className="flex items-center gap-2">
			<Input
				aria-label={`New ${noun}`}
				className="flex-1"
				disabled={isSaving}
				nativeInput
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						handleSubmit();
					}
				}}
				placeholder={placeholder}
				ref={inputRef}
				value={value}
			/>
			<Button
				aria-label={`Add ${noun}`}
				disabled={value.trim().length === 0}
				loading={isSaving}
				onClick={handleSubmit}
				size="icon"
				type="button"
				variant="outline"
			>
				<Plus />
			</Button>
		</div>
	);
}
