import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RichTextField } from '@/components/letters/rich-text-field';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { convexErrorMessage } from '@/lib/project-form';

/**
 * The disclaimer and acknowledgement tabs — one rich-text block each, saved
 * explicitly rather than on every keystroke.
 *
 * `RichTextField` emits the same HTML vocabulary as the portal's Tiptap editor,
 * so what is written here round-trips through the portal and through the
 * server-side html→pdfmake converter unchanged.
 */
export function TemplateHtmlTab({
	description,
	field,
	label,
	templateId: raw,
}: {
	description: string;
	field: 'acknowledgementHtml' | 'disclaimerHtml';
	label: string;
	templateId: string;
}) {
	const templateId = raw as Id<'quoteTemplates'>;
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();

	const terms = useQuery(api.quoteTerms.get.get, { templateId });
	const updateContent = useMutation(api.quoteTerms.updateContent.updateContent);

	const [html, setHtml] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	const stored = terms?.settings[field] ?? '';
	const dirty = html !== null && html !== stored;

	const handleSave = async () => {
		if (html === null) {
			return;
		}
		setSaving(true);
		try {
			// The two fields are independent on the mutation, so sending only this
			// one leaves the other exactly as it was.
			await updateContent({ templateId, [field]: html });
		} catch (error) {
			Alert.alert(
				`Could not save the ${label.toLowerCase()}`,
				convexErrorMessage(error, 'Please try again.')
			);
		} finally {
			setSaving(false);
		}
	};

	if (terms === undefined) {
		return (
			<View className="gap-3 p-4">
				<Skeleton className="h-6 w-1/3" />
				<Skeleton className="h-60 w-full" />
			</View>
		);
	}

	return (
		<KeyboardAwareScrollView
			bottomOffset={16}
			className="flex-1"
			contentContainerStyle={{
				gap: 12,
				padding: 16,
				paddingBottom: insets.bottom + 24,
			}}
			keyboardShouldPersistTaps="handled"
		>
			<Text className="font-sans text-muted-foreground text-xs">
				{description}
			</Text>
			{/* Keyed on the stored value so a server change while the tab is open
			    remounts the editor rather than leaving it on stale content. */}
			<RichTextField
				initialContent={stored}
				key={stored}
				label={label}
				minHeight={280}
				onChange={setHtml}
				placeholder={`Write the ${label.toLowerCase()}…`}
			/>
			<Button
				disabled={!dirty || saving}
				icon={<Check color={colors.foreground} size={16} strokeWidth={2} />}
				loading={saving}
				onPress={handleSave}
			>
				{dirty ? 'Save changes' : 'Saved'}
			</Button>
		</KeyboardAwareScrollView>
	);
}
