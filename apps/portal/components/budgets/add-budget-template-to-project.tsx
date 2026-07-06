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
	DialogTrigger,
} from '@workspace/ui/components/dialog';
import {
	Field,
	FieldDescription,
	FieldLabel,
} from '@workspace/ui/components/field';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { FolderPlus, Plus } from 'lucide-react';
import { type ReactElement, useEffect, useState } from 'react';
import TaskProjectCombobox from '@/components/tasks/task-project-combobox';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function AddBudgetTemplateToProject({
	budgetTemplateId,
	templateTitle,
	trigger,
}: {
	budgetTemplateId: Id<'budgetTemplates'>;
	templateTitle: string;
	trigger?: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const [projectId, setProjectId] = useState<string>('');
	const [isSaving, setIsSaving] = useState(false);
	const applyToProject = useMutation(
		api.budgetTemplates.applyToProject.applyToProject
	);

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
			await applyToProject({
				projectId: projectId as Id<'projects'>,
				budgetTemplateId,
			});
			toastManager.add({
				title: 'Template added to project',
				type: 'success',
			});
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not add template to project. Please try again in a moment.'
				),
				title: 'Could not add to project',
				type: 'error',
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger
				render={
					trigger ?? (
						<Button variant="outline">
							<FolderPlus />
							Add to Project
						</Button>
					)
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add to Project</DialogTitle>
				</DialogHeader>
				<DialogPanel className="flex flex-col gap-4">
					<Field>
						<FieldLabel htmlFor="add-budget-template-to-project-project">
							Project
						</FieldLabel>
						<TaskProjectCombobox
							id="add-budget-template-to-project-project"
							onChange={setProjectId}
							placeholder="Select a project"
							value={projectId}
						/>
						<FieldDescription>
							{`Adds every trade price from "${templateTitle}" to the selected project. Existing trade prices on the project are overwritten.`}
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
						variant="outline"
					>
						<Plus aria-hidden />
						Add to Project
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
