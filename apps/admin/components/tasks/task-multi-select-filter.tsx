'use client';

import {
	Combobox,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
	useComboboxFilter,
} from '@workspace/ui/components/combobox';
import { cn } from '@workspace/ui/lib/utils';
import { XIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface FilterOption {
	label: string;
	value: string;
}

// Shared chip styling so the visible chips and the hidden measurement row are
// pixel-identical (the overflow calculation depends on matching widths).
const CHIP_CLASS =
	'inline-flex shrink-0 items-center rounded-[calc(var(--radius-md)-1px)] bg-accent ps-2 font-medium text-accent-foreground text-sm outline-none sm:text-xs/(--text-xs--line-height)';
const MORE_CLASS =
	'inline-flex shrink-0 items-center rounded-[calc(var(--radius-md)-1px)] bg-muted px-2 font-medium text-muted-foreground text-sm sm:text-xs/(--text-xs--line-height)';

const CHIP_GAP = 4; // gap-1
const INPUT_MIN_WIDTH = 48; // min-w-12 on the input
const ROW_PADDING = 8; // chips container padding + border

function SelectedChip({
	label,
	onRemove,
	measure,
}: {
	label: string;
	onRemove?: () => void;
	measure?: boolean;
}) {
	return (
		<span
			className={CHIP_CLASS}
			data-measure-chip={measure ? '' : undefined}
			data-slot="combobox-chip"
		>
			<span className="max-w-[200px] truncate">{label}</span>
			<button
				aria-label={`Remove ${label}`}
				className="flex h-full shrink-0 cursor-pointer items-center px-1.5 opacity-80 hover:opacity-100"
				onClick={onRemove}
				tabIndex={measure ? -1 : 0}
				type="button"
			>
				<XIcon className="size-4 sm:size-3.5" />
			</button>
		</span>
	);
}

export default function TaskMultiSelectFilter({
	id,
	placeholder,
	options,
	value,
	onChange,
}: {
	id: string;
	placeholder: string;
	options: FilterOption[];
	value: string[];
	onChange: (next: string[]) => void;
}) {
	const [query, setQuery] = useState('');
	const filter = useComboboxFilter();

	const rowRef = useRef<HTMLDivElement>(null);
	const measureRef = useRef<HTMLDivElement>(null);
	const [visibleCount, setVisibleCount] = useState(value.length);

	const labelByValue = useMemo(() => {
		const map = new Map<string, string>();
		for (const option of options) {
			map.set(option.value, option.label);
		}
		return map;
	}, [options]);

	const selectedSet = new Set(value);
	const unselected = options
		.filter((option) => !selectedSet.has(option.value))
		.map((option) => option.value);
	const filteredValues = unselected.filter((optionValue) =>
		filter.contains(
			optionValue,
			query,
			(candidate) => labelByValue.get(candidate) ?? candidate
		)
	);

	// Re-measure whenever the selection or its labels change.
	const chipsKey = value.map((v) => labelByValue.get(v) ?? v).join('|');

	// Measure chips against the available width and collapse the overflow into a
	// "+N more" badge so chips always stay on a single line.
	useEffect(() => {
		const row = rowRef.current;
		const measure = measureRef.current;
		if (!(row && measure)) {
			return;
		}
		if (chipsKey.length === 0) {
			setVisibleCount(0);
			return;
		}

		const recompute = () => {
			const chipEls = Array.from(
				measure.querySelectorAll<HTMLElement>('[data-measure-chip]')
			);
			const moreEl = measure.querySelector<HTMLElement>('[data-measure-more]');
			const moreWidth = moreEl?.getBoundingClientRect().width ?? 0;
			const widths = chipEls.map((el) => el.getBoundingClientRect().width);
			const available = row.clientWidth - ROW_PADDING - INPUT_MIN_WIDTH;

			// Everything fits on one line — no overflow badge needed.
			let total = 0;
			for (const [i, width] of widths.entries()) {
				total += width + (i > 0 ? CHIP_GAP : 0);
			}
			if (total <= available) {
				setVisibleCount(widths.length);
				return;
			}

			// Fit as many chips as possible while reserving room for the badge.
			let used = 0;
			let count = 0;
			for (const width of widths) {
				const chipWidth = width + (count > 0 ? CHIP_GAP : 0);
				if (used + chipWidth + CHIP_GAP + moreWidth <= available) {
					used += chipWidth;
					count++;
				} else {
					break;
				}
			}
			setVisibleCount(count);
		};

		recompute();
		const observer = new ResizeObserver(recompute);
		observer.observe(row);
		return () => observer.disconnect();
	}, [chipsKey]);

	const hiddenCount = Math.max(value.length - visibleCount, 0);

	const removeValue = (optionValue: string) => {
		onChange(value.filter((current) => current !== optionValue));
	};

	return (
		<Combobox
			filteredItems={filteredValues}
			items={unselected}
			itemToStringLabel={(optionValue) =>
				labelByValue.get(String(optionValue ?? '')) ?? String(optionValue ?? '')
			}
			multiple
			onInputValueChange={(next) => setQuery(next)}
			onValueChange={(next) => {
				onChange(next as string[]);
				setQuery('');
			}}
			value={value}
		>
			<div className="relative w-full" ref={rowRef}>
				<ComboboxChips className="flex-nowrap overflow-hidden">
					{value.slice(0, visibleCount).map((optionValue) => (
						<SelectedChip
							key={optionValue}
							label={labelByValue.get(optionValue) ?? optionValue}
							onRemove={() => removeValue(optionValue)}
						/>
					))}
					{hiddenCount > 0 && (
						<span className={MORE_CLASS}>+{hiddenCount} more</span>
					)}
					<ComboboxChipsInput
						aria-label={placeholder}
						id={id}
						placeholder={value.length === 0 ? placeholder : undefined}
					/>
				</ComboboxChips>

				{/* Hidden measurement row: renders every chip so widths can be measured. */}
				<div
					aria-hidden="true"
					className="pointer-events-none invisible absolute inset-0 flex flex-nowrap items-center gap-1 p-[calc(--spacing(1)-1px)]"
					ref={measureRef}
				>
					{value.map((optionValue) => (
						<SelectedChip
							key={optionValue}
							label={labelByValue.get(optionValue) ?? optionValue}
							measure
						/>
					))}
					<span className={cn(MORE_CLASS)} data-measure-more="">
						+{value.length} more
					</span>
				</div>
			</div>
			<ComboboxPopup>
				<ComboboxEmpty>No matches.</ComboboxEmpty>
				<ComboboxList>
					{(optionValue: string) => (
						<ComboboxItem key={optionValue} value={optionValue}>
							{labelByValue.get(optionValue) ?? optionValue}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
