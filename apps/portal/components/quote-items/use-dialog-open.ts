'use client';

import { useCallback, useState } from 'react';

export interface ControllableDialogProps {
	onOpenChange?: (next: boolean) => void;
	open?: boolean;
}

/**
 * Lets a dialog be driven either by its own trigger (uncontrolled) or by a
 * parent — needed for the menu-style headers, where the menu closes on click so
 * the dialog's open state has to live outside it.
 */
export function useDialogOpen({ open, onOpenChange }: ControllableDialogProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const isControlled = open !== undefined;

	const setOpen = useCallback(
		(next: boolean) => {
			if (!isControlled) {
				setInternalOpen(next);
			}
			onOpenChange?.(next);
		},
		[isControlled, onOpenChange]
	);

	return { open: isControlled ? open : internalOpen, setOpen };
}
