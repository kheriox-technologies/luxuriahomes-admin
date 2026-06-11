import type { Id } from '@workspace/backend/dataModel';
import { Suspense } from 'react';
import MaterialVariantDetailView from '@/components/materials/material-variant-detail-view';

export default async function MaterialVariantDetailPage({
	params,
}: {
	params: Promise<{ materialId: string; variantId: string }>;
}) {
	const { materialId, variantId } = await params;
	return (
		<Suspense fallback={null}>
			<MaterialVariantDetailView
				materialId={materialId as Id<'materials'>}
				variantId={variantId as Id<'materialVariants'>}
			/>
		</Suspense>
	);
}
