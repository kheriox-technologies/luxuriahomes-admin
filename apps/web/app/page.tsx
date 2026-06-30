import { api } from '@workspace/backend/api';
import { fetchQuery } from 'convex/nextjs';
import { AboutSection } from '@/components/home/about-section';
import { CompletedProjects } from '@/components/home/completed-projects';
import { CtaBand } from '@/components/home/cta-band';
import { Hero } from '@/components/home/hero';
import { ServicesSection } from '@/components/home/services-section';
import { WhyChooseUs } from '@/components/home/why-choose-us';
import { resolveCardImageKey } from '@/lib/projects';

export const revalidate = 300;

export default async function HomePage() {
	const [banners, completed, published] = await Promise.all([
		fetchQuery(api.web.banners.list, {}),
		fetchQuery(api.web.projects.listCompleted, {}),
		fetchQuery(api.web.projects.listPublished, {}),
	]);

	const heroBackgroundKeys = banners.map((banner) => banner.key);
	const aboutImageKey = completed.map(resolveCardImageKey).find(Boolean);
	const inProgressCount = published.filter(
		(p) => p.status === 'in_progress'
	).length;

	return (
		<>
			<Hero
				backgroundKeys={heroBackgroundKeys}
				completedCount={completed.length}
				inProgressCount={inProgressCount}
			/>
			<ServicesSection />
			<AboutSection imageKey={aboutImageKey} />
			<CompletedProjects projects={completed} />
			<WhyChooseUs />
			<CtaBand />
		</>
	);
}
