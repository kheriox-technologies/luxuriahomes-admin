import { Plus, Trash2 } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { TextField } from '@/components/ui/text-field';
import type {
	QuotationClientDraft,
	QuotationFormErrors,
} from '@/lib/client-quotation-form';
import { MAX_QUOTATION_CLIENTS } from '@/lib/client-quotation-form';

/**
 * The parties the quotation is addressed to, up to four.
 *
 * Their emails are load-bearing rather than decorative: the client portal
 * authorizes by matching them, and each one becomes a signing slot.
 */
export function DraftClientsEditor({
	clients,
	errors,
	onAdd,
	onChange,
	onRemove,
	showErrors,
}: {
	clients: QuotationClientDraft[];
	errors: QuotationFormErrors;
	onAdd: () => void;
	onChange: (index: number, patch: Partial<QuotationClientDraft>) => void;
	onRemove: (index: number) => void;
	showErrors: boolean;
}) {
	const colors = useThemeColors();
	const error = (key: string) => (showErrors ? (errors[key] ?? '') : '');

	return (
		<View className="gap-4">
			{clients.map((client, index) => (
				// The list is short, capped at four and reordered only by add/remove,
				// so the index is a stable enough key here.
				// biome-ignore lint/suspicious/noArrayIndexKey: clients have no id until saved
				<View className="gap-2" key={index}>
					<View className="flex-row items-center gap-2">
						<Text className="flex-1 font-sans-medium text-foreground text-xs uppercase tracking-wider">
							{`Client ${index + 1}`}
						</Text>
						{index > 0 ? (
							<Pressable
								accessibilityLabel={`Remove client ${index + 1}`}
								accessibilityRole="button"
								hitSlop={8}
								onPress={() => onRemove(index)}
							>
								<Trash2 color={colors.destructive} size={16} strokeWidth={2} />
							</Pressable>
						) : null}
					</View>
					<TextField
						error={error(`clients.${index}.name`)}
						label="Name"
						onChangeText={(name) => onChange(index, { name })}
						placeholder="Full name"
						value={client.name}
					/>
					<TextField
						autoCapitalize="none"
						error={error(`clients.${index}.email`)}
						keyboardType="email-address"
						label="Email"
						onChangeText={(email) => onChange(index, { email })}
						placeholder="name@example.com"
						value={client.email}
					/>
					<TextField
						error={error(`clients.${index}.phone`)}
						keyboardType="phone-pad"
						label="Phone"
						onChangeText={(phone) => onChange(index, { phone })}
						placeholder="04XX XXX XXX"
						value={client.phone}
					/>
				</View>
			))}

			{clients.length < MAX_QUOTATION_CLIENTS ? (
				<Pressable
					accessibilityLabel="Add client"
					accessibilityRole="button"
					className="h-9 flex-row items-center justify-center gap-2 rounded-lg border border-border border-dashed active:bg-muted"
					onPress={onAdd}
				>
					<Plus color={colors.foreground} size={16} strokeWidth={2} />
					<Text className="font-sans-medium text-foreground text-sm">
						Add client
					</Text>
				</Pressable>
			) : null}
		</View>
	);
}
