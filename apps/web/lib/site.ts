import {
	Award,
	Building,
	Building2,
	Hammer,
	HeartHandshake,
	Home,
	Lightbulb,
	type LucideIcon,
	ShieldCheck,
} from 'lucide-react';
import type { Route } from 'next';

export interface NavLink {
	href: Route;
	label: string;
}

export const NAV_LINKS: NavLink[] = [
	{ label: 'Home', href: '/' },
	{ label: 'Projects', href: '/projects' },
	{ label: 'About Us', href: '/about' },
	{ label: 'Contact', href: '/contact' },
];

export interface Service {
	description: string;
	icon: LucideIcon;
	title: string;
}

export const SERVICES: Service[] = [
	{
		title: 'House & Land Packages',
		description:
			'Thoughtfully designed homes paired with prime locations — turnkey packages with customisable floor plans for effortless modern living.',
		icon: Home,
	},
	{
		title: 'Knock Down & Rebuild',
		description:
			'Replace an ageing structure with a bespoke, custom-designed home on the land you already know and love.',
		icon: Hammer,
	},
	{
		title: 'Dual Occupancy & Duplex',
		description:
			'Maximise space and investment returns with tailored duplex designs for homeowners and investors alike.',
		icon: Building2,
	},
	{
		title: 'Town Houses',
		description:
			'Contemporary townhomes that blend style, functionality and efficiency for elevated urban living.',
		icon: Building,
	},
];

export interface Differentiator {
	description: string;
	icon: LucideIcon;
	title: string;
}

export const DIFFERENTIATORS: Differentiator[] = [
	{
		title: 'Expertise',
		description:
			'A team of seasoned professionals brings a wealth of knowledge and craftsmanship to every project.',
		icon: Award,
	},
	{
		title: 'Uncompromising Quality',
		description:
			'We never compromise on quality, ensuring every detail meets our exacting standards.',
		icon: ShieldCheck,
	},
	{
		title: 'Innovation',
		description:
			'We stay ahead of industry trends and embrace emerging construction technologies.',
		icon: Lightbulb,
	},
	{
		title: 'Customer Focus',
		description:
			'Your satisfaction is our priority. We work closely with you to understand your needs and exceed expectations.',
		icon: HeartHandshake,
	},
];

export const SERVICE_AREAS = [
	{
		title: 'Residential',
		description: 'Custom luxury homes, knock-down rebuilds and renovations.',
	},
	{
		title: 'Commercial',
		description: 'Offices, retail and hospitality fit-outs and builds.',
	},
	{
		title: 'Industrial',
		description: 'Robust, functional industrial construction solutions.',
	},
];

export const SITE_COPY = {
	heroEyebrow: 'Luxury Home Builders · South East Queensland',
	heroTagline: 'Experience the epitome of luxury',
	heroHeadline: 'Designing dreams,\nbuilding lifestyles',
	heroSubtext:
		'Where elegance meets construction excellence. Luxuria Homes Australia crafts unparalleled living spaces that redefine opulence and sophistication.',
	aboutEyebrow: 'About Luxuria Homes',
	aboutTitle: 'We transform visions into reality',
	aboutLead:
		'With a passion for precision and a commitment to excellence, we are your trusted partner in the world of construction and development.',
	aboutBody:
		'Luxuria Homes Australia is a leading construction firm recognised for innovation, quality craftsmanship and dedication to customer satisfaction — blending cutting-edge architectural design with meticulous attention to detail across residential, commercial and industrial projects.',
	mission:
		'To build with integrity, creativity and precision. We believe in more than just constructing buildings — we build relationships, trust, and a future where dreams take shape.',
	servicesEyebrow: 'What We Do',
	servicesTitle: 'Crafted solutions for every vision',
	servicesSubtext:
		'From turnkey house and land packages to bespoke knock-down rebuilds, we deliver homes that redefine opulence.',
	projectsEyebrow: 'Our Portfolio',
	projectsTitle: 'Recently completed homes',
	projectsSubtext:
		'A selection of luxury residences we have designed and delivered across South East Queensland.',
	whyEyebrow: 'Why Luxuria Homes',
	whyTitle: 'Building quality homes that redefine opulence',
	ctaTitle: 'Start building with us',
	ctaSubtext:
		'Let’s bring your dream home to life. Get in touch with our team for a no-obligation consultation.',
} as const;
