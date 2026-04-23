'use client';

import type { Doc } from '@workspace/backend/dataModel';
import {
	Card,
	CardFrame,
	CardFrameHeader,
	CardFrameTitle,
	CardPanel,
} from '@workspace/ui/components/card';
import {
	projectClientAddressLine,
	projectClientDisplayName,
	projectClientEmailPhoneLine,
} from '@/components/projects/project-form-shared';

type ProjectClient = Doc<'projects'>['clients'][number];

function ProjectClientReadOnlyCard({ client }: { client: ProjectClient }) {
	const addressLine = projectClientAddressLine(client);

	return (
		<CardFrame>
			<CardFrameHeader className="flex flex-row items-center justify-between gap-3">
				<CardFrameTitle className="min-w-0 truncate leading-snug">
					{projectClientDisplayName(client)}
				</CardFrameTitle>
			</CardFrameHeader>
			<Card>
				<CardPanel className="space-y-2 text-muted-foreground">
					<p className="text-sm leading-snug">
						{projectClientEmailPhoneLine(client)}
					</p>
					<p className="text-sm leading-snug">
						{addressLine || (
							<span className="text-muted-foreground/72">No address</span>
						)}
					</p>
				</CardPanel>
			</Card>
		</CardFrame>
	);
}

export default function ProjectClientsTabContent({
	clients,
}: {
	clients: ProjectClient[];
}) {
	if (!clients.length) {
		return (
			<p className="text-muted-foreground text-sm">
				No clients have been added to this project yet.
			</p>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			{clients.map((client, index) => (
				<ProjectClientReadOnlyCard
					client={client}
					key={`${client.email}-${client.phone}-${index}`}
				/>
			))}
		</div>
	);
}
