'use client';

import { Button } from '@workspace/ui/components/button';
import { Trash2Icon } from 'lucide-react';

/**
 * Renders the pending items queued for a multi-add dialog session as a card
 * list, each with a right-aligned delete button. Returns null when empty.
 */
export function PendingItemsList({
	items,
	onRemove,
}: {
	items: string[];
	onRemove: (index: number) => void;
}) {
	if (items.length === 0) {
		return null;
	}

	return (
		<ul className="flex flex-col gap-2">
			{items.map((item, index) => (
				<li
					className="flex items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2"
					key={item}
				>
					<span className="truncate text-sm">{item}</span>
					<Button
						aria-label={`Remove ${item}`}
						onClick={() => onRemove(index)}
						size="icon-sm"
						type="button"
						variant="ghost"
					>
						<Trash2Icon />
					</Button>
				</li>
			))}
		</ul>
	);
}
