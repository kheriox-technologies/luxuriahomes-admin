'use client';

import { cn } from '@workspace/ui/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

/** Rough starting height so the panel does not jump on first paint. */
const INITIAL_HEIGHT = 160;

/**
 * Renders signature HTML inside a sandboxed iframe that grows to fit its
 * content, so the whole signature is visible without scrolling.
 *
 * The iframe isolates the email markup from the app's Tailwind/dark-mode
 * styles, so what you see here matches what Gmail will render. `sandbox` grants
 * only `allow-same-origin` — enough to measure the content height from the
 * parent, while scripts stay blocked.
 */
export default function SignaturePreview({
	className,
	html,
}: {
	className?: string;
	html: string;
}) {
	const frameRef = useRef<HTMLIFrameElement>(null);
	const [height, setHeight] = useState(INITIAL_HEIGHT);

	const measure = useCallback(() => {
		const doc = frameRef.current?.contentDocument;
		if (!doc?.body) {
			return;
		}
		const next = Math.max(
			doc.documentElement.scrollHeight,
			doc.body.scrollHeight
		);
		if (next > 0) {
			setHeight(next);
		}
	}, []);

	useEffect(() => {
		const frame = frameRef.current;
		if (!frame) {
			return;
		}
		let observer: ResizeObserver | undefined;

		// Each srcDoc change swaps in a new document, so the observer has to be
		// re-bound on every load. The load event also covers the logo image, which
		// resolves after the document itself is ready.
		const attach = () => {
			const root = frame.contentDocument?.documentElement;
			if (!root) {
				return;
			}
			observer?.disconnect();
			observer = new ResizeObserver(measure);
			observer.observe(root);
			measure();
		};

		attach();
		// No `html` dependency: every srcDoc change fires `load`, which re-attaches.
		frame.addEventListener('load', attach);
		return () => {
			frame.removeEventListener('load', attach);
			observer?.disconnect();
		};
	}, [measure]);

	const srcDocument = `<!doctype html><html><head><meta charset="utf-8"><meta name="color-scheme" content="light"></head><body style="margin:0;padding:16px;background:#ffffff;overflow:hidden;">${html}</body></html>`;

	return (
		<iframe
			className={cn('w-full rounded-md border bg-white', className)}
			ref={frameRef}
			sandbox="allow-same-origin"
			scrolling="no"
			srcDoc={srcDocument}
			style={{ height }}
			title="Signature preview"
		/>
	);
}
