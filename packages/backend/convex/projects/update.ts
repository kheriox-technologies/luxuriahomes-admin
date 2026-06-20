import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildProjectSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import {
	addBusinessDaysToTimestamp,
	businessDaysBetweenTimestamps,
} from '../projectTasks/shared';
import {
	assertAustralianAddress,
	australianAddressValidator,
	normalizeClientEmail,
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
		quotePrice: v.optional(v.union(v.number(), v.null())),
		expenses: v.optional(v.union(v.number(), v.null())),
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
			// Preserve existing client portal links: the form drafts that drive this
			// mutation do not carry portal fields, so match incoming clients to existing
			// ones by email and carry the portal access over.
			const portalByEmail = new Map(
				existing.clients
					.filter((client) => client.portalUserId !== undefined)
					.map((client) => [normalizeClientEmail(client.email), client])
			);
			clients = args.clients.map((client) => {
				if (client.address) {
					assertAustralianAddress(client.address);
				}
				const existingClient = portalByEmail.get(
					normalizeClientEmail(client.email)
				);
				if (!existingClient) {
					return client;
				}
				return {
					...client,
					portalUserId: existingClient.portalUserId,
					portalAccessGrantedAt: existingClient.portalAccessGrantedAt,
				};
			});
		}

		let startDate = existing.startDate;
		const oldStartDate = existing.startDate;
		if (args.startDate !== undefined) {
			startDate = args.startDate === null ? undefined : args.startDate;
		}

		let quotePrice = existing.quotePrice;
		if (args.quotePrice !== undefined) {
			quotePrice = args.quotePrice === null ? undefined : args.quotePrice;
		}

		let expenses = existing.expenses;
		if (args.expenses !== undefined) {
			expenses = args.expenses === null ? undefined : args.expenses;
		}

		// When start date changes and a schedule exists, shift all stage/task dates
		// by the same number of business days (skips weekends, preserving weekday alignment).
		if (
			startDate !== undefined &&
			oldStartDate !== undefined &&
			startDate !== oldStartDate
		) {
			const bizDiff = businessDaysBetweenTimestamps(oldStartDate, startDate);
			if (bizDiff !== 0) {
				const stages = await ctx.db
					.query('projectStages')
					.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
					.collect();
				for (const stage of stages) {
					await ctx.db.patch(stage._id, {
						startDate: addBusinessDaysToTimestamp(stage.startDate, bizDiff),
						endDate: addBusinessDaysToTimestamp(stage.endDate, bizDiff),
					});
				}
				const tasks = await ctx.db
					.query('projectTasks')
					.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
					.collect();
				for (const task of tasks) {
					const newTaskStart = addBusinessDaysToTimestamp(
						task.startDate,
						bizDiff
					);
					await ctx.db.patch(task._id, {
						startDate: newTaskStart,
						endDate: addBusinessDaysToTimestamp(
							newTaskStart,
							task.durationDays - 1
						),
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
			quotePrice,
			expenses,
			searchText,
		});
		return args.projectId;
	},
});
