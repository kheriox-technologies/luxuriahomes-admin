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
	projects: defineTable({
		name: v.string(),
		address: australianAddressValidator,
		status: projectStatusValidator,
		clients: v.array(projectClientValidator),
		searchText: v.string(),
	}).searchIndex('search_projects', { searchField: 'searchText' }),
});
