import { useLocalSearchParams } from 'expo-router';
import { TemplateHtmlTab } from '@/components/quotation-templates/template-html-tab';

export default function TemplateDisclaimerScreen() {
	const { templateId } = useLocalSearchParams<{ templateId: string }>();
	return (
		<TemplateHtmlTab
			description="Printed as its own numbered section, before the terms."
			field="disclaimerHtml"
			label="Disclaimer"
			templateId={templateId}
		/>
	);
}
