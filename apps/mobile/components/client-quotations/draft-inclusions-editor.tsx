import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { CenteredTextInput } from '@/components/ui/centered-text-input';
import { CONTROL_HEIGHT } from '@/lib/theme';
import type { DraftStage } from './use-quotation-draft';

/**
 * What each stage includes — the body of the quotation.
 *
 * The stages themselves are fixed: they drive the payment schedule, so adding
 * or removing one here would break the percentages. Sections and items are
 * fully editable, seeded from the template's defaults.
 */
export function DraftInclusionsEditor({
	onAddItem,
	onAddSection,
	onRemoveItem,
	onRemoveSection,
	onRenameSection,
	onUpdateItem,
	percentOf,
	stages,
}: {
	onAddItem: (stageKey: string, sectionKey: string, name: string) => void;
	onAddSection: (stageKey: string, name: string) => void;
	onRemoveItem: (stageKey: string, sectionKey: string, itemKey: string) => void;
	onRemoveSection: (stageKey: string, sectionKey: string) => void;
	onRenameSection: (stageKey: string, sectionKey: string, name: string) => void;
	onUpdateItem: (
		stageKey: string,
		sectionKey: string,
		itemKey: string,
		name: string
	) => void;
	percentOf: (stage: DraftStage) => string;
	stages: DraftStage[];
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

	return (
		<View className="gap-2">
			{stages.map((stage) => {
				const open = expanded.has(stage.key);
				const itemCount = stage.sections.reduce(
					(sum, section) => sum + section.items.length,
					0
				);
				return (
					<View
						className="overflow-hidden rounded-lg border border-border"
						key={stage.key}
					>
						<Pressable
							accessibilityLabel={
								open ? `Collapse ${stage.name}` : `Expand ${stage.name}`
							}
							accessibilityRole="button"
							className="flex-row items-center gap-2 p-3"
							hitSlop={4}
							onPress={() => toggle(stage.key)}
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
							<Text className="flex-1 font-sans-medium text-foreground text-sm">
								{stage.name}
							</Text>
							<Badge variant="info">{`${percentOf(stage) || '0'}%`}</Badge>
							<Badge variant="outline">{String(itemCount)}</Badge>
						</Pressable>

						{open ? (
							<View className="gap-3 border-border border-t p-3">
								{stage.sections.map((section) => (
									<View className="gap-2" key={section.key}>
										<View className="flex-row items-center gap-2">
											<View
												className="flex-1 rounded-lg border border-border bg-card px-3"
												style={{ height: CONTROL_HEIGHT }}
											>
												<CenteredTextInput
													onChangeText={(name) =>
														onRenameSection(stage.key, section.key, name)
													}
													placeholder="Section name"
													value={section.name}
												/>
											</View>
											<Pressable
												accessibilityLabel={`Remove ${section.name}`}
												accessibilityRole="button"
												hitSlop={8}
												onPress={() => onRemoveSection(stage.key, section.key)}
											>
												<Trash2
													color={colors.destructive}
													size={16}
													strokeWidth={2}
												/>
											</Pressable>
										</View>

										<View className="gap-2 pl-3">
											{section.items.map((item) => (
												<View
													className="flex-row items-center gap-2"
													key={item.key}
												>
													<View
														className="flex-1 rounded-lg border border-border bg-card px-3"
														style={{ height: CONTROL_HEIGHT }}
													>
														<CenteredTextInput
															onChangeText={(name) =>
																onUpdateItem(
																	stage.key,
																	section.key,
																	item.key,
																	name
																)
															}
															placeholder="Item"
															value={item.name}
														/>
													</View>
													<Pressable
														accessibilityLabel={`Remove ${item.name}`}
														accessibilityRole="button"
														hitSlop={8}
														onPress={() =>
															onRemoveItem(stage.key, section.key, item.key)
														}
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
																onAddItem(stage.key, section.key, text)
															)
														}
														placeholder="Add an item…"
														returnKeyType="done"
														value={drafts[section.key] ?? ''}
													/>
												</View>
												<Pressable
													accessibilityLabel="Add item"
													accessibilityRole="button"
													hitSlop={8}
													onPress={() =>
														commit(section.key, (text) =>
															onAddItem(stage.key, section.key, text)
														)
													}
												>
													<Plus
														color={colors.foreground}
														size={16}
														strokeWidth={2}
													/>
												</Pressable>
											</View>
										</View>
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
													[stage.key]: text,
												}))
											}
											onSubmitEditing={() =>
												commit(stage.key, (text) =>
													onAddSection(stage.key, text)
												)
											}
											placeholder="Add a section…"
											returnKeyType="done"
											value={drafts[stage.key] ?? ''}
										/>
									</View>
									<Pressable
										accessibilityLabel="Add section"
										accessibilityRole="button"
										hitSlop={8}
										onPress={() =>
											commit(stage.key, (text) => onAddSection(stage.key, text))
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
		</View>
	);
}
