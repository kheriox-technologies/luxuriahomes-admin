import '@repo/env/admin';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	transpilePackages: ['@repo/env'],
};

export default nextConfig;
