/**
 * DEV-only seed for App Store screenshots.
 *
 * Creates a set of clearly-fictional projects (plus schedule stages/tasks,
 * flooring inclusions, and documents on the lead project) so the mobile app's
 * Dashboard, Projects, Schedule, Inclusions, and Documents screens render as a
 * realistic in-use app for App Store captures. No real customer data.
 *
 * All dates are computed relative to the run time so the Dashboard's rolling
 * window (default 1 week) always shows the intended overdue + upcoming tasks,
 * regardless of when the seed is run.
 *
 * Run against DEV only:  npx convex run devSeed:run
 * Undo:                  npx convex run devSeed:teardown
 */

import type { Id } from './_generated/dataModel';
import type { MutationCtx } from './_generated/server';
import { internalMutation } from './_generated/server';
import { buildProjectSearchText, buildSearchText } from './lib/buildSearchText';

const DAY = 86_400_000;

type ScheduleStatus = 'Pending' | 'In Progress' | 'Complete';
type InclusionClass = 'Standard' | 'Gold' | 'Platinum';
type InclusionStatus = 'Under Review' | 'Approved';

const FILE_EXTENSION = /\.[^.]+$/;

const FLOORING_CATEGORY_NAME = 'Flooring';
const FLOORING_CATEGORY_CODE = 'FLR';

// Marker so teardown only ever removes rows this seed created.
const SEED_CLIENT_EMAIL = 'sample.owner@luxuriahomes-demo.test';
const SEED_UPLOADER = 'priya@luxuriahomes.com.au';

interface TaskSeed {
	endOff: number; // days from now
	name: string;
	startOff: number; // days from now
	status: ScheduleStatus;
}

interface StageSeed {
	name: string;
	order: number;
	status: ScheduleStatus;
	tasks: TaskSeed[];
}

interface ProjectSeed {
	name: string;
	postcode: string;
	quotePrice?: number;
	received?: number;
	stages: StageSeed[];
	startOffDays: number;
	status: 'not_started' | 'in_progress' | 'completed';
	street: string;
	suburb: string;
}

// Lead project — appears in the Dashboard, Schedule, Inclusions, Documents,
// and iPad screenshots. Rich schedule with one overdue + several upcoming.
const RIVERSIDE: ProjectSeed = {
	name: 'Riverside Residence',
	street: '14 Riverbank Dr',
	suburb: 'Brookwater',
	postcode: '4300',
	status: 'in_progress',
	startOffDays: -46,
	quotePrice: 890_000,
	received: 445_000,
	stages: [
		{
			name: 'Slab & Footings',
			status: 'Complete',
			order: 1,
			tasks: [
				{
					name: 'Site cut & excavation',
					status: 'Complete',
					startOff: -46,
					endOff: -43,
				},
				{
					name: 'Formwork & steel',
					status: 'Complete',
					startOff: -42,
					endOff: -38,
				},
				{ name: 'Slab pour', status: 'Complete', startOff: -37, endOff: -35 },
				{
					name: 'Slab cure & inspection',
					status: 'Complete',
					startOff: -34,
					endOff: -31,
				},
			],
		},
		{
			name: 'Framing',
			status: 'In Progress',
			order: 2,
			tasks: [
				{ name: 'Wall frames', status: 'Complete', startOff: -13, endOff: -8 },
				{
					name: 'Roof trusses',
					status: 'In Progress',
					startOff: -3,
					endOff: 4,
				},
				{ name: 'Frame inspection', status: 'Pending', startOff: 2, endOff: 3 },
				{ name: 'Frame sign-off', status: 'Pending', startOff: 6, endOff: 7 },
			],
		},
		{
			name: 'Wet Areas',
			status: 'In Progress',
			order: 3,
			tasks: [
				{
					name: 'Waterproofing prep',
					status: 'Complete',
					startOff: -9,
					endOff: -7,
				},
				// Overdue: end date has passed and it isn't Complete.
				{
					name: 'Waterproofing sign-off',
					status: 'In Progress',
					startOff: -6,
					endOff: -3,
				},
			],
		},
		{
			name: 'Brickwork',
			status: 'Pending',
			order: 4,
			tasks: [
				{ name: 'Brick delivery', status: 'Pending', startOff: 3, endOff: 4 },
				{ name: 'Bricklaying', status: 'Pending', startOff: 8, endOff: 16 },
			],
		},
		{
			name: 'Roofing & Cladding',
			status: 'Pending',
			order: 5,
			tasks: [
				{ name: 'Roof battens', status: 'Pending', startOff: 18, endOff: 22 },
				{
					name: 'Cladding install',
					status: 'Pending',
					startOff: 23,
					endOff: 31,
				},
			],
		},
	],
};

