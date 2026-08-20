'use client';

import { api } from '@workspace/backend/api';
import { useMutation, useQuery } from 'convex/react';
import EditableHtmlCard from '@/components/quote-terms/editable-html-card';
import { useQuoteTemplateId } from './quote-template-context';

export default function QuotationsDisclaimerTab() {
	const templateId = useQuoteTemplateId();
	const terms = useQuery(api.quoteTerms.get.get, { templateId });
	const updateContent = useMutation(api.quoteTerms.updateContent.updateContent);

	return (
		<EditableHtmlCard
			description="What the estimate does and does not commit to."
			editorId="quote-terms-disclaimer"
			isLoading={terms === undefined}
			noun="disclaimer"
			onSave={(html) => updateContent({ disclaimerHtml: html, templateId })}
			placeholder="Write the disclaimer that prints on every quotation…"
			title="Disclaimer"
			value={terms?.settings.disclaimerHtml ?? ''}
		/>
	);
}
