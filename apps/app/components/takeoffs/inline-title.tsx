'use client';

import { Input } from '@workspace/ui/components/input';
import { cn } from '@workspace/ui/lib/utils';
import { type CSSProperties, useState } from 'react';

// Single click runs onActivate (e.g. select the card / let the parent handle
// it), double click edits the label inline; Enter/blur commits, Escape cancels.
export function InlineTitle({
	value,
	onRename,
	onActivate,
	onEditEnd,
	className,
	style,
	autoEdit,
}: {
	value: string;
	onRename: (label: string) => void;
	onActivate?: () => void;
	/** Called whenever the field leaves edit mode (commit, blur, or Escape). */
	onEditEnd?: () => void;
	className?: string;
	style?: CSSProperties;
	/** Open directly in edit mode on mount (e.g. for a freshly created item). */
	autoEdit?: boolean;
}) {
	const [editing, setEditing] = useState(Boolean(autoEdit));
	const [draft, setDraft] = useState(value);

	const commit = () => {
		const trimmed = draft.trim();
		if (trimmed && trimmed !== value) {
			onRename(trimmed);
		} else {
			setDraft(value);
		}
		setEditing(false);
		onEditEnd?.();
	};

	if (editing) {
		return (
			<Input
				autoFocus
				className={cn('h-7 text-sm', className)}
				nativeInput
				onBlur={commit}
				onChange={(event) => setDraft(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === 'Enter') {
						commit();
					} else if (event.key === 'Escape') {
						setDraft(value);
						setEditing(false);
						onEditEnd?.();
					}
				}}
				style={style}
				value={draft}
			/>
		);
	}

	return (
		<button
			className={cn('truncate text-left font-medium text-sm', className)}
			onClick={onActivate}
			onDoubleClick={() => {
				setDraft(value);
				setEditing(true);
			}}
			style={style}
			title="Double-click to rename"
			type="button"
		>
			{value}
		</button>
	);
}