// Supporting projects — populate the Projects list and give the Dashboard
// cards varied overdue/upcoming counts.
const OTHER_PROJECTS: ProjectSeed[] = [
	{
		name: 'Hillcrest Estate',
		street: '6 Summit Ct',
		suburb: 'Springfield',
		postcode: '4300',
		status: 'in_progress',
		startOffDays: -20,
		quotePrice: 760_000,
		received: 228_000,
		stages: [
			{
				name: 'Framing',
				status: 'In Progress',
				order: 1,
				tasks: [
					{ name: 'Wall frames', status: 'Complete', startOff: -6, endOff: -2 },
					{
						name: 'Roof trusses',
						status: 'In Progress',
						startOff: 1,
						endOff: 5,
					},
					{
						name: 'Frame inspection',
						status: 'Pending',
						startOff: 4,
						endOff: 5,
					},
				],
			},
			{
				name: 'Fit-out',
				status: 'Pending',
				order: 2,
				tasks: [
					{
						name: 'Cabinetry measure',
						status: 'Pending',
						startOff: 6,
						endOff: 7,
					},
				],
			},
		],
	},
	{
		name: 'Coastal Haven',
		street: '22 Marine Pde',
		suburb: 'Redland Bay',
		postcode: '4165',
		status: 'in_progress',
		startOffDays: -34,
		quotePrice: 1_240_000,
		received: 620_000,
		stages: [
			{
				name: 'Roofing & Cladding',
				status: 'In Progress',
				order: 1,
				tasks: [
					// Two overdue tasks.
					{
						name: 'Gutter install',
						status: 'In Progress',
						startOff: -8,
						endOff: -4,
					},
					{
						name: 'Roof plumbing sign-off',
						status: 'Pending',
						startOff: -5,
						endOff: -2,
					},
					{
						name: 'Cladding install',
						status: 'In Progress',
						startOff: -1,
						endOff: 3,
					},
				],
			},
			{
				name: 'Windows & Doors',
				status: 'Pending',
				order: 2,
				tasks: [
					{
						name: 'Window delivery',
						status: 'Pending',
						startOff: 2,
						endOff: 3,
					},
					{ name: 'Door hanging', status: 'Pending', startOff: 5, endOff: 7 },
				],
			},
		],
	},
	{
		name: 'Camp Hill Residence',
		street: '9 Ridge St',
		suburb: 'Camp Hill',
		postcode: '4152',
		status: 'in_progress',
		startOffDays: -12,
		quotePrice: 980_000,
		received: 196_000,
		stages: [
			{
				name: 'Slab & Footings',
				status: 'In Progress',
				order: 1,
				tasks: [
					{
						name: 'Formwork & steel',
						status: 'In Progress',
						startOff: -2,
						endOff: 2,
					},
					{ name: 'Slab pour', status: 'Pending', startOff: 4, endOff: 5 },
				],
			},
		],
	},
	{
		name: 'Wavell Heights Home',
		street: '31 Kimberley St',
		suburb: 'Wavell Heights',
		postcode: '4012',
		status: 'not_started',
		startOffDays: 5,
		quotePrice: 720_000,
		received: 0,
		stages: [
			{
				name: 'Site Establishment',
				status: 'Pending',
				order: 1,
				tasks: [
					{ name: 'Site set-out', status: 'Pending', startOff: 5, endOff: 6 },
				],
			},
		],
	},
];

interface InclusionSeed {
	class: InclusionClass;
	code: string;
	color: string;
	costPrice: number;
	models: string[];
	salePrice: number;
	status: InclusionStatus;
	title: string;
	variationPrice?: number;
	vendor: string;
}

