'use client';

import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
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
 *
 * A revision on a quotation the clients already hold also offers to email them
 * the new version. It is only offered once the quotation has been issued — a
 * draft has no recipients — and never when amending, because a correction to a
 * version in place is not new news.
 *
 * When the revision undoes an approval, the dialog says so before it is saved:
 * the decision the clients already made does not survive it.
 */
export default function QuotationVersionDialog({
	amending = false,
	initialDescription = '',
	onConfirm,
	onOpenChange,
	open,
	recipients = [],
	reopening = false,
	saving,
	version,
}: {
	amending?: boolean;
	initialDescription?: string;
	onConfirm: (description: string, emailClients: boolean) => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	/** Client names to email, empty when the quotation has not been issued yet. */
	recipients?: string[];
	/** Whether saving sends an already-approved quotation back for approval. */
	reopening?: boolean;
	saving: boolean;
	version: number;
}) {
	const [description, setDescription] = useState('');
	const [emailClients, setEmailClients] = useState(true);
	const canEmail = !amending && recipients.length > 0;

	useEffect(() => {
		if (open) {
			setDescription(initialDescription);
			setEmailClients(true);
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
						{reopening
							? ' The quotation goes back to Under Review, so the clients approve this version again.'
							: null}
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
					{canEmail ? (
						<label
							className="mt-4 flex cursor-pointer items-start gap-2 text-sm"
							htmlFor="quotation-version-email-clients"
						>
							<Checkbox
								checked={emailClients}
								id="quotation-version-email-clients"
								onCheckedChange={(checked) => setEmailClients(checked === true)}
							/>
							<span className="flex flex-col gap-0.5">
								<span>Email version {version} to the clients</span>
								<span className="text-muted-foreground text-xs">
									{recipients.join(', ')} — each gets the new PDF and what
									changed.
								</span>
							</span>
						</label>
					) : null}
				</DialogPanel>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						disabled={trimmed.length === 0 || saving}
						loading={saving}
						onClick={() => onConfirm(trimmed, canEmail && emailClients)}
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
