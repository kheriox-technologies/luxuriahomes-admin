/**
 * Single source of truth for the sponsor banners.
 *
 * Values are transcribed from the live app so the banners stay on-brand:
 *   palettes  -> apps/web/app/site.css + docs/brand-palette.md
 *   copy      -> apps/web/lib/site.ts (SITE_COPY, SERVICES) + apps/web/app/layout.tsx
 *   contact   -> apps/web/.env.prod (production values)
 *   project   -> Convex `websiteProjects`, fetched by fetch-assets.mjs
 *
 * Edit anything here and re-run `node render.mjs` to regenerate the banners.
 */

/** Canvas sizes. Keys are used in output filenames. */
export const RATIOS = {
	'16x9': { width: 1920, height: 1080 },
	'9x16': { width: 1080, height: 1920 },
};

/**
 * The two approved brand worlds. `ground` is the solid type-bearing surface,
 * `ink` the text on it, `accent` the small-caps/rule colour.
 */
export const PALETTES = {
	navy: {
		name: 'navy',
		ground: '#15283a',
		groundDeep: '#0e1c29',
		groundSoft: '#1b3047',
		ink: '#f8edb8',
		inkMuted: 'rgba(248, 237, 184, 0.72)',
		inkFaint: 'rgba(248, 237, 184, 0.42)',
		accent: '#c79a3b',
		rule: 'rgba(248, 237, 184, 0.26)',
		/** Tint laid over photography so it sits in the same world as the ground. */
		photoScrim:
			'linear-gradient(to top, rgba(14, 28, 41, 0.72) 0%, rgba(14, 28, 41, 0.18) 45%, rgba(14, 28, 41, 0.34) 100%)',
	},
	linen: {
		name: 'linen',
		ground: '#f5ebe0',
		groundDeep: '#e8dccd',
		groundSoft: '#fefcfa',
		ink: '#2b2927',
		inkMuted: 'rgba(43, 41, 39, 0.68)',
		inkFaint: 'rgba(43, 41, 39, 0.38)',
		accent: '#8a6d3a',
		rule: 'rgba(43, 41, 39, 0.18)',
		photoScrim:
			'linear-gradient(to top, rgba(43, 41, 39, 0.28) 0%, rgba(43, 41, 39, 0.04) 50%, rgba(43, 41, 39, 0.16) 100%)',
	},
};

/** Verbatim from apps/web/lib/site.ts and the site metadata. */
export const COPY = {
	tagline: ['Designing dreams,', 'building lifestyles'],
	secondary: 'Where elegance meets construction excellence',
	locale: 'Luxury Home Builders · South East Queensland',
	description:
		'Luxuria Homes Australia crafts unparalleled luxury living spaces — custom homes, house & land packages, knock-down rebuilds, duplexes and town houses across South East Queensland.',
	servicesTitle: 'Crafted solutions for every vision',
	servicesSubtext:
		'From turnkey house and land packages to bespoke knock-down rebuilds, we deliver homes that redefine opulence.',
	projectsTitle: 'Recently completed homes',
	projectsSubtext:
		'A selection of luxury residences we have designed and delivered across South East Queensland.',
	ctaTitle: 'Start building with us',
	ctaSubtext:
		"Let's bring your dream home to life. Get in touch with our team for a no-obligation consultation.",
};

/** The four SERVICES entries from apps/web/lib/site.ts. */
export const SERVICES = [
	{
		title: 'House & Land Packages',
		description:
			'Thoughtfully designed homes paired with prime locations — turnkey packages with customisable floor plans.',
	},
	{
		title: 'Knock Down & Rebuild',
		description:
			'Replace an ageing structure with a bespoke, custom-designed home on the land you already know and love.',
	},
	{
		title: 'Dual Occupancy & Duplex',
		description:
			'Maximise space and investment returns with tailored duplex designs for homeowners and investors alike.',
	},
	{
		title: 'Town Houses',
		description:
			'Contemporary townhomes that blend style, functionality and efficiency for elevated urban living.',
	},
];

/** Production contact details from apps/web/.env.prod. */
export const CONTACT = {
	phones: ['0433 196 100', '0482 794 242'],
	email: 'admin@luxuriahomes.com.au',
	website: 'luxuriahomes.com.au',
	address: 'Unit 7, 21 Technology Drive, Augustine Heights QLD 4300',
	qbcc: 'QBCC Licence 15405403',
};

/**
 * The featured completed project. Mirrors the Convex `websiteProjects` record;
 * fetch-assets.mjs verifies these values still match the deployment.
 */
export const FEATURED = {
	name: 'Camp Hill',
	completedYear: 2026,
	region: 'Brisbane, Queensland',
	specs: [
		'5 Bed',
		'3 Bath',
		'2 Car',
		'347m² Home',
		'406m² Land',
		'Pool',
		'Media Room',
	],
	blurb:
		"An inspiring statement of opulence and design, this residence balances organic fluidity with raw refinement — architecture and craftsmanship forming a sculptural showpiece in one of Camp Hill's most coveted precincts.",
};

/**
 * Photographs chosen by eye from the 22 available frames, pinned by filename.
 * fetch-assets.mjs downloads every frame; these are the ones the banners use.
 */
export const PHOTOS = {
	facadeDusk: '22_5982f82b-6627-4ca9-bc0d-d18c9084af99.jpg',
	courtyard: '12_c32f6c63-0891-445b-89ee-107ea3b53bf9.jpg',
	openPlan: '14_52c10ab5-7ea3-4168-a7a4-896a48a872ba.jpg',
	kitchenLiving: '11_4691605b-6ae9-4641-aceb-32d203d71f90.jpg',
	bathTub: '08_5bb06025-21d5-475c-afdc-c5b7006cb891.jpg',
	aerialPool: '21_a28fb626-5028-486e-84f8-7d001dab8da7.jpg',
	staircase: '18_d9f2491d-7083-489b-97b2-10abdb88c362.jpg',
	lounge: '09_001d6c9c-bd97-4ef4-bfe3-8b7c119eef7c.jpg',
};

/** Lucide icon paths (24x24, stroke). Matches the icon set used by apps/web. */
export const ICONS = {
	phone:
		'<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',
	mail: '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>',
	pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
	globe:
		'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
	badge:
		'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
};