// Flooring selections shown on the Inclusions screen (variation total = $4,250).
const RIVERSIDE_INCLUSIONS: InclusionSeed[] = [
	{
		title: 'Engineered Oak — Coastal',
		class: 'Gold',
		status: 'Approved',
		code: 'FLR-014',
		vendor: 'Harwoods',
		models: ['220mm plank'],
		color: 'Natural Matte',
		costPrice: 9800,
		salePrice: 14_050,
		variationPrice: 2500,
	},
	{
		title: 'Porcelain Tile — Carrara',
		class: 'Standard',
		status: 'Under Review',
		code: 'FLR-021',
		vendor: 'Beaumont',
		models: ['600×600'],
		color: 'Polished White',
		costPrice: 6200,
		salePrice: 8400,
	},
	{
		title: 'Wool Loop Carpet — Dune',
		class: 'Gold',
		status: 'Approved',
		code: 'FLR-033',
		vendor: 'Godfrey Hirst',
		models: ['Bedrooms'],
		color: 'Warm Sand',
		costPrice: 4100,
		salePrice: 6350,
		variationPrice: 1750,
	},
];

interface DocumentSeed {
	mimeType: string;
	name: string;
	size: number;
	uploadedOff: number; // days from now
}

const RIVERSIDE_DOCUMENTS: DocumentSeed[] = [
	{
		name: 'Building Contract.pdf',
		mimeType: 'application/pdf',
		size: 1_468_006,
		uploadedOff: -190,
	},
	{
		name: 'Floor Plans — Rev C.pdf',
		mimeType: 'application/pdf',
		size: 3_355_443,
		uploadedOff: -28,
	},
	{
		name: 'Site Progress — Framing.jpg',
		mimeType: 'image/jpeg',
		size: 839_680,
		uploadedOff: -17,
	},
	{
		name: 'Colour Selections.pdf',
		mimeType: 'application/pdf',
		size: 655_360,
		uploadedOff: -15,
	},
	{
		name: 'Engineering Certificate.pdf',
		mimeType: 'application/pdf',
		size: 524_288,
		uploadedOff: -12,
	},
];

