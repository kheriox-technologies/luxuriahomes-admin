import type { Id } from '@workspace/backend/dataModel';
import { Suspense } from 'react';
import MaterialDetailView from '@/components/materials/material-detail-view';

export default async function MaterialDetailPage({
	params,
}: {
	params: Promise<{ materialId: string }>;
}) {
	const { materialId } = await params;
	return (
		<Suspense fallback={null}>
			<MaterialDetailView materialId={materialId as Id<'materials'>} />
		</Suspense>
	);
}
