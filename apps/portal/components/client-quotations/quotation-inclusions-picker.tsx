'use client';

import type { Doc } from '@workspace/backend/dataModel';
import {
	Accordion,
	AccordionItem,
	AccordionPanel,
	AccordionTrigger,
} from '@workspace/ui/components/accordion';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';

export interface QuoteCatalogueSectionNode {
	items: Doc<'quoteItems'>[];
	section: Doc<'quoteSections'>;
}

export interface QuoteCatalogueStageNode {
	sections: QuoteCatalogueSectionNode[];
	stage: Doc<'quoteStages'>;
}

/**
 * Which catalogue items this quotation lists under "What each stage includes".
 * Items flagged as defaults in the catalogue arrive pre-selected; the picker is
 * for trimming or extending that set per project.
 */
export default function QuotationInclusionsPicker({
	onChange,
	selected,
	tree,
}: {
	onChange: (next: Set<string>) => void;
	selected: Set<string>;
	tree: QuoteCatalogueStageNode[] | undefined;
}) {
	if (tree === undefined) {
		return (
			<p className="text-muted-foreground text-sm">Loading quote items…</p>
		);
	}
	if (tree.length === 0) {
		return (
			<p className="text-muted-foreground text-sm">
				No quote items yet. Add them under Lists → Quote Items.
			</p>
		);
	}

	const setMany = (itemIds: string[], checked: boolean) => {
		const next = new Set(selected);
		for (const itemId of itemIds) {
			if (checked) {
				next.add(itemId);
			} else {
				next.delete(itemId);
			}
		}
		onChange(next);
	};

	return (
		<Accordion className="flex flex-col gap-2">
			{tree.map((stageNode) => {
				const stageItemIds = stageNode.sections.flatMap((sectionNode) =>
					sectionNode.items.map((item) => item._id as string)
				);
				const selectedCount = stageItemIds.filter((id) =>
					selected.has(id)
				).length;

				return (
					<AccordionItem
						// AccordionItem defaults to `last:border-b-0`, which would strip
						// the bottom edge off this card's full border on the last stage.
						className="rounded-lg border px-3 last:border-b"
						key={stageNode.stage._id}
						value={stageNode.stage._id}
					>
						<AccordionTrigger>
							<span className="flex w-full items-center justify-between gap-3 pe-2">
								<span className="font-medium">{stageNode.stage.name}</span>
								<span className="text-muted-foreground text-xs tabular-nums">
									{selectedCount} of {stageItemIds.length} selected
								</span>
							</span>
						</AccordionTrigger>
						<AccordionPanel>
							<div className="flex flex-col gap-4">
								<div className="flex gap-2">
									<Button
										onClick={() => setMany(stageItemIds, true)}
										size="sm"
										type="button"
										variant="outline"
									>
										Select all
									</Button>
									<Button
										onClick={() => setMany(stageItemIds, false)}
										size="sm"
										type="button"
										variant="outline"
									>
										Clear
									</Button>
								</div>

								{stageNode.sections.map((sectionNode) => {
									const sectionItemIds = sectionNode.items.map(
										(item) => item._id as string
									);
									const sectionSelected = sectionItemIds.filter((id) =>
										selected.has(id)
									).length;
									const allSelected =
										sectionItemIds.length > 0 &&
										sectionSelected === sectionItemIds.length;

									return (
										<div
											className="flex flex-col gap-2"
											key={sectionNode.section._id}
										>
											<label
												className="flex cursor-pointer items-center gap-2 font-medium text-foreground text-sm"
												htmlFor={`quotation-section-${sectionNode.section._id}`}
											>
												<Checkbox
													checked={allSelected}
													id={`quotation-section-${sectionNode.section._id}`}
													indeterminate={sectionSelected > 0 && !allSelected}
													onCheckedChange={(checked) =>
														setMany(sectionItemIds, checked === true)
													}
												/>
												{sectionNode.section.name}
											</label>

											<div className="flex flex-col gap-2 ps-6">
												{sectionNode.items.map((item) => (
													<label
														className="flex cursor-pointer items-start gap-2 text-sm"
														htmlFor={`quotation-item-${item._id}`}
														key={item._id}
													>
														<Checkbox
															checked={selected.has(item._id)}
															className="mt-0.5"
															id={`quotation-item-${item._id}`}
															onCheckedChange={(checked) =>
																setMany([item._id], checked === true)
															}
														/>
														<span className="flex flex-col">
															<span className="text-foreground">
																{item.name}
															</span>
															{item.description ? (
																<span className="text-muted-foreground text-xs">
																	{item.description}
																</span>
															) : null}
														</span>
													</label>
												))}
											</div>
										</div>
									);
								})}
							</div>
						</AccordionPanel>
					</AccordionItem>
				);
			})}
		</Accordion>
	);
}
