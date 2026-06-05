import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { zodToConvex } from 'convex-helpers/server/zod';
import { z } from 'zod';
import {
	australianAddressValidator,
	projectClientValidator,
	projectStatusValidator,
} from './projects/shared';

export const permissionValidator = z.object({
	roleName: z.string(),
	paths: z.array(z.string()).default([]),
	actions: z.array(z.string()).default([]),
});

export const inclusionVariantClassValidator = v.union(
	v.literal('Standard'),
	v.literal('Gold'),
	v.literal('Platinum')
);

export const projectInclusionStatusValidator = v.union(
	v.literal('Under Review'),
	v.literal('Approved')
);

export const stageDependencyTypeValidator = v.union(
	v.literal('after'),
	v.literal('alongWith')
);

export const taskDependencyTypeValidator = v.union(
	v.literal('after'),
	v.literal('alongWith')
);

// Schema definition
export default defineSchema({
	permissions: defineTable(zodToConvex(permissionValidator)).index(
		'by_role_name',
		['roleName']
	),
	inclusionCategories: defineTable({
		name: v.string(),
		code: v.string(),
		count: v.number(),
		searchText: v.string(),
	})
		.index('by_name', ['name'])
		.index('by_code', ['code'])
		.searchIndex('search_inclusion_categories', { searchField: 'searchText' }),
	inclusions: defineTable({
		title: v.string(),
		categoryId: v.id('inclusionCategories'),
		searchText: v.string(),
		variantCount: v.number(),
	})
		.index('by_category', ['categoryId'])
		.searchIndex('search_inclusions', { searchField: 'searchText' }),
	inclusionVariants: defineTable({
		inclusionId: v.id('inclusions'),
		class: inclusionVariantClassValidator,
		code: v.string(),
		vendor: v.string(),
		models: v.array(v.string()),
		color: v.optional(v.string()),
		details: v.optional(v.string()),
		image: v.optional(v.string()),
		storageId: v.optional(v.id('_storage')),
		link: v.optional(v.string()),
		costPrice: v.number(),
		salePrice: v.number(),
		searchText: v.string(),
	})
		.index('by_inclusion', ['inclusionId'])
		.index('by_code', ['code'])
		.searchIndex('search_inclusion_variants', { searchField: 'searchText' }),
	projectInclusions: defineTable({
		projectId: v.id('projects'),
		title: v.string(),
		categoryId: v.id('inclusionCategories'),
		class: inclusionVariantClassValidator,
		code: v.string(),
		vendor: v.string(),
		models: v.array(v.string()),
		color: v.optional(v.string()),
		details: v.optional(v.string()),
		image: v.optional(v.string()),
		storageId: v.optional(v.id('_storage')),
		link: v.optional(v.string()),
		costPrice: v.number(),
		salePrice: v.number(),
		variationCostPrice: v.optional(v.number()),
		variationSalePrice: v.optional(v.number()),
		searchText: v.string(),
		status: v.optional(projectInclusionStatusValidator),
	})
		.index('by_project', ['projectId'])
		.searchIndex('search_project_inclusions', {
			searchField: 'searchText',
			filterFields: ['projectId'],
		}),
	projectInclusionNotes: defineTable({
		projectInclusionId: v.id('projectInclusions'),
		timestamp: v.number(),
		addedBy: v.string(),
		note: v.string(),
	}).index('by_project_inclusion', ['projectInclusionId']),
	projects: defineTable({
		name: v.string(),
		address: australianAddressValidator,
		status: projectStatusValidator,
		clients: v.array(projectClientValidator),
		startDate: v.optional(v.number()),
		searchText: v.string(),
	}).searchIndex('search_projects', { searchField: 'searchText' }),
	stages: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
		taskCount: v.number(),
		totalDuration: v.number(),
		displayOrder: v.number(),
		dependsOn: v.array(
			v.object({
				stageId: v.id('stages'),
				type: stageDependencyTypeValidator,
			})
		),
		searchText: v.string(),
	})
		.index('by_name', ['name'])
		.index('by_display_order', ['displayOrder'])
		.searchIndex('search_stages', { searchField: 'searchText' }),
	tasks: defineTable({
		stageId: v.id('stages'),
		name: v.string(),
		description: v.optional(v.string()),
		duration: v.number(),
		displayOrder: v.number(),
		dependsOn: v.array(
			v.object({
				taskId: v.id('tasks'),
				type: taskDependencyTypeValidator,
			})
		),
		searchText: v.string(),
	})
		.index('by_stage', ['stageId'])
		.index('by_stage_display_order', ['stageId', 'displayOrder'])
		.searchIndex('search_tasks', { searchField: 'searchText' }),
	orders: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
		stageId: v.optional(v.id('stages')),
		taskId: v.optional(v.id('tasks')),
		materials: v.optional(
			v.array(v.object({ name: v.string(), units: v.string() }))
		),
		searchText: v.string(),
	})
		.index('by_stage', ['stageId'])
		.index('by_task', ['taskId'])
		.searchIndex('search_orders', { searchField: 'searchText' }),
	units: defineTable({
		category: v.string(),
		abbr: v.string(),
		label: v.string(),
	}).index('by_category', ['category']),
	locations: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
		searchText: v.string(),
	}).searchIndex('search_locations', { searchField: 'searchText' }),
	trades: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
		searchText: v.string(),
	}).searchIndex('search_trades', { searchField: 'searchText' }),
});
