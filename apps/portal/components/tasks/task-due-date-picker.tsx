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
			<div className="relative">
				<PopoverTrigger
					render={
						<Button
							className="w-full justify-start pr-9 font-normal"
							onBlur={onBlur}
							type="button"
							variant="outline"
						/>
					}
				>
					<CalendarIcon aria-hidden className="mr-2 size-4 opacity-60" />
					<span className={value ? '' : 'text-muted-foreground'}>{label}</span>
				</PopoverTrigger>
				{value ? (
					<button
						aria-label="Clear due date"
						className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-center rounded-sm"
						onClick={(e) => {
							e.stopPropagation();
							onChange(undefined);
						}}
						onMouseDown={(e) => e.preventDefault()}
						type="button"
					>
						<XIcon className="size-4 opacity-60 hover:opacity-100" />
					</button>
				) : null}
			</div>
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
