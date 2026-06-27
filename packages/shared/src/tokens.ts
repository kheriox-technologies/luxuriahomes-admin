/**
 * Cross-platform design tokens.
 *
 * These are the OKLch tokens from `packages/ui/src/styles/globals.css` converted
 * to sRGB hex (web Tailwind v4 CSS cannot be imported by React Native / Metro).
 * Keep this file in sync with `globals.css` — it is the single source of raw color
 * values for the mobile app (both the Nativewind CSS variables and any imperative
 * React Native styling such as the status bar or splash screen).
 */

export const lightColors = {
	background: '#f9fafb',
	foreground: '#0a0a0a',
	card: '#ffffff',
	cardForeground: '#0a0a0a',
	primary: '#001f30',
	primaryForeground: '#fff0a9',
	secondary: '#f5f5f5',
	secondaryForeground: '#171717',
	muted: '#f5f5f5',
	mutedForeground: '#737373',
	accent: '#f5f5f5',
	accentForeground: '#171717',
	destructive: '#df2225',
	border: '#e5e5e5',
	input: '#e5e5e5',
	ring: '#a1a1a1',
} as const;

export const darkColors = {
	background: '#1f1f23',
	foreground: '#fafafa',
	card: '#171717',
	cardForeground: '#fafafa',
	primary: '#001f30',
	primaryForeground: '#fff0a9',
	secondary: '#262626',
	secondaryForeground: '#fafafa',
	muted: '#262626',
	mutedForeground: '#b5b5b5',
	accent: '#404040',
	accentForeground: '#fafafa',
	destructive: '#ff6467',
	border: 'rgba(255, 255, 255, 0.1)',
	input: 'rgba(255, 255, 255, 0.15)',
	ring: '#8e8e8e',
} as const;

/** Base border radius in px (web `--radius: 0.375rem`). */
export const radius = 6;

export type ColorTokens = typeof lightColors;
