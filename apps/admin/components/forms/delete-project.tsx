'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
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
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { type ReactElement, useState } from 'react';

export default function DeleteProject({
	projectId,
	projectName,
	trigger,
}: {
	projectId: Id<'projects'>;
	projectName: string;
	trigger?: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const removeProject = useMutation(api.projects.remove.remove);
	const router = useRouter();

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await removeProject({ projectId });
			toastManager.add({
				title: 'Project deleted',
				type: 'success',
			});
			setOpen(false);
			router.push('/projects');
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Could not delete project';
			toastManager.add({
				description: message,
				title: 'Could not delete project',
				type: 'error',
			});
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<AlertDialog onOpenChange={setOpen} open={open}>
			<AlertDialogTrigger
				render={
					trigger ?? (
						<Button variant="destructive-outline">Delete project</Button>
					)
				}
			/>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete project?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will permanently delete ${projectName}. This action cannot be undone.`}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</AlertDialogClose>
					<Button
						loading={isDeleting}
						onClick={() => {
							onDelete().catch(() => {
								/* Error is handled in onDelete */
							});
						}}
						variant="destructive"
					>
						Delete project
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
