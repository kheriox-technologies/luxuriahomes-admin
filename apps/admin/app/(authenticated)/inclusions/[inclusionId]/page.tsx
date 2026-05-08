import type { Id } from '@workspace/backend/dataModel';

import InclusionCatalogueDetailView from '@/components/inclusions/inclusion-catalogue-detail-view';

export default async function InclusionDetailPage({
	params,
}: {
	params: Promise<{ inclusionId: string }>;
}) {
	const { inclusionId } = await params;
	return (
		<InclusionCatalogueDetailView
			inclusionId={inclusionId as Id<'inclusions'>}
		/>
	);
}
