'use client';

import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';
import { Button } from '@workspace/ui/components/button';
import {
	ToggleGroup,
	ToggleGroupItem,
} from '@workspace/ui/components/toggle-group';
import { useState } from 'react';
import { type AppMode, useAppModeStore } from '@/stores/app-mode-store';

export default function AppModeToggle() {
	const mode = useAppModeStore((state) => state.mode);
	const setMode = useAppModeStore((state) => state.setMode);
	const [open, setOpen] = useState(false);
	const [pendingMode, setPendingMode] = useState<AppMode | null>(null);

	const onModeChange = (nextModeValues: string[]) => {
		const nextModeValue = nextModeValues.at(-1);
		if (!nextModeValue) {
			return;
		}

		if (nextModeValue !== 'builder' && nextModeValue !== 'client') {
			return;
		}

		const nextMode: AppMode = nextModeValue;
		if (nextMode === mode) {
			return;
		}

		if (mode === 'client' && nextMode === 'builder') {
			setPendingMode(nextMode);
			setOpen(true);
			return;
		}

		setMode(nextMode);
	};

	const onConfirmBuilderMode = () => {
		if (pendingMode) {
			setMode(pendingMode);
		}
		setPendingMode(null);
		setOpen(false);
	};

	const onCancelBuilderMode = () => {
		setPendingMode(null);
		setOpen(false);
	};

	return (
		<>
			<ToggleGroup
				aria-label="Application mode"
				onValueChange={onModeChange}
				value={[mode]}
				variant="outline"
			>
				<ToggleGroupItem
					className="data-pressed:border-primary data-pressed:bg-primary data-pressed:text-primary-foreground hover:data-pressed:bg-primary/90"
					value="builder"
				>
					Builder
				</ToggleGroupItem>
				<ToggleGroupItem
					className="data-pressed:border-primary data-pressed:bg-primary data-pressed:text-primary-foreground hover:data-pressed:bg-primary/90"
					value="client"
				>
					Client
				</ToggleGroupItem>
			</ToggleGroup>

			<AlertDialog onOpenChange={setOpen} open={open}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Switch to Builder mode?</AlertDialogTitle>
						<AlertDialogDescription>
							You are switching from Client to Builder mode. Continue?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogClose
							onClick={onCancelBuilderMode}
							render={<Button type="button" variant="outline" />}
						>
							Cancel
						</AlertDialogClose>
						<Button onClick={onConfirmBuilderMode} type="button">
							Switch to Builder
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
