import { View } from 'react-native';
import { ClientMenu } from '@/components/client/client-menu';
import { ClientQuotationsList } from '@/components/client-quotations/client-quotations-list';
import { ScreenHeader } from '@/components/screen-header';

export default function ClientQuotationsScreen() {
	return (
		<View className="flex-1 bg-background">
			<ScreenHeader
				rightSlot={<ClientMenu />}
				subtitle="Your quotations from Luxuria Homes"
				title="Quotations"
			/>
			<ClientQuotationsList surface="client" />
		</View>
	);
}
