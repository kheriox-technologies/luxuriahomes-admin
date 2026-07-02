'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { useMutation } from 'convex/react';
import { EllipsisVertical } from 'lucide-react';

type TaskStatus = 'Pending' | 'In Progress' | 'Complete';

export default function TaskCardActions({
	taskId,
	status,
}: {
	taskId: Id<'projectTasks'>;
	status: TaskStatus;
}) {
	const updateStatus = useMutation(api.projectTasks.updateStatus.updateStatus);

	return (
		<Menu>
			<MenuTrigger
				render={
					<Button
						aria-label="Task status actions"
						className="relative z-10"
						size="icon-sm"
						type="button"
						variant="ghost"
					/>
				}
			>
				<EllipsisVertical className="size-4" />
			</MenuTrigger>
			<MenuPopup align="end">
				{status !== 'Pending' && (
					<MenuItem onClick={() => updateStatus({ taskId, status: 'Pending' })}>
						Mark Pending
					</MenuItem>
				)}
				{status !== 'In Progress' && (
					<MenuItem
						onClick={() => updateStatus({ taskId, status: 'In Progress' })}
					>
						Mark In Progress
					</MenuItem>
				)}
				{status !== 'Complete' && (
					<MenuItem
						onClick={() => updateStatus({ taskId, status: 'Complete' })}
					>
						Mark Complete
					</MenuItem>
				)}
			</MenuPopup>
		</Menu>
	);
}
