import type { Id } from '@workspace/backend/dataModel';
import SignatureLanding from '@/components/client-quotations/signing/signature-landing';

export default async function CountersignQuotationPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return (
		<SignatureLanding
			quotationId={id as Id<'clientQuotations'>}
			surface="admin"
		/>
	);
}
