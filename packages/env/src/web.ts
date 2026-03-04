import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		APP_NAME: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_APP_NAME: z.string().min(1),
		NEXT_PUBLIC_FOOTER_TEXT: z.string().min(1),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
		NEXT_PUBLIC_FOOTER_TEXT: process.env.NEXT_PUBLIC_FOOTER_TEXT,
	},
});
