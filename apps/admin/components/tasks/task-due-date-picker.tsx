'use client';

import { Button } from '@workspace/ui/components/button';
import { Calendar } from '@workspace/ui/components/calendar';
import {
	Popover,
	PopoverPopup,
	PopoverTrigger,
} from '@workspace/ui/components/popover';
import { CalendarIcon, XIcon } from 'lucide-react';

export default function TaskDueDatePicker({
	value,
	onChange,
	onBlur,
	placeholder = 'No due date',
}: {
	value: Date | undefined;
	onChange: (date: Date | undefined) => void;
	onBlur?: () => void;
	placeholder?: string;
}) {
	const label = value
		? value.toLocaleDateString('en-AU', {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			})
		: placeholder;

	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						className="w-full justify-start font-normal"
						onBlur={onBlur}
						type="button"
						variant="outline"
					/>
				}
			>
				<CalendarIcon aria-hidden className="mr-2 size-4 opacity-60" />
				<span className={value ? '' : 'text-muted-foreground'}>{label}</span>
				{value ? (
					<span className="ml-auto">
						<XIcon
							aria-label="Clear due date"
							className="size-4 opacity-60 hover:opacity-100"
							onClick={(e) => {
								e.stopPropagation();
								onChange(undefined);
							}}
						/>
					</span>
				) : null}
			</PopoverTrigger>
			<PopoverPopup align="start" side="bottom">
				<Calendar
					captionLayout="dropdown"
					mode="single"
					onSelect={(date) => onChange(date ?? undefined)}
					selected={value}
				/>
			</PopoverPopup>
		</Popover>
	);
}
