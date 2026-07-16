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
import {
	Select,
	SelectItem,
	SelectPopup,
	SelectTrigger,
	SelectValue,
} from '@workspace/ui/components/select';
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
	const [adjustmentType, setAdjustmentType] = useState<'increase' | 'decrease'>(
		'increase'
	);
	const [isSaving, setIsSaving] = useState(false);

	const copyTemplate = useMutation(api.budgetTemplates.copy.copy);

	useEffect(() => {
		if (open) {
			setName(`${templateTitle} (Copy)`);
			setPercentage('');
			setAdjustmentType('increase');
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
		let percentageValue = 0;
		if (trimmedPercentage.length > 0) {
			if (!PERCENTAGE_PATTERN.test(trimmedPercentage)) {
				toastManager.add({
					description: 'Enter a positive number, e.g. 10 for a 10% change.',
					title: 'Percentage is invalid',
					type: 'error',
				});
				return;
			}
			percentageValue = Number(trimmedPercentage);
		}

		if (adjustmentType === 'decrease' && percentageValue > 100) {
			toastManager.add({
				description: 'Percentage decrease cannot exceed 100%.',
				title: 'Percentage is invalid',
				type: 'error',
			});
			return;
		}

		setIsSaving(true);
		try {
			const newId = await copyTemplate({
				sourceBudgetTemplateId,
				title: trimmedName,
				percentage: percentageValue,
				adjustmentType,
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
							Price adjustment{' '}
							<span className="text-muted-foreground text-xs">(optional)</span>
						</FieldLabel>
						<div className="flex w-full gap-2">
							<Select
								onValueChange={(next) =>
									setAdjustmentType(next as 'increase' | 'decrease')
								}
								value={adjustmentType}
							>
								<SelectTrigger className="flex-1">
									<SelectValue />
								</SelectTrigger>
								<SelectPopup>
									<SelectItem value="increase">Increase</SelectItem>
									<SelectItem value="decrease">Decrease</SelectItem>
								</SelectPopup>
							</Select>
							<InputGroup className="flex-1">
								<InputGroupInput
									id="copy-budget-template-percentage"
									inputMode="decimal"
									nativeInput
									onChange={(e) => setPercentage(e.target.value)}
									placeholder="0"
									type="text"
									value={percentage}
								/>
								<InputGroupAddon align="inline-end">
									<InputGroupText>%</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
						</div>
						<FieldDescription>
							Raise or lower every trade price by this percentage. Leave blank
							for an exact copy.
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
