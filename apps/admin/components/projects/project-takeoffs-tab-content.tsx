'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
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
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { useQuery } from 'convex/react';
import { Ruler, Save } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { TakeoffsHandle } from '@/components/takeoffs/takeoffs-content';
import ProjectTakeoffWorkspace from './project-takeoff-workspace';

export default function ProjectTakeoffsTabContent({
	projectId,
}: {
	projectId: Id<'projects'>;
}) {
	const takeoffs = useQuery(api.takeoffs.list.list, { projectId });
	const [selectedId, setSelectedId] = useState<Id<'takeoffs'> | null>(null);
	const contentRef = useRef<TakeoffsHandle>(null);
	const [savingPdf, setSavingPdf] = useState(false);

	const onSavePdf = async () => {
		setSavingPdf(true);
		try {
			await contentRef.current?.savePdf();
		} finally {
			setSavingPdf(false);
		}
	};

	// Default to the first takeoff once the list loads (or when the current
	// selection disappears, e.g. after a delete).
	useEffect(() => {
		if (!takeoffs) {
			return;
		}
		setSelectedId((prev) => {
			if (prev && takeoffs.some((t) => t._id === prev)) {
				return prev;
			}
			return takeoffs[0]?._id ?? null;
		});
	}, [takeoffs]);

	const items = useMemo(() => (takeoffs ?? []).map((t) => t._id), [takeoffs]);
	const labelById = useMemo(() => {
		const map = new Map<Id<'takeoffs'>, string>();
		for (const t of takeoffs ?? []) {
			map.set(t._id, t.name);
		}
		return map;
	}, [takeoffs]);

	if (takeoffs === undefined) {
		return <p className="text-muted-foreground text-sm">Loading…</p>;
	}

	if (takeoffs.length === 0) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Ruler aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No take-offs yet</EmptyTitle>
					<EmptyDescription>
						Open the Documents tab, then use a PDF&apos;s &ldquo;Add to
						take-offs&rdquo; action to start measuring.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col gap-3">
			<div className="flex w-full items-center justify-between gap-2">
				<div className="w-full max-w-sm">
					<Combobox<Id<'takeoffs'>>
						items={items}
						itemToStringLabel={(item) => labelById.get(item) ?? ''}
						onValueChange={(next) => setSelectedId(next ?? null)}
						value={selectedId}
					>
						<ComboboxInput placeholder="Select a PDF" />
						<ComboboxPopup>
							<ComboboxEmpty>No take-offs available.</ComboboxEmpty>
							<ComboboxList>
								{(item: Id<'takeoffs'>) => (
									<ComboboxItem key={item} value={item}>
										{labelById.get(item) ?? item}
									</ComboboxItem>
								)}
							</ComboboxList>
						</ComboboxPopup>
					</Combobox>
				</div>
				{selectedId ? (
					<Button
						loading={savingPdf}
						onClick={() => onSavePdf().catch(() => undefined)}
						size="sm"
						type="button"
						variant="outline"
					>
						<Save />
						Save PDF
					</Button>
				) : null}
			</div>
			<div className="min-h-0 w-full min-w-0 flex-1">
				{selectedId ? (
					<ProjectTakeoffWorkspace
						contentRef={contentRef}
						key={selectedId}
						takeoffId={selectedId}
					/>
				) : null}
			</div>
		</div>
	);
}
