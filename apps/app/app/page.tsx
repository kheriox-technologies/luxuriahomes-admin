import type { Route } from 'next';
import { redirect } from 'next/navigation';
import { getLandingPath } from '@/actions/auth';

// Defense-in-depth behind the middleware, which already redirects '/'
const RootPage = async () => {
	const landing = await getLandingPath();
	redirect((landing ?? '/error?error=arbitrary_octopus') as Route);
};

export default RootPage;
