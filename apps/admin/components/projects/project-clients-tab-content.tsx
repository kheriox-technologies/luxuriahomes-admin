'use client';

import type { Doc } from '@workspace/backend/dataModel';
import { Card, CardPanel } from '@workspace/ui/components/card';
import {
	projectClientAddressLine,
	projectClientDisplayName,
	projectClientEmailPhoneLine,
} from '@/components/forms/project-form-shared';

type ProjectClient = Doc<'projects'>['clients'][number];

function ProjectClientReadOnlyCard({ client }: { client: ProjectClient }) {
	const addressLine = projectClientAddressLine(client);

	return (
		<Card>
			<CardPanel className="space-y-2 text-muted-foreground">
				<p className="font-semibold text-foreground leading-none">
					{projectClientDisplayName(client)}
				</p>
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
