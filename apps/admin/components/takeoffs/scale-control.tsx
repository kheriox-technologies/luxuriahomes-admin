'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@workspace/ui/components/popover';
import { ChevronDown, Crosshair, Ruler } from 'lucide-react';
import { useState } from 'react';
import { formatMethodLabel } from '@/lib/takeoffs/geometry';
import type { MeasurementMethod } from '@/lib/takeoffs/types';

// Global (PDF-wide) scale/calibration control for the toolbar. Shows the active
// document method and opens a popover to switch between a drawing scale and a
// calibration. Per-page overrides live in the measurements panel instead.
export default function ScaleControl({
	method,
	calibrating,
	onOpenScaleDialog,
	onCalibrate,
}: {
	method: MeasurementMethod | null;
	calibrating: boolean;
	onOpenScaleDialog: () => void;
	onCalibrate: () => void;
}) {
	const [open, setOpen] = useState(false);

	const isScale = method?.kind === 'scale';
	const label = method ? formatMethodLabel(method) : 'Not set';

	return (
		<Popover onOpenChange={setOpen} open={open}>
			<PopoverTrigger
				render={
					<Button
						className="ml-auto"
						size="sm"
						title="Set the measurement scale for all pages"
						variant="outline"
					>
						{isScale ? <Ruler /> : <Crosshair />}
						<span className="text-muted-foreground text-xs">All pages</span>
						<Badge size="lg" variant={method ? 'success' : 'warning'}>
							{label}
						</Badge>
						<ChevronDown className="opacity-60" />
					</Button>
				}
			/>
			<PopoverContent align="end" className="w-64">
				<div className="flex flex-col gap-2">
					<p className="font-medium text-sm">Measurement scale · all pages</p>
					<p className="text-muted-foreground text-xs">
						Pick a known drawing scale, or calibrate from a line of known
						length.
					</p>
					<Button
						className="justify-start"
						onClick={() => {
							setOpen(false);
							onOpenScaleDialog();
						}}
						size="sm"
						variant={isScale ? 'default' : 'outline'}
					>
						<Ruler />
						Drawing scale…
					</Button>
					<Button
						className="justify-start"
						onClick={() => {
							setOpen(false);
							onCalibrate();
						}}
						size="sm"
						variant={
							method?.kind === 'calibration' || calibrating
								? 'default'
								: 'outline'
						}
					>
						<Crosshair />
						Calibrate from line
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
