import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetTextInput,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useAction } from 'convex/react';
import {
	type Ref,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { Alert, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';

export interface InclusionEmailSeed {
	filename: string;
	s3Key: string;
	subject?: string;
}

export interface InclusionEmailSheetHandle {
	present: (seed: InclusionEmailSeed) => void;
}

const recipientSeparators = /[\s,;]+/;
const DEFAULT_SUBJECT = 'Schedule of Finishes';

export function InclusionEmailSheet({
	projectId,
	ref,
}: {
	projectId: Id<'projects'>;
	ref?: Ref<InclusionEmailSheetHandle>;
}) {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetModal>(null);
	const sendEmail = useAction(api.email.send.send);

	const [seed, setSeed] = useState<InclusionEmailSeed | null>(null);
	const [to, setTo] = useState('');
	const [subject, setSubject] = useState(DEFAULT_SUBJECT);
	const [message, setMessage] = useState('');
	const [sending, setSending] = useState(false);

	useImperativeHandle(ref, () => ({
		present: (next) => {
			setSeed(next);
			setTo('');
			setSubject(next.subject ?? DEFAULT_SUBJECT);
			setMessage('');
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
		if (!seed) {
			return;
		}
		const recipients = to
			.split(recipientSeparators)
			.map((value) => value.trim())
			.filter((value) => value !== '');
		if (recipients.length === 0) {
			Alert.alert('Add a recipient', 'Enter at least one email address.');
			return;
		}
		setSending(true);
		try {
			await sendEmail({
				to: recipients,
				subject: subject.trim() || DEFAULT_SUBJECT,
				text: message.trim() === '' ? undefined : message.trim(),
				attachments: [
					{
						filename: seed.filename,
						contentType: 'application/pdf',
						s3Key: seed.s3Key,
					},
				],
				projectId,
				relatedTable: 'projectInclusions',
			});
			sheetRef.current?.dismiss();
			Alert.alert('Email sent', `Sent to ${recipients.join(', ')}.`);
		} catch {
			Alert.alert('Unable to send', 'The email could not be sent. Try again.');
		} finally {
			setSending(false);
		}
	};

	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			backgroundStyle={{ backgroundColor: colors.card }}
			enableDynamicSizing
			handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
			keyboardBehavior="interactive"
			ref={sheetRef}
		>
			<BottomSheetView
				className="gap-3 px-4 pt-1"
				style={{ paddingBottom: insets.bottom + 16 }}
			>
				<Text className="font-sans-semibold text-base text-foreground">
					Email inclusions
				</Text>

				<View className="gap-1">
					<Text className="font-sans-medium text-muted-foreground text-xs">
						To
					</Text>
					<BottomSheetTextInput
						autoCapitalize="none"
						autoCorrect={false}
						className="min-h-[44px] rounded-lg border border-border bg-background px-3 py-2.5 font-sans text-base text-foreground"
						keyboardType="email-address"
						onChangeText={setTo}
						placeholder="name@example.com, another@example.com"
						placeholderTextColor={colors.mutedForeground}
						value={to}
					/>
				</View>

				<View className="gap-1">
					<Text className="font-sans-medium text-muted-foreground text-xs">
						Subject
					</Text>
					<BottomSheetTextInput
						className="min-h-[44px] rounded-lg border border-border bg-background px-3 py-2.5 font-sans text-base text-foreground"
						onChangeText={setSubject}
						placeholderTextColor={colors.mutedForeground}
						value={subject}
					/>
				</View>

				<View className="gap-1">
					<Text className="font-sans-medium text-muted-foreground text-xs">
						Message (optional)
					</Text>
					<BottomSheetTextInput
						className="min-h-[88px] rounded-lg border border-border bg-background px-3 py-2.5 font-sans text-base text-foreground"
						multiline
						onChangeText={setMessage}
						placeholder="Add a note…"
						placeholderTextColor={colors.mutedForeground}
						style={{ textAlignVertical: 'top' }}
						value={message}
					/>
				</View>

				<Button
					className="mt-1"
					loading={sending}
					onPress={handleSend}
					variant="primary"
				>
					{sending ? 'Sending…' : 'Send email'}
				</Button>
			</BottomSheetView>
		</BottomSheetModal>
	);
}
