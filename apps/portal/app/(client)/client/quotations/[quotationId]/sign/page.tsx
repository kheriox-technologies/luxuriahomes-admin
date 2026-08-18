import type { Id } from '@workspace/backend/dataModel';
import SignatureLanding from '@/components/client-quotations/signing/signature-landing';

export default async function SignQuotationPage({
	params,
}: {
	params: Promise<{ quotationId: string }>;
}) {
	const { quotationId } = await params;
	return (
		<SignatureLanding
			quotationId={quotationId as Id<'clientQuotations'>}
			surface="client"
		/>
	);
}
