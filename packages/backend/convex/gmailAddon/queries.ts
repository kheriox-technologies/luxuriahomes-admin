import { ConvexError, v } from 'convex/values';
import { internalQuery } from '../_generated/server';

export const listProjects = internalQuery({
	args: {},
	handler: async (ctx) => {
		const projects = await ctx.db.query('projects').collect();
		return projects
			.map((project) => ({
				id: project._id,
				name: project.name,
				status: project.status,
			}))
			.sort((a, b) =>
				a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
			);
	},
});

export const getProject = internalQuery({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		const project = await ctx.db.get(args.projectId);
		if (!project) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Project not found',
			});
		}
		return { id: project._id, name: project.name };
	},
});

export const listTrades = internalQuery({
	args: {},
	handler: async (ctx) => {
		const trades = await ctx.db.query('trades').collect();
		return trades
			.map((trade) => ({ id: trade._id, name: trade.name }))
			.sort((a, b) =>
				a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
			);
	},
});

export const listServiceProviders = internalQuery({
	args: { tradeId: v.optional(v.id('trades')) },
	handler: async (ctx, args) => {
		const providers = await ctx.db.query('serviceProviders').collect();
		return providers
			.filter((provider) =>
				args.tradeId ? provider.tradeIds.includes(args.tradeId) : true
			)
			.map((provider) => ({
				id: provider._id,
				company: provider.company,
				name: provider.name,
			}))
			.sort((a, b) => {
				const companyCompare = a.company.localeCompare(b.company, undefined, {
					sensitivity: 'base',
				});
				if (companyCompare !== 0) {
					return companyCompare;
				}
				return a.name.localeCompare(b.name, undefined, {
					sensitivity: 'base',
				});
			});
	},
});
