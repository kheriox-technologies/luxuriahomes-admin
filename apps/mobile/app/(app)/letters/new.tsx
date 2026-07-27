import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useAction } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Modal,
	Pressable,
	ScrollView,
	Switch,
	Text,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
	type LetterRecipient,
	LetterRecipientsField,
} from '@/components/letters/letter-recipients-field';
import { RichTextField } from '@/components/letters/rich-text-field';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { DateField } from '@/components/ui/date-field';
import { TextField } from '@/components/ui/text-field';
import {
	buildEmailHtml,
	buildEmailText,
	collectRecipientEmails,
	DEFAULT_EMAIL_BODY_HTML,
} from '@/lib/letter-email';

const EMPTY_EDITOR_HTML = '<p></p>';
const DEFAULT_FROM_HTML = '<p>Kind Regards,</p><p>Luxuria Homes</p>';
const PDF_CONTENT_TYPE = 'application/pdf';
const HTML_TAG_REGEX = /<[^>]*>/g;
const WHITESPACE_REGEX = /\s|&nbsp;/g;

function formatDateLabel(date: Date): string {
	return new Intl.DateTimeFormat('en-AU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}).format(date);
}

function isContentEmpty(html: string): boolean {
	return (
		html.replace(HTML_TAG_REGEX, '').replace(WHITESPACE_REGEX, '').length === 0
	);
}

export default function NewLetterScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();
	const params = useLocalSearchParams<{
		scope?: string;
		projectId?: string;
		folderPath?: string;
	}>();

	const scope: 'company' | 'project' =
		params.scope === 'project' ? 'project' : 'company';
	const projectId =
		scope === 'project' ? (params.projectId as Id<'projects'>) : undefined;
	const folderPath = params.folderPath ?? '';

	const saveLetter = useAction(api.letters.save.save);
	const sendEmail = useAction(api.email.send.send);

	const [name, setName] = useState('');
	const [nameTouched, setNameTouched] = useState(false);
	const [date, setDate] = useState<Date>(() => new Date());
	const [recipients, setRecipients] = useState<LetterRecipient[]>([]);
	const [emailLetter, setEmailLetter] = useState(false);
	const [contentHtml, setContentHtml] = useState(EMPTY_EDITOR_HTML);
	const [fromHtml, setFromHtml] = useState(DEFAULT_FROM_HTML);
	const [saving, setSaving] = useState(false);

	const dateLabel = useMemo(() => formatDateLabel(date), [date]);
	const nameEmpty = name.trim() === '';
	const canSave = !(nameEmpty || isContentEmpty(contentHtml) || saving);
	const locationLabel =
		scope === 'company'
			? `Company Documents${folderPath ? ` / ${folderPath}` : ''}`
			: `Project Documents${folderPath ? ` / ${folderPath}` : ''}`;

	// Email the just-saved letter (attached by its S3 key) to recipients that
	// have a valid email. The letter is already saved, so email issues never fail
	// the save — they only change which alert is shown.
	const emailSavedLetter = async (s3Key: string, fileName: string) => {
		const to = collectRecipientEmails(recipients);
		if (to.length === 0) {
			Alert.alert(
				'Letter saved, not emailed',
				'No selected recipients have an email address.'
			);
			return;
		}
		try {
			await sendEmail({
				to,
				subject: `Luxuria Homes: ${name.trim()}`,
				html: buildEmailHtml(DEFAULT_EMAIL_BODY_HTML),
				text: buildEmailText(DEFAULT_EMAIL_BODY_HTML),
				attachments: [
					{ filename: fileName, contentType: PDF_CONTENT_TYPE, s3Key },
				],
				projectId: scope === 'project' ? projectId : undefined,
				relatedTable: 'letter',
				relatedId: s3Key,
			});
			Alert.alert('Letter saved and emailed', `Sent to ${to.join(', ')}.`);
		} catch {
			Alert.alert(
				'Email not sent',
				'The letter was saved, but the email could not be sent.'
			);
		}
	};

	const handleSave = async () => {
		if (!canSave) {
			return;
		}
		setSaving(true);
		try {
			const result = await saveLetter({
				name: name.trim(),
				dateLabel,
				contentHtml,
				fromHtml,
				recipients: recipients.map((recipient) => ({
					name: recipient.name,
					company: recipient.company,
				})),
				scope,
				projectId: scope === 'project' ? projectId : undefined,
				folderPath,
			});
			if (emailLetter) {
				await emailSavedLetter(result.s3Key, result.fileName);
			} else {
				Alert.alert('Letter saved', `${result.fileName} was added.`);
			}
			router.back();
		} catch {
			Alert.alert('Could not save letter', 'Please try again in a moment.');
			setSaving(false);
		}
	};

	return (
		<View className="flex-1 bg-background">
			<View
				className="flex-row items-center gap-3 bg-background px-4 pb-3"
				style={{ paddingTop: insets.top + 8 }}
			>
				<Pressable
					accessibilityLabel="Back"
					accessibilityRole="button"
					className="h-10 w-10 items-center justify-center rounded-lg border border-border bg-card"
					hitSlop={4}
					onPress={() => router.back()}
				>
					<ArrowLeft color={colors.foreground} size={20} strokeWidth={2} />
				</Pressable>
				<Text className="flex-1 font-sans-bold text-2xl text-foreground">
					Add Letter
				</Text>
				<Button
					disabled={!canSave}
					icon={<Check color={colors.foreground} size={18} strokeWidth={2} />}
					loading={saving}
					onPress={handleSave}
				>
					Save
				</Button>
			</View>

			<ScrollView
				className="flex-1"
				contentContainerClassName="gap-4 px-4"
				contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
				keyboardShouldPersistTaps="handled"
			>
				<TextField
					error={
						nameTouched && nameEmpty
							? 'A document name is required.'
							: undefined
					}
					label="Name"
					onChangeText={(text) => {
						setName(text);
						setNameTouched(true);
					}}
					placeholder="e.g. Variation approval letter"
					value={name}
				/>

				<DateField
					label="Date"
					onChange={(next) => next && setDate(next)}
					value={date}
				/>

				<View className="gap-1.5">
					<Text className="font-sans-medium text-foreground text-sm">
						Location
					</Text>
					<View className="rounded-lg border border-border bg-muted/40 px-3 py-2.5">
						<Text className="font-sans text-muted-foreground text-sm">
							{locationLabel}
						</Text>
					</View>
				</View>

				<View className="gap-1.5">
					<View className="flex-row items-center justify-between">
						<Text className="font-sans-medium text-foreground text-sm">To</Text>
						<View className="flex-row items-center gap-2">
							<Text className="font-sans text-muted-foreground text-xs">
								Email Letter
							</Text>
							<Switch onValueChange={setEmailLetter} value={emailLetter} />
						</View>
					</View>
					<LetterRecipientsField
						onChange={setRecipients}
						projectId={projectId}
						scope={scope}
						values={recipients}
					/>
				</View>

				<RichTextField
					initialContent={contentHtml}
					label="Content"
					minHeight={240}
					onChange={setContentHtml}
					placeholder="Compose your letter…"
				/>

				<RichTextField
					initialContent={fromHtml}
					label="From"
					minHeight={120}
					onChange={setFromHtml}
				/>
			</ScrollView>

			<Modal animationType="fade" transparent visible={saving}>
				<View className="flex-1 items-center justify-center bg-black/50">
					<View className="items-center gap-3 rounded-2xl bg-card px-6 py-5">
						<ActivityIndicator color={colors.foreground} size="large" />
						<Text className="font-sans-medium text-foreground text-sm">
							Generating PDF…
						</Text>
					</View>
				</View>
			</Modal>
		</View>
	);
}
