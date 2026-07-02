'use client';

import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogPanel,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import {
	Select,
	SelectItem,
	SelectPopup,
	SelectTrigger,
	SelectValue,
} from '@workspace/ui/components/select';
import { type ReactElement, useEffect, useState } from 'react';
import { PAPER_SIZE_OPTIONS } from '@/lib/takeoffs/geometry';
import type {
	MethodScope,
	PaperSize,
	ScaleSetting,
} from '@/lib/takeoffs/types';

// Common architectural drawing-scale ratios offered as quick picks; any other
// value can be typed via the custom input.
const RATIO_PRESETS = [50, 100, 200, 500, 1000] as const;

const PAPER_LABELS: Record<PaperSize, string> = {
	A0: 'A0',
	A1: 'A1',
	A2: 'A2',
	A3: 'A3',
	A4: 'A4',
	auto: 'Auto (detect from PDF)',
};

export default function ScaleDialog({
	open,
	page,
	initialScale,
	initialScope,
	onConfirm,
	onCancel,
}: {
	open: boolean;
	page: number;
	initialScale: ScaleSetting;
	initialScope: MethodScope;
	onConfirm: (scale: ScaleSetting, scope: MethodScope) => void;
	onCancel: () => void;
}): ReactElement {
	const [ratio, setRatio] = useState(String(initialScale.ratio));
	const [paper, setPaper] = useState<PaperSize>(initialScale.paper);
	const [scope, setScope] = useState<MethodScope>(initialScope);

	// Re-seed the form whenever the dialog is (re)opened for a new context.
	useEffect(() => {
		if (open) {
			setRatio(String(initialScale.ratio));
			setPaper(initialScale.paper);
			setScope(initialScope);
		}
	}, [open, initialScale, initialScope]);

	const ratioNumber = Number(ratio);
	const valid = Number.isFinite(ratioNumber) && ratioNumber > 0;

	const scopeOptions: Array<{ id: MethodScope; label: string }> = [
		{ id: 'all', label: 'All pages' },
		{ id: 'page', label: `This page only (${page})` },
	];

	const confirm = () => {
		if (valid) {
			onConfirm({ ratio: ratioNumber, paper }, scope);
		}
	};

	return (
		<Dialog
			onOpenChange={(next) => {
				if (!next) {
					onCancel();
				}
			}}
			open={open}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Set drawing scale</DialogTitle>
					<DialogDescription>
						Choose the plan's drawing scale and paper size. The real-world
						measurement scale is derived from these, so no calibration line is
						needed.
					</DialogDescription>
				</DialogHeader>
				<DialogPanel className="flex flex-col gap-3">
					<div className="flex flex-col gap-1.5">
						<span className="font-medium text-muted-foreground text-xs">
							Scale ratio
						</span>
						<div className="flex items-center gap-2">
							<div className="flex flex-wrap items-center gap-1 rounded-lg border p-1">
								{RATIO_PRESETS.map((preset) => (
									<Button
										key={preset}
										onClick={() => setRatio(String(preset))}
										size="sm"
										variant={Number(ratio) === preset ? 'default' : 'ghost'}
									>
										1:{preset}
									</Button>
								))}
							</div>
							<div className="flex items-center gap-1">
								<span className="text-muted-foreground text-sm">1:</span>
								<Input
									className="w-24"
									nativeInput
									onChange={(event) => setRatio(event.target.value)}
									onKeyDown={(event) => {
										if (event.key === 'Enter') {
											confirm();
										}
									}}
									placeholder="100"
									type="number"
									value={ratio}
								/>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<span className="font-medium text-muted-foreground text-xs">
							Paper size
						</span>
						<Select
							onValueChange={(next) => setPaper(next as PaperSize)}
							value={paper}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectPopup>
								{PAPER_SIZE_OPTIONS.map((size) => (
									<SelectItem key={size} value={size}>
										{PAPER_LABELS[size]}
									</SelectItem>
								))}
								<SelectItem value="auto">{PAPER_LABELS.auto}</SelectItem>
							</SelectPopup>
						</Select>
					</div>

					<div className="flex flex-col gap-1.5">
						<span className="font-medium text-muted-foreground text-xs">
							Apply scale to
						</span>
						<div className="flex items-center gap-1 rounded-lg border p-1">
							{scopeOptions.map((option) => (
								<Button
									className="flex-1"
									key={option.id}
									onClick={() => setScope(option.id)}
									size="sm"
									variant={scope === option.id ? 'default' : 'ghost'}
								>
									{option.label}
								</Button>
							))}
						</div>
					</div>
				</DialogPanel>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button disabled={!valid} onClick={confirm} type="button">
						Set scale
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
