import '@workspace/env/app';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	transpilePackages: ['@workspace/env', 'frappe-gantt'],
};

export default nextConfig;
