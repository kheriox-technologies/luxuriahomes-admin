'use client';

import { Button } from '@workspace/ui/components/button';
import { toastManager } from '@workspace/ui/components/toast';
import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { copySignatureToClipboard } from '@/lib/copy-signature';

/** How long the button stays in its "Copied" state. */
const COPIED_RESET_MS = 2000;

/**
 * Copies rendered signature HTML and confirms inline on the button.
 *
 * Success is shown on the button rather than as a toast — the feedback belongs
 * where the click happened. Failures still toast, since they need explaining.
 */
export default function CopySignatureButton({
	'aria-label': ariaLabel,
	html,
	iconOnly = false,
}: {
	'aria-label'?: string;
	html: string;
	iconOnly?: boolean;
}) {
	const [copied, setCopied] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(
		() => () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		},
		[]
	);

	const onCopy = async () => {
		try {
			await copySignatureToClipboard(html);
			setCopied(true);
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
		} catch {
			toastManager.add({
				description: 'Your browser blocked clipboard access.',
				title: 'Could not copy signature',
				type: 'error',
			});
		}
	};

	const label = copied ? 'Copied' : 'Copy';

	return (
		<Button
			aria-label={iconOnly ? ariaLabel : undefined}
			onClick={() => {
				onCopy().catch(() => {
					/* Errors surface as a toast */
				});
			}}
			size={iconOnly ? 'icon' : 'sm'}
			type="button"
			variant="outline"
		>
			{copied ? <Check aria-hidden /> : <Copy aria-hidden />}
			{iconOnly ? null : label}
			{/* Announced to screen readers, which do not see the icon swap. */}
			<span aria-live="polite" className="sr-only">
				{copied ? 'Signature copied to clipboard' : ''}
			</span>
		</Button>
	);
}
