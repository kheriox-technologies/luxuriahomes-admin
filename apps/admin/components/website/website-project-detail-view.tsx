'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@workspace/ui/components/card';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import { ImagePlus, Pencil, Trash2 } from 'lucide-react';
import PageHeading from '@/components/page-heading';
import DeleteWebsiteProject from './delete-website-project';
import EditWebsiteProjectForm from './edit-website-project';
import { websiteProjectStatusBadge } from './website-project-form-shared';
import WebsiteProjectGallery from './website-project-gallery';
import WebsiteProjectMediaUploadDialog from './website-project-media-upload-dialog';
import { WebsiteProjectSpecs } from './website-project-specs';

export default function WebsiteProjectDetailView({
	websiteProjectId,
}: {
	websiteProjectId: Id<'websiteProjects'>;
}) {
	const project = useQuery(api.websiteProjects.get.get, { websiteProjectId });

	if (project === undefined) {
		return (
			<div className={cn('flex h-full w-full flex-col')}>
				<PageHeading backLink="/website" heading="Project" />
				<p className="text-muted-foreground text-sm">Loading…</p>
			</div>
		);
	}

	if (project === null) {
		return (
			<div className={cn('flex h-full w-full flex-col')}>
				<PageHeading backLink="/website" heading="Project" />
				<p className="text-muted-foreground text-sm">Project not found.</p>
			</div>
		);
	}

	const statusBadge = websiteProjectStatusBadge(project.status);

	return (
		<div className={cn('flex h-full w-full flex-col gap-4')}>
			<PageHeading
				backLink="/website"
				heading={project.name}
				rightSlot={
					<div className="flex items-center gap-2">
						<WebsiteProjectMediaUploadDialog
							trigger={
								<Button type="button" variant="default">
									<ImagePlus />
									Upload Images / Videos
								</Button>
							}
							websiteProjectId={websiteProjectId}
						/>
						<EditWebsiteProjectForm
							trigger={
								<Button type="button" variant="outline">
									<Pencil />
									Edit
								</Button>
							}
							websiteProjectId={websiteProjectId}
						/>
						<DeleteWebsiteProject
							projectName={project.name}
							trigger={
								<Button type="button" variant="destructive-outline">
									<Trash2 />
									Delete
								</Button>
							}
							websiteProjectId={websiteProjectId}
						/>
					</div>
				}
				titleTrailing={
					<div className="flex shrink-0 items-center gap-2">
						<Badge className="shrink-0" size="lg" variant={statusBadge.variant}>
							{statusBadge.label}
						</Badge>
						{project.completedYear === undefined ? null : (
							<Badge className="shrink-0" size="lg" variant="outline">
								{project.completedYear}
							</Badge>
						)}
						{project.include ? (
							<Badge className="shrink-0" size="lg" variant="success">
								Included
							</Badge>
						) : (
							<Badge className="shrink-0" size="lg" variant="outline">
								Hidden
							</Badge>
						)}
					</div>
				}
			/>

			<Card>
				<CardHeader>
					<CardTitle>Details</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{project.description ? (
						<p className="whitespace-pre-wrap text-sm">{project.description}</p>
					) : (
						<p className="text-muted-foreground text-sm">
							No description provided.
						</p>
					)}
					<WebsiteProjectSpecs project={project} />
				</CardContent>
			</Card>

			<WebsiteProjectGallery project={project} />
		</div>
	);
}
