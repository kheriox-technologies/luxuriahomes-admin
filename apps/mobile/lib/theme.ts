// Brand + semantic colors for places that need raw values (navigation theme,
// icons, status bars). Class-based styling should use the tailwind tokens.

export const brand = {
	navy: '#001f30',
	navyLight: '#133244',
	gold: '#fff0a9',
} as const;

export const palette = {
	light: {
		background: '#f9fafb',
		foreground: '#0a0a0a',
		card: '#ffffff',
		border: '#e5e5e5',
		muted: '#f5f5f5',
		mutedForeground: '#737373',
		destructive: '#df2225',
	},
	dark: {
		background: '#1f1f23',
		foreground: '#fafafa',
		card: '#171717',
		border: '#353539',
		muted: '#262626',
		mutedForeground: '#a1a1a1',
		destructive: '#ff6467',
	},
} as const;

export const semantic = {
	success: '#10b981',
	warning: '#f59e0b',
	info: '#3b82f6',
} as const;

export type ColorScheme = keyof typeof palette;
