import '@workspace/env/admin';
import { env } from '@workspace/env/admin';
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
