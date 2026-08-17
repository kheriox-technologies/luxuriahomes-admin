import type { Id } from '@workspace/backend/dataModel';
import ClientQuotationComposer from '@/components/client-quotations/client-quotation-composer';

export default async function EditClientQuotationPage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ version?: string }>;
}) {
	const { id } = await params;
	// Present when the edit was opened from a row in the version history, which
	// rewrites that version rather than issuing a new one.
	const { version } = await searchParams;
	const editVersion = version === undefined ? undefined : Number(version);

	return (
		<ClientQuotationComposer
			editVersion={
				editVersion !== undefined && Number.isFinite(editVersion)
					? editVersion
					: undefined
			}
			quotationId={id as Id<'clientQuotations'>}
		/>
	);
}
