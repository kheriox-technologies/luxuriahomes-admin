'use client';

import type { Doc } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DeleteOrderTask from './delete-order-task';
import EditOrderTask from './edit-order-task';
import { TASK_ROW_HEIGHT } from './schedule-row-heights';

export default function OrderTaskRow({
	orderTask,
}: {
	orderTask: Doc<'scheduleOrderTasks'>;
}) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		<>
			<div
				className="flex items-center justify-between border-border/50 border-b pr-3 pl-8"
				style={{ height: TASK_ROW_HEIGHT }}
			>
				<div className="flex min-w-0 flex-1 items-center gap-1">
					<span className="min-w-0 flex-1 truncate text-left text-muted-foreground text-sm">
						{orderTask.name}
					</span>
				</div>
				<div className="flex shrink-0 items-center gap-1">
					<span className="text-muted-foreground text-xs">
						{orderTask.durationDays}d
					</span>
					<Badge
						className="bg-pink-500/20 px-1 py-0 font-semibold text-[9px] text-pink-700 dark:text-pink-300"
						size="sm"
					>
						O
					</Badge>
					<Menu>
						<MenuTrigger
							render={
								<Button
									aria-label="Order task actions"
									size="icon-sm"
									type="button"
									variant="ghost"
								/>
							}
						>
							<EllipsisVertical className="size-4" />
						</MenuTrigger>
						<MenuPopup align="end">
							<MenuItem onClick={() => setEditOpen(true)}>
								<Pencil />
								Edit Order Task
							</MenuItem>
							<MenuSeparator />
							<MenuItem
								onClick={() => setDeleteOpen(true)}
								variant="destructive"
							>
								<Trash2 />
								Delete Order Task
							</MenuItem>
						</MenuPopup>
					</Menu>
				</div>
			</div>
			<EditOrderTask
				onOpenChange={setEditOpen}
				open={editOpen}
				orderTask={orderTask}
			/>
			<DeleteOrderTask
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				orderTask={orderTask}
			/>
		</>
	);
}
