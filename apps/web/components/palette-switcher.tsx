'use client';

// TEMPORARY: dev-only palette experimentation UI. Remove this component (and
// `lib/palettes.ts`) once a final palette is chosen.

import { useEffect, useState } from 'react';
import {
	DEFAULT_KEY,
	derivePalette,
	PALETTES,
	type Palette,
	paletteVarsForKey,
} from '@/lib/palettes';

const STORAGE_KEY = 'lh-palette';

const BRAND_VARS = [
	'--brand-primary',
	'--brand-primary-soft',
	'--brand-surface',
	'--brand-accent',
	'--brand-accent-foreground',
	'--brand-ink',
	'--app-primary',
	'--app-primary-foreground',
] as const;

function applyPalette(palette: Palette) {
	const el = document.documentElement;
	const resolved = paletteVarsForKey(palette.key);
	if (!resolved) {
		resetPalette();
		return;
	}
	for (const [name, value] of Object.entries(resolved.vars)) {
		el.style.setProperty(name, value);
	}
	if (resolved.tone === 'light') {
		el.dataset.paletteTone = 'light';
	} else {
		// Dark palette leaves --brand-ink to the :root default.
		el.style.removeProperty('--brand-ink');
		delete el.dataset.paletteTone;
	}
}

function resetPalette() {
	const el = document.documentElement;
	for (const name of BRAND_VARS) {
		el.style.removeProperty(name);
	}
	delete el.dataset.paletteTone;
}

// Group palettes by their `group` field, preserving order.
const GROUPS = PALETTES.reduce<{ name: string; palettes: Palette[] }[]>(
	(acc, palette) => {
		const existing = acc.find((group) => group.name === palette.group);
		if (existing) {
			existing.palettes.push(palette);
		} else {
			acc.push({ name: palette.group, palettes: [palette] });
		}
		return acc;
	},
	[]
);

export function PaletteSwitcher() {
	const [open, setOpen] = useState(false);
	const [activeKey, setActiveKey] = useState<string>(DEFAULT_KEY);

	// Re-apply the saved choice on mount so it survives reloads / navigation.
	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (!saved || saved === DEFAULT_KEY) {
			return;
		}
		const palette = PALETTES.find((item) => item.key === saved);
		if (palette) {
			applyPalette(palette);
			setActiveKey(palette.key);
		}
	}, []);

	const handleSelect = (palette: Palette) => {
		applyPalette(palette);
		localStorage.setItem(STORAGE_KEY, palette.key);
		setActiveKey(palette.key);
	};

	const handleReset = () => {
		resetPalette();
		localStorage.setItem(STORAGE_KEY, DEFAULT_KEY);
		setActiveKey(DEFAULT_KEY);
	};

	return (
		<div className="fixed right-4 bottom-4 z-50 font-sans">
			{open ? (
				<div className="mb-2 w-64 rounded-xl border border-black/10 bg-[#fff] p-3 text-slate-900 shadow-2xl">
					<div className="mb-2 flex items-center justify-between">
						<span className="font-semibold text-sm">Palette preview</span>
						<button
							aria-label="Close palette switcher"
							className="rounded p-1 text-slate-500 text-xs hover:bg-slate-100"
							onClick={() => setOpen(false)}
							type="button"
						>
							✕
						</button>
					</div>

					<button
						aria-pressed={activeKey === DEFAULT_KEY}
						className={`mb-2 flex w-full items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-sm transition-colors hover:bg-slate-50 ${
							activeKey === DEFAULT_KEY
								? 'border-slate-900'
								: 'border-transparent'
						}`}
						onClick={handleReset}
						type="button"
					>
						<span className="inline-flex overflow-hidden rounded-full border border-black/10">
							<span className="size-4 bg-[#15283a]" />
							<span className="size-4 bg-[#f8edb8]" />
						</span>
						Default (brand)
					</button>

					{GROUPS.map((group) => (
						<div className="mb-1" key={group.name}>
							<p className="mt-2 mb-1 px-1 font-medium text-[10px] text-slate-400 uppercase tracking-wide">
								{group.name}
							</p>
							{group.palettes.map((palette) => {
								const derived = derivePalette(palette.color);
								return (
									<button
										aria-pressed={activeKey === palette.key}
										className={`flex w-full items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-sm transition-colors hover:bg-slate-50 ${
											activeKey === palette.key
												? 'border-slate-900'
												: 'border-transparent'
										}`}
										key={palette.key}
										onClick={() => handleSelect(palette)}
										type="button"
									>
										<span className="inline-flex overflow-hidden rounded-full border border-black/10">
											<span
												className="size-4"
												style={{ backgroundColor: derived.surface }}
											/>
											<span
												className="size-4"
												style={{ backgroundColor: derived.primary }}
											/>
											<span
												className="size-4"
												style={{ backgroundColor: derived.accent }}
											/>
										</span>
										{palette.label}
									</button>
								);
							})}
						</div>
					))}
				</div>
			) : null}

			<button
				className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 font-medium text-[#fff] text-sm shadow-lg transition-transform hover:scale-105"
				onClick={() => setOpen((value) => !value)}
				type="button"
			>
				🎨 Palette
			</button>
		</div>
	);
}
