'use client';

import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@workspace/ui/components/alert-dialog';
import { Button } from '@workspace/ui/components/button';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';

/**
 * Re-pulls one section of the quotation from the catalogue, discarding the
 * edits made to it here. Scoped per frame so resetting the inclusions doesn't
 * throw away reworked terms.
 */
export default function QuotationResetButton({
	label,
	onReset,
}: {
	label: string;
	onReset: () => void;
}) {
	const [open, setOpen] = useState(false);

	return (
		<AlertDialog onOpenChange={setOpen} open={open}>
			<AlertDialogTrigger
				render={
					<Button size="sm" type="button" variant="outline">
						<RotateCcw aria-hidden /> Reset
					</Button>
				}
			/>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Reset from catalogue?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This replaces ${label} with the catalogue defaults. Your edits to this section will be discarded.`}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</AlertDialogClose>
					<Button
						onClick={() => {
							onReset();
							setOpen(false);
						}}
						type="button"
						variant="outline"
					>
						<RotateCcw aria-hidden /> Reset
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
