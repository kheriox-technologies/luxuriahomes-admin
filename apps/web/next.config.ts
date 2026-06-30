import '@workspace/env/web';
import { env } from '@workspace/env/web';
import type { NextConfig } from 'next';

const staticCdnHost = new URL(env.NEXT_PUBLIC_STATIC_URL).hostname;

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	transpilePackages: ['@workspace/env'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: staticCdnHost,
				pathname: '/**',
			},
		],
	},
};

export default nextConfig;
