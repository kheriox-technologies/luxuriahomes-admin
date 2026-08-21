import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import {
	DEFAULT_SIGNATURE_STYLE,
	deriveInitials,
	SIGNATURE_STYLES,
	type SignatureStyleId,
	signatureStyle,
} from '@workspace/backend/quotationSignatureStyles';
import { useAction, useMutation } from 'convex/react';
import { useRouter } from 'expo-router';
import { Check, FileText, PenLine } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenFormHeader } from '@/components/screen-form-header';
import { useThemeColors } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { TextField } from '@/components/ui/text-field';
import { formatCurrency, formatDate } from '@/lib/format';
import { convexErrorMessage } from '@/lib/project-form';
import { shareRemotePdf } from '@/lib/share-file';
import type { QuotationSurface } from '../quotation-surface';
import { useSigningContext } from './use-signing-context';

const MAX_INITIALS = 4;

const BLOCKED_COPY: Record<string, { description: string; title: string }> = {
	ALREADY_SIGNED: {
		title: 'Already signed',
		description: 'You have already signed this quotation.',
	},
	CLIENTS_PENDING: {
		title: 'Waiting on the clients',
		description:
			'Every client has to sign before Luxuria Homes can countersign.',
	},
	NOT_REQUESTED: {
		title: 'Not ready to sign',
		description: 'Signatures have not been requested for this quotation yet.',
	},
};

/**
 * Where a party signs a quotation.
 *
 * The portal rasterises every page and overlays clickable boxes on the document
 * itself. That does not port to a phone, so the ceremony here is driven by the
 * anchors the renderer reports: the signer reads the document through the share
 * sheet, then confirms each section it asks them to initial. Finishing renders
 * the signed copy server-side and records it.
 */
