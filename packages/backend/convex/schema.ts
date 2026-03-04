import { defineSchema, defineTable } from 'convex/server';
import { zodToConvex } from 'convex-helpers/server/zod';
import { z } from 'zod';

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
});
