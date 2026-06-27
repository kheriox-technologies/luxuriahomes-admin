// Expo inlines EXPO_PUBLIC_* variables at build time. Validate them eagerly so a
// missing value fails fast with a clear message instead of a cryptic runtime error.
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!convexUrl) {
	throw new Error('Missing EXPO_PUBLIC_CONVEX_URL');
}

if (!clerkPublishableKey) {
	throw new Error('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY');
}

export const env = {
	convexUrl,
	clerkPublishableKey,
} as const;
