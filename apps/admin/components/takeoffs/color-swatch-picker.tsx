'use client';

import { Button } from '@workspace/ui/components/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@workspace/ui/components/popover';
import { cn } from '@workspace/ui/lib/utils';
import { useState } from 'react';
import { SHAPE_PALETTE } from '@/lib/takeoffs/geometry';

// A compact colour picker: a swatch button that opens a popover of preset
// palette colours plus a native input for any custom colour. Controlled by the
// caller via `value`/`onChange`.
export default function ColorSwatchPicker({
	value,
	onChange,
	label = 'Pick colour',
}: {
	value: string;
	onChange: (color: string) => void;
	label?: string;
}) {
	const [open, setOpen] = useState(false);

	const pick = (color: string) => {
		onChange(color);
		setOpen(false);
	};

	return (
		<Popover onOpenChange={setOpen} open={open}>
			<PopoverTrigger
				render={
					<Button aria-label={label} size="icon-sm" variant="outline">
						<span
							className="size-4 rounded-full border"
							style={{ backgroundColor: value }}
						/>
					</Button>
				}
			/>
			<PopoverContent className="w-auto">
				<div className="flex flex-col gap-2">
					<div className="grid grid-cols-6 gap-1.5">
						{SHAPE_PALETTE.map((color) => (
							<button
								aria-label={color}
								className={cn(
									'size-6 rounded-full border transition-transform hover:scale-110',
									value.toLowerCase() === color.toLowerCase() &&
										'ring-2 ring-ring ring-offset-1 ring-offset-popover'
								)}
								key={color}
								onClick={() => pick(color)}
								style={{ backgroundColor: color }}
								type="button"
							/>
						))}
					</div>
					<label className="flex items-center justify-between gap-2 text-muted-foreground text-xs">
						Custom
						<input
							className="size-6 cursor-pointer rounded border bg-transparent p-0"
							onChange={(event) => onChange(event.target.value)}
							type="color"
							value={value}
						/>
					</label>
				</div>
			</PopoverContent>
		</Popover>
	);
}
