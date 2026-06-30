import { Badge } from '@workspace/ui/components/badge';
import {
	Bath,
	BedDouble,
	BookOpen,
	Car,
	LandPlot,
	Ruler,
	Sofa,
	Toilet,
	Tv,
	Waves,
} from 'lucide-react';
import { formatArea, statusLabel, type WebProject } from '@/lib/projects';

interface SpecChip {
	icon: typeof BedDouble;
	label: string;
	value: string;
}

function specChips(project: WebProject): SpecChip[] {
	const chips: SpecChip[] = [];
	if (project.beds !== undefined) {
		chips.push({ icon: BedDouble, value: `${project.beds}`, label: 'beds' });
	}
	if (project.baths !== undefined) {
		chips.push({ icon: Bath, value: `${project.baths}`, label: 'baths' });
	}
	if (project.powder !== undefined) {
		chips.push({
			icon: Toilet,
			value: `${project.powder}`,
			label: 'powder rooms',
		});
	}
	if (project.cars !== undefined) {
		chips.push({ icon: Car, value: `${project.cars}`, label: 'car spaces' });
	}
	if (project.living !== undefined) {
		chips.push({
			icon: Sofa,
			value: `${project.living}`,
			label: 'living areas',
		});
	}
	if (project.study !== undefined) {
		chips.push({ icon: BookOpen, value: `${project.study}`, label: 'studies' });
	}
	const landArea = formatArea(project.landArea);
	if (landArea) {
		chips.push({ icon: LandPlot, value: landArea, label: 'land area' });
	}
	const buildingArea = formatArea(project.buildingArea);
	if (buildingArea) {
		chips.push({ icon: Ruler, value: buildingArea, label: 'building area' });
	}
	if (project.hasPool) {
		chips.push({ icon: Waves, value: 'Pool', label: 'pool' });
	}
	if (project.hasMediaRoom) {
		chips.push({ icon: Tv, value: 'Media Room', label: 'media room' });
	}
	return chips;
}

/**
 * Minimal, image-less card for in-progress projects. Not a link — these have no
 * detail page yet. Shows the project name, status and whatever specs exist.
 */
export function ProjectMiniCard({ project }: { project: WebProject }) {
	const chips = specChips(project);

	return (
		<div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
			<div className="flex items-start justify-between gap-3">
				<h3 className="font-display text-foreground text-xl leading-snug">
					{project.name}
				</h3>
				<Badge className="shrink-0 bg-brand-navy/90 text-brand-cream" size="lg">
					{statusLabel(project.status)}
				</Badge>
			</div>

			{project.description ? (
				<p className="text-muted-foreground text-sm leading-relaxed">
					{project.description}
				</p>
			) : null}

			{chips.length > 0 ? (
				<div className="mt-auto flex flex-wrap items-center gap-4 border-border border-t pt-4 text-muted-foreground text-sm">
					{chips.map((chip) => (
						<span className="flex items-center gap-1.5" key={chip.label}>
							<chip.icon className="size-4 text-brand-gold" />
							{chip.value}
							<span className="sr-only">{chip.label}</span>
						</span>
					))}
				</div>
			) : null}
		</div>
	);
}
