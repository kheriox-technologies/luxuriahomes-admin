'use client';

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
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { type ReactNode, useEffect, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

/**
 * The name + description form behind Add, Edit and Duplicate. All three collect
 * exactly the same two fields, so only the copy and the submit handler differ.
 */
export default function QuotationTemplateDialog({
	confirmIcon,
	confirmLabel,
	errorTitle,
	idPrefix,
	initialDescription,
	initialName,
	onOpenChange,
	onSubmit,
	open,
	successTitle,
	title,
}: {
	confirmIcon: ReactNode;
	confirmLabel: string;
	errorTitle: string;
	idPrefix: string;
	initialDescription?: string;
	initialName?: string;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: { description?: string; name: string }) => Promise<void>;
	open: boolean;
	successTitle: string;
	title: string;
}) {
	const [name, setName] = useState(initialName ?? '');
	const [description, setDescription] = useState(initialDescription ?? '');
	const [isSaving, setIsSaving] = useState(false);

	// Reopening has to show the current values, not whatever was typed and
	// abandoned last time.
	useEffect(() => {
		if (open) {
			setName(initialName ?? '');
			setDescription(initialDescription ?? '');
		}
	}, [initialDescription, initialName, open]);

	const handleSubmit = async () => {
		const trimmed = name.trim();
		if (trimmed.length === 0) {
			toastManager.add({ title: 'Enter a template name', type: 'error' });
			return;
		}
		setIsSaving(true);
		try {
			await onSubmit({
				description: description.trim() || undefined,
				name: trimmed,
			});
			toastManager.add({ title: successTitle, type: 'success' });
			onOpenChange(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Please try again in a moment.'
				),
				title: errorTitle,
				type: 'error',
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<DialogPanel className="flex flex-col gap-4">
					<Field>
						<FieldLabel htmlFor={`${idPrefix}-name`}>Name</FieldLabel>
						<Input
							autoFocus
							id={`${idPrefix}-name`}
							nativeInput
							onChange={(e) => setName(e.target.value)}
							placeholder="Template name"
							value={name}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor={`${idPrefix}-description`}>
							Description{' '}
							<span className="text-muted-foreground text-xs">(optional)</span>
						</FieldLabel>
						<Textarea
							id={`${idPrefix}-description`}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="What this template is for"
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
						loading={isSaving}
						onClick={() => {
							handleSubmit().catch(() => {
								/* Error handled in handleSubmit */
							});
						}}
						type="button"
						variant="outline"
					>
						{confirmIcon}
						{confirmLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
