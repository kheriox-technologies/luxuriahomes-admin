import type { Id } from '@workspace/backend/dataModel';
import ClientQuotationComposer from '@/components/client-quotations/client-quotation-composer';

export default async function EditClientQuotationPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <ClientQuotationComposer quotationId={id as Id<'clientQuotations'>} />;
}
