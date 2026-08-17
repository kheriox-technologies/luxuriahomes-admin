'use client';

import { api } from '@workspace/backend/api';
import { useMutation, useQuery } from 'convex/react';
import EditableHtmlCard from '@/components/quote-terms/editable-html-card';

export default function QuotationsAcknowledgementTab() {
	const terms = useQuery(api.quoteTerms.get.get, {});
	const updateContent = useMutation(api.quoteTerms.updateContent.updateContent);

	return (
		<EditableHtmlCard
			description="Section 05 of the quotation — the copy printed above the client signature block."
			editorId="quote-terms-acknowledgement"
			isLoading={terms === undefined}
			noun="acknowledgement"
			onSave={(html) => updateContent({ acknowledgementHtml: html })}
			placeholder="Write the acknowledgement that prints above the signature block…"
			title="Acknowledgement"
			value={terms?.settings.acknowledgementHtml ?? ''}
		/>
	);
}
