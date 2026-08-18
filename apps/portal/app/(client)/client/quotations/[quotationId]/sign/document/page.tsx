import type { Id } from '@workspace/backend/dataModel';
import QuotationSigningSurface from '@/components/client-quotations/signing/quotation-signing-surface';

export default async function SignQuotationDocumentPage({
	params,
}: {
	params: Promise<{ quotationId: string }>;
}) {
	const { quotationId } = await params;
	return (
		<QuotationSigningSurface
			quotationId={quotationId as Id<'clientQuotations'>}
			surface="client"
		/>
	);
}
