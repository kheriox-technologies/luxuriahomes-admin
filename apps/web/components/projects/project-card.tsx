import {
	ArrowUpRight,
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
import Image from 'next/image';
import Link from 'next/link';
import {
	formatArea,
	resolveCardImageKey,
	type WebProject,
} from '@/lib/projects';
import { staticCdnUrl } from '@/lib/static-cdn';

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

export function ProjectCard({ project }: { project: WebProject }) {
	const imageKey = resolveCardImageKey(project);
	const imageSrc = imageKey ? staticCdnUrl(imageKey) : '/placeholder.svg';
	const chips = specChips(project);

	return (
		<Link
			className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
			href={`/projects/${project._id}`}
		>
			<div className="relative aspect-[4/3] overflow-hidden bg-muted">
				<Image
					alt={project.name}
					className="object-cover transition-transform duration-500 group-hover:scale-105"
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
					src={imageSrc}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-brand-primary/55 via-transparent to-transparent opacity-70" />
			</div>

			<div className="flex flex-1 flex-col gap-4 p-6">
				<div className="flex items-start justify-between gap-3">
					<div className="flex flex-col gap-1">
						<h3 className="font-display text-foreground text-xl leading-snug transition-colors group-hover:text-brand-accent">
							{project.name}
						</h3>
						{project.completedYear ? (
							<span className="text-muted-foreground text-sm">
								Completed {project.completedYear}
							</span>
						) : null}
					</div>
					<ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-accent" />
				</div>

				{chips.length > 0 ? (
					<div className="mt-auto flex flex-wrap items-center gap-4 border-border border-t pt-4 text-muted-foreground text-sm">
						{chips.map((chip) => (
							<span className="flex items-center gap-1.5" key={chip.label}>
								<chip.icon className="size-4 text-brand-accent" />
								{chip.value}
								<span className="sr-only">{chip.label}</span>
							</span>
						))}
					</div>
				) : null}
			</div>
		</Link>
	);
}
