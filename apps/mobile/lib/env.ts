function required(name: string, value: string | undefined): string {
	if (!value) {
		throw new Error(`Missing environment variable: ${name}`);
	}
	return value;
}

export const env = {
	convexUrl: required(
		'EXPO_PUBLIC_CONVEX_URL',
		process.env.EXPO_PUBLIC_CONVEX_URL
	),
	clerkPublishableKey: required(
		'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY',
		process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
	),
};
