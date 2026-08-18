import type { Id } from '@workspace/backend/dataModel';
import QuotationSigningSurface from '@/components/client-quotations/signing/quotation-signing-surface';

export default async function CountersignQuotationDocumentPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return (
		<QuotationSigningSurface
			quotationId={id as Id<'clientQuotations'>}
			surface="admin"
		/>
	);
}
