'use client';

import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogPanel,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import {
	Field,
	FieldDescription,
	FieldLabel,
} from '@workspace/ui/components/field';
import { useQuery } from 'convex/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Asks which template a new quotation should be built from before handing over
 * to the composer. A deployment with exactly one template preselects it, so the
 * common case is a single Continue click.
 */
export default function SelectQuotationTemplateDialog({
	onOpenChange,
	open,
}: {
	onOpenChange: (open: boolean) => void;
	open: boolean;
}) {
	const router = useRouter();
	const templates = useQuery(api.quoteTemplates.list.list, open ? {} : 'skip');
	const [selected, setSelected] = useState<Doc<'quoteTemplates'> | null>(null);

	const onlyTemplate = templates?.length === 1 ? templates[0] : undefined;
	useEffect(() => {
		if (open && onlyTemplate) {
			setSelected(onlyTemplate);
		}
	}, [onlyTemplate, open]);

	const isLoading = templates === undefined;
	const isEmpty = templates?.length === 0;

	return (
		<Dialog
			onOpenChange={(next) => {
				onOpenChange(next);
				if (!next) {
					setSelected(null);
				}
			}}
			open={open}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Choose a quotation template</DialogTitle>
				</DialogHeader>
				<DialogPanel className="flex flex-col gap-4">
					{isEmpty ? (
						<FieldDescription>
							There are no quotation templates yet. Create one first, then come
							back to build a quotation from it.
						</FieldDescription>
					) : (
						<Field>
							<FieldLabel htmlFor="new-quotation-template">Template</FieldLabel>
							<Combobox<Doc<'quoteTemplates'>>
								disabled={isLoading}
								items={templates ?? []}
								itemToStringLabel={(item) => item.name}
								onValueChange={setSelected}
								value={selected}
							>
								<ComboboxInput
									id="new-quotation-template"
									placeholder={
										isLoading ? 'Loading templates…' : 'Search templates'
									}
								/>
								<ComboboxPopup>
									<ComboboxEmpty>No template found.</ComboboxEmpty>
									<ComboboxList>
										{(item: Doc<'quoteTemplates'>) => (
											<ComboboxItem key={item._id} value={item}>
												{item.name}
											</ComboboxItem>
										)}
									</ComboboxList>
								</ComboboxPopup>
							</Combobox>
							<FieldDescription>
								Its items, terms, exclusions and notes are copied into the new
								quotation, where you can edit them.
							</FieldDescription>
						</Field>
					)}
				</DialogPanel>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					{isEmpty ? (
						<Button
							render={<Link href="/quotation-templates" />}
							variant="outline"
						>
							Manage templates
						</Button>
					) : (
						<Button
							disabled={selected === null}
							onClick={() => {
								if (selected) {
									router.push(`/quotations/new?template=${selected._id}`);
								}
							}}
							type="button"
							variant="outline"
						>
							Continue
							<ArrowRight aria-hidden />
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
