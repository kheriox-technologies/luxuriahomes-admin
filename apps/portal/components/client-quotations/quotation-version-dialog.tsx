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
 *
 * When `amending`, the same dialog confirms a correction to a version that has
 * already been saved: the description starts from what that version already
 * says, and can be corrected along with everything else.
 */
export default function QuotationVersionDialog({
	amending = false,
	initialDescription = '',
	onConfirm,
	onOpenChange,
	open,
	saving,
	version,
}: {
	amending?: boolean;
	initialDescription?: string;
	onConfirm: (description: string) => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	saving: boolean;
	version: number;
}) {
	const [description, setDescription] = useState('');

	useEffect(() => {
		if (open) {
			setDescription(initialDescription);
		}
	}, [open, initialDescription]);

	const trimmed = description.trim();
	const action = amending ? 'Update' : 'Save';

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{action} version {version}
					</DialogTitle>
					<DialogDescription>
						{amending
							? `This rewrites version ${version} in place and replaces its PDF. No new version is issued.`
							: 'This keeps the quote reference and issues a new PDF. The previous version stays available.'}
					</DialogDescription>
				</DialogHeader>
				<DialogPanel>
					<Field>
						<FieldLabel htmlFor="quotation-version-description">
							{amending
								? 'What does this version say?'
								: 'What changed in this version?'}
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
						<Save aria-hidden /> {action} version {version}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
