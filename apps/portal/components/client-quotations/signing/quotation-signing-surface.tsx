'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import { Spinner } from '@workspace/ui/components/spinner';
import { toastManager } from '@workspace/ui/components/toast';
import { cn } from '@workspace/ui/lib/utils';
import { useAction, useMutation } from 'convex/react';
import { ArrowDown, Check, PenLine } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { QuotationSurface } from '@/components/client-quotations/quotation-surface';
import { usePdfDocument } from '@/components/takeoffs/use-pdf-document';
import {
	buildClientQuotationSignaturePdf,
	type QuotationPdfAnchor,
} from '@/lib/client/pdf/client-quotation-pdf';
import { A4_HEIGHT, A4_WIDTH } from '@/lib/client/pdf/client-quotation-theme';
import {
	buildQuotationPdfInput,
	buildSignerSlots,
} from '@/lib/client/pdf/quotation-pdf-input';
import {
	DEFAULT_SIGNATURE_STYLE,
	deriveInitials,
	isSignatureStyleId,
	type SignatureStyleId,
	signatureStyle,
} from '@/lib/client/pdf/signature-styles';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { UNAUTHORIZED_HREF, useSigningContext } from './use-signing-context';

const PAGE_RENDER_WIDTH = 900;

/**
 * What the countersignature box is captioned before it is signed. Fixed rather
 * than taken from whoever is viewing, so every signer's copy of an unsigned
 * document reads identically; once signed, the row carries the admin's own name.
 */
const REPRESENTATIVE_PLACEHOLDER_NAME = 'Luxuria Homes';

/** The one place a document's marks are held while the signer works. */
interface AppliedMarks {
	initialled: Set<string>;
	signed: boolean;
}

/**
 * Where a signer initials each section and signs the last page.
 *
 * The document is built once on mount, already carrying every signature
 * collected so far — so a client opening their link after another has signed
 * sees that signature before they touch anything. Placing a mark only updates
 * local state and paints an overlay; the PDF is rebuilt exactly once, at the
 * end, with everything applied. Rebuilding on every click would re-lay out a
 * dozen pages each time and make the page unusable.
 */
