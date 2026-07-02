import { buttonVariants } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { ArrowLeftRight } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { getAccessibleSurfaces } from '@/actions/auth';
import type { Surface } from '@/config/roles';

interface SurfaceSwitcherProps {
	current: Surface;
}

/**
 * Renders links to the other surfaces the user may enter (e.g. an
 * admin+client user sees "Client Portal" in the admin topbar). Renders
 * nothing for single-surface users.
 */
const SurfaceSwitcher = async ({ current }: SurfaceSwitcherProps) => {
	const surfaces = await getAccessibleSurfaces();
	const others = surfaces.filter((s) => s.surface !== current);
	if (others.length === 0) {
		return null;
	}
	return (
		<div className="flex items-center gap-2">
			{others.map((s) => (
				<Link
					className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
					href={s.home as Route}
					key={s.surface}
				>
					<ArrowLeftRight className="size-4" />
					{s.label}
				</Link>
			))}
		</div>
	);
};

export default SurfaceSwitcher;
