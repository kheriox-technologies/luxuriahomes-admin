import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	client: {
		NEXT_PUBLIC_APP_NAME: z.string().min(1),
		NEXT_PUBLIC_CONVEX_URL: z.string().min(1),
		// Public static CDN base for marketing media (project images/videos,
		// banners). Objects are served unsigned, so URLs are a plain concat.
		NEXT_PUBLIC_STATIC_URL: z.string().min(1),
		NEXT_PUBLIC_WEB_URL: z.string().min(1),
		NEXT_PUBLIC_CONTACT_EMAIL: z.string().min(1),
		// One or more phone numbers, comma-separated.
		NEXT_PUBLIC_CONTACT_PHONE: z.string().min(1),
		NEXT_PUBLIC_CONTACT_ADDRESS: z.string().min(1),
		NEXT_PUBLIC_QBCC_LICENCE: z.string().optional(),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
		NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
		NEXT_PUBLIC_STATIC_URL: process.env.NEXT_PUBLIC_STATIC_URL,
		NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
		NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
		NEXT_PUBLIC_CONTACT_PHONE: process.env.NEXT_PUBLIC_CONTACT_PHONE,
		NEXT_PUBLIC_CONTACT_ADDRESS: process.env.NEXT_PUBLIC_CONTACT_ADDRESS,
		NEXT_PUBLIC_QBCC_LICENCE: process.env.NEXT_PUBLIC_QBCC_LICENCE,
	},
});
