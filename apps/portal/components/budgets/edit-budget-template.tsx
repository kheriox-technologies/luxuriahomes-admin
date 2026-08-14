'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
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
import {
	Field,
	FieldDescription,
	FieldLabel,
} from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	type BudgetTemplateDraftValues,
	budgetTemplateDraftErrorMessage,
	budgetTemplateDraftSchema,
	emptyBudgetTemplateDraft,
	isValidPercentString,
	parsePercentString,
} from './budget-form-shared';

export default function EditBudgetTemplate({
	budgetTemplateId,
	initialTitle,
	initialDescription,
	initialDefaultContingencyPercent,
	open,
	onOpenChange,
}: {
	budgetTemplateId: Id<'budgetTemplates'>;
	initialTitle: string;
	initialDescription?: string;
	initialDefaultContingencyPercent?: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [draft, setDraft] = useState<BudgetTemplateDraftValues>(
		emptyBudgetTemplateDraft
	);
	const [contingency, setContingency] = useState('0');

	const updateTemplate = useMutation(api.budgetTemplates.update.update);

	useEffect(() => {
		if (open) {
			setDraft({
				title: initialTitle,
				description: initialDescription ?? '',
			});
			setContingency(String(initialDefaultContingencyPercent ?? 0));
		}
	}, [
		open,
		initialTitle,
		initialDescription,
		initialDefaultContingencyPercent,
	]);

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
		const trimmedContingency = contingency.trim();
		if (
			trimmedContingency !== '' &&
			!isValidPercentString(trimmedContingency)
		) {
			toastManager.add({
				title: 'Enter a contingency between 0 and 100',
				type: 'error',
			});
			return;
		}
		try {
			const { data } = parsed;
			await updateTemplate({
				budgetTemplateId,
				title: data.title,
				description: data.description?.trim() || undefined,
				defaultContingencyPercent:
					trimmedContingency === ''
						? 0
						: parsePercentString(trimmedContingency),
			});
			toastManager.add({ title: 'Budget template updated', type: 'success' });
			onOpenChange(false);
		} catch (error) {
			onOpenChange(false);
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not update budget template. Please try again in a moment.'
				),
				title: 'Could not update budget template',
				type: 'error',
			});
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Budget Template</DialogTitle>
				</DialogHeader>
				<DialogPanel className="flex flex-col gap-4">
					<Field>
						<FieldLabel htmlFor="edit-budget-template-title">Title</FieldLabel>
						<Input
							autoFocus
							id="edit-budget-template-title"
							nativeInput
							onChange={(e) =>
								setDraft((p) => ({ ...p, title: e.target.value }))
							}
							placeholder="Template title"
							value={draft.title}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="edit-budget-template-description">
							Description{' '}
							<span className="text-muted-foreground text-xs">(optional)</span>
						</FieldLabel>
						<Textarea
							id="edit-budget-template-description"
							onChange={(e) =>
								setDraft((p) => ({ ...p, description: e.target.value }))
							}
							placeholder="Short description"
							rows={3}
							value={draft.description ?? ''}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="edit-budget-template-contingency">
							Default contingency
						</FieldLabel>
						<InputGroup>
							<InputGroupInput
								id="edit-budget-template-contingency"
								inputMode="decimal"
								nativeInput
								onChange={(e) => setContingency(e.target.value)}
								placeholder="0"
								type="text"
								value={contingency}
							/>
							<InputGroupAddon align="inline-end">
								<InputGroupText>%</InputGroupText>
							</InputGroupAddon>
						</InputGroup>
						<FieldDescription>
							Changing this applies the percentage to every trade in this
							template.
						</FieldDescription>
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
						variant="outline"
					>
						<Check aria-hidden />
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
