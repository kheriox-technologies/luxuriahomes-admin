'use client';

import type { Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@workspace/ui/components/card';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { Spinner } from '@workspace/ui/components/spinner';
import { cn } from '@workspace/ui/lib/utils';
import { PenLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatIssueDate } from '@/components/client-quotations/client-quotation-form-shared';
import type { QuotationSurface } from '@/components/client-quotations/quotation-surface';
import {
	DEFAULT_SIGNATURE_STYLE,
	deriveInitials,
	SIGNATURE_STYLES,
	type SignatureStyleId,
} from '@/lib/client/pdf/signature-styles';
import { formatAudWhole } from '@/lib/currency';
import { UNAUTHORIZED_HREF, useSigningContext } from './use-signing-context';

const MAX_INITIALS_LENGTH = 6;

/**
 * Where a signer decides how their signature will look, before they see the
 * document.
 *
 * Keeping the choice here rather than in the document means the PDF is built
 * once, already carrying the right typeface — the signing page then only has to
 * place marks, not re-render on every change of mind.
 */
export default function SignatureLanding({
	quotationId,
	surface,
}: {
	quotationId: Id<'clientQuotations'>;
	surface: QuotationSurface;
}) {
	const router = useRouter();
	const context = useSigningContext(quotationId, surface);

	const [style, setStyle] = useState<SignatureStyleId>(DEFAULT_SIGNATURE_STYLE);
	const [initials, setInitials] = useState('');
	const [initialsTouched, setInitialsTouched] = useState(false);

	const signerName = context?.authorized ? context.signer.name : '';

	// Seeded from the signer's name once it arrives, then left alone — an initials
	// field the signer has edited must not be overwritten by a re-render.
	useEffect(() => {
		if (!initialsTouched && signerName) {
			setInitials(deriveInitials(signerName));
		}
	}, [signerName, initialsTouched]);

	useEffect(() => {
		if (context && !context.authorized) {
			router.replace(UNAUTHORIZED_HREF);
		}
	}, [context, router]);

	if (context === undefined) {
		return (
			<div className="flex min-h-64 items-center justify-center">
				<Spinner />
			</div>
		);
	}

	if (!context.authorized) {
		return null;
	}

	const { blockedReason, canSign, quotation, signer } = context;
	const version = quotation.version ?? 1;

	const blockedMessage = (() => {
		switch (blockedReason) {
			case 'ALREADY_SIGNED':
				return "You've already signed this quotation. There's nothing more to do — we'll email you a copy once everyone has signed.";
			case 'CLIENTS_PENDING':
				return 'Luxuria Homes countersigns last. This quotation is still with its clients.';
			case 'NOT_REQUESTED':
				return 'This quotation is not currently open for signature.';
			default:
				return null;
		}
	})();

	return (
		// `self-start` matters: the surface layouts drop their children into a flex
		// row, which would otherwise stretch this to the container's height and
		// leave the bottom padding sitting above where the content actually ends —
		// putting Start Signing flush against the footer.
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-6 self-start p-4 pb-12 sm:p-6 sm:pb-16">
			<div className="flex flex-col gap-1">
				<h1 className="font-semibold text-2xl tracking-tight">
					Sign quotation {quotation.reference}
				</h1>
				<p className="text-muted-foreground text-sm">{quotation.projectName}</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>You are signing as</CardTitle>
					<CardDescription>
						Only this address can open this signing link.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-1">
					<p className="font-medium">
						{signer.name}
						{signer.role === 'Representative' ? (
							<span className="ml-2 font-normal text-muted-foreground">
								for Luxuria Homes
							</span>
						) : null}
					</p>
					<p className="text-muted-foreground text-sm">{signer.email}</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>What you're signing</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4 sm:grid-cols-2">
					<Detail label="Quote reference">
						<span className="flex items-center gap-2">
							{quotation.reference}
							<Badge variant="secondary">v{version}</Badge>
						</span>
					</Detail>
					<Detail label="Project">{quotation.projectName}</Detail>
					<Detail label="Site address">
						{quotation.address.street}, {quotation.address.suburb}{' '}
						{quotation.address.state} {quotation.address.postcode}
					</Detail>
					<Detail label="Issued">
						{formatIssueDate(new Date(quotation.issuedAt))}
					</Detail>
					<Detail label="Contract sum (excl. GST)">
						{formatAudWhole(quotation.contractSumExclGst)}
					</Detail>
					<Detail label="Total incl. GST">
						<span className="font-semibold">
							{formatAudWhole(quotation.totalInclGst)}
						</span>
					</Detail>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Declaration</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm leading-relaxed">
						By signing, I confirm that I am happy with this quotation, that I
						have read it in full, and that I am signing{' '}
						<strong>version {version}</strong> — the latest version of{' '}
						{quotation.reference} — as issued on{' '}
						{formatIssueDate(new Date(quotation.issuedAt))}.
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Choose your signature</CardTitle>
					<CardDescription>
						This is how your name and initials will appear on the quotation.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<div className="grid gap-3 sm:grid-cols-3">
						{SIGNATURE_STYLES.map((option) => (
							<button
								aria-pressed={style === option.id}
								className={cn(
									'flex flex-col gap-2 rounded-lg border p-4 text-left transition-colors',
									style === option.id
										? 'border-primary ring-1 ring-primary'
										: 'border-border hover:bg-accent'
								)}
								key={option.id}
								onClick={() => setStyle(option.id)}
								type="button"
							>
								<span className="text-muted-foreground text-xs uppercase tracking-wide">
									{option.label}
								</span>
								<span
									className="truncate text-2xl leading-tight"
									style={{ fontFamily: option.cssFamily }}
								>
									{signer.name}
								</span>
								<span
									className="text-lg leading-tight"
									style={{ fontFamily: option.cssFamily }}
								>
									{initials || deriveInitials(signer.name)}
								</span>
							</button>
						))}
					</div>
					<Field>
						<FieldLabel htmlFor="signature-initials">Your initials</FieldLabel>
						<Input
							className="max-w-32"
							id="signature-initials"
							maxLength={MAX_INITIALS_LENGTH}
							onChange={(event) => {
								setInitialsTouched(true);
								setInitials(event.target.value.toUpperCase());
							}}
							value={initials}
						/>
					</Field>
				</CardContent>
			</Card>

			{blockedMessage ? (
				<p className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
					{blockedMessage}
				</p>
			) : null}

			<div className="flex justify-end">
				<Button
					disabled={!canSign || initials.trim() === ''}
					onClick={() => {
						router.push(
							`${signingBase(surface)}/${quotationId}/sign/document?style=${style}&initials=${encodeURIComponent(initials.trim())}` as never
						);
					}}
					type="button"
					variant="outline"
				>
					<PenLine aria-hidden /> Start Signing
				</Button>
			</div>
		</div>
	);
}

function signingBase(surface: QuotationSurface): string {
	return surface === 'client' ? '/client/quotations' : '/quotations';
}

function Detail({
	children,
	label,
}: {
	children: React.ReactNode;
	label: string;
}) {
	return (
		<div className="flex flex-col gap-0.5">
			<span className="text-muted-foreground text-xs uppercase tracking-wide">
				{label}
			</span>
			<span className="text-sm">{children}</span>
		</div>
	);
}
