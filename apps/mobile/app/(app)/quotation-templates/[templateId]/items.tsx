import { useLocalSearchParams } from 'expo-router';
import { QuoteCatalogueTab } from '@/components/quotation-templates/quote-catalogue-tab';

export default function TemplateItemsScreen() {
	const { templateId } = useLocalSearchParams<{ templateId: string }>();
	return <QuoteCatalogueTab templateId={templateId} />;
}
