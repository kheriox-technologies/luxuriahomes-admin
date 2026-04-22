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
	projects: defineTable({
		name: v.string(),
		address: australianAddressValidator,
		status: projectStatusValidator,
		client: projectClientValidator,
		searchText: v.string(),
	}).searchIndex('search_projects', { searchField: 'searchText' }),
});
