import type { Id } from '@workspace/backend/dataModel';
import { Suspense } from 'react';

import InclusionCatalogueDetailView from '@/components/inclusions/inclusion-catalogue-detail-view';

export default async function InclusionDetailPage({
	params,
}: {
	params: Promise<{ inclusionId: string }>;
}) {
	const { inclusionId } = await params;
	return (
		<Suspense fallback={null}>
			<InclusionCatalogueDetailView
				inclusionId={inclusionId as Id<'inclusions'>}
			/>
		</Suspense>
	);
}
