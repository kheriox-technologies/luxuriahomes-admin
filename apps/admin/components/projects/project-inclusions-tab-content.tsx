'use client';

import { Card, CardPanel } from '@workspace/ui/components/card';

const SAMPLE_INCLUSIONS = [
	'Premium stone benchtops in kitchen and island',
	'900mm stainless steel appliances package',
	'Ducted reverse-cycle air conditioning',
	'Floor-to-ceiling tiling in main bathroom',
	'LED downlights throughout living spaces',
] as const;

export default function ProjectInclusionsTabContent() {
	return (
		<Card>
			<CardPanel className="space-y-3">
				<div>
					<p className="font-semibold text-foreground">Sample inclusions</p>
					<p className="text-muted-foreground text-sm">
						Placeholder content for now. You can replace this with project
						inclusion data later.
					</p>
				</div>
				<ul className="list-disc space-y-1 pl-5 text-muted-foreground text-sm">
					{SAMPLE_INCLUSIONS.map((item) => (
						<li key={item}>{item}</li>
					))}
				</ul>
			</CardPanel>
		</Card>
	);
}
