import { v } from 'convex/values';

export const projectStatusValidator = v.union(
	v.literal('not_started'),
	v.literal('in_progress'),
	v.literal('completed')
);

export const projectClientValidator = v.object({
	firstName: v.string(),
	lastName: v.string(),
	email: v.string(),
	phone: v.string(),
	company: v.optional(v.string()),
});

export const projectClientPatchValidator = v.object({
	firstName: v.optional(v.string()),
	lastName: v.optional(v.string()),
	email: v.optional(v.string()),
	phone: v.optional(v.string()),
	company: v.optional(v.string()),
});
