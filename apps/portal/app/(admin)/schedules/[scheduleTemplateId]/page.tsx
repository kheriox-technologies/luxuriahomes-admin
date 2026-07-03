import type { Id } from '@workspace/backend/dataModel';
import { Suspense } from 'react';
import ScheduleTemplateDetailView from '@/components/schedules/schedule-template-detail-view';

export default async function ScheduleTemplateDetailPage({
	params,
}: {
	params: Promise<{ scheduleTemplateId: string }>;
}) {
	const { scheduleTemplateId } = await params;
	return (
		<Suspense fallback={null}>
			<ScheduleTemplateDetailView
				scheduleTemplateId={scheduleTemplateId as Id<'scheduleTemplates'>}
			/>
		</Suspense>
	);
}
