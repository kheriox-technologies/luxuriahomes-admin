import {
	Bath,
	BedDouble,
	BookOpen,
	Car,
	Clapperboard,
	LandPlot,
	type LucideIcon,
	Ruler,
	ShowerHead,
	Sofa,
	Waves,
} from 'lucide-react';
import { formatArea, type WebProject } from '@/lib/projects';

interface Stat {
	icon: LucideIcon;
	label: string;
	value: string;
}

function buildStats(project: WebProject): Stat[] {
	const stats: Stat[] = [];
	const push = (icon: LucideIcon, label: string, value: number | undefined) => {
		if (value !== undefined) {
			stats.push({ icon, label, value: String(value) });
		}
	};

	push(BedDouble, 'Bedrooms', project.beds);
	push(Bath, 'Bathrooms', project.baths);
	push(ShowerHead, 'Powder Rooms', project.powder);
	push(Car, 'Car Spaces', project.cars);
	push(Sofa, 'Living Areas', project.living);
	push(BookOpen, 'Study', project.study);

	const land = formatArea(project.landArea);
	if (land) {
		stats.push({ icon: LandPlot, label: 'Land Area', value: land });
	}
	const building = formatArea(project.buildingArea);
	if (building) {
		stats.push({ icon: Ruler, label: 'Building Area', value: building });
	}
	return stats;
}

export function ProjectStats({ project }: { project: WebProject }) {
	const stats = buildStats(project);
	const features: { icon: LucideIcon; label: string }[] = [];
	if (project.hasPool) {
		features.push({ icon: Waves, label: 'Swimming Pool' });
	}
	if (project.hasMediaRoom) {
		features.push({ icon: Clapperboard, label: 'Media Room' });
	}

	if (stats.length === 0 && features.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-col gap-6">
			{stats.length > 0 ? (
				<dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-4">
					{stats.map((stat) => (
						<div className="flex flex-col gap-2 bg-card p-5" key={stat.label}>
							<stat.icon className="size-5 text-brand-accent" />
							<dd className="font-display text-foreground text-xl">
								{stat.value}
							</dd>
							<dt className="text-muted-foreground text-xs uppercase tracking-wide">
								{stat.label}
							</dt>
						</div>
					))}
				</dl>
			) : null}

			{features.length > 0 ? (
				<div className="flex flex-wrap gap-3">
					{features.map((feature) => (
						<span
							className="inline-flex items-center gap-2 rounded-full border border-brand-accent/30 bg-brand-accent/5 px-4 py-2 font-medium text-foreground text-sm"
							key={feature.label}
						>
							<feature.icon className="size-4 text-brand-accent" />
							{feature.label}
						</span>
					))}
				</div>
			) : null}
		</div>
	);
}
