'use client';

import { api } from '@workspace/backend/api';
import { useMutation, useQuery } from 'convex/react';
import EditableHtmlCard from '@/components/quote-terms/editable-html-card';
import { useQuoteTemplateId } from './quote-template-context';

export default function QuotationsAcknowledgementTab() {
	const templateId = useQuoteTemplateId();
	const terms = useQuery(api.quoteTerms.get.get, { templateId });
	const updateContent = useMutation(api.quoteTerms.updateContent.updateContent);

	return (
		<EditableHtmlCard
			description="The copy printed above the client signature block."
			editorId="quote-terms-acknowledgement"
			isLoading={terms === undefined}
			noun="acknowledgement"
			onSave={(html) =>
				updateContent({ acknowledgementHtml: html, templateId })
			}
			placeholder="Write the acknowledgement that prints above the signature block…"
			title="Acknowledgement"
			value={terms?.settings.acknowledgementHtml ?? ''}
		/>
	);
}
