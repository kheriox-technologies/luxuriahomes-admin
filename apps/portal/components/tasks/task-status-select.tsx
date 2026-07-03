'use client';

import {
	Select,
	SelectItem,
	SelectPopup,
	SelectTrigger,
	SelectValue,
} from '@workspace/ui/components/select';
import {
	TASK_STATUS_LABELS,
	TASK_STATUS_ORDER,
	type TaskStatus,
} from '@/components/tasks/task-form-shared';

export default function TaskStatusSelect({
	id,
	value,
	onChange,
}: {
	id?: string;
	value: TaskStatus;
	onChange: (next: TaskStatus) => void;
}) {
	return (
		<Select
			onValueChange={(next) => onChange(next as TaskStatus)}
			value={value}
		>
			<SelectTrigger id={id}>
				<SelectValue placeholder="Select status" />
			</SelectTrigger>
			<SelectPopup>
				{TASK_STATUS_ORDER.map((status) => (
					<SelectItem key={status} value={status}>
						{TASK_STATUS_LABELS[status]}
					</SelectItem>
				))}
			</SelectPopup>
		</Select>
	);
}
