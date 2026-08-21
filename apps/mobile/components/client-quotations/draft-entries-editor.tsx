import { Plus, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { CenteredTextInput } from '@/components/ui/centered-text-input';
import { CONTROL_HEIGHT } from '@/lib/theme';

export interface DraftEntryRow {
	key: string;
	text: string;
}

/**
 * The flat text lists inside a quotation — its exclusions and important notes.
 *
 * Rows are edited in place rather than through a sheet: they are one short line
 * each, and a sheet per line would make reviewing a seeded list of twenty of
 * them tedious.
 */
export function DraftEntriesEditor({
	addPlaceholder,
	entries,
	noun,
	onAdd,
	onRemove,
	onUpdate,
}: {
	addPlaceholder: string;
	entries: DraftEntryRow[];
	noun: string;
	onAdd: (text: string) => void;
	onRemove: (key: string) => void;
	onUpdate: (key: string, text: string) => void;
}) {
	const colors = useThemeColors();
	const [draft, setDraft] = useState('');

	const commit = () => {
		const trimmed = draft.trim();
		if (!trimmed) {
			return;
		}
		onAdd(trimmed);
		setDraft('');
	};

	return (
		<View className="gap-2">
			{entries.length === 0 ? (
				<Text className="font-sans text-muted-foreground text-xs">
					{`No ${noun}s on this quotation.`}
				</Text>
			) : null}

			{entries.map((entry, index) => (
				<View className="flex-row items-center gap-2" key={entry.key}>
					<Text className="font-sans text-muted-foreground text-xs tabular-nums">
						{index + 1}
					</Text>
					<View
						className="flex-1 rounded-lg border border-border bg-card px-3"
						style={{ height: CONTROL_HEIGHT }}
					>
						<CenteredTextInput
							onChangeText={(text) => onUpdate(entry.key, text)}
							placeholder={`Describe the ${noun}`}
							value={entry.text}
						/>
					</View>
					<Pressable
						accessibilityLabel={`Remove ${noun}`}
						accessibilityRole="button"
						hitSlop={8}
						onPress={() => onRemove(entry.key)}
					>
						<Trash2 color={colors.destructive} size={16} strokeWidth={2} />
					</Pressable>
				</View>
			))}

			<View className="flex-row items-center gap-2">
				<View
					className="flex-1 rounded-lg border border-border border-dashed bg-card px-3"
					style={{ height: CONTROL_HEIGHT }}
				>
					<CenteredTextInput
						onChangeText={setDraft}
						onSubmitEditing={commit}
						placeholder={addPlaceholder}
						returnKeyType="done"
						value={draft}
					/>
				</View>
				<Pressable
					accessibilityLabel={`Add ${noun}`}
					accessibilityRole="button"
					disabled={!draft.trim()}
					hitSlop={8}
					onPress={commit}
				>
					<Plus
						color={draft.trim() ? colors.foreground : colors.mutedForeground}
						size={18}
						strokeWidth={2}
					/>
				</Pressable>
			</View>
		</View>
	);
}
