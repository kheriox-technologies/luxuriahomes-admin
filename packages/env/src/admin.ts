import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		APP_NAME: z.string().min(1),
		CONVEX_DEPLOYMENT: z.string().min(1),
		CLERK_SECRET_KEY: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_APP_NAME: z.string().min(1),
		NEXT_PUBLIC_APP_HOME: z.string().min(1),
		NEXT_PUBLIC_APP_PRIMARY_COLOR: z.string().min(1),
		NEXT_PUBLIC_APP_PRIMARY_FOREGROUND_COLOR: z.string().min(1),
		NEXT_PUBLIC_FOOTER_TEXT: z.string().min(1),
		NEXT_PUBLIC_CONVEX_URL: z.string().min(1),
		NEXT_PUBLIC_CONVEX_SITE_URL: z.string().min(1),
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
		NEXT_PUBLIC_APP_HOME: process.env.NEXT_PUBLIC_APP_HOME,
		NEXT_PUBLIC_APP_PRIMARY_COLOR: process.env.NEXT_PUBLIC_APP_PRIMARY_COLOR,
		NEXT_PUBLIC_APP_PRIMARY_FOREGROUND_COLOR:
			process.env.NEXT_PUBLIC_APP_PRIMARY_FOREGROUND_COLOR,
		NEXT_PUBLIC_FOOTER_TEXT: process.env.NEXT_PUBLIC_FOOTER_TEXT,
		NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
		NEXT_PUBLIC_CONVEX_SITE_URL: process.env.NEXT_PUBLIC_CONVEX_SITE_URL,
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
	},
});
