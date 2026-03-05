'use client';

import { SignIn } from '@clerk/nextjs';
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { Loader2 } from 'lucide-react';
import { CenteredLayout } from '@/layouts/centered-layout';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<AuthLoading>
				<CenteredLayout>
					<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
				</CenteredLayout>
			</AuthLoading>
			<Authenticated>{children}</Authenticated>
			<Unauthenticated>
				<CenteredLayout>
					<SignIn />
				</CenteredLayout>
			</Unauthenticated>
		</>
	);
};

export default AuthGuard;
