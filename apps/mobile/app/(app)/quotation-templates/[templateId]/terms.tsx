import { useLocalSearchParams } from 'expo-router';
import { QuoteTermsTab } from '@/components/quotation-templates/quote-terms-tab';

export default function TemplateTermsScreen() {
	const { templateId } = useLocalSearchParams<{ templateId: string }>();
	return <QuoteTermsTab templateId={templateId} />;
}
