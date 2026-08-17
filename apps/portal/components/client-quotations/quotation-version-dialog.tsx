'use client';

import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogPanel,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { Textarea } from '@workspace/ui/components/textarea';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';

export const MAX_VERSION_DESCRIPTION_LENGTH = 200;

/**
 * Asks what changed before a revision is saved. Every version after the first
 * carries a description, so the history reads as a record rather than a list of
 * dates — the reason it is required rather than optional.
 */
export default function QuotationVersionDialog({
	onConfirm,
	onOpenChange,
	open,
	saving,
	version,
}: {
	onConfirm: (description: string) => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	saving: boolean;
	version: number;
}) {
	const [description, setDescription] = useState('');

	useEffect(() => {
		if (open) {
			setDescription('');
		}
	}, [open]);

	const trimmed = description.trim();

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Save version {version}</DialogTitle>
					<DialogDescription>
						This keeps the quote reference and issues a new PDF. The previous
						version stays available.
					</DialogDescription>
				</DialogHeader>
				<DialogPanel>
					<Field>
						<FieldLabel htmlFor="quotation-version-description">
							What changed in this version?
						</FieldLabel>
						<Textarea
							id="quotation-version-description"
							maxLength={MAX_VERSION_DESCRIPTION_LENGTH}
							onChange={(event) => setDescription(event.target.value)}
							placeholder="e.g. Revised kitchen allowance and updated stage 3 percentage"
							rows={3}
							value={description}
						/>
					</Field>
				</DialogPanel>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						disabled={trimmed.length === 0 || saving}
						loading={saving}
						onClick={() => onConfirm(trimmed)}
						type="button"
						variant="outline"
					>
						<Save aria-hidden /> Save version {version}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
