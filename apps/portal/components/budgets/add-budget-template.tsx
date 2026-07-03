'use client';

import { api } from '@workspace/backend/api';
import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogPanel,
	DialogTitle,
	DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { type ReactElement, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	type BudgetTemplateDraftValues,
	budgetTemplateDraftErrorMessage,
	budgetTemplateDraftSchema,
	emptyBudgetTemplateDraft,
} from './budget-form-shared';

export default function AddBudgetTemplate({
	trigger,
}: {
	trigger?: ReactElement;
} = {}) {
	const [open, setOpen] = useState(false);
	const [draft, setDraft] = useState<BudgetTemplateDraftValues>(
		emptyBudgetTemplateDraft
	);

	const addTemplate = useMutation(api.budgetTemplates.add.add);

	const handleSubmit = async () => {
		const parsed = budgetTemplateDraftSchema.safeParse(draft);
		if (!parsed.success) {
			toastManager.add({
				description: budgetTemplateDraftErrorMessage(parsed.error),
				title: 'Template details invalid',
				type: 'error',
			});
			return;
		}
		try {
			const { data } = parsed;
			await addTemplate({
				title: data.title,
				description: data.description?.trim() || undefined,
			});
			toastManager.add({ title: 'Budget template added', type: 'success' });
			setDraft(emptyBudgetTemplateDraft);
			setOpen(false);
		} catch (error) {
			setOpen(false);
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not add budget template. Please try again in a moment.'
				),
				title: 'Could not add budget template',
				type: 'error',
			});
		}
	};

	return (
		<Dialog
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) {
					setDraft(emptyBudgetTemplateDraft);
				}
			}}
			open={open}
		>
			<DialogTrigger render={trigger ?? <Button>Add Template</Button>} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Budget Template</DialogTitle>
				</DialogHeader>
				<DialogPanel className="flex flex-col gap-4">
					<Field>
						<FieldLabel htmlFor="add-budget-template-title">Title</FieldLabel>
						<Input
							autoFocus
							id="add-budget-template-title"
							nativeInput
							onChange={(e) =>
								setDraft((p) => ({ ...p, title: e.target.value }))
							}
							placeholder="Template title"
							value={draft.title}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="add-budget-template-description">
							Description{' '}
							<span className="text-muted-foreground text-xs">(optional)</span>
						</FieldLabel>
						<Textarea
							id="add-budget-template-description"
							onChange={(e) =>
								setDraft((p) => ({ ...p, description: e.target.value }))
							}
							placeholder="Short description"
							rows={3}
							value={draft.description ?? ''}
						/>
					</Field>
				</DialogPanel>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						onClick={() => {
							handleSubmit().catch(() => {
								/* Error handled in handleSubmit */
							});
						}}
						type="button"
					>
						Add Template
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
