import '@workspace/env/web';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	transpilePackages: ['@workspace/env'],
};

export default nextConfig;
