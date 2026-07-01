// TEMPORARY: dev-only palette experimentation. Remove this file (and the
// PaletteSwitcher) once a final palette is chosen and baked into `app/site.css`.
//
// A palette is now defined by a SINGLE input color. The full brand slot set is
// derived from it as a 100->900 tonal scale (see `derivePalette`): the input is
// the 500, lighter shades mix toward white, darker shades toward black. A light
// input uses the darkest shade as foreground ink; a dark input uses the lightest.

export const DEFAULT_KEY = 'default' as const;

export interface Palette {
	/** The single input color that drives the whole palette (500 anchor). */
	color: string;
	/** Which set the palette belongs to. */
	group: string;
	/** Stable id, also persisted to localStorage. */
	key: string;
	/** Human label shown in the switcher. */
	label: string;
}

/** Brand slot values derived from a single input color. */
export interface DerivedPalette {
	/** Accent — eyebrow rules, CTA buttons (bg/text-brand-accent). */
	accent: string;
	/** Text placed on top of the accent (contrasts with `accent`). */
	accentForeground: string;
	/** On-primary foreground when the palette is dark (lightest shade). */
	foreground: string;
	/** Dark ink for light palettes; also `--brand-ink` / on-primary foreground. */
	ink: string;
	/** Primary / section & header background (bg-brand-primary), the 500. */
	primary: string;
	/** Secondary surface — top contact bar (bg-brand-primary-soft). */
	primarySoft: string;
	/** Lightest tone — light surfaces + on-dark text (bg/text-brand-surface). */
	surface: string;
	/** 'light' when the input is a light color (enables foreground inversion). */
	tone?: 'light';
}

export const PALETTES: Palette[] = [
	{
		key: 'sage',
		label: 'Sage',
		group: 'Light Theme',
		color: '#e9edc9',
	},
	{
		key: 'linen',
		label: 'Linen',
		group: 'Light Theme',
		color: '#f5ebe0',
	},
	{
		key: 'violet',
		label: 'Violet',
		group: 'Dark Theme',
		color: '#7161ef',
	},
	{
		key: 'teal',
		label: 'Teal',
		group: 'Dark Theme',
		color: '#006d77',
	},
];

const HEX_SHORT_LENGTH = 3;
const HEX_BASE = 16;
const LIGHT_LUMINANCE_THRESHOLD = 0.6;
// Rec. 709 relative-luminance coefficients.
const R_COEFF = 0.2126;
const G_COEFF = 0.7152;
const B_COEFF = 0.0722;
const MAX_CHANNEL = 255;

/** Parse a #rgb or #rrggbb string into 0-255 channels. */
function parseHex(hex: string): { r: number; g: number; b: number } {
	let value = hex.replace('#', '');
	if (value.length === HEX_SHORT_LENGTH) {
		value = value
			.split('')
			.map((c) => c + c)
			.join('');
	}
	const r = Number.parseInt(value.slice(0, 2), HEX_BASE);
	const g = Number.parseInt(value.slice(2, 4), HEX_BASE);
	const b = Number.parseInt(value.slice(4, 6), HEX_BASE);
	return { r, g, b };
}

/** True when the color is light enough to want a dark foreground. */
export function isLight(hex: string): boolean {
	const { r, g, b } = parseHex(hex);
	const luminance = (R_COEFF * r + G_COEFF * g + B_COEFF * b) / MAX_CHANNEL;
	return luminance >= LIGHT_LUMINANCE_THRESHOLD;
}

/** color-mix expression toward white (lighter shade). */
function lighten(color: string, percent: number): string {
	return `color-mix(in oklab, ${color} ${percent}%, white)`;
}

/** color-mix expression toward black (darker shade). */
function darken(color: string, percent: number): string {
	return `color-mix(in oklab, ${color} ${percent}%, black)`;
}

/**
 * Derive the full brand slot set from a single input color. The input is the
 * 500 anchor; lighter shades mix toward white, darker toward black.
 */
export function derivePalette(color: string): DerivedPalette {
	const shade100 = lighten(color, 15);
	const shade600 = darken(color, 82);
	const shade800 = darken(color, 45);
	const shade900 = darken(color, 30);

	if (isLight(color)) {
		// Light input: sections are light, so foreground flips to the darkest shade.
		return {
			primary: color,
			primarySoft: shade600,
			surface: shade100,
			accent: shade800,
			// Accent is dark here, so on-accent text is the lightest shade.
			accentForeground: shade100,
			ink: shade900,
			foreground: shade900,
			tone: 'light',
		};
	}

	// Dark input: sections stay dark, so foreground is the lightest shade.
	const shade300 = lighten(color, 50);
	const shade400 = lighten(color, 75);
	return {
		primary: color,
		primarySoft: shade400,
		surface: shade100,
		accent: shade300,
		// Accent is light here, so on-accent text is the darkest shade.
		accentForeground: shade900,
		ink: shade900,
		foreground: shade100,
	};
}

/**
 * The CSS custom properties a palette applies, mirroring the switcher's
 * `applyPalette`. Pure (no DOM), so it can run server-side to bake a persisted
 * palette into `<html>` at render time. Returns `null` for the default/unknown
 * key, meaning "apply nothing — use the baked defaults in app/site.css".
 */
export function paletteVarsForKey(key: string | undefined): {
	vars: Record<string, string>;
	tone?: 'light';
} | null {
	if (!key || key === DEFAULT_KEY) {
		return null;
	}
	const palette = PALETTES.find((item) => item.key === key);
	if (!palette) {
		return null;
	}
	const derived = derivePalette(palette.color);
	const vars: Record<string, string> = {
		'--brand-primary': derived.primary,
		'--brand-primary-soft': derived.primarySoft,
		'--brand-surface': derived.surface,
		'--brand-accent': derived.accent,
		'--brand-accent-foreground': derived.accentForeground,
		// Mirror the app primary so `bg-primary`/`text-primary` follow along.
		'--app-primary': derived.primary,
	};
	if (derived.tone === 'light') {
		// Light palette: sections go light, so flip on-dark foregrounds to ink.
		vars['--brand-ink'] = derived.ink;
		vars['--app-primary-foreground'] = derived.ink;
		return { vars, tone: 'light' };
	}
	// Dark palette: omit --brand-ink so the app/site.css :root default applies.
	vars['--app-primary-foreground'] = derived.foreground;
	return { vars };
}
