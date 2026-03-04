import type { AuthConfig } from 'convex/server';

export default {
	providers: [
		{
			// biome-ignore lint/style/noNonNullAssertion: Clerk JWT Issuer Domain is set in the environment variables
			domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
			applicationID: 'convex',
		},
	],
} satisfies AuthConfig;
