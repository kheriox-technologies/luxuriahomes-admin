import '@workspace/env/web';
import { env } from '@workspace/env/web';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	transpilePackages: ['@workspace/env'],
	redirects: async () => [
		{
			source: '/',
			destination: env.NEXT_PUBLIC_APP_HOME,
			permanent: true,
		},
	],
};

export default nextConfig;
