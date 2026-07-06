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
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type ReactElement, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function DeleteProject({
	projectId,
	projectName,
	trigger,
	open: controlledOpen,
	onOpenChange,
	redirectOnDelete = true,
}: {
	projectId: Id<'projects'>;
	projectName: string;
	trigger?: ReactElement;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	redirectOnDelete?: boolean;
}) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : uncontrolledOpen;
	const setOpen = (next: boolean) => {
		if (!isControlled) {
			setUncontrolledOpen(next);
		}
		onOpenChange?.(next);
	};
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
			if (redirectOnDelete) {
				router.push('/projects');
			}
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete project. Please try again in a moment.'
				),
				title: 'Could not delete project',
				type: 'error',
			});
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<AlertDialog onOpenChange={setOpen} open={open}>
			{isControlled ? null : (
				<AlertDialogTrigger
					render={
						trigger ?? (
							<Button variant="destructive-outline">
								<Trash2 aria-hidden /> Delete project
							</Button>
						)
					}
				/>
			)}
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
						variant="destructive-outline"
					>
						<Trash2 aria-hidden /> Delete project
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
