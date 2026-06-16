import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildProjectSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import {
	assertAustralianAddress,
	australianAddressValidator,
	projectClientValidator,
	projectStatusValidator,
} from './shared';

export const update = mutation({
	args: {
		projectId: v.id('projects'),
		name: v.optional(v.string()),
		address: v.optional(australianAddressValidator),
		status: v.optional(projectStatusValidator),
		clients: v.optional(v.array(projectClientValidator)),
		startDate: v.optional(v.union(v.number(), v.null())),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await ctx.db.get(args.projectId);
		if (!existing) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Project not found',
			});
		}

		if (args.address) {
			assertAustralianAddress(args.address);
		}

		const name = args.name ?? existing.name;
		const address = args.address ?? existing.address;
		const status = args.status ?? existing.status;

		let clients = existing.clients;
		if (args.clients !== undefined) {
			if (args.clients.length < 1) {
				throw new ConvexError({
					code: 'CLIENTS_REQUIRED',
					message: 'At least one client is required',
				});
			}
			for (const client of args.clients) {
				if (client.address) {
					assertAustralianAddress(client.address);
				}
			}
			clients = args.clients;
		}

		let startDate = existing.startDate;
		const oldStartDate = existing.startDate;
		if (args.startDate !== undefined) {
			startDate = args.startDate === null ? undefined : args.startDate;
		}

		// When start date changes and a schedule exists, shift all stage/task dates
		if (
			startDate !== undefined &&
			oldStartDate !== undefined &&
			startDate !== oldStartDate
		) {
			const MS_PER_DAY = 86_400_000;
			const diffDays = Math.round((startDate - oldStartDate) / MS_PER_DAY);
			if (diffDays !== 0) {
				const stages = await ctx.db
					.query('projectStages')
					.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
					.collect();
				for (const stage of stages) {
					await ctx.db.patch(stage._id, {
						startDate: stage.startDate + diffDays * MS_PER_DAY,
						endDate: stage.endDate + diffDays * MS_PER_DAY,
					});
				}
				const tasks = await ctx.db
					.query('projectTasks')
					.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
					.collect();
				for (const task of tasks) {
					await ctx.db.patch(task._id, {
						startDate: task.startDate + diffDays * MS_PER_DAY,
						endDate: task.endDate + diffDays * MS_PER_DAY,
					});
				}
			}
		}

		const searchText = buildProjectSearchText({
			name,
			address,
			status,
			clients,
		});

		await ctx.db.patch(args.projectId, {
			name,
			address,
			status,
			clients,
			startDate,
			searchText,
		});
		return args.projectId;
	},
});
