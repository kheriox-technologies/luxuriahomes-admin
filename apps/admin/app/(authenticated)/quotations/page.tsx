import { Suspense } from 'react';
import QuotationsPageContent from '@/components/quotations/quotations-page-content';

export default function QuotationsPage() {
	return (
		<Suspense fallback={null}>
			<QuotationsPageContent />
		</Suspense>
	);
}
