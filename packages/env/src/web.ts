import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		// Deployment environment, provided by Amplify (e.g. `prod`). Used to gate
		// dev-only UI such as the palette switcher.
		ENV: z.string().optional(),
	},
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
		// Persisted brand palette key (see apps/web/lib/palettes.ts). Applied
		// server-side as the site default; unset falls back to app/site.css.
		NEXT_PUBLIC_BRAND_PALETTE: z.string().optional(),
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
		NEXT_PUBLIC_BRAND_PALETTE: process.env.NEXT_PUBLIC_BRAND_PALETTE,
	},
});
