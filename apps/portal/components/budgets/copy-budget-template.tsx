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
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

const PERCENTAGE_PATTERN = /^\d+(\.\d+)?$/;

export default function CopyBudgetTemplate({
	sourceBudgetTemplateId,
	templateTitle,
	open,
	onOpenChange,
}: {
	sourceBudgetTemplateId: Id<'budgetTemplates'>;
	templateTitle: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const router = useRouter();
	const [name, setName] = useState('');
	const [percentage, setPercentage] = useState('');
	const [isSaving, setIsSaving] = useState(false);

	const copyTemplate = useMutation(api.budgetTemplates.copy.copy);

	useEffect(() => {
		if (open) {
			setName(`${templateTitle} (Copy)`);
			setPercentage('');
		}
	}, [open, templateTitle]);

	const handleSubmit = async () => {
		const trimmedName = name.trim();
		if (trimmedName.length === 0) {
			toastManager.add({
				description: 'Enter a name for the new template.',
				title: 'Name is required',
				type: 'error',
			});
			return;
		}

		const trimmedPercentage = percentage.trim();
		let percentageIncrease = 0;
		if (trimmedPercentage.length > 0) {
			if (!PERCENTAGE_PATTERN.test(trimmedPercentage)) {
				toastManager.add({
					description: 'Enter a positive number, e.g. 10 for a 10% increase.',
					title: 'Percentage is invalid',
					type: 'error',
				});
				return;
			}
			percentageIncrease = Number(trimmedPercentage);
		}

		setIsSaving(true);
		try {
			const newId = await copyTemplate({
				sourceBudgetTemplateId,
				title: trimmedName,
				percentageIncrease,
			});
			toastManager.add({ title: 'Budget template copied', type: 'success' });
			onOpenChange(false);
			router.push(`/budgets/${newId}`);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not copy budget template. Please try again in a moment.'
				),
				title: 'Could not copy budget template',
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
					<DialogTitle>Copy Budget Template</DialogTitle>
				</DialogHeader>
				<DialogPanel className="flex flex-col gap-4">
					<Field>
						<FieldLabel htmlFor="copy-budget-template-name">Name</FieldLabel>
						<Input
							autoFocus
							id="copy-budget-template-name"
							nativeInput
							onChange={(e) => setName(e.target.value)}
							placeholder="Template name"
							value={name}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="copy-budget-template-percentage">
							% increase{' '}
							<span className="text-muted-foreground text-xs">(optional)</span>
						</FieldLabel>
						<Input
							id="copy-budget-template-percentage"
							inputMode="decimal"
							nativeInput
							onChange={(e) => setPercentage(e.target.value)}
							placeholder="0"
							value={percentage}
						/>
						<FieldDescription>
							Increase every trade price by this percentage. Leave blank for an
							exact copy.
						</FieldDescription>
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
						<Copy aria-hidden />
						Copy Template
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
