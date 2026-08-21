import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { Send, Trash2 } from 'lucide-react-native';
import {
	type Ref,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { BottomSheetInputProvider } from '@/components/ui/bottom-sheet-input-context';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { formatDate } from '@/lib/format';
import { convexErrorMessage } from '@/lib/project-form';
import type { QuotationSurface } from './quotation-surface';

export interface ClientQuotationNotesSheetHandle {
	present: (quotationId: Id<'clientQuotations'>, reference: string) => void;
}

/**
 * The commentary thread on a quotation, shared by both surfaces.
 *
 * The admin and client functions are paired rather than unioned, and selected
 * with `'skip'` — see the note in `quotation-surface.ts`. A client may delete
 * only their own notes; the server enforces that, and the button follows it.
 */
export function ClientQuotationNotesSheet({
	ref,
	surface,
}: {
	ref?: Ref<ClientQuotationNotesSheetHandle>;
	surface: QuotationSurface;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);

	const [quotationId, setQuotationId] = useState<Id<'clientQuotations'> | null>(
		null
	);
	const [reference, setReference] = useState('');
	const [note, setNote] = useState('');
	const [saving, setSaving] = useState(false);

	const isClient = surface === 'client';
	const args = quotationId ? { quotationId } : ('skip' as const);
	const adminNotes = useQuery(
		api.clientQuotations.listNotes.listNotes,
		isClient ? 'skip' : args
	);
	const clientNotes = useQuery(
		api.clientPortal.quotations.listNotes.listNotes,
		isClient ? args : 'skip'
	);
	const notes = isClient ? clientNotes : adminNotes;

	const appendAdminNote = useMutation(
		api.clientQuotations.appendNote.appendNote
	);
	const appendClientNote = useMutation(
		api.clientPortal.quotations.appendNote.appendNote
	);
	const deleteAdminNote = useMutation(
		api.clientQuotations.deleteNote.deleteNote
	);
	const deleteClientNote = useMutation(
		api.clientPortal.quotations.deleteNote.deleteNote
	);

	useImperativeHandle(ref, () => ({
		present: (id, quotationReference) => {
			setQuotationId(id);
			setReference(quotationReference);
			setNote('');
			sheetRef.current?.present();
		},
	}));

	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				opacity={0.5}
			/>
		),
		[]
	);

	const handleSend = async () => {
		const trimmed = note.trim();
		if (!(trimmed && quotationId)) {
			return;
		}
		setSaving(true);
		try {
			const append = isClient ? appendClientNote : appendAdminNote;
			await append({ quotationId, note: trimmed });
			setNote('');
		} catch (error) {
			Alert.alert(
				'Could not add note',
				convexErrorMessage(error, 'Please try again.')
			);
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = (noteId: Id<'clientQuotationNotes'>) => {
		Alert.alert('Delete note?', 'This cannot be undone.', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Delete',
				style: 'destructive',
				onPress: () => {
					const remove = isClient ? deleteClientNote : deleteAdminNote;
					remove({ noteId }).catch((error) =>
						Alert.alert(
							'Could not delete note',
							convexErrorMessage(error, 'Please try again.')
						)
					);
				},
			},
		]);
	};

	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			backgroundStyle={{ backgroundColor: colors.card }}
			enableDynamicSizing
			handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
			keyboardBehavior="interactive"
			maxDynamicContentSize={640}
			ref={sheetRef}
		>
			<BottomSheetScrollView
				className="px-4 pt-1"
				contentContainerStyle={{ paddingBottom: insets.bottom + 16, gap: 12 }}
				keyboardShouldPersistTaps="handled"
			>
				<BottomSheetInputProvider>
					<Text className="px-1 font-sans-semibold text-base text-foreground">
						{`Notes · ${reference}`}
					</Text>

					{notes === undefined ? (
						<Text className="px-1 font-sans text-muted-foreground text-xs">
							Loading…
						</Text>
					) : null}
					{notes?.length === 0 ? (
						<Text className="px-1 font-sans text-muted-foreground text-xs">
							No notes yet.
						</Text>
					) : null}
					{notes?.map((row) => (
						<View
							className="gap-1 rounded-lg border border-border p-3"
							key={row._id}
						>
							<View className="flex-row items-center gap-2">
								<Text className="flex-1 font-sans-medium text-foreground text-xs">
									{row.addedBy}
								</Text>
								<Text className="font-sans text-muted-foreground text-xs">
									{formatDate(row.timestamp)}
								</Text>
								<Pressable
									accessibilityLabel="Delete note"
									accessibilityRole="button"
									hitSlop={8}
									onPress={() => handleDelete(row._id)}
								>
									<Trash2
										color={colors.mutedForeground}
										size={14}
										strokeWidth={2}
									/>
								</Pressable>
							</View>
							<Text className="font-sans text-foreground text-sm">
								{row.note}
							</Text>
						</View>
					))}

					<TextField
						label="Add a note"
						multiline
						onChangeText={setNote}
						placeholder="Write a note…"
						value={note}
					/>
					<Button
						className="mt-1"
						disabled={!note.trim() || saving}
						icon={<Send color={colors.foreground} size={16} strokeWidth={2} />}
						loading={saving}
						onPress={handleSend}
					>
						Add note
					</Button>
				</BottomSheetInputProvider>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
