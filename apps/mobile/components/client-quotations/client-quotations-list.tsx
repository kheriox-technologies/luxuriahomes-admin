import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import { useAction, useMutation, useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import {
	CircleCheck,
	ExternalLink,
	FileSignature,
	History,
	PenLine,
	Send,
	Signature,
	SquarePen,
	StickyNote,
	Trash2,
} from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';
import {
	ActionSheet,
	type ActionSheetItem,
} from '@/components/ui/action-sheet';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchBar } from '@/components/ui/search-bar';
import { ListSkeleton } from '@/components/ui/skeleton';
import { convexErrorMessage } from '@/lib/project-form';
import { shareRemotePdf } from '@/lib/share-file';
import { ClientQuotationCard } from './client-quotation-card';
import {
	ClientQuotationNotesSheet,
	type ClientQuotationNotesSheetHandle,
} from './client-quotation-notes-sheet';
import {
	ClientQuotationVersionsSheet,
	type ClientQuotationVersionsSheetHandle,
} from './client-quotation-versions-sheet';
import type { QuotationSurface } from './quotation-surface';
import {
	type ClientQuotationRow,
	latestPdfKey,
	quotationFileName,
} from './types';

const DRAFT = 'Draft';
const REVIEW = 'Under Review';
const APPROVED = 'Approved';
const AWAITING_SIGNATURES = 'Awaiting Signatures';

/**
 * The quotations list, for both the builder and the client surface.
 *
 * One component over paired Convex functions rather than two screens — see the
 * note in `quotation-surface.ts`. The client sees a shorter action list and
 * never sees a draft, which the server enforces rather than this filter.
 */
