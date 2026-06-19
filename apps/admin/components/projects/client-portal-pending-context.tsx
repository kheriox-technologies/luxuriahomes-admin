'use client';

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';

interface ClientPortalPendingContextValue {
	isPending: (email: string) => boolean;
	setPending: (email: string, pending: boolean) => void;
}

const ClientPortalPendingContext =
	createContext<ClientPortalPendingContextValue | null>(null);

export function ClientPortalPendingProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [pendingEmails, setPendingEmails] = useState<Set<string>>(
		() => new Set()
	);

	const setPending = useCallback((email: string, pending: boolean) => {
		setPendingEmails((current) => {
			const next = new Set(current);
			if (pending) {
				next.add(email);
			} else {
				next.delete(email);
			}
			return next;
		});
	}, []);

	const value = useMemo<ClientPortalPendingContextValue>(
		() => ({
			isPending: (email) => pendingEmails.has(email),
			setPending,
		}),
		[pendingEmails, setPending]
	);

	return (
		<ClientPortalPendingContext value={value}>
			{children}
		</ClientPortalPendingContext>
	);
}

export function useClientPortalPending() {
	const context = useContext(ClientPortalPendingContext);
	if (!context) {
		throw new Error(
			'useClientPortalPending must be used within a ClientPortalPendingProvider'
		);
	}
	return context;
}
