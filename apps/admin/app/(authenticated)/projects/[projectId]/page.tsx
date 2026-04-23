import type { Id } from '@workspace/backend/dataModel';

import ProjectDetailView from '@/components/projects/project-detail-view';

export default async function ProjectPage({
	params,
}: {
	params: Promise<{ projectId: string }>;
}) {
	const { projectId } = await params;
	return <ProjectDetailView projectId={projectId as Id<'projects'>} />;
}
