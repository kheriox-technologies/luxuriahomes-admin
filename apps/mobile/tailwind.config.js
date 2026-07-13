'use strict';
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./lib/**/*.{ts,tsx}',
	],
	presets: [require('nativewind/preset')],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				// Converted from packages/ui/src/styles/globals.css oklch tokens
				background: 'rgb(var(--background) / <alpha-value>)',
				foreground: 'rgb(var(--foreground) / <alpha-value>)',
				card: 'rgb(var(--card) / <alpha-value>)',
				'card-foreground': 'rgb(var(--card-foreground) / <alpha-value>)',
				muted: 'rgb(var(--muted) / <alpha-value>)',
				'muted-foreground': 'rgb(var(--muted-foreground) / <alpha-value>)',
				border: 'rgb(var(--border) / <alpha-value>)',
				primary: 'rgb(var(--primary) / <alpha-value>)',
				'primary-foreground': 'rgb(var(--primary-foreground) / <alpha-value>)',
				accent: 'rgb(var(--accent) / <alpha-value>)',
				destructive: 'rgb(var(--destructive) / <alpha-value>)',
				ink: '#2b2927',
				'ink-light': '#514e4a',
				linen: '#f5ebe0',
				success: '#10b981',
				warning: '#f59e0b',
				info: '#3b82f6',
			},
			borderRadius: {
				DEFAULT: '6px',
			},
			fontFamily: {
				sans: ['Inter_400Regular'],
				'sans-medium': ['Inter_500Medium'],
				'sans-semibold': ['Inter_600SemiBold'],
				'sans-bold': ['Inter_700Bold'],
			},
			fontSize: {
				xs: ['14px', { lineHeight: '18px' }],
				sm: ['16px', { lineHeight: '22px' }],
				base: ['18px', { lineHeight: '26px' }],
				lg: ['20px', { lineHeight: '28px' }],
				xl: ['22px', { lineHeight: '30px' }],
				'2xl': ['26px', { lineHeight: '34px' }],
			},
		},
	},
	plugins: [],
};
