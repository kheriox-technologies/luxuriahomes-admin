import type { Id } from '@workspace/backend/dataModel';
import ClientQuotationComposer from '@/components/client-quotations/client-quotation-composer';

export default async function NewClientQuotationPage({
	searchParams,
}: {
	searchParams: Promise<{ template?: string }>;
}) {
	const { template } = await searchParams;
	return (
		<ClientQuotationComposer
			templateId={template as Id<'quoteTemplates'> | undefined}
		/>
	);
}
