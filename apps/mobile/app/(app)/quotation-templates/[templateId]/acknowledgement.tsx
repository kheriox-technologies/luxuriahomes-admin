import { useLocalSearchParams } from 'expo-router';
import { TemplateHtmlTab } from '@/components/quotation-templates/template-html-tab';

export default function TemplateAcknowledgementScreen() {
	const { templateId } = useLocalSearchParams<{ templateId: string }>();
	return (
		<TemplateHtmlTab
			description="Printed above the signature block on the last page."
			field="acknowledgementHtml"
			label="Acknowledgement"
			templateId={templateId}
		/>
	);
}