export default function QuotationSigningSurface({
	quotationId,
	surface,
}: {
	quotationId: Id<'clientQuotations'>;
	surface: QuotationSurface;
}) {
	const router = useRouter();
	const params = useSearchParams();
	const context = useSigningContext(quotationId, surface);

	const styleParam = params.get('style');
	const style: SignatureStyleId =
		styleParam && isSignatureStyleId(styleParam)
			? styleParam
			: DEFAULT_SIGNATURE_STYLE;
	const initialsParam = params.get('initials')?.trim() ?? '';

	const [doc, setDoc] = useState<{
		anchors: QuotationPdfAnchor[];
		url: string;
	} | null>(null);
	const [buildError, setBuildError] = useState<string | null>(null);
	const [marks, setMarks] = useState<AppliedMarks>({
		initialled: new Set(),
		signed: false,
	});
	const [submitting, setSubmitting] = useState(false);

	const generateUploadUrl = useAction(
		api.clientQuotations.generateSignatureUploadUrl.generateSignatureUploadUrl
	);
	const recordClientSignature = useMutation(
		api.clientPortal.quotations.recordSignature.recordSignature
	);
	const recordAdminSignature = useMutation(
		api.clientQuotations.recordSignature.recordSignature
	);

	const authorized = context?.authorized === true ? context : null;
	const signerName = authorized?.signer.name ?? '';
	const initials = initialsParam || deriveInitials(signerName);
	const mySlotKey = authorized?.signer.slotKey ?? '';

	useEffect(() => {
		if (context && !context.authorized) {
			router.replace(UNAUTHORIZED_HREF);
		}
	}, [context, router]);

	// The context is a live query, so its object identity changes on every server
	// push. The effect below reads it through a ref and keys off what actually
	// matters instead — otherwise the document would rebuild on every push.
	const authorizedRef = useRef(authorized);
	authorizedRef.current = authorized;

	// The document the signer works on — everyone else's marks already in place,
	// theirs still to come. Rebuilt only when the collected set actually changes,
	// which is how a signer who lost a race gets a refreshed document.
	const signatureFingerprint = authorized?.signatures
		.map((row) => `${row.slotKey}:${row.signedAt}`)
		.join('|');

	// biome-ignore lint/correctness/useExhaustiveDependencies: the fingerprint is a cache key, not a value the effect reads — it stands in for the context behind `authorizedRef`, which cannot be a dependency without rebuilding on every server push.
	useEffect(() => {
		const current = authorizedRef.current;
		if (!current) {
			return;
		}
		let cancelled = false;
		let objectUrl: string | null = null;

		(async () => {
			try {
				const signers = buildSignerSlots(
					current.quotation,
					current.signatures,
					REPRESENTATIVE_PLACEHOLDER_NAME,
					style
				);
				const { anchors, blob } = await buildClientQuotationSignaturePdf(
					buildQuotationPdfInput({
						quotation: current.quotation,
						signers,
						versions: current.versions,
					})
				);
				if (cancelled) {
					return;
				}
				objectUrl = URL.createObjectURL(blob);
				setDoc({ anchors, url: objectUrl });
				// A fresh document means the marks placed on the old one no longer
				// correspond to anything on screen.
				setMarks({ initialled: new Set(), signed: false });
			} catch {
				if (!cancelled) {
					setBuildError(
						'Could not prepare the quotation for signing. Please reload the page.'
					);
				}
			}
		})();

		return () => {
			cancelled = true;
			if (objectUrl) {
				URL.revokeObjectURL(objectUrl);
			}
		};
	}, [signatureFingerprint, style]);

	/**
	 * My boxes, in signing order: every initials box first, then the signature.
	 * Document order would put the acknowledgement section's initials strip after
	 * the signature block it sits under, which reads backwards when walking a
	 * signer through the ceremony.
	 */
	const mySteps = useMemo(() => {
		const mine = (doc?.anchors ?? []).filter(
			(anchor) => anchor.slotKey === mySlotKey
		);
		return [
			...mine.filter((anchor) => anchor.kind === 'initials'),
			...mine.filter((anchor) => anchor.kind === 'signature'),
		];
	}, [doc, mySlotKey]);

	const isApplied = useCallback(
		(anchor: QuotationPdfAnchor) =>
			anchor.kind === 'signature'
				? marks.signed
				: marks.initialled.has(anchor.id),
		[marks]
	);

	const nextStep = mySteps.find((anchor) => !isApplied(anchor));
	const initialsSteps = mySteps.filter((a) => a.kind === 'initials');
	const initialsDone = initialsSteps.filter(isApplied).length;
	const allApplied = mySteps.length > 0 && mySteps.every(isApplied);

	const applyMark = (anchor: QuotationPdfAnchor) => {
		setMarks((current) =>
			anchor.kind === 'signature'
				? { ...current, signed: true }
				: {
						...current,
						initialled: new Set(current.initialled).add(anchor.id),
					}
		);
	};

	const scrollTo = (anchor: QuotationPdfAnchor) => {
		document
			.getElementById(anchorElementId(anchor))
			?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	};

	const onFinish = async () => {
		if (!authorized) {
			return;
		}
		setSubmitting(true);
		try {
			// The final document: everyone else's marks, plus mine.
			const signers = buildSignerSlots(
				authorized.quotation,
				[
					...authorized.signatures,
					{
						initialsText: initials,
						name: authorized.signer.name,
						signatureText: authorized.signer.name,
						signedAt: Date.now(),
						slotKey: mySlotKey,
						style,
					},
				],
				REPRESENTATIVE_PLACEHOLDER_NAME,
				style
			);
			const { blob } = await buildClientQuotationSignaturePdf(
				buildQuotationPdfInput({
					quotation: authorized.quotation,
					signers,
					versions: authorized.versions,
				})
			);

			const upload = await generateUploadUrl({ quotationId });
			const response = await fetch(upload.uploadUrl, {
				method: 'PUT',
				body: blob,
				headers: { 'Content-Type': 'application/pdf' },
			});
			if (!response.ok) {
				throw new Error('Upload failed');
			}

			const record =
				surface === 'client' ? recordClientSignature : recordAdminSignature;
			const result = await record({
				quotationId,
				version: authorized.quotation.version ?? 1,
				basisSignatureIds: authorized.basisSignatureIds,
				style,
				signatureText: authorized.signer.name,
				initialsText: initials,
				document: {
					fileName: upload.fileName,
					folderPath: upload.folderPath,
					kebabName: upload.kebabName,
					s3Key: upload.s3Key,
					size: blob.size,
				},
			});

			toastManager.add({
				description: result.complete
					? 'Everyone has now signed. A copy is on its way to all parties.'
					: 'Thank you — your signature has been recorded.',
				title: 'Quotation signed',
				type: 'success',
			});
			router.push(
				(surface === 'client' ? '/client/quotations' : '/quotations') as never
			);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not record your signature. Please try again in a moment.'
				),
				title: 'Could not sign',
				type: 'error',
			});
		} finally {
			setSubmitting(false);
		}
	};

	if (context === undefined) {
		return (
			<div className="flex min-h-64 items-center justify-center">
				<Spinner />
			</div>
		);
	}
	if (!authorized) {
		return null;
	}
	if (!authorized.canSign) {
		return (
			<div className="mx-auto max-w-2xl p-6">
				<p className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
					This quotation is not open for your signature right now.
				</p>
			</div>
		);
	}
	if (buildError) {
		return (
			<div className="mx-auto max-w-2xl p-6 text-destructive text-sm">
				{buildError}
			</div>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="flex-1 overflow-auto bg-muted/30 px-4 pt-4 pb-28">
				{doc ? (
					<SignaturePages
						anchors={doc.anchors}
						initials={initials}
						isApplied={isApplied}
						mySlotKey={mySlotKey}
						onApply={applyMark}
						signatures={authorized.signatures}
						signerName={authorized.signer.name}
						style={style}
						url={doc.url}
					/>
				) : (
					<div className="flex min-h-64 items-center justify-center">
						<Spinner />
					</div>
				)}
			</div>

			<div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t bg-background px-4 py-3">
				<p className="text-sm">
					<span className="font-medium">
						{initialsDone} of {initialsSteps.length}
					</span>{' '}
					<span className="text-muted-foreground">sections initialled</span>
					{marks.signed ? (
						<span className="ml-2 text-muted-foreground">· signed</span>
					) : null}
				</p>
				<div className="flex gap-2">
					<Button
						disabled={!nextStep}
						onClick={() => nextStep && scrollTo(nextStep)}
						type="button"
						variant="outline"
					>
						<ArrowDown aria-hidden />
						{nextStep?.kind === 'signature' ? 'Go to signature' : 'Next'}
					</Button>
					<Button
						disabled={!allApplied}
						loading={submitting}
						onClick={() => {
							onFinish().catch(() => {
								/* handled in onFinish */
							});
						}}
						type="button"
						variant="outline"
					>
						<Check aria-hidden /> Finish &amp; sign
					</Button>
				</div>
			</div>
		</div>
	);
}