export function QuotationSigningScreen({
	quotationId,
	surface,
}: {
	quotationId: Id<'clientQuotations'>;
	surface: QuotationSurface;
}) {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();

	const context = useSigningContext(quotationId, surface);
	const generateSigningPdf = useAction(
		api.clientQuotations.pdf.generate.generateSigningPdf
	);
	const recordAdminSignature = useMutation(
		api.clientQuotations.recordSignature.recordSignature
	);
	const recordClientSignature = useMutation(
		api.clientPortal.quotations.recordSignature.recordSignature
	);

	const authorized = context?.authorized === true ? context : null;
	const signerName = authorized?.signer.name ?? '';

	const [style, setStyle] = useState<SignatureStyleId>(DEFAULT_SIGNATURE_STYLE);
	const [initials, setInitials] = useState<string | null>(null);
	const [started, setStarted] = useState(false);
	const [confirmed, setConfirmed] = useState<Set<number>>(new Set());
	const [sections, setSections] = useState<number[] | null>(null);
	const [preparing, setPreparing] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const resolvedInitials = initials ?? deriveInitials(signerName);

	const quotation = authorized?.quotation as
		| {
				address: {
					postcode: string;
					state: string;
					street: string;
					suburb: string;
				};
				contractSumExclGst: number;
				issuedAt: number;
				projectName: string;
				reference: string;
				totalInclGst: number;
				version?: number;
		  }
		| undefined;

	const blocked = useMemo(() => {
		if (!authorized || authorized.canSign) {
			return null;
		}
		return (
			BLOCKED_COPY[authorized.blockedReason ?? ''] ?? {
				title: 'Cannot sign',
				description: 'This quotation is not open for your signature.',
			}
		);
	}, [authorized]);

	if (context === undefined) {
		return (
			<View className="flex-1 gap-3 bg-background p-4">
				<Skeleton className="h-10 w-2/3" />
				<Skeleton className="h-40 w-full" />
			</View>
		);
	}

	if (!authorized) {
		return (
			<View className="flex-1 bg-background">
				<ScreenFormHeader title="Sign quotation" />
				<EmptyState
					description="You are not a party to this quotation."
					icon={PenLine}
					title="Not available"
				/>
			</View>
		);
	}

	if (blocked) {
		return (
			<View className="flex-1 bg-background">
				<ScreenFormHeader title="Sign quotation" />
				<EmptyState
					description={blocked.description}
					icon={PenLine}
					title={blocked.title}
				/>
			</View>
		);
	}

	const openDocument = async () => {
		setPreparing(true);
		try {
			const rendered = await generateSigningPdf({
				quotationId,
				surface,
				preview: true,
			});
			// The initials boxes are the sections this signer has to acknowledge.
			const mine = rendered.anchors
				.filter(
					(anchor) =>
						anchor.kind === 'initials' &&
						anchor.slotKey === authorized.signer.slotKey &&
						anchor.section !== undefined
				)
				.map((anchor) => anchor.section as number);
			setSections([...new Set(mine)].sort((a, b) => a - b));
			setStarted(true);
			await shareRemotePdf(
				rendered.url,
				`${quotation?.reference ?? 'quotation'}.pdf`
			);
		} catch (error) {
			Alert.alert(
				'Could not prepare the quotation',
				convexErrorMessage(error, 'Please try again in a moment.')
			);
		} finally {
			setPreparing(false);
		}
	};

	const allConfirmed =
		sections?.every((section) => confirmed.has(section)) ?? false;

	const handleFinish = async () => {
		if (!(allConfirmed && resolvedInitials)) {
			return;
		}
		setSubmitting(true);
		try {
			const rendered = await generateSigningPdf({
				quotationId,
				surface,
				pending: {
					initialsText: resolvedInitials,
					signatureText: authorized.signer.name,
					style,
				},
				preview: false,
			});
			if (!rendered.document) {
				throw new Error('The signed document was not filed.');
			}
			const record =
				surface === 'client' ? recordClientSignature : recordAdminSignature;
			const result = await record({
				quotationId,
				version: rendered.version,
				basisSignatureIds: rendered.basisSignatureIds,
				style,
				signatureText: authorized.signer.name,
				initialsText: resolvedInitials,
				document: rendered.document,
			});
			Alert.alert(
				'Quotation signed',
				result.complete
					? 'Everyone has now signed. A copy is on its way to all parties.'
					: 'Thank you — your signature has been recorded.'
			);
			router.back();
		} catch (error) {
			Alert.alert(
				'Could not record your signature',
				convexErrorMessage(error, 'Please try again in a moment.')
			);
			setSubmitting(false);
		}
	};

	return (
		<View className="flex-1 bg-background">
			<ScreenFormHeader title="Sign quotation" />

			<KeyboardAwareScrollView
				bottomOffset={16}
				className="flex-1"
				contentContainerStyle={{
					gap: 12,
					paddingHorizontal: 16,
					paddingBottom: insets.bottom + 24,
				}}
				keyboardShouldPersistTaps="handled"
			>
				<Card className="gap-1 p-4">
					<Text className="font-sans-semibold text-foreground text-sm">
						You are signing as
					</Text>
					<Text className="font-sans text-foreground text-sm">
						{authorized.signer.name}
					</Text>
					<Text className="font-sans text-muted-foreground text-xs">
						{authorized.signer.role === 'Representative'
							? 'On behalf of Luxuria Homes'
							: authorized.signer.email}
					</Text>
				</Card>

				{quotation ? (
					<Card className="gap-1.5 p-4">
						<View className="flex-row items-center gap-2">
							<Text className="flex-1 font-sans-semibold text-foreground text-sm">
								What you are signing
							</Text>
							<Badge variant="outline">{quotation.reference}</Badge>
						</View>
						<Text className="font-sans text-foreground text-sm">
							{quotation.projectName}
						</Text>
						<Text className="font-sans text-muted-foreground text-xs">
							{`${quotation.address.street}, ${quotation.address.suburb} ${quotation.address.state} ${quotation.address.postcode}`}
						</Text>
						<Text className="font-sans text-muted-foreground text-xs">
							{`Issued ${formatDate(quotation.issuedAt)} · v${quotation.version ?? 1}`}
						</Text>
						<View className="flex-row items-center gap-2 pt-1">
							<Text className="flex-1 font-sans text-muted-foreground text-xs">
								Contract sum
							</Text>
							<Text className="font-sans text-muted-foreground text-xs tabular-nums">
								{formatCurrency(quotation.contractSumExclGst)}
							</Text>
						</View>
						<View className="flex-row items-center gap-2">
							<Text className="flex-1 font-sans-medium text-foreground text-sm">
								Total incl. GST
							</Text>
							<Text className="font-sans-medium text-foreground text-sm tabular-nums">
								{formatCurrency(quotation.totalInclGst)}
							</Text>
						</View>
					</Card>
				) : null}

				<Card className="gap-3 p-4">
					<Text className="font-sans-semibold text-foreground text-sm">
						Choose your signature
					</Text>
					<View className="gap-2">
						{SIGNATURE_STYLES.map((option) => {
							const selected = option.id === style;
							return (
								<Pressable
									accessibilityLabel={`${option.label} signature style`}
									accessibilityRole="radio"
									accessibilityState={{ selected }}
									className={
										selected
											? 'flex-row items-center gap-3 rounded-lg border border-primary bg-muted p-3'
											: 'flex-row items-center gap-3 rounded-lg border border-border p-3 active:bg-muted'
									}
									key={option.id}
									onPress={() => setStyle(option.id)}
								>
									<Text
										className="flex-1 text-foreground"
										style={{ fontFamily: option.pdfFont, fontSize: 26 }}
									>
										{signerName || 'Your name'}
									</Text>
									{selected ? (
										<Check
											color={colors.foreground}
											size={16}
											strokeWidth={2}
										/>
									) : null}
								</Pressable>
							);
						})}
					</View>
					<TextField
						autoCapitalize="characters"
						label="Initials"
						onChangeText={(text) =>
							setInitials(text.toUpperCase().slice(0, MAX_INITIALS))
						}
						placeholder="JAW"
						value={resolvedInitials}
					/>
					<Text
						className="text-foreground"
						style={{ fontFamily: signatureStyle(style).pdfFont, fontSize: 22 }}
					>
						{resolvedInitials}
					</Text>
				</Card>

				<Card className="gap-2 p-4">
					<Text className="font-sans-semibold text-foreground text-sm">
						Declaration
					</Text>
					<Text className="font-sans text-muted-foreground text-xs">
						By signing you confirm you have read the quotation in full,
						including its terms, exclusions and important notes, and that you
						accept it as the basis of the contract.
					</Text>
				</Card>

				<Button
					disabled={preparing}
					icon={
						<FileText color={colors.foreground} size={16} strokeWidth={2} />
					}
					loading={preparing}
					onPress={() => {
						openDocument().catch(() => {
							/* reported in openDocument */
						});
					}}
				>
					{started ? 'Open the quotation again' : 'Read the quotation'}
				</Button>

				{started && sections ? (
					<Card className="gap-2 p-4">
						<Text className="font-sans-semibold text-foreground text-sm">
							{`Confirm each section (${confirmed.size} of ${sections.length})`}
						</Text>
						<Text className="font-sans text-muted-foreground text-xs">
							Tick each section to place your initials against it, exactly as
							you would initial the printed pages.
						</Text>
						{sections.map((section) => {
							const ticked = confirmed.has(section);
							return (
								<Pressable
									accessibilityLabel={`Initial section ${section}`}
									accessibilityRole="checkbox"
									accessibilityState={{ checked: ticked }}
									className="flex-row items-center gap-3 rounded-lg border border-border p-3 active:bg-muted"
									key={section}
									onPress={() =>
										setConfirmed((current) => {
											const next = new Set(current);
											if (next.has(section)) {
												next.delete(section);
											} else {
												next.add(section);
											}
											return next;
										})
									}
								>
									<View
										className={
											ticked
												? 'h-5 w-5 items-center justify-center rounded border border-primary bg-primary'
												: 'h-5 w-5 items-center justify-center rounded border border-border'
										}
									>
										{ticked ? (
											<Text
												style={{
													fontFamily: signatureStyle(style).pdfFont,
													fontSize: 12,
													color: colors.card,
												}}
											>
												{resolvedInitials.slice(0, 2)}
											</Text>
										) : null}
									</View>
									<Text className="flex-1 font-sans text-foreground text-sm">
										{`Section ${String(section).padStart(2, '0')}`}
									</Text>
								</Pressable>
							);
						})}
					</Card>
				) : null}

				<Button
					disabled={!(allConfirmed && resolvedInitials) || submitting}
					icon={<PenLine color={colors.foreground} size={16} strokeWidth={2} />}
					loading={submitting}
					onPress={() => {
						handleFinish().catch(() => {
							/* reported in handleFinish */
						});
					}}
					variant="primary"
				>
					Finish & sign
				</Button>
			</KeyboardAwareScrollView>
		</View>
	);
}
