import type { Id } from '@workspace/backend/dataModel';
import { useLocalSearchParams } from 'expo-router';
import { ClientQuotationComposer } from '@/components/client-quotations/client-quotation-composer';

export default function EditQuotationScreen() {
	const { quotationId, version } = useLocalSearchParams<{
		quotationId: string;
		version?: string;
	}>();
	// `?version=` present means amending that revision in place rather than
	// issuing a new one.
	const editVersion = version ? Number(version) : undefined;

	return (
		<ClientQuotationComposer
			editVersion={Number.isFinite(editVersion) ? editVersion : undefined}
			quotationId={quotationId as Id<'clientQuotations'>}
		/>
	);
}
