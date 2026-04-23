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

// Schema definition
export default defineSchema({
	permissions: defineTable(zodToConvex(permissionValidator)).index(
		'by_role_name',
		['roleName']
	),
	inclusionCategories: defineTable({
		name: v.string(),
		count: v.number(),
		searchText: v.string(),
	})
		.index('by_name', ['name'])
		.searchIndex('search_inclusion_categories', { searchField: 'searchText' }),
	projects: defineTable({
		name: v.string(),
		address: australianAddressValidator,
		status: projectStatusValidator,
		clients: v.array(projectClientValidator),
		searchText: v.string(),
	}).searchIndex('search_projects', { searchField: 'searchText' }),
	/** Temporary rows for `/upload-test`; references `_storage` so `getUrl` works. */
	uploadTestImages: defineTable({
		storageId: v.id('_storage'),
		fileName: v.string(),
		contentType: v.string(),
		byteLength: v.number(),
	}),
});
