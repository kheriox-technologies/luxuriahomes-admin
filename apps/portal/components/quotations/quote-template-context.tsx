'use client';

import type { Id } from '@workspace/backend/dataModel';
import { createContext, type ReactNode, useContext } from 'react';

const QuoteTemplateContext = createContext<Id<'quoteTemplates'> | null>(null);

/**
 * Scopes the six quotation catalogue tabs to one template. The tabs render deep
 * accordion trees, so the id is read from context by the leaves that query and
 * mutate rather than threaded through every intermediate component.
 */
export function QuoteTemplateProvider({
	children,
	templateId,
}: {
	children: ReactNode;
	templateId: Id<'quoteTemplates'>;
}) {
	return (
		<QuoteTemplateContext value={templateId}>{children}</QuoteTemplateContext>
	);
}

export function useQuoteTemplateId(): Id<'quoteTemplates'> {
	const templateId = useContext(QuoteTemplateContext);
	if (!templateId) {
		throw new Error(
			'useQuoteTemplateId must be used inside a QuoteTemplateProvider'
		);
	}
	return templateId;
}
