import { ListPlus, Plus, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { CenteredTextInput } from '@/components/ui/centered-text-input';
import { CONTROL_HEIGHT } from '@/lib/theme';

export interface DraftSpecialInclusionRow {
	amount: string;
	key: string;
	text: string;
}

/**
 * Extras specific to one quotation, on top of everything the template supplies.
 *
 * The amount is added to the contract total but never printed — it is there so
 * the builder can see what an extra is costing them, not so the client can.
 */
export function DraftSpecialInclusionsEditor({
	entries,
	onAdd,
	onAddFromList,
	onRemove,
	onUpdate,
}: {
	entries: DraftSpecialInclusionRow[];
	onAdd: (text: string) => void;
	onAddFromList: () => void;
	onRemove: (key: string) => void;
	onUpdate: (key: string, patch: { amount?: string; text?: string }) => void;
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
			<Button
				icon={<ListPlus color={colors.foreground} size={16} strokeWidth={2} />}
				onPress={onAddFromList}
			>
				Add from standard list
			</Button>

			{entries.map((entry) => (
				<View className="gap-2" key={entry.key}>
					<View className="flex-row items-center gap-2">
						<View
							className="flex-1 rounded-lg border border-border bg-card px-3"
							style={{ height: CONTROL_HEIGHT }}
						>
							<CenteredTextInput
								onChangeText={(text) => onUpdate(entry.key, { text })}
								placeholder="Describe the inclusion"
								value={entry.text}
							/>
						</View>
						<View
							className="w-28 rounded-lg border border-border bg-card px-3"
							style={{ height: CONTROL_HEIGHT }}
						>
							<CenteredTextInput
								keyboardType="decimal-pad"
								onChangeText={(amount) => onUpdate(entry.key, { amount })}
								placeholder="Amount"
								value={entry.amount}
							/>
						</View>
						<Pressable
							accessibilityLabel="Remove special inclusion"
							accessibilityRole="button"
							hitSlop={8}
							onPress={() => onRemove(entry.key)}
						>
							<Trash2 color={colors.destructive} size={16} strokeWidth={2} />
						</Pressable>
					</View>
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
						placeholder="Add a special inclusion…"
						returnKeyType="done"
						value={draft}
					/>
				</View>
				<Pressable
					accessibilityLabel="Add special inclusion"
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

			<Text className="font-sans text-muted-foreground text-xs">
				Amounts are added to the contract total for your reference — they are
				never printed on the client's quotation.
			</Text>
		</View>
	);
}
