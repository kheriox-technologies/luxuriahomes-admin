import { Redirect, useLocalSearchParams } from 'expo-router';

// Items is the tab worth landing on — it is the bulk of what a template holds.
export default function QuotationTemplateIndex() {
	const { templateId } = useLocalSearchParams<{ templateId: string }>();
	return (
		<Redirect
			href={{
				pathname: '/(app)/quotation-templates/[templateId]/items',
				params: { templateId },
			}}
		/>
	);
}
