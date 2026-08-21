import type { Id } from '@workspace/backend/dataModel';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { ClientQuotationComposer } from '@/components/client-quotations/client-quotation-composer';
import {
	SelectTemplateSheet,
	type SelectTemplateSheetHandle,
} from '@/components/client-quotations/select-template-sheet';
import { ScreenFormHeader } from '@/components/screen-form-header';

export default function NewQuotationScreen() {
	const { templateId: fromRoute } = useLocalSearchParams<{
		templateId?: string;
	}>();
	const [templateId, setTemplateId] = useState<Id<'quoteTemplates'> | null>(
		(fromRoute as Id<'quoteTemplates'>) ?? null
	);
	const sheetRef = useRef<SelectTemplateSheetHandle>(null);

	// Arriving from a template carries it in the route; arriving from the
	// quotations list does not, so the picker opens straight away.
	useEffect(() => {
		if (!templateId) {
			sheetRef.current?.present();
		}
	}, [templateId]);

	if (templateId) {
		return <ClientQuotationComposer templateId={templateId} />;
	}

	return (
		<View className="flex-1 bg-background">
			<ScreenFormHeader title="New quotation" />
			<SelectTemplateSheet onSelect={setTemplateId} ref={sheetRef} />
		</View>
	);
}
