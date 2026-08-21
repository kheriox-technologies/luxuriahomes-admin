import type { Id } from '@workspace/backend/dataModel';
import { useLocalSearchParams } from 'expo-router';
import { QuotationSigningScreen } from '@/components/client-quotations/signing/quotation-signing-screen';

export default function ClientSignQuotationScreen() {
	const { quotationId } = useLocalSearchParams<{ quotationId: string }>();
	return (
		<QuotationSigningScreen
			quotationId={quotationId as Id<'clientQuotations'>}
			surface="client"
		/>
	);
}
