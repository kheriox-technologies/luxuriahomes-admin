import type { Id } from '@workspace/backend/dataModel';
import { Suspense } from 'react';
import QuotationsPageContent from '@/components/quotations/quotations-page-content';

export default async function QuotationTemplatePage({
	params,
}: {
	params: Promise<{ templateId: string }>;
}) {
	const { templateId } = await params;
	return (
		// The tab shell reads `?tab=` with useSearchParams.
		<Suspense fallback={null}>
			<QuotationsPageContent templateId={templateId as Id<'quoteTemplates'>} />
		</Suspense>
	);
}
