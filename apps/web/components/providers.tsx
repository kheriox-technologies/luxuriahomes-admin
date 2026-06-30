'use client';

import { env } from '@workspace/env/web';
import {
	AnchoredToastProvider,
	ToastProvider,
} from '@workspace/ui/components/toast';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import type { ReactNode } from 'react';

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL || '');

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<ConvexProvider client={convex}>
			<ToastProvider>
				<AnchoredToastProvider>{children}</AnchoredToastProvider>
			</ToastProvider>
		</ConvexProvider>
	);
}