export function ClientQuotationsList({
	surface,
}: {
	surface: QuotationSurface;
}) {
	const router = useRouter();
	const isClient = surface === 'client';

	const [search, setSearch] = useState('');
	const trimmedSearch = search.trim();

	// Admin search goes through the backend index; the client list is short and
	// already scoped to them, so it filters in place — as the portal does.
	const adminList = useQuery(
		api.clientQuotations.list.list,
		isClient || trimmedSearch !== '' ? 'skip' : {}
	);
	const adminSearch = useQuery(
		api.clientQuotations.search.search,
		isClient || trimmedSearch === '' ? 'skip' : { query: trimmedSearch }
	);
	const clientList = useQuery(
		api.clientPortal.quotations.list.list,
		isClient ? {} : 'skip'
	);

	const rows = useMemo<ClientQuotationRow[] | undefined>(() => {
		if (isClient) {
			if (clientList === undefined) {
				return;
			}
			if (!trimmedSearch) {
				return clientList;
			}
			const needle = trimmedSearch.toLowerCase();
			return clientList.filter((row) =>
				`${row.reference} ${row.projectName} ${row.clients
					.map((client) => client.name)
					.join(' ')}`
					.toLowerCase()
					.includes(needle)
			);
		}
		return trimmedSearch === '' ? adminList : adminSearch;
	}, [adminList, adminSearch, clientList, isClient, trimmedSearch]);

	const approveAdmin = useMutation(api.clientQuotations.approve.approve);
	const approveClient = useMutation(
		api.clientPortal.quotations.approve.approve
	);
	const removeQuotation = useMutation(api.clientQuotations.remove.remove);
	const sendToClients = useAction(
		api.clientQuotations.sendToClients.sendToClients
	);
	const requestSignatures = useAction(
		api.clientQuotations.requestSignatures.requestSignatures
	);
	const signAdminUrl = useAction(api.cdn.signUrl.signUrl);
	const signClientUrl = useAction(api.clientPortal.quotations.signUrl.signUrl);

	const [selected, setSelected] = useState<ClientQuotationRow | null>(null);
	const [busy, setBusy] = useState(false);
	const menuRef = useRef<BottomSheetModal>(null);
	const notesRef = useRef<ClientQuotationNotesSheetHandle>(null);
	const versionsRef = useRef<ClientQuotationVersionsSheetHandle>(null);

	const fail = (title: string) => (error: unknown) =>
		Alert.alert(title, convexErrorMessage(error, 'Please try again.'));

	const openPdf = async (row: ClientQuotationRow) => {
		const s3Key = latestPdfKey(row);
		if (!s3Key) {
			Alert.alert(
				'No PDF yet',
				'This quotation has not been issued with a document.'
			);
			return;
		}
		try {
			const url = isClient
				? await signClientUrl({ quotationId: row._id, s3Key })
				: await signAdminUrl({ s3Key });
			await shareRemotePdf(url, quotationFileName(row));
		} catch (error) {
			fail('Could not open the PDF')(error);
		}
	};

	const confirmSend = (row: ClientQuotationRow) => {
		const isDraft = row.status === DRAFT;
		Alert.alert(
			isDraft ? 'Send to client/s?' : 'Resend to client/s?',
			isDraft
				? `This emails ${row.reference} to ${row.clients.length} client${row.clients.length === 1 ? '' : 's'} and moves it to Under Review.`
				: `This emails ${row.reference} to the clients again. Nothing about the quotation changes.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Send',
					onPress: () => {
						setBusy(true);
						sendToClients({ quotationId: row._id })
							.then((result) =>
								Alert.alert(
									'Sent',
									`Emailed to ${result.sent} client${result.sent === 1 ? '' : 's'}.`
								)
							)
							.catch(fail('Could not send the quotation'))
							.finally(() => setBusy(false));
					},
				},
			]
		);
	};

	const confirmApprove = (row: ClientQuotationRow) => {
		Alert.alert(
			'Approve quotation?',
			`This records ${row.reference} as approved.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Approve',
					onPress: () => {
						const approve = isClient ? approveClient : approveAdmin;
						approve({ quotationId: row._id }).catch(
							fail('Could not approve the quotation')
						);
					},
				},
			]
		);
	};

	const confirmRequestSignatures = (row: ClientQuotationRow) => {
		Alert.alert(
			'Request signatures?',
			`This emails each client a personal signing link for ${row.reference}.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Request',
					onPress: () => {
						setBusy(true);
						requestSignatures({ quotationId: row._id })
							.then((result) =>
								Alert.alert(
									'Signature requests sent',
									`Emailed to ${result.sent} client${result.sent === 1 ? '' : 's'}.`
								)
							)
							.catch(fail('Could not request signatures'))
							.finally(() => setBusy(false));
					},
				},
			]
		);
	};

	const confirmDelete = (row: ClientQuotationRow) => {
		Alert.alert(
			'Delete quotation?',
			`This permanently deletes ${row.reference} and its version history.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						removeQuotation({ quotationId: row._id }).catch(
							fail('Could not delete the quotation')
						);
					},
				},
			]
		);
	};

	const menuItems: ActionSheetItem[] = selected
		? [
				...(isClient
					? []
					: [
							{
								key: 'edit',
								label: 'Edit',
								icon: SquarePen,
								onPress: () =>
									router.push({
										pathname: '/(app)/quotations/[quotationId]/edit',
										params: { quotationId: selected._id },
									}),
							},
						]),
				{
					key: 'pdf',
					label: 'Open latest PDF',
					icon: ExternalLink,
					disabled: !latestPdfKey(selected),
					onPress: () => {
						openPdf(selected).catch(() => {
							/* reported in openPdf */
						});
					},
				},
				{
					key: 'notes',
					label: 'Notes',
					icon: StickyNote,
					onPress: () =>
						notesRef.current?.present(selected._id, selected.reference),
				},
				{
					key: 'history',
					label: 'Version history',
					icon: History,
					onPress: () =>
						versionsRef.current?.present(selected._id, selected.reference),
				},
				...(isClient
					? []
					: [
							{
								key: 'send',
								label:
									selected.status === DRAFT
										? 'Send to client/s'
										: 'Resend to client/s',
								icon: Send,
								disabled: !selected.s3Key || busy,
								onPress: () => confirmSend(selected),
							},
						]),
				{
					// Approval is the outcome of a review, so it only opens once the
					// quotation is actually under review.
					key: 'approve',
					label: 'Approve',
					icon: CircleCheck,
					disabled: selected.status !== REVIEW,
					onPress: () => confirmApprove(selected),
				},
				...(isClient
					? []
					: [
							{
								// Signatures are collected against a settled document.
								key: 'request-signatures',
								label: 'Request signatures',
								icon: Signature,
								disabled:
									selected.status !== APPROVED || !selected.s3Key || busy,
								onPress: () => confirmRequestSignatures(selected),
							},
						]),
				{
					// Open to both surfaces: a client signs their own copy, an admin
					// countersigns. Whose turn it is is decided on the signing screen.
					key: 'sign',
					label: 'Sign',
					icon: PenLine,
					disabled: selected.status !== AWAITING_SIGNATURES,
					onPress: () =>
						router.push({
							pathname: isClient
								? '/(client)/quotations/[quotationId]/sign'
								: '/(app)/quotations/[quotationId]/sign',
							params: { quotationId: selected._id },
						}),
				},
				...(isClient
					? []
					: [
							{
								key: 'delete',
								label: 'Delete',
								icon: Trash2,
								destructive: true,
								onPress: () => confirmDelete(selected),
							},
						]),
			]
		: [];

	if (rows === undefined) {
		return <ListSkeleton />;
	}

	let emptyDescription =
		'Open a quotation template and use its + button to build your first quotation.';
	if (trimmedSearch) {
		emptyDescription = 'Try a different reference, project or client.';
	} else if (isClient) {
		emptyDescription =
			'Quotations appear here once they have been sent to you.';
	}

	return (
		<View className="flex-1">
			<View className="px-4 pb-3">
				<SearchBar
					onChangeText={setSearch}
					placeholder="Search by reference, project or client"
					value={search}
				/>
			</View>

			<FlatList
				contentContainerClassName="pb-6"
				data={rows}
				keyExtractor={(row) => row._id}
				ListEmptyComponent={
					<EmptyState
						description={emptyDescription}
						icon={FileSignature}
						title={
							trimmedSearch ? 'No matching quotations' : 'No quotations yet'
						}
					/>
				}
				renderItem={({ item }) => (
					<ClientQuotationCard
						onOpenMenu={(row) => {
							setSelected(row);
							menuRef.current?.present();
						}}
						onOpenNotes={(row) =>
							notesRef.current?.present(row._id, row.reference)
						}
						// Tapping a row opens what it is for: the document.
						onPress={(row) => {
							openPdf(row).catch(() => {
								/* reported in openPdf */
							});
						}}
						row={item}
					/>
				)}
			/>

			{busy ? (
				<View className="absolute right-0 bottom-0 left-0 items-center pb-6">
					<Text className="font-sans text-muted-foreground text-xs">
						Working…
					</Text>
				</View>
			) : null}

			<ActionSheet
				items={menuItems}
				ref={menuRef}
				title={selected?.reference}
			/>
			<ClientQuotationNotesSheet ref={notesRef} surface={surface} />
			<ClientQuotationVersionsSheet ref={versionsRef} surface={surface} />
		</View>
	);
}
