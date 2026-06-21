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
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { useEffect, useState } from 'react';
import TaskProjectCombobox from '@/components/tasks/task-project-combobox';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function AddBudgetToProject({
	budgetId,
	budgetTitle,
	open,
	onOpenChange,
}: {
	budgetId: Id<'budgets'>;
	budgetTitle: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [projectId, setProjectId] = useState<string>('');
	const [isSaving, setIsSaving] = useState(false);
	const addToProject = useMutation(api.projectBudgets.add.add);

	useEffect(() => {
		if (open) {
			setProjectId('');
		}
	}, [open]);

	const handleSubmit = async () => {
		if (!projectId) {
			toastManager.add({ title: 'Select a project', type: 'error' });
			return;
		}
		setIsSaving(true);
		try {
			await addToProject({
				projectId: projectId as Id<'projects'>,
				budgetId,
			});
			toastManager.add({ title: 'Budget added to project', type: 'success' });
			onOpenChange(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not add budget to project. Please try again in a moment.'
				),
				title: 'Could not add to project',
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
					<DialogTitle>Add to Project</DialogTitle>
				</DialogHeader>
				<DialogPanel className="flex flex-col gap-4">
					<Field>
						<FieldLabel htmlFor="add-budget-to-project-project">
							Project
						</FieldLabel>
						<TaskProjectCombobox
							id="add-budget-to-project-project"
							onChange={setProjectId}
							placeholder="Select a project"
							value={projectId}
						/>
						<FieldDescription>
							{`Adds "${budgetTitle}" to the selected project. A project can have one budget item per trade.`}
						</FieldDescription>
					</Field>
				</DialogPanel>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						disabled={!projectId}
						loading={isSaving}
						onClick={() => {
							handleSubmit().catch(() => {
								/* Error handled in handleSubmit */
							});
						}}
						type="button"
					>
						Add to Project
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