function toKebab(value: string): string {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function taskDurationDays(startOff: number, endOff: number): number {
	return Math.max(1, Math.round(endOff - startOff) + 1);
}

async function insertProject(
	ctx: MutationCtx,
	seed: ProjectSeed,
	now: number
): Promise<Id<'projects'>> {
	const address = {
		street: seed.street,
		suburb: seed.suburb,
		state: 'QLD' as const,
		postcode: seed.postcode,
	};
	const clients = [
		{
			firstName: 'Sample',
			lastName: 'Owner',
			email: SEED_CLIENT_EMAIL,
			phone: '0400 000 000',
		},
	];

	const projectId = await ctx.db.insert('projects', {
		name: seed.name,
		address,
		status: seed.status,
		clients,
		startDate: now + seed.startOffDays * DAY,
		quotePrice: seed.quotePrice,
		received: seed.received,
		searchText: buildProjectSearchText({
			name: seed.name,
			address,
			status: seed.status,
			clients,
		}),
	});

	for (const stage of seed.stages) {
		const stageStart =
			now + Math.min(...stage.tasks.map((t) => t.startOff)) * DAY;
		const stageEnd = now + Math.max(...stage.tasks.map((t) => t.endOff)) * DAY;
		const stageId = await ctx.db.insert('projectStages', {
			projectId,
			name: stage.name,
			order: stage.order,
			startDate: stageStart,
			endDate: stageEnd,
			status: stage.status,
		});

		let order = 1;
		for (const task of stage.tasks) {
			await ctx.db.insert('projectTasks', {
				projectId,
				stageId,
				name: task.name,
				durationDays: taskDurationDays(task.startOff, task.endOff),
				order,
				startDate: now + task.startOff * DAY,
				endDate: now + task.endOff * DAY,
				status: task.status,
			});
			order++;
		}
	}

	return projectId;
}

async function getOrCreateFlooringCategory(
	ctx: MutationCtx
): Promise<Id<'inclusionCategories'>> {
	const existing = await ctx.db
		.query('inclusionCategories')
		.withIndex('by_name', (q) => q.eq('name', FLOORING_CATEGORY_NAME))
		.first();
	if (existing) {
		return existing._id;
	}
	return await ctx.db.insert('inclusionCategories', {
		name: FLOORING_CATEGORY_NAME,
		code: FLOORING_CATEGORY_CODE,
		count: RIVERSIDE_INCLUSIONS.length,
		searchText: buildSearchText([
			FLOORING_CATEGORY_NAME,
			FLOORING_CATEGORY_CODE,
		]),
	});
}

async function seedRiversideExtras(
	ctx: MutationCtx,
	projectId: Id<'projects'>,
	now: number
): Promise<void> {
	const categoryId = await getOrCreateFlooringCategory(ctx);

	for (const inc of RIVERSIDE_INCLUSIONS) {
		await ctx.db.insert('projectInclusions', {
			projectId,
			title: inc.title,
			categoryId,
			class: inc.class,
			code: inc.code,
			vendor: inc.vendor,
			models: inc.models,
			color: inc.color,
			costPrice: inc.costPrice,
			salePrice: inc.salePrice,
			variationPrice: inc.variationPrice,
			status: inc.status,
			searchText: buildSearchText([
				inc.title,
				inc.code,
				inc.vendor,
				inc.color,
				FLOORING_CATEGORY_NAME,
				...inc.models,
			]),
		});
	}

	for (const doc of RIVERSIDE_DOCUMENTS) {
		const kebabName = toKebab(doc.name.replace(FILE_EXTENSION, ''));
		await ctx.db.insert('projectDocuments', {
			projectId,
			name: doc.name,
			kebabName,
			s3Key: `dev-seed/${toKebab(RIVERSIDE.name)}/${kebabName}`,
			folderPath: '',
			size: doc.size,
			mimeType: doc.mimeType,
			uploadedBy: SEED_UPLOADER,
			uploadedAt: now + doc.uploadedOff * DAY,
		});
	}
}

const ALL_SEED_PROJECTS = [RIVERSIDE, ...OTHER_PROJECTS];
const SEED_PROJECT_KEYS = new Set(
	ALL_SEED_PROJECTS.map((p) => `${p.name}|${p.street}`)
);

export const run = internalMutation({
	args: {},
	handler: async (ctx) => {
		// Idempotency guard: skip if the lead marker project already exists.
		const existing = await ctx.db
			.query('projects')
			.filter((q) => q.eq(q.field('name'), RIVERSIDE.name))
			.first();
		if (existing && existing.address.street === RIVERSIDE.street) {
			return {
				skipped: true,
				message:
					'Seed already present (Riverside Residence found). Run devSeed:teardown first to reseed.',
			};
		}

		const now = Date.now();

		const riversideId = await insertProject(ctx, RIVERSIDE, now);
		await seedRiversideExtras(ctx, riversideId, now);

		for (const project of OTHER_PROJECTS) {
			await insertProject(ctx, project, now);
		}

		return {
			inserted: true,
			projects: ALL_SEED_PROJECTS.length,
			leadProject: RIVERSIDE.name,
		};
	},
});

export const teardown = internalMutation({
	args: {},
	handler: async (ctx) => {
		const projects = await ctx.db.query('projects').collect();
		const targets = projects.filter((p) =>
			SEED_PROJECT_KEYS.has(`${p.name}|${p.address.street}`)
		);

		let removedProjects = 0;
		let removedRows = 0;

		for (const project of targets) {
			const stages = await ctx.db
				.query('projectStages')
				.withIndex('by_project', (q) => q.eq('projectId', project._id))
				.collect();
			const tasks = await ctx.db
				.query('projectTasks')
				.withIndex('by_project', (q) => q.eq('projectId', project._id))
				.collect();
			const inclusions = await ctx.db
				.query('projectInclusions')
				.withIndex('by_project', (q) => q.eq('projectId', project._id))
				.collect();
			const documents = await ctx.db
				.query('projectDocuments')
				.withIndex('by_project', (q) => q.eq('projectId', project._id))
				.collect();

			for (const row of [...stages, ...tasks, ...inclusions, ...documents]) {
				await ctx.db.delete(row._id);
				removedRows++;
			}
			await ctx.db.delete(project._id);
			removedProjects++;
		}

		return { removedProjects, removedRows };
	},
});
