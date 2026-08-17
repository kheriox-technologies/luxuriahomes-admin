'use client';

import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';
import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogPanel,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/**
 * Primitives shared by the three draft editors on the Add Quotation page.
 *
 * They are deliberate twins of the catalogue's `quote-lists/list-primitives`
 * and `QuoteSimpleList`: same look and keyboard behaviour, but every change is
 * a synchronous setState on the local draft rather than a Convex mutation, so
 * there is nothing to await and nothing to fail.
 */

/** One editable line: number, text input committed on blur or Enter, delete. */
export function DraftTextRow({
	label,
	number,
	onChange,
	onRemove,
	value,
}: {
	label: string;
	number: string;
	onChange: (next: string) => void;
	onRemove: () => void;
	value: string;
}) {
	const [draft, setDraft] = useState(value);
	const committedRef = useRef(value);

	// Adopt an external change (a reset re-seeding the list) without clobbering
	// what is being typed right now.
	useEffect(() => {
		if (value !== committedRef.current) {
			committedRef.current = value;
			setDraft(value);
		}
	}, [value]);

	const commit = () => {
		const trimmed = draft.trim();
		// Blank means "no change" — the row reverts and deleting is done with the
		// delete button, matching the catalogue lists.
		if (trimmed.length === 0 || trimmed === committedRef.current) {
			setDraft(committedRef.current);
			return;
		}
		committedRef.current = trimmed;
		onChange(trimmed);
	};

	return (
		<div className="flex items-center gap-2 bg-card px-3 py-2">
			<span className="shrink-0 text-muted-foreground text-xs tabular-nums">
				{number}
			</span>
			<Input
				aria-label={label}
				className="flex-1"
				nativeInput
				onBlur={commit}
				onChange={(event) => setDraft(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === 'Enter') {
						event.preventDefault();
						event.currentTarget.blur();
					}
				}}
				value={draft}
			/>
			<Button
				aria-label={`Remove ${label}`}
				onClick={onRemove}
				size="icon"
				type="button"
				variant="destructive-outline"
			>
				<Trash2 />
			</Button>
		</div>
	);
}

/** Inline "add" box. Enter or the button appends and keeps the caret in place. */
export function DraftInlineAdd({
	noun,
	onAdd,
	placeholder,
}: {
	noun: string;
	onAdd: (value: string) => void;
	placeholder: string;
}) {
	const [value, setValue] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	const submit = () => {
		const trimmed = value.trim();
		if (trimmed.length === 0) {
			return;
		}
		onAdd(trimmed);
		setValue('');
		inputRef.current?.focus();
	};

	return (
		<div className="flex items-center gap-2">
			<Input
				aria-label={`New ${noun}`}
				className="flex-1"
				nativeInput
				onChange={(event) => setValue(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === 'Enter') {
						event.preventDefault();
						submit();
					}
				}}
				placeholder={placeholder}
				ref={inputRef}
				value={value}
			/>
			<Button
				aria-label={`Add ${noun}`}
				disabled={value.trim().length === 0}
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

/** Confirmation for a delete that takes child rows with it. */
export function DraftDeleteDialog({
	description,
	noun,
	onConfirm,
	onOpenChange,
	open,
}: {
	description: string;
	noun: string;
	onConfirm: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
}) {
	return (
		<AlertDialog onOpenChange={onOpenChange} open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{`Remove ${noun}?`}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</AlertDialogClose>
					<Button
						onClick={() => {
							onConfirm();
							onOpenChange(false);
						}}
						type="button"
						variant="destructive-outline"
					>
						<Trash2 aria-hidden /> {`Remove ${noun}`}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

/** Single-field rename dialog, used for section headings in both tree editors. */
export function DraftRenameDialog({
	initialValue,
	label,
	onOpenChange,
	onSave,
	open,
	title,
}: {
	initialValue: string;
	label: string;
	onOpenChange: (open: boolean) => void;
	onSave: (next: string) => void;
	open: boolean;
	title: string;
}) {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		if (open) {
			setValue(initialValue);
		}
	}, [initialValue, open]);

	const save = () => {
		const trimmed = value.trim();
		if (trimmed.length === 0) {
			return;
		}
		onSave(trimmed);
		onOpenChange(false);
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<DialogPanel>
					<Field>
						<FieldLabel htmlFor="quotation-draft-rename">{label}</FieldLabel>
						<Input
							id="quotation-draft-rename"
							nativeInput
							onChange={(event) => setValue(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === 'Enter') {
									event.preventDefault();
									save();
								}
							}}
							value={value}
						/>
					</Field>
				</DialogPanel>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						disabled={value.trim().length === 0}
						onClick={save}
						type="button"
						variant="outline"
					>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
