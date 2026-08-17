'use client';

import { Button } from '@workspace/ui/components/button';
import {
	Card,
	CardDescription,
	CardHeader,
	CardPanel,
	CardTitle,
} from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { toastManager } from '@workspace/ui/components/toast';
import { Check, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import RichTextEditor from '@/components/rich-text-editor';
import { getConvexErrorMessage } from '@/lib/convex-errors';

/**
 * A block of quotation boilerplate, always editable in place. Save is enabled
 * only once the HTML differs from what is stored, and Reset drops local edits —
 * a view/edit toggle would need to re-render the saved HTML as markup, which the
 * editor already does safely.
 */
export default function EditableHtmlCard({
	description,
	editorId,
	isLoading,
	noun,
	onSave,
	placeholder,
	title,
	value,
}: {
	description: string;
	editorId: string;
	isLoading: boolean;
	// Used in the toast copy, e.g. "disclaimer".
	noun: string;
	onSave: (html: string) => Promise<unknown>;
	placeholder: string;
	title: string;
	value: string;
}) {
	const [draft, setDraft] = useState(value);
	const [isSaving, setIsSaving] = useState(false);

	// Adopt the server value whenever it changes and nothing is being saved. The
	// page is the only writer, so this only fires on load and after a save.
	useEffect(() => {
		if (!isSaving) {
			setDraft(value);
		}
	}, [value, isSaving]);

	const isDirty = draft !== value;

	const save = async () => {
		setIsSaving(true);
		try {
			await onSave(draft);
			toastManager.add({ title: `${title} saved`, type: 'success' });
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					`Could not save the ${noun}. Please try again in a moment.`
				),
				title: `Could not save ${noun}`,
				type: 'error',
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardPanel className="flex flex-col gap-3">
				{isLoading ? (
					<Skeleton className="h-32 w-full rounded-lg" />
				) : (
					<RichTextEditor
						id={editorId}
						onChange={setDraft}
						placeholder={placeholder}
						value={draft}
					/>
				)}
				<div className="flex justify-end gap-2">
					<Button
						disabled={!isDirty || isSaving}
						onClick={() => setDraft(value)}
						type="button"
						variant="outline"
					>
						<RotateCcw aria-hidden /> Reset
					</Button>
					<Button
						disabled={!isDirty}
						loading={isSaving}
						onClick={() => {
							save().catch(() => {
								/* Error handled in save */
							});
						}}
						type="button"
						variant="outline"
					>
						<Check aria-hidden /> Save
					</Button>
				</div>
			</CardPanel>
		</Card>
	);
}