function anchorElementId(anchor: QuotationPdfAnchor): string {
	return `anchor-${anchor.id}`;
}

/**
 * The rendered pages with the signing boxes overlaid.
 *
 * Anchors come back in PDF points against a top-left origin, so each one is
 * placed as a percentage of the page — which keeps it correct at any render
 * width without re-measuring the canvas.
 */
function SignaturePages({
	anchors,
	initials,
	isApplied,
	mySlotKey,
	onApply,
	signatures,
	signerName,
	style,
	url,
}: {
	anchors: QuotationPdfAnchor[];
	initials: string;
	isApplied: (anchor: QuotationPdfAnchor) => boolean;
	mySlotKey: string;
	onApply: (anchor: QuotationPdfAnchor) => void;
	signatures: { name: string; slotKey: string; style: string }[];
	signerName: string;
	style: SignatureStyleId;
	url: string;
}) {
	const { numPages, renderThumbnail, ready, error } = usePdfDocument(url);
	const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());

	useEffect(() => {
		if (!ready || numPages === 0) {
			return;
		}
		let cancelled = false;
		(async () => {
			for (let page = 1; page <= numPages; page++) {
				if (cancelled) {
					return;
				}
				const canvas = canvasRefs.current.get(page);
				if (canvas) {
					await renderThumbnail(page, canvas, PAGE_RENDER_WIDTH);
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [ready, numPages, renderThumbnail]);

	if (error) {
		return <div className="p-4 text-destructive text-sm">{error}</div>;
	}

	// Signed slots are already drawn into the PDF, so their overlay is skipped —
	// only an unfilled box of mine needs an affordance on top.
	const signedSlots = new Set(signatures.map((row) => row.slotKey));

	return (
		<div className="flex flex-col items-center gap-6">
			{Array.from({ length: Math.max(numPages, 1) }, (_, i) => i + 1).map(
				(page) => (
					<div className="relative w-full max-w-[900px]" key={page}>
						<canvas
							className="h-auto w-full rounded-sm border bg-white shadow-sm"
							ref={(element) => {
								if (element) {
									canvasRefs.current.set(page, element);
								} else {
									canvasRefs.current.delete(page);
								}
							}}
						/>
						{anchors
							.filter(
								(anchor) =>
									anchor.page === page &&
									anchor.slotKey === mySlotKey &&
									!signedSlots.has(anchor.slotKey)
							)
							.map((anchor) => (
								<AnchorOverlay
									anchor={anchor}
									applied={isApplied(anchor)}
									initials={initials}
									key={anchor.id}
									onApply={onApply}
									signerName={signerName}
									style={style}
								/>
							))}
					</div>
				)
			)}
		</div>
	);
}

function AnchorOverlay({
	anchor,
	applied,
	initials,
	onApply,
	signerName,
	style,
}: {
	anchor: QuotationPdfAnchor;
	applied: boolean;
	initials: string;
	onApply: (anchor: QuotationPdfAnchor) => void;
	signerName: string;
	style: SignatureStyleId;
}) {
	const { cssFamily } = signatureStyle(style);
	const isSignature = anchor.kind === 'signature';

	return (
		<button
			className={cn(
				'absolute flex items-center justify-center rounded-sm border-2 text-center transition-colors',
				applied
					? 'border-transparent bg-transparent'
					: 'animate-pulse border-primary bg-primary/10 hover:bg-primary/20'
			)}
			id={anchorElementId(anchor)}
			onClick={() => !applied && onApply(anchor)}
			style={{
				left: `${(anchor.left / A4_WIDTH) * 100}%`,
				top: `${(anchor.top / A4_HEIGHT) * 100}%`,
				width: `${(anchor.width / A4_WIDTH) * 100}%`,
				height: `${(anchor.height / A4_HEIGHT) * 100}%`,
			}}
			type="button"
		>
			{applied ? (
				<span
					className="w-full truncate px-2 text-left"
					style={{
						fontFamily: cssFamily,
						fontSize: isSignature ? '1.4rem' : '1rem',
					}}
				>
					{isSignature ? signerName : initials}
				</span>
			) : (
				<span className="flex items-center gap-1 font-medium text-primary text-xs">
					<PenLine aria-hidden className="size-3" />
					{isSignature ? 'Sign here' : 'Initial here'}
				</span>
			)}
		</button>
	);
}
