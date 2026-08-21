import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { CenteredTextInput } from '@/components/ui/centered-text-input';
import { CONTROL_HEIGHT } from '@/lib/theme';
import type { DraftTermSection } from './use-quotation-draft';

/** The terms as they will print — sections of clauses, editable per quotation. */
export function DraftTermsEditor({
	onAddClause,
	onAddSection,
	onRemoveClause,
	onRemoveSection,
	onRenameSection,
	onUpdateClause,
	sections,
}: {
	onAddClause: (sectionKey: string, text: string) => void;
	onAddSection: (name: string) => void;
	onRemoveClause: (sectionKey: string, clauseKey: string) => void;
	onRemoveSection: (sectionKey: string) => void;
	onRenameSection: (sectionKey: string, name: string) => void;
	onUpdateClause: (sectionKey: string, clauseKey: string, text: string) => void;
	sections: DraftTermSection[];
}) {
	const colors = useThemeColors();
	const [expanded, setExpanded] = useState<Set<string>>(new Set());
	const [drafts, setDrafts] = useState<Record<string, string>>({});

	const toggle = (key: string) =>
		setExpanded((current) => {
			const next = new Set(current);
			if (next.has(key)) {
				next.delete(key);
			} else {
				next.add(key);
			}
			return next;
		});

	const commit = (key: string, submit: (text: string) => void) => {
		const trimmed = (drafts[key] ?? '').trim();
		if (!trimmed) {
			return;
		}
		submit(trimmed);
		setDrafts((current) => ({ ...current, [key]: '' }));
	};

	const NEW_SECTION_KEY = '__new-section';

	return (
		<View className="gap-2">
			{sections.map((section) => {
				const open = expanded.has(section.key);
				return (
					<View
						className="overflow-hidden rounded-lg border border-border"
						key={section.key}
					>
						<View className="flex-row items-center gap-2 p-3">
							<Pressable
								accessibilityLabel={
									open ? `Collapse ${section.name}` : `Expand ${section.name}`
								}
								accessibilityRole="button"
								hitSlop={8}
								onPress={() => toggle(section.key)}
							>
								{open ? (
									<ChevronDown
										color={colors.mutedForeground}
										size={16}
										strokeWidth={2}
									/>
								) : (
									<ChevronRight
										color={colors.mutedForeground}
										size={16}
										strokeWidth={2}
									/>
								)}
							</Pressable>
							<View
								className="flex-1 rounded-lg border border-border bg-card px-3"
								style={{ height: CONTROL_HEIGHT }}
							>
								<CenteredTextInput
									onChangeText={(name) => onRenameSection(section.key, name)}
									placeholder="Section name"
									value={section.name}
								/>
							</View>
							<Badge variant="outline">{String(section.items.length)}</Badge>
							<Pressable
								accessibilityLabel={`Remove ${section.name}`}
								accessibilityRole="button"
								hitSlop={8}
								onPress={() => onRemoveSection(section.key)}
							>
								<Trash2 color={colors.destructive} size={16} strokeWidth={2} />
							</Pressable>
						</View>

						{open ? (
							<View className="gap-2 border-border border-t p-3">
								{section.items.map((clause) => (
									<View className="flex-row items-start gap-2" key={clause.key}>
										<View className="flex-1 rounded-lg border border-border bg-card px-3 py-2">
											<CenteredTextInput
												containerClassName="min-h-[40px]"
												multiline
												onChangeText={(text) =>
													onUpdateClause(section.key, clause.key, text)
												}
												placeholder="Clause"
												value={clause.text}
											/>
										</View>
										<Pressable
											accessibilityLabel="Remove clause"
											accessibilityRole="button"
											hitSlop={8}
											onPress={() => onRemoveClause(section.key, clause.key)}
										>
											<Trash2
												color={colors.destructive}
												size={14}
												strokeWidth={2}
											/>
										</Pressable>
									</View>
								))}

								<View className="flex-row items-center gap-2">
									<View
										className="flex-1 rounded-lg border border-border border-dashed bg-card px-3"
										style={{ height: CONTROL_HEIGHT }}
									>
										<CenteredTextInput
											onChangeText={(text) =>
												setDrafts((current) => ({
													...current,
													[section.key]: text,
												}))
											}
											onSubmitEditing={() =>
												commit(section.key, (text) =>
													onAddClause(section.key, text)
												)
											}
											placeholder="Add a clause…"
											returnKeyType="done"
											value={drafts[section.key] ?? ''}
										/>
									</View>
									<Pressable
										accessibilityLabel="Add clause"
										accessibilityRole="button"
										hitSlop={8}
										onPress={() =>
											commit(section.key, (text) =>
												onAddClause(section.key, text)
											)
										}
									>
										<Plus color={colors.foreground} size={16} strokeWidth={2} />
									</Pressable>
								</View>
							</View>
						) : null}
					</View>
				);
			})}

			<View className="flex-row items-center gap-2">
				<View
					className="flex-1 rounded-lg border border-border border-dashed bg-card px-3"
					style={{ height: CONTROL_HEIGHT }}
				>
					<CenteredTextInput
						onChangeText={(text) =>
							setDrafts((current) => ({ ...current, [NEW_SECTION_KEY]: text }))
						}
						onSubmitEditing={() => commit(NEW_SECTION_KEY, onAddSection)}
						placeholder="Add a terms section…"
						returnKeyType="done"
						value={drafts[NEW_SECTION_KEY] ?? ''}
					/>
				</View>
				<Pressable
					accessibilityLabel="Add terms section"
					accessibilityRole="button"
					hitSlop={8}
					onPress={() => commit(NEW_SECTION_KEY, onAddSection)}
				>
					<Plus color={colors.foreground} size={16} strokeWidth={2} />
				</Pressable>
			</View>
		</View>
	);
}
