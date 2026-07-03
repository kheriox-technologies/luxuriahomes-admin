'use client';

import {
	Select,
	SelectItem,
	SelectPopup,
	SelectTrigger,
	SelectValue,
} from '@workspace/ui/components/select';
import { Percent } from 'lucide-react';
import { WASTAGE_OPTIONS } from '@/lib/takeoffs/geometry';

// Global (PDF-wide) wastage allowance for the toolbar. Sets the default wastage %
// added on top of every measurement's actual value; individual measurements can
// override it from their row in the measurements panel.
export default function WastageControl({
	value,
	onChange,
}: {
	value: number;
	onChange: (next: number) => void;
}) {
	return (
		<div
			className="flex items-center gap-1.5"
			title="Default wastage allowance added to every measurement"
		>
			<Percent className="size-4 text-muted-foreground" />
			<span className="text-muted-foreground text-xs">Wastage</span>
			<Select
				onValueChange={(next) => onChange(Number(next))}
				value={String(value)}
			>
				<SelectTrigger className="min-w-20" size="sm">
					<SelectValue>{(selected) => `${selected}%`}</SelectValue>
				</SelectTrigger>
				<SelectPopup>
					{WASTAGE_OPTIONS.map((option) => (
						<SelectItem key={option} value={String(option)}>
							{option}%
						</SelectItem>
					))}
				</SelectPopup>
			</Select>
		</div>
	);
}
