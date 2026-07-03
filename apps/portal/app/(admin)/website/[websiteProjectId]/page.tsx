import type { Id } from '@workspace/backend/dataModel';

import WebsiteProjectDetailView from '@/components/website/website-project-detail-view';

export default async function WebsiteProjectPage({
	params,
}: {
	params: Promise<{ websiteProjectId: string }>;
}) {
	const { websiteProjectId } = await params;
	return (
		<WebsiteProjectDetailView
			websiteProjectId={websiteProjectId as Id<'websiteProjects'>}
		/>
	);
}
